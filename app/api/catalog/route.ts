import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import path from "path";
import { stat } from "fs/promises";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const BUCKET_NAME = "catalogs";
const PRIMARY_FILENAME = "QuantumWearX-Catalog.pdf";
const METADATA_FILENAME = "catalog-info.json";

export async function GET() {
  const supabase = getSupabaseAdmin();

  let currentCatalog = null;
  const history: any[] = [];

  // 1. Try reading live metadata & file list from Supabase Storage
  try {
    const { data: metaBlob } = await supabase.storage
      .from(BUCKET_NAME)
      .download(METADATA_FILENAME);

    if (metaBlob) {
      const metaText = await metaBlob.text();
      try {
        currentCatalog = JSON.parse(metaText);
      } catch {
        // malformed json
      }
    }

    // List all files in the catalogs bucket
    const { data: files } = await supabase.storage.from(BUCKET_NAME).list("", {
      sortBy: { column: "created_at", order: "desc" },
    });

    if (files && files.length > 0) {
      for (const f of files) {
        if (f.name.toLowerCase().endsWith(".pdf")) {
          const { data: pubData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(f.name);

          const size = f.metadata?.size || 0;
          const isPrimary = f.name === PRIMARY_FILENAME;

          history.push({
            name: f.name,
            displayName: f.name.replace(/-/g, " ").replace(".pdf", ""),
            url: pubData.publicUrl,
            size,
            sizeFormatted: formatBytes(size),
            lastModified: f.updated_at || f.created_at || new Date().toISOString(),
            isActive: isPrimary,
          });

          // If no currentCatalog from JSON, deduce from primary file
          if (!currentCatalog && isPrimary) {
            currentCatalog = {
              name: PRIMARY_FILENAME,
              displayName: "QuantumWear X B2B Master Catalog",
              url: pubData.publicUrl,
              size,
              sizeFormatted: formatBytes(size),
              lastModified: f.updated_at || f.created_at || new Date().toISOString(),
              category: "All Categories",
              status: "Active",
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("Supabase catalog read error, attempting filesystem fallback:", err);
  }

  // 2. If nothing from Supabase, fallback to local bundled file in /public/catalog
  if (!currentCatalog) {
    try {
      const primaryFile = path.join(process.cwd(), "public", "catalog", PRIMARY_FILENAME);
      const fileStat = await stat(primaryFile);
      currentCatalog = {
        name: PRIMARY_FILENAME,
        displayName: "QuantumWear X B2B Master Catalog",
        url: `/catalog/${PRIMARY_FILENAME}`,
        size: fileStat.size,
        sizeFormatted: formatBytes(fileStat.size),
        lastModified: fileStat.mtime.toISOString(),
        category: "All Categories",
        status: "Active",
      };
    } catch {
      currentCatalog = {
        name: PRIMARY_FILENAME,
        displayName: "QuantumWear X B2B Master Catalog",
        url: `/catalog/${PRIMARY_FILENAME}`,
        size: 15859,
        sizeFormatted: "15.5 KB",
        lastModified: new Date().toISOString(),
        category: "All Categories",
        status: "Active",
      };
    }
  }

  return NextResponse.json({
    success: true,
    currentCatalog,
    history,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "QuantumWear X B2B Master Catalog";
    const category = (formData.get("category") as string) || "All Categories";
    const version = (formData.get("version") as string) || "v1.0";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No catalog file was provided" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF documents (.pdf) are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const supabase = getSupabaseAdmin();

    // Ensure bucket exists
    try {
      await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    } catch {
      // Bucket likely exists
    }

    // 1. Upload primary catalog to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(PRIMARY_FILENAME, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage PDF upload failed:", uploadError);
      throw new Error(`Cloud storage upload failed: ${uploadError.message}`);
    }

    // 2. Optionally upload versioned copy
    if (version && version !== "v1.0") {
      const versionTag = version.replace(/[^a-zA-Z0-9.-]/g, "");
      const versionedFilename = `QuantumWearX-Catalog-${versionTag}.pdf`;
      try {
        await supabase.storage
          .from(BUCKET_NAME)
          .upload(versionedFilename, buffer, {
            contentType: "application/pdf",
            upsert: true,
          });
      } catch (verErr) {
        console.warn("Versioned catalog copy warning:", verErr);
      }
    }

    // 3. Get public permanent URL
    const { data: pubData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(PRIMARY_FILENAME);

    const publicUrl = pubData.publicUrl;

    // 4. Save metadata JSON
    const updatedCatalog = {
      name: PRIMARY_FILENAME,
      displayName: title,
      url: publicUrl,
      size: buffer.length,
      sizeFormatted: formatBytes(buffer.length),
      lastModified: new Date().toISOString(),
      category,
      version,
      status: "Active",
    };

    try {
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(METADATA_FILENAME, Buffer.from(JSON.stringify(updatedCatalog, null, 2)), {
          contentType: "application/json",
          upsert: true,
        });
    } catch (metaErr) {
      console.warn("Could not write catalog metadata JSON:", metaErr);
    }

    // 5. Best-effort local file write for local offline development (wrapped safely so EROFS on Vercel is NEVER thrown)
    try {
      const fs = await import("fs/promises");
      const catalogDir = path.join(process.cwd(), "public", "catalog");
      await fs.mkdir(catalogDir, { recursive: true });
      await fs.writeFile(path.join(catalogDir, PRIMARY_FILENAME), buffer);
    } catch {
      // Ignored: read-only serverless environment (Vercel)
    }

    return NextResponse.json({
      success: true,
      message: "Catalog successfully uploaded and published live!",
      catalog: updatedCatalog,
    });
  } catch (err: any) {
    console.error("Catalog upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload catalog file" },
      { status: 500 }
    );
  }
}
