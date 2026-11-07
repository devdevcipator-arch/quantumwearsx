import { categoryCatalogs } from "@/app/data/categories";
import { DEFAULT_PRODUCTS, ProductItem } from "./products-service";

export interface ProductDetailInfo {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  badge: string;
  shortDescription: string;
  longDescription: string[];
  description1: string;
  description2?: string;
  description3?: string;
  mainImage: string;
  thumbnails: string[];
  quoteCategory: string;
  graphicWord?: string;
  specs?: {
    moq: string;
    materials: string;
    branding: string;
    leadTime: string;
    standards: string;
  };
}

/** Helper to convert any title/name into a URL-safe slug */
export function slugify(str: string): string {
  if (!str) return "item";
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Get a product's canonical URL slug */
export function getProductSlug(item: { id?: string; title?: string; name?: string }): string {
  const name = item.title || item.name || item.id || "item";
  return slugify(name);
}

/** Get a product's canonical URL */
export function getProductUrl(item: { id?: string; title?: string; name?: string }): string {
  return `/product/${getProductSlug(item)}`;
}

// Category fallback thumbnails
const CATEGORY_THUMBNAILS: Record<string, string[]> = {
  "leather-products": [
    "/images/grid_sportswear.jpg",
    "/images/grid_leather_hide.jpg",
    "/images/grid_backpack.jpg",
  ],
  "activewear": [
    "/images/grid_sportswear.jpg",
    "/images/triptych_brand_tag.jpg",
    "/images/grid_backpack.jpg",
  ],
  "sportswear": [
    "/images/grid_sportswear.jpg",
    "/images/grid_tracksuit.jpg",
    "/images/grid_backpack.jpg",
  ],
  "streetwear": [
    "/images/grid_tracksuit.jpg",
    "/images/triptych_embroidery.jpg",
    "/images/grid_backpack.jpg",
  ],
  "safety-wear": [
    "/images/grid_workwear.jpg",
    "/images/grid_tactical_vest.jpg",
    "/images/triptych_brand_tag.jpg",
  ],
  "custom-bags": [
    "/images/grid_backpack.jpg",
    "/images/grid_leather_hide.jpg",
    "/images/grid_sportswear.jpg",
  ],
};

// Featured showcase product matching the user's design reference exactly
const CSSA_PRODUCT: ProductDetailInfo = {
  id: "prod-cssa-master",
  slug: "cssa",
  title: "CSSA",
  category: "Leather Products",
  categorySlug: "leather-products",
  badge: "CUSTOM PRODUCTION",
  graphicWord: "PUSH",
  shortDescription:
    "Handcrafted with masterful engineering and artisan precision, featuring top-grain bovine leather optimized for luxury brand standards and industrial durability.",
  longDescription: [
    "Handcrafted with masterful engineering and artisan precision. Our CSSA line features top-grain bovine leather optimized for luxury standards and industrial durability.",
    "Designed for high-definition corporate identity integration, featuring advanced embossing, custom laser engraving, and reinforced saddle stitching for lifelong performance.",
    "Every unit is cut from hand-selected hides, treated with eco-conscious tanning formulas, and finished with custom heavy-gauge hardware engineered to withstand demanding daily wear.",
    "Manufactured directly in our Sialkot production facility with full tech pack prototyping support, dedicated sampling in 7–10 days, and multi-stage in-line quality assurance compliant with OEKO-TEX® and ICMES standards.",
  ],
  description1:
    "Handcrafted with masterful engineering and artisan precision. Our CSSA line features top-grain bovine leather optimized for luxury standards and industrial durability.",
  description2:
    "Designed for high-definition corporate identity integration, featuring advanced embossing and reinforced saddle stitching for lifelong performance.",
  description3:
    "Every unit is cut from hand-selected hides, treated with eco-conscious tanning formulas, and finished with custom heavy-gauge hardware engineered to withstand demanding daily wear.",
  mainImage: "/images/grid_leather_hide.jpg",
  thumbnails: [
    "/images/grid_sportswear.jpg",
    "/images/grid_leather_hide.jpg",
    "/images/grid_backpack.jpg",
  ],
  quoteCategory: "Leather Products",
};

/** Build rich specifications and descriptions for any product item */
function buildProductDetail(
  id: string,
  title: string,
  category: string,
  image: string,
  customDesc?: string,
  quoteCat?: string
): ProductDetailInfo {
  const catSlug = slugify(category);
  const fallbackThumbs =
    CATEGORY_THUMBNAILS[catSlug] || [
      image,
      "/images/grid_leather_hide.jpg",
      "/images/grid_backpack.jpg",
    ];

  // Guarantee 3 unique thumbnail items
  const thumbs = [
    image || fallbackThumbs[0],
    fallbackThumbs[1] || "/images/grid_leather_hide.jpg",
    fallbackThumbs[2] || "/images/grid_backpack.jpg",
  ];

  const cleanDesc = customDesc ? customDesc.trim().replace(/\.+$/, "") : "";

  const shortDesc = cleanDesc
    ? `${cleanDesc}.`
    : `Artisan-engineered ${title} customized to your brand's specifications with premium materials, precision stitching, and direct factory pricing.`;

  const longDesc = [
    cleanDesc
      ? `Handcrafted with masterful engineering and artisan precision. Our ${title} is purpose-built for international luxury standards, athletic performance, and everyday durability, featuring ${cleanDesc.toLowerCase()}.`
      : `Handcrafted with masterful engineering and artisan precision. Our ${title} is optimized for luxury brand standards, rigorous athletic performance, and long-term durability.`,
    `Designed for high-definition corporate identity integration, featuring advanced stitching, reinforced seams, and custom brand detailing tailored to your exact tech pack specifications.`,
    `Manufactured in our Sialkot facility with direct factory pricing, comprehensive sample development, and multi-stage in-line quality control conforming to OEKO-TEX® and Sialkot Chamber standards.`,
  ];

  return {
    id,
    slug: slugify(title),
    title,
    category,
    categorySlug: catSlug,
    badge: "CUSTOM PRODUCTION",
    graphicWord: title.split(" ")[0]?.toUpperCase() || "PUSH",
    shortDescription: shortDesc,
    longDescription: longDesc,
    description1: longDesc[0],
    description2: longDesc[1],
    description3: longDesc[2],
    mainImage: image || "/images/grid_leather_hide.jpg",
    thumbnails: thumbs,
    quoteCategory: quoteCat || category,
  };
}

/** Retrieve all static product slugs for Next.js build-time pre-rendering */
export function getAllStaticProductSlugs(): string[] {
  const slugs = new Set<string>();

  // Always include CSSA
  slugs.add("cssa");

  // Include DEFAULT_PRODUCTS
  DEFAULT_PRODUCTS.forEach((p) => {
    slugs.add(slugify(p.title));
  });

  // Include all products from categoryCatalogs
  categoryCatalogs.forEach((cat) => {
    cat.products.forEach((p) => {
      slugs.add(slugify(p.name));
    });
  });

  return Array.from(slugs);
}

/** Find a product detail by its slug, id, or title */
export function getProductDetailBySlug(rawSlug: string): ProductDetailInfo {
  const clean = slugify(decodeURIComponent(rawSlug));

  // 1. Check exact match for CSSA
  if (clean === "cssa") {
    return CSSA_PRODUCT;
  }

  // 2. Check DEFAULT_PRODUCTS
  const defaultMatch = DEFAULT_PRODUCTS.find(
    (p) => slugify(p.title) === clean || p.id === rawSlug || slugify(p.id) === clean
  );
  if (defaultMatch) {
    return buildProductDetail(
      defaultMatch.id,
      defaultMatch.title,
      defaultMatch.category,
      defaultMatch.image,
      defaultMatch.description,
      defaultMatch.category
    );
  }

  // 3. Check categoryCatalogs
  for (const cat of categoryCatalogs) {
    const catalogMatch = cat.products.find(
      (p) => slugify(p.name) === clean || slugify(p.filter) === clean
    );
    if (catalogMatch) {
      return buildProductDetail(
        slugify(catalogMatch.name),
        catalogMatch.name,
        cat.name,
        catalogMatch.image,
        catalogMatch.description,
        catalogMatch.quoteCategory
      );
    }
  }

  // 4. Fallback: generate a clean product detail for any valid query
  const formattedTitle = rawSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return buildProductDetail(
    clean,
    formattedTitle,
    "Custom Manufacturing",
    "/images/grid_leather_hide.jpg",
    undefined,
    "Custom Manufacturing"
  );
}

