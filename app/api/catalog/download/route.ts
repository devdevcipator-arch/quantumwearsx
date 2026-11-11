import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: pubData } = supabase.storage
      .from("catalogs")
      .getPublicUrl("QuantumWearX-Catalog.pdf");

    if (pubData?.publicUrl) {
      return NextResponse.redirect(pubData.publicUrl, 307);
    }
  } catch (err) {
    console.warn("Catalog download redirect fallback:", err);
  }

  // Fallback to static bundled catalog in /public
  return NextResponse.redirect("/catalog/QuantumWearX-Catalog.pdf", 307);
}

