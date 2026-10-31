/* ---------------------------------------------------------------
   Category catalog data (drives /products/[slug] pages)
   All B2B catalog entries live here so pages stay data-driven.
--------------------------------------------------------------- */

export type CatalogTagVariant = "red" | "light";

export interface CatalogProduct {
  /** Card title, e.g. "Gym T-Shirts & Tanks" */
  name: string;
  /** Sub-item this product belongs to (must exist in the parent category subItems) */
  filter: string;
  /** Optional corner badge, e.g. "PRIVATE LABEL" */
  tag?: string;
  tagVariant?: CatalogTagVariant;
  image: string;
  alt: string;
  /** Pre-selected option inside the quote modal (must be a QuoteModal option) */
  quoteCategory: string;
}

export interface CategoryCatalog {
  /** URL slug, e.g. "activewear" */
  slug: string;
  /** Display name, e.g. "Activewear" */
  name: string;
  /** Small red uppercase slogan above the title */
  eyebrow: string;
  /** Big page title, e.g. "ACTIVEWEAR CATALOG" */
  headingTitle: string;
  /** Red section heading right side, e.g. "Performance Engineering" */
  engineeringTitle: string;
  /** White bold intro title */
  introTitle: string;
  /** Intro paragraph under introTitle */
  intro: string;
  /** Sidebar sub-filters; index 0 is the "All" option */
  subItems: string[];
  products: CatalogProduct[];
}

/** Map of slugs -> display name used by the sidebar accordion */
export const categoryCatalogs: CategoryCatalog[] = [
  {
    slug: "activewear",
    name: "Activewear",
    eyebrow: "PRECISION IN EVERY STITCH",
    headingTitle: "ACTIVEWEAR CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM ACTIVEWEAR MANUFACTURING",
    intro:
      "QuantumWear X delivers end-to-end B2B solutions for fitness brands worldwide. Our activewear line features advanced moisture-management fabrics, four-way stretch technology, and reinforced stitching engineered for high-intensity performance. From custom GSM selection to private label branding, we scale your vision from prototype to bulk production.",
    subItems: [
      "All Activewear",
      "Gym T-Shirts & Tanks",
      "Leggings & Sports Bras",
      "Compression Wear",
      "Workout Shorts & Joggers",
      "Custom Fitness Sets",
    ],
    products: [
      {
        name: "Gym T-Shirts & Tanks",
        filter: "Gym T-Shirts & Tanks",
        tag: "PRIVATE LABEL",
        tagVariant: "red",
        image: "/images/grid_sportswear.jpg",
        alt: "Private label gym t-shirt with contrast panel design",
        quoteCategory: "Activewear & Tracksuits",
      },
      {
        name: "Leggings & Bras",
        filter: "Leggings & Sports Bras",
        tag: "SEAMLESS",
        tagVariant: "light",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Seamless leggings and sports bra production detail",
        quoteCategory: "Activewear & Tracksuits",
      },
      {
        name: "Compression Wear",
        filter: "Compression Wear",
        tag: "MOISTURE-WICK",
        tagVariant: "light",
        image: "/images/grid_backpack.jpg",
        alt: "Compression training wear and accessories production",
        quoteCategory: "Activewear & Tracksuits",
      },
      {
        name: "Workout Shorts",
        filter: "Workout Shorts & Joggers",
        image: "/images/grid_tracksuit.jpg",
        alt: "Custom workout shorts and joggers finished in studio",
        quoteCategory: "Activewear & Tracksuits",
      },
      {
        name: "Custom Sets",
        filter: "Custom Fitness Sets",
        image: "/images/triptych_embroidery.jpg",
        alt: "Matching custom fitness sets with embroidery detail",
        quoteCategory: "Activewear & Tracksuits",
      },
    ],
  },
  {
    slug: "sportswear",
    name: "Sportswear",
    eyebrow: "BUILT FOR EVERY MATCH",
    headingTitle: "SPORTSWEAR CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM SPORTSWEAR MANUFACTURING",
    intro:
      "QuantumWear X builds team-grade sportswear for clubs, schools, and emerging brands. Sublimation-ready fabrics, reinforced flatlock seams, and complete Pantone matching keep every kit uniform across reorders. From single-team samples to season-long bulk runs, your brand stays match-ready.",
    subItems: [
      "All Sportswear",
      "Soccer Jerseys & Kits",
      "Team Tracksuits",
      "Basketball Uniforms",
      "Custom Teamwear",
    ],
    products: [
      {
        name: "Soccer Jerseys & Kits",
        filter: "Soccer Jerseys & Kits",
        tag: "PRIVATE LABEL",
        tagVariant: "red",
        image: "/images/grid_sportswear.jpg",
        alt: "Private label soccer jersey kits in technical fabric",
        quoteCategory: "Sportswear",
      },
      {
        name: "Team Tracksuits",
        filter: "Team Tracksuits",
        tag: "ALL-SEASON",
        tagVariant: "light",
        image: "/images/grid_tracksuit.jpg",
        alt: "All-season team tracksuits and training sets",
        quoteCategory: "Sportswear",
      },
      {
        name: "Match Jersey Fabrics",
        filter: "Soccer Jerseys & Kits",
        tag: "SUBLIMATION",
        tagVariant: "light",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Sublimation-ready performance jersey fabric panels",
        quoteCategory: "Sportswear",
      },
      {
        name: "Court Uniforms",
        filter: "Basketball Uniforms",
        tag: "REVERSIBLE",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Reversible basketball uniforms on the production floor",
        quoteCategory: "Sportswear",
      },
      {
        name: "Custom Team Sets",
        filter: "Custom Teamwear",
        image: "/images/triptych_embroidery.jpg",
        alt: "Custom teamwear sets with club embroidery",
        quoteCategory: "Sportswear",
      },
    ],
  },
  {
    slug: "streetwear",
    name: "Streetwear",
    eyebrow: "MADE FOR THE STREETS",
    headingTitle: "STREETWEAR CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM STREETWEAR MANUFACTURING",
    intro:
      "QuantumWear X crafts heavyweight street staples for independent labels and fast-growing brands. From 240–400 GSM fleece and garment-dye washes to puff embroidery and custom woven labels, every piece is built for the streetwear cycle. Scale from limited drops to mass retail with consistent quality.",
    subItems: [
      "All Streetwear",
      "Oversized Tees & Hoodies",
      "Cargos & Track Pants",
      "Premium Drops",
    ],
    products: [
      {
        name: "Heavyweight Tees & Hoodies",
        filter: "Oversized Tees & Hoodies",
        tag: "HEAVY-GSM",
        tagVariant: "red",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Heavy GSM oversized tees and hoodies in production",
        quoteCategory: "Sportswear",
      },
      {
        name: "Cargos & Track Pants",
        filter: "Cargos & Track Pants",
        image: "/images/grid_tracksuit.jpg",
        alt: "Custom cargo and track pant models on hangers",
        quoteCategory: "Sportswear",
      },
      {
        name: "Statement Sets",
        filter: "Premium Drops",
        tag: "CUSTOM TRIMS",
        tagVariant: "light",
        image: "/images/triptych_embroidery.jpg",
        alt: "Statement streetwear sets with custom trims",
        quoteCategory: "Sportswear",
      },
      {
        name: "Hand-Finished Pieces",
        filter: "Premium Drops",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Hand finished leather street pieces at the bench",
        quoteCategory: "Leather Goods",
      },
    ],
  },
  {
    slug: "safety-wear",
    name: "Safety Wear",
    eyebrow: "CERTIFIED FOR ANY JOBSITE",
    headingTitle: "SAFETY WEAR CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM SAFETY WEAR MANUFACTURING",
    intro:
      "QuantumWear X manufactures certified safety wear for construction, logistics, and industrial partners. ANSI-class hi-vis materials, rip-stop reinforcements, and EN ISO reflective taping meet global compliance standards. Outfit entire crews from prototype approval to container-scale production.",
    subItems: [
      "All Safety Wear",
      "Hi-Vis Vests & Jackets",
      "Coveralls & Overalls",
      "Work Pants & Shirts",
    ],
    products: [
      {
        name: "Hi-Vis Site Kit",
        filter: "Hi-Vis Vests & Jackets",
        tag: "ANSI CLASS 2",
        tagVariant: "red",
        image: "/images/grid_workwear.jpg",
        alt: "ANSI class hi-vis vests and jackets for site crews",
        quoteCategory: "Workwear & Uniforms",
      },
      {
        name: "Industrial Coveralls",
        filter: "Coveralls & Overalls",
        tag: "INDUSTRIAL",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Industrial coveralls stitched on factory floor",
        quoteCategory: "Workwear & Uniforms",
      },
      {
        name: "Utility Work Pants",
        filter: "Work Pants & Shirts",
        tag: "RIP-STOP",
        tagVariant: "light",
        image: "/images/grid_tracksuit.jpg",
        alt: "Rip-stop utility work pants and shorts",
        quoteCategory: "Workwear & Uniforms",
      },
    ],
  },
  {
    slug: "leather-products",
    name: "Leather Products",
    eyebrow: "CUT FROM FULL-GRAIN HIDES",
    headingTitle: "LEATHER PRODUCTS CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM LEATHER PRODUCTS MANUFACTURING",
    intro:
      "QuantumWear X works full-grain and top-grain leathers for brands that demand premium touch and durability. Vegetable-tanned panels, custom hardware, and hand finishing define every product line. Develop exclusive palettes and embossed branding from sample hide to bulk delivery.",
    subItems: [
      "All Leather Products",
      "Leather Jackets & Outerwear",
      "Leather Bottoms & Shorts",
      "Custom Leather Goods",
    ],
    products: [
      {
        name: "Biker Leather Jackets",
        filter: "Leather Jackets & Outerwear",
        tag: "FULL-GRAIN",
        tagVariant: "red",
        image: "/images/grid_leather_jacket.jpg",
        alt: "Full-grain biker leather jacket with snap hardware",
        quoteCategory: "Leather Jackets",
      },
      {
        name: "Full-Grain Hides & Panels",
        filter: "Custom Leather Goods",
        tag: "GRADE A",
        tagVariant: "light",
        image: "/images/grid_leather_hide.jpg",
        alt: "Grade A full-grain leather hides and cut panels",
        quoteCategory: "Leather Goods",
      },
      {
        name: "Hand-Stitched Leather Sets",
        filter: "Leather Bottoms & Shorts",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Hand stitched leather sets at cutting bench",
        quoteCategory: "Leather Goods",
      },
      {
        name: "Woven Labels & Hardware",
        filter: "Custom Leather Goods",
        tag: "BRANDED",
        tagVariant: "light",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Custom woven labels and branded leather hardware",
        quoteCategory: "Leather Goods",
      },
    ],
  },
  {
    slug: "custom-bags",
    name: "Custom Bags",
    eyebrow: "CARRIED WITH CONFIDENCE",
    headingTitle: "CUSTOM BAGS CATALOG",
    engineeringTitle: "Performance Engineering",
    introTitle: "CUSTOM BAG MANUFACTURING",
    intro:
      "QuantumWear X designs and builds custom bags for outdoor, fitness, and lifestyle brands. Weather-sealed zips, 600–1680D Cordura shells, and reinforced load points are engineered for daily abuse. From prototype samples to full production runs, your bag line ships retail-ready.",
    subItems: [
      "All Custom Bags",
      "Backpacks & Rucksacks",
      "Duffels & Gym Bags",
      "Travel & Tech Bags",
    ],
    products: [
      {
        name: "Technical Daypacks",
        filter: "Backpacks & Rucksacks",
        tag: "WEATHER-SEALED",
        tagVariant: "red",
        image: "/images/grid_backpack.jpg",
        alt: "Weather-sealed technical daypack with strap system",
        quoteCategory: "Custom Bags",
      },
      {
        name: "Travel Rucksack 28L",
        filter: "Travel & Tech Bags",
        image: "/images/grid_backpack.jpg",
        alt: "Travel rucksack with laptop compartment",
        quoteCategory: "Custom Bags",
      },
      {
        name: "Prototype Sampling",
        filter: "Duffels & Gym Bags",
        tag: "SAMPLING",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Duffel and gym bag prototypes in sampling room",
        quoteCategory: "Custom Bags",
      },
      {
        name: "Leather-Trim Carriers",
        filter: "Travel & Tech Bags",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Travel carriers with leather trim detailing",
        quoteCategory: "Custom Bags",
      },
    ],
  },
];

/**
 * Map of the /products page "Collections / Categories" list to catalog slugs
 */
export const catalogListSlugs: Record<string, string> = {
  Activewear: "activewear",
  Sportswear: "sportswear",
  Streetwear: "streetwear",
  "Safety Wear": "safety-wear",
  "Leather Products": "leather-products",
  "Custom Bags": "custom-bags",
};

/** Map of the /products "Activewear Essentials" list to catalog sub-filters */
export const activewearEssentialFilters: Record<string, string> = {
  "Gym T-shirts & Tank Tops": "Gym T-Shirts & Tanks",
  "Leggings & Sports Bras": "Leggings & Sports Bras",
  "Compression Wear": "Compression Wear",
  "Workout Shorts & Joggers": "Workout Shorts & Joggers",
  "Custom Fitness Sets": "Custom Fitness Sets",
  "Athletic Outerwear": "Gym T-Shirts & Tanks",
};

export function findCategoryBySlug(slug: string): CategoryCatalog | undefined {
  return categoryCatalogs.find((c) => c.slug === slug);
}

/* Map the bento-grid labels (home + /products pages) onto catalog slugs */
export const bentoCategorySlugs: Record<string, string> = {
  Sportswear: "sportswear",
  "Leather Goods": "leather-products",
  "Activewear & Tracksuits": "activewear",
  "Workwear & Uniforms": "safety-wear",
  "Leather Jackets": "leather-products",
  "Custom Bags": "custom-bags",
};

/**
 * Loose matcher used when landing on a category page with a pre-selected
 * sub-item (e.g. /products/activewear?item=Gym%20T-shirts%20%26%20Tank%20Tops).
 * Compares the first 6 alphanumeric characters so label casing/spacing
 * differences don't break the match.
 */
export function matchSubItem(query: string | null | undefined, subItems: string[]): string {
  if (!query) return "";
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
  const key = norm(query);
  if (!key) return "";
  return subItems.find((sub) => norm(sub).startsWith(key)) ?? "";
}
