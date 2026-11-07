import { Metadata } from "next";
import ProductDetailView from "./ProductDetailView";
import {
  getAllStaticProductSlugs,
  getProductDetailBySlug,
  buildProductDetail,
  slugify,
  ProductDetailInfo,
} from "@/lib/product-details";
import { supabase } from "@/lib/supabase";
import { extractMetaFromDescription } from "@/lib/products-service";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllStaticProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Always render fresh DB content on the server so the first paint already
// matches the real product — no "content swap after mount" that briefly
// shifts/breaks the layout.
export const dynamic = "force-dynamic";

/**
 * Look up the live product row from Supabase matching this slug, using the
 * same matching logic the client-side ProductDetailView sync uses
 * (title-slug / inclusion match), so SSR and hydration agree.
 */
async function loadDbProductRow(slug: string): Promise<any | null> {
  try {
    const clean = slugify(decodeURIComponent(slug));
    const { data: rows } = await supabase.from("products").select("*");
    if (!rows || rows.length === 0) return null;

    return (
      rows.find((row: any) => {
        if (slugify(row.title || "") === clean) return true;
        const rTitle = (row.title || "").toLowerCase().trim();
        return (
          rTitle === slug.toLowerCase().trim() ||
          (slug.length > 2 && rTitle.includes(slug.toLowerCase().trim())) ||
          (slug.length > 2 && slug.toLowerCase().trim().includes(rTitle))
        );
      }) || null
    );
  } catch {
    return null;
  }
}

/** Merge a live DB row over the static product detail so SSR == client view */
async function buildInitialProduct(slug: string): Promise<ProductDetailInfo> {
  const base = getProductDetailBySlug(slug);
  const row = await loadDbProductRow(slug);

  if (!row) return base;

  const { cleanDescription, extras } = extractMetaFromDescription(
    row.description || ""
  );

  const dbLongDesc = row.long_description || extras.long_description || "";
  const dbSecs = [
    row.secondary_image_1 || extras.secondary_image_1,
    row.secondary_image_2 || extras.secondary_image_2,
    row.secondary_image_3 || extras.secondary_image_3,
  ].filter(Boolean);

  // Rebuild through buildProductDetail so long-description paragraph
  // splitting + thumbnail fallbacks behave identically to the client sync.
  return buildProductDetail(
    row.id || base.id,
    row.title || base.title,
    row.category || base.category,
    row.image || base.mainImage,
    cleanDescription || base.shortDescription.replace(/\.$/, ""),
    base.quoteCategory,
    dbLongDesc || undefined,
    dbSecs.length > 0 ? dbSecs : base.secondaryImages
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await buildInitialProduct(slug);

  const title = `${product.title} — Custom ${product.category} Manufacturing | QUANTUMWEARX`;
  const metaDesc = product.shortDescription || product.description1 || product.title;
  const description = `${product.title}: ${metaDesc.slice(0, 155)}...`;

  return {
    title,
    description,
    keywords: [
      product.title.toLowerCase(),
      `custom ${product.category.toLowerCase()}`,
      `private label ${product.category.toLowerCase()}`,
      "b2b apparel manufacturing",
      "Sialkot manufacturer",
      "QuantumWear X",
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.mainImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await buildInitialProduct(slug);

  return <ProductDetailView product={product} />;
}
