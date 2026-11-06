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
  /** Optional custom product description */
  description?: string;
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
      "Gym T-shirts and tank tops",
      "Leggings and sports bras",
      "Compression wear",
      "Workout shorts and joggers",
      "Custom fitness sets",
    ],
    products: [
      {
        name: "Gym T-shirts and tank tops",
        filter: "Gym T-shirts and tank tops",
        tag: "PRIVATE LABEL",
        tagVariant: "red",
        image: "/images/grid_sportswear.jpg",
        alt: "Private label gym t-shirt and tank top design",
        quoteCategory: "Activewear & Tracksuits",
        description: "Custom breathable athletic fabrics engineered for gym performance and durability.",
      },
      {
        name: "Leggings and sports bras",
        filter: "Leggings and sports bras",
        tag: "SEAMLESS",
        tagVariant: "light",
        image: "/images/triptych_brand_tag.jpg",
        alt: "High-waist seamless leggings and sports bra production",
        quoteCategory: "Activewear & Tracksuits",
        description: "Four-way stretch non-sheer compression leggings paired with supportive sports bras.",
      },
      {
        name: "Compression wear",
        filter: "Compression wear",
        tag: "MOISTURE-WICK",
        tagVariant: "light",
        image: "/images/grid_backpack.jpg",
        alt: "Compression training tops and recovery tights",
        quoteCategory: "Activewear & Tracksuits",
        description: "Ergonomic compression tops and bottoms providing targeted muscular support.",
      },
      {
        name: "Workout shorts and joggers",
        filter: "Workout shorts and joggers",
        image: "/images/grid_tracksuit.jpg",
        alt: "Custom workout shorts and athletic joggers",
        quoteCategory: "Activewear & Tracksuits",
        description: "Lightweight gym shorts with zipper pockets and tapered fleece training joggers.",
      },
      {
        name: "Custom fitness sets",
        filter: "Custom fitness sets",
        image: "/images/triptych_embroidery.jpg",
        alt: "Matching custom fitness sets with brand embroidery",
        quoteCategory: "Activewear & Tracksuits",
        description: "Color-coordinated fitness two-piece sets ready for private label collection drops.",
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
      "Football and hockey uniforms",
      "Tracksuits and training suits",
      "Cycling jerseys and bib shorts",
      "Basketball jerseys and shorts",
      "Sports jackets and teamwear",
    ],
    products: [
      {
        name: "Football and hockey uniforms",
        filter: "Football and hockey uniforms",
        tag: "PRIVATE LABEL",
        tagVariant: "red",
        image: "/images/grid_sportswear.jpg",
        alt: "Sublimated football and hockey team uniforms",
        quoteCategory: "Sportswear",
        description: "Reinforced tear-resistant match jerseys and socks with vivid all-over sublimation printing.",
      },
      {
        name: "Tracksuits and training suits",
        filter: "Tracksuits and training suits",
        tag: "ALL-SEASON",
        tagVariant: "light",
        image: "/images/grid_tracksuit.jpg",
        alt: "All-season team tracksuits and training sets",
        quoteCategory: "Sportswear",
        description: "Breathable poly-spandex athletic tracksuits tailored for warm-ups and team travel.",
      },
      {
        name: "Cycling jerseys and bib shorts",
        filter: "Cycling jerseys and bib shorts",
        tag: "AERODYNAMIC",
        tagVariant: "light",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Aerodynamic cycling jerseys with padded bib shorts",
        quoteCategory: "Sportswear",
        description: "Pro-cut aerodynamic cycling jerseys with anti-slip silicone hems and gel-padded bib shorts.",
      },
      {
        name: "Basketball jerseys and shorts",
        filter: "Basketball jerseys and shorts",
        tag: "REVERSIBLE",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Open-hole mesh basketball jerseys and shorts",
        quoteCategory: "Sportswear",
        description: "Quick-drying breathable court uniforms available in single and reversible team styles.",
      },
      {
        name: "Sports jackets and teamwear",
        filter: "Sports jackets and teamwear",
        image: "/images/triptych_embroidery.jpg",
        alt: "Custom sports jackets and coach teamwear",
        quoteCategory: "Sportswear",
        description: "Waterproof and windbreaker team jackets featuring custom crest embroidery and thermal lining.",
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
      "Oversized T-shirts",
      "Hoodies and sweatshirts",
      "Baggy jeans and joggers",
      "Varsity and bomber jackets",
      "Custom caps and beanies",
    ],
    products: [
      {
        name: "Oversized T-shirts",
        filter: "Oversized T-shirts",
        tag: "HEAVY-GSM",
        tagVariant: "red",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Heavyweight 240+ GSM dropped-shoulder oversized tees",
        quoteCategory: "Sportswear",
        description: "Vintage-washed heavyweight combed cotton tees featuring dropped shoulders and custom fit blocks.",
      },
      {
        name: "Hoodies and sweatshirts",
        filter: "Hoodies and sweatshirts",
        tag: "400 GSM",
        tagVariant: "light",
        image: "/images/triptych_embroidery.jpg",
        alt: "Heavyweight 400 GSM French terry hoodies",
        quoteCategory: "Sportswear",
        description: "Boxy luxury cut 400 GSM French terry pullover hoodies with double-layer hoods and puff printing.",
      },
      {
        name: "Baggy jeans and joggers",
        filter: "Baggy jeans and joggers",
        image: "/images/grid_tracksuit.jpg",
        alt: "Wide-leg skate jeans and heavyweight joggers",
        quoteCategory: "Sportswear",
        description: "Relaxed wide-leg denim and heavy fleece casual streetwear sweatpants with custom metal hardware.",
      },
      {
        name: "Varsity and bomber jackets",
        filter: "Varsity and bomber jackets",
        tag: "PREMIUM",
        tagVariant: "light",
        image: "/images/grid_leather_jacket.jpg",
        alt: "Classic wool and leather sleeve varsity jacket",
        quoteCategory: "Leather Goods",
        description: "Heritage wool body with genuine leather sleeves, custom chenille embroidery, and quilted interior.",
      },
      {
        name: "Custom caps and beanies",
        filter: "Custom caps and beanies",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Structured snapback caps and ribbed knit beanies",
        quoteCategory: "Sportswear",
        description: "6-panel flat brim snapbacks, curved dad hats, and acrylic ribbed knit beanies with custom patch tags.",
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
      "High-visibility safety vests",
      "Reflective jackets and trousers",
      "Work shirts and uniforms",
      "Industrial coveralls",
      "Company-branded workwear",
    ],
    products: [
      {
        name: "High-visibility safety vests",
        filter: "High-visibility safety vests",
        tag: "ANSI CLASS 2",
        tagVariant: "red",
        image: "/images/grid_workwear.jpg",
        alt: "ANSI Class 2 certified high-vis vests",
        quoteCategory: "Workwear & Uniforms",
        description: "ANSI/ISEA 107 Class 2 certified mesh and solid polyester safety vests with silver reflective tape.",
      },
      {
        name: "Reflective jackets and trousers",
        filter: "Reflective jackets and trousers",
        tag: "WEATHERPROOF",
        tagVariant: "light",
        image: "/images/grid_workwear.jpg",
        alt: "Fluorescent weatherproof jackets and safety trousers",
        quoteCategory: "Workwear & Uniforms",
        description: "Waterproof polyurethane-coated shell jackets and trousers with 360-degree reflective bands.",
      },
      {
        name: "Work shirts and uniforms",
        filter: "Work shirts and uniforms",
        image: "/images/grid_workwear.jpg",
        alt: "Industrial utility work shirts and crew uniforms",
        quoteCategory: "Workwear & Uniforms",
        description: "Rip-stop cotton-poly twill work shirts with dual chest pockets and reinforced stress points.",
      },
      {
        name: "Industrial coveralls",
        filter: "Industrial coveralls",
        tag: "HEAVY-DUTY",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Heavy-duty full body industrial boiler suits",
        quoteCategory: "Workwear & Uniforms",
        description: "Heavy twill safety coveralls with two-way heavy brass zippers and tool storage loops.",
      },
      {
        name: "Company-branded workwear",
        filter: "Company-branded workwear",
        image: "/images/triptych_brand_tag.jpg",
        alt: "Custom company-branded workwear uniforms",
        quoteCategory: "Workwear & Uniforms",
        description: "Customized corporate workwear branded with direct embroidery, heat transfers, and high-visibility patches.",
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
      "Leather jackets",
      "Leather wallets and cardholders",
      "Leather belts",
      "Leather accessories",
      "Custom leather products",
    ],
    products: [
      {
        name: "Leather jackets",
        filter: "Leather jackets",
        tag: "FULL-GRAIN",
        tagVariant: "red",
        image: "/images/grid_leather_jacket.jpg",
        alt: "Full-grain genuine biker and bomber leather jackets",
        quoteCategory: "Leather Jackets",
        description: "Handcrafted 100% genuine top-grain cowhide and sheepskin leather jackets with antique YKK hardware.",
      },
      {
        name: "Leather wallets and cardholders",
        filter: "Leather wallets and cardholders",
        tag: "HANDMADE",
        tagVariant: "light",
        image: "/images/grid_leather_hide.jpg",
        alt: "Handcrafted slim bifold wallets and card cases",
        quoteCategory: "Leather Goods",
        description: "Vegetable-tanned leather bifold wallets and slim RFID-blocking credit card organizers.",
      },
      {
        name: "Leather belts",
        filter: "Leather belts",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Full-grain solid leather casual and dress belts",
        quoteCategory: "Leather Goods",
        description: "Solid 3.5mm full-grain leather belts with burnished edges and interchangeable buckle hardware.",
      },
      {
        name: "Leather accessories",
        filter: "Leather accessories",
        tag: "BESPOKE",
        tagVariant: "light",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Handcrafted leather accessories, keychains, and coasters",
        quoteCategory: "Leather Goods",
        description: "Custom debossed leather key fobs, watch straps, desk pads, and leather coasters.",
      },
      {
        name: "Custom leather products",
        filter: "Custom leather products",
        image: "/images/grid_leather_hide.jpg",
        alt: "Bespoke custom manufactured leather goods",
        quoteCategory: "Leather Goods",
        description: "End-to-end bespoke leather manufacturing tailored precisely to client drawings and tech packs.",
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
      "Backpacks",
      "Gym and duffel bags",
      "Sports and team bags",
      "Travel bags",
      "Custom promotional bags",
    ],
    products: [
      {
        name: "Backpacks",
        filter: "Backpacks",
        tag: "WEATHER-SEALED",
        tagVariant: "red",
        image: "/images/grid_backpack.jpg",
        alt: "Weather-sealed 600D technical commuter backpacks",
        quoteCategory: "Custom Bags",
        description: "High-density Cordura daypacks with waterproof zippers, ergonomic straps, and laptop sleeves.",
      },
      {
        name: "Gym and duffel bags",
        filter: "Gym and duffel bags",
        tag: "REINFORCED",
        tagVariant: "light",
        image: "/images/hero_factory_sewing.jpg",
        alt: "Heavy-duty gym holdalls and duffel bags",
        quoteCategory: "Custom Bags",
        description: "All-purpose gym duffels featuring ventilated wet/shoe compartments and reinforced grab handles.",
      },
      {
        name: "Sports and team bags",
        filter: "Sports and team bags",
        image: "/images/grid_backpack.jpg",
        alt: "Club equipment bags and sports team holdalls",
        quoteCategory: "Custom Bags",
        description: "Heavy-duty gear holdalls designed to haul team equipment, bats, pads, and balls in bulk.",
      },
      {
        name: "Travel bags",
        filter: "Travel bags",
        tag: "AIRLINE READY",
        tagVariant: "light",
        image: "/images/triptych_leather_stitch.jpg",
        alt: "Carry-on weekend travel bags with leather accents",
        quoteCategory: "Custom Bags",
        description: "Durable weekender bags and carry-on luggage with reinforced base panels and leather trims.",
      },
      {
        name: "Custom promotional bags",
        filter: "Custom promotional bags",
        image: "/images/triptych_embroidery.jpg",
        alt: "Eco-friendly cotton tote bags and promotional sacks",
        quoteCategory: "Custom Bags",
        description: "Organic cotton canvas tote bags, drawstring cinch packs, and branded event giveaways.",
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
  "Gym T-shirts and tank tops": "Gym T-shirts and tank tops",
  "Leggings and sports bras": "Leggings and sports bras",
  "Compression wear": "Compression wear",
  "Workout shorts and joggers": "Workout shorts and joggers",
  "Custom fitness sets": "Custom fitness sets",
};

export function findCategoryBySlug(slug: string): CategoryCatalog | undefined {
  const found = categoryCatalogs.find((c) => c.slug === slug);
  if (found) return found;

  // Fallback for dynamically created categories
  if (slug) {
    const formattedName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      slug,
      name: formattedName,
      eyebrow: "CUSTOM PRODUCTION",
      headingTitle: `${formattedName.toUpperCase()} CATALOG`,
      engineeringTitle: "Performance Engineering",
      introTitle: `CUSTOM ${formattedName.toUpperCase()} MANUFACTURING`,
      intro: `QuantumWear X manufactures custom ${formattedName} engineered to enterprise grade.`,
      subItems: [`All ${formattedName}`],
      products: [],
    };
  }
  return undefined;
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
 * sub-item (e.g. /products/activewear?item=Gym%20T-shirts%20and%20tank%20tops).
 * Compares the first 6 alphanumeric characters so label casing/spacing
 * differences don't break the match.
 */
export function matchSubItem(query: string | null | undefined, subItems: string[]): string {
  if (!query) return "";
  const clean = query.trim().toLowerCase();

  // 1. Exact match (case-insensitive)
  const exact = subItems.find((s) => s.toLowerCase() === clean);
  if (exact) return exact;

  // 2. Full alphanumeric normalized match (without arbitrary 6-char truncation)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normQuery = norm(clean);
  if (!normQuery) return "";

  const normExact = subItems.find((s) => norm(s) === normQuery);
  if (normExact) return normExact;

  // 3. Normalized containment (one contains the other)
  const contains = subItems.find(
    (s) => norm(s).includes(normQuery) || normQuery.includes(norm(s))
  );
  if (contains) return contains;

  return "";
}
