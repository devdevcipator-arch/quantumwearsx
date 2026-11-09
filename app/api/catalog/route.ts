import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export async function GET() {
  try {
    const catalogDir = path.join(process.cwd(), "public", "catalog");
    await mkdir(catalogDir, { recursive: true });

    const primaryFile = path.join(catalogDir, "QuantumWearX-Catalog.pdf");
    let currentCatalog = null;

    try {
      const fileStat = await stat(primaryFile);
      currentCatalog = {
        name: "QuantumWearX-Catalog.pdf",
        displayName: "QuantumWear X B2B Master Catalog",
        url: "/catalog/QuantumWearX-Catalog.pdf",
        size: fileStat.size,
        sizeFormatted: formatBytes(fileStat.size),
        lastModified: fileStat.mtime.toISOString(),
        category: "All Categories",
        status: "Active",
      };
    } catch {
      // Primary file does not exist yet
      currentCatalog = null;
    }

    // Read any other catalogs in directory
    const files = await readdir(catalogDir);
    const catalogFiles = await Promise.all(
      files
        .filter((f) => f.toLowerCase().endsWith(".pdf"))
        .map(async (f) => {
          const filePath = path.join(catalogDir, f);
          const s = await stat(filePath);
          return {
            name: f,
            displayName: f.replace(/-/g, " ").replace(".pdf", ""),
            url: `/catalog/${f}`,
            size: s.size,
            sizeFormatted: formatBytes(s.size),
            lastModified: s.mtime.toISOString(),
            isActive: f === "QuantumWearX-Catalog.pdf",
          };
        })
    );

    return NextResponse.json({
      success: true,
      currentCatalog,
      history: catalogFiles,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to inspect catalog directory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "QuantumWear X B2B Catalog";
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

    const catalogDir = path.join(process.cwd(), "public", "catalog");
    await mkdir(catalogDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Overwrite default live file so the public website download always serves latest
    const mainFilePath = path.join(catalogDir, "QuantumWearX-Catalog.pdf");
    await writeFile(mainFilePath, buffer);

    // Also write a versioned copy if version provided and not default
    let versionedFilename = `QuantumWearX-Catalog-${version.replace(/[^a-zA-Z0-9.-]/g, "")}.pdf`;
    try {
      await writeFile(path.join(catalogDir, versionedFilename), buffer);
    } catch {
      // Non-critical if versioned save fails
    }

    const fileStat = await stat(mainFilePath);

    return NextResponse.json({
      success: true,
      message: "Catalog successfully uploaded and published live!",
      catalog: {
        name: "QuantumWearX-Catalog.pdf",
        displayName: title,
        url: "/catalog/QuantumWearX-Catalog.pdf",
        size: fileStat.size,
        sizeFormatted: formatBytes(fileStat.size),
        lastModified: fileStat.mtime.toISOString(),
        category,
        version,
        status: "Active",
      },
    });
  } catch (err: any) {
    console.error("Catalog upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload catalog file" },
      { status: 500 }
    );
  }
}

