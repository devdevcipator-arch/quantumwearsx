import { supabase } from "./supabase";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  subcategory_id?: string | null;
  image: string;
  category_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SubcategoryItem {
  id: string;
  name: string;
  category: string;
  category_id?: string | null;
  display_order?: number;
  created_at?: string;
}

export const DEFAULT_CATEGORIES: string[] = [
  "Activewear",
  "Sportswear",
  "Streetwear",
  "Safety Wear",
  "Leather Products",
  "Custom Bags",
];

export const DEFAULT_SUBCATEGORIES: Record<string, string[]> = {
  "Activewear": [
    "Gym T-shirts and tank tops",
    "Leggings and sports bras",
    "Compression wear",
    "Workout shorts and joggers",
    "Custom fitness sets",
  ],
  "Sportswear": [
    "Football and hockey uniforms",
    "Tracksuits and training suits",
    "Cycling jerseys and bib shorts",
    "Basketball jerseys and shorts",
    "Sports jackets and teamwear",
  ],
  "Streetwear": [
    "Oversized T-shirts",
    "Hoodies and sweatshirts",
    "Baggy jeans and joggers",
    "Varsity and bomber jackets",
    "Custom caps and beanies",
  ],
  "Safety Wear": [
    "High-visibility safety vests",
    "Reflective jackets and trousers",
    "Work shirts and uniforms",
    "Industrial coveralls",
    "Company-branded workwear",
  ],
  "Leather Products": [
    "Leather jackets",
    "Leather wallets and cardholders",
    "Leather belts",
    "Leather accessories",
    "Custom leather products",
  ],
  "Custom Bags": [
    "Backpacks",
    "Gym and duffel bags",
    "Sports and team bags",
    "Travel bags",
    "Custom promotional bags",
  ],
};

// Helper to get local subcategory overrides so user-assigned subcategories are never lost
export function getStoredSubcategoryMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("qw_product_subcategories");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setStoredSubcategory(id: string, title: string, subcategory: string) {
  if (typeof window === "undefined" || !subcategory) return;
  try {
    const map = getStoredSubcategoryMap();
    if (id) map[id] = subcategory;
    if (title) map[title.toLowerCase().trim()] = subcategory;
    localStorage.setItem("qw_product_subcategories", JSON.stringify(map));
  } catch {}
}

// Helpers to transparently persist subcategory inside product description
// ensuring zero data loss across devices even before database schema migrations
export function extractSubcategoryFromDescription(desc: string): { cleanDescription: string; subcategory: string } {
  if (!desc) return { cleanDescription: "", subcategory: "" };
  const match = desc.match(/<!--subcategory:([^>]+)-->/);
  const subcategory = match ? match[1].trim() : "";
  const cleanDescription = desc.replace(/<!--subcategory:[^>]*-->/g, "").trim();
  return { cleanDescription, subcategory };
}

export function encodeSubcategoryInDescription(desc: string, sub: string): string {
  const clean = (desc || "").replace(/<!--subcategory:[^>]*-->/g, "").trim();
  return sub ? `${clean}\n<!--subcategory:${sub}-->` : clean;
}

// Helper to infer subcategory from product title/category if not explicitly set
export function inferSubcategory(title: string, category: string): string {
  const subs = DEFAULT_SUBCATEGORIES[category] || [];
  const lowerTitle = (title || "").toLowerCase();
  for (const s of subs) {
    if (lowerTitle.includes(s.toLowerCase())) {
      return s;
    }
  }
  return "";
}

export const DEFAULT_PRODUCTS: ProductItem[] = [
  // Activewear
  {
    id: "prod-act-1",
    title: "Gym T-shirts and tank tops",
    description: "Custom breathable athletic fabrics engineered for gym performance and durability",
    category: "Activewear",
    subcategory: "Gym T-shirts and tank tops",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-act-2",
    title: "Leggings and sports bras",
    description: "Four-way stretch non-sheer compression leggings paired with supportive sports bras",
    category: "Activewear",
    subcategory: "Leggings and sports bras",
    image: "/images/triptych_brand_tag.jpg",
  },
  {
    id: "prod-act-3",
    title: "Compression wear",
    description: "Ergonomic compression tops and bottoms providing targeted muscular support",
    category: "Activewear",
    subcategory: "Compression wear",
    image: "/images/grid_backpack.jpg",
  },
  {
    id: "prod-act-4",
    title: "Workout shorts and joggers",
    description: "Lightweight gym shorts with zipper pockets and tapered fleece training joggers",
    category: "Activewear",
    subcategory: "Workout shorts and joggers",
    image: "/images/grid_tracksuit.jpg",
  },
  {
    id: "prod-act-5",
    title: "Custom fitness sets",
    description: "Color-coordinated fitness two-piece sets ready for private label collection drops",
    category: "Activewear",
    subcategory: "Custom fitness sets",
    image: "/images/triptych_embroidery.jpg",
  },

  // Sportswear
  {
    id: "prod-spt-1",
    title: "Football and hockey uniforms",
    description: "Reinforced tear-resistant match jerseys and socks with vivid all-over sublimation printing",
    category: "Sportswear",
    subcategory: "Football and hockey uniforms",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-spt-2",
    title: "Tracksuits and training suits",
    description: "Breathable poly-spandex athletic tracksuits tailored for warm-ups and team travel",
    category: "Sportswear",
    subcategory: "Tracksuits and training suits",
    image: "/images/grid_tracksuit.jpg",
  },
  {
    id: "prod-spt-3",
    title: "Cycling jerseys and bib shorts",
    description: "Pro-cut aerodynamic cycling jerseys with anti-slip silicone hems and gel-padded bib shorts",
    category: "Sportswear",
    subcategory: "Cycling jerseys and bib shorts",
    image: "/images/triptych_brand_tag.jpg",
  },
  {
    id: "prod-spt-4",
    title: "Basketball jerseys and shorts",
    description: "Quick-drying breathable court uniforms available in single and reversible team styles",
    category: "Sportswear",
    subcategory: "Basketball jerseys and shorts",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-spt-5",
    title: "Sports jackets and teamwear",
    description: "Waterproof and windbreaker team jackets featuring custom crest embroidery and thermal lining",
    category: "Sportswear",
    subcategory: "Sports jackets and teamwear",
    image: "/images/triptych_embroidery.jpg",
  },

  // Streetwear
  {
    id: "prod-str-1",
    title: "Oversized T-shirts",
    description: "Vintage-washed heavyweight combed cotton tees featuring dropped shoulders and custom fit blocks",
    category: "Streetwear",
    subcategory: "Oversized T-shirts",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-str-2",
    title: "Hoodies and sweatshirts",
    description: "Boxy luxury cut 400 GSM French terry pullover hoodies with double-layer hoods and puff printing",
    category: "Streetwear",
    subcategory: "Hoodies and sweatshirts",
    image: "/images/triptych_embroidery.jpg",
  },
  {
    id: "prod-str-3",
    title: "Baggy jeans and joggers",
    description: "Relaxed wide-leg denim and heavy fleece casual streetwear sweatpants with custom metal hardware",
    category: "Streetwear",
    subcategory: "Baggy jeans and joggers",
    image: "/images/grid_tracksuit.jpg",
  },
  {
    id: "prod-str-4",
    title: "Varsity and bomber jackets",
    description: "Heritage wool body with genuine leather sleeves, custom chenille embroidery, and quilted interior",
    category: "Streetwear",
    subcategory: "Varsity and bomber jackets",
    image: "/images/grid_leather_jacket.jpg",
  },
  {
    id: "prod-str-5",
    title: "Custom caps and beanies",
    description: "6-panel flat brim snapbacks, curved dad hats, and acrylic ribbed knit beanies with custom patch tags",
    category: "Streetwear",
    subcategory: "Custom caps and beanies",
    image: "/images/triptych_brand_tag.jpg",
  },

  // Safety Wear
  {
    id: "prod-saf-1",
    title: "High-visibility safety vests",
    description: "ANSI/ISEA 107 Class 2 certified mesh and solid polyester safety vests with silver reflective tape",
    category: "Safety Wear",
    subcategory: "High-visibility safety vests",
    image: "/images/grid_workwear.jpg",
  },
  {
    id: "prod-saf-2",
    title: "Reflective jackets and trousers",
    description: "Waterproof polyurethane-coated shell jackets and trousers with 360-degree reflective bands",
    category: "Safety Wear",
    subcategory: "Reflective jackets and trousers",
    image: "/images/grid_workwear.jpg",
  },
  {
    id: "prod-saf-3",
    title: "Work shirts and uniforms",
    description: "Rip-stop cotton-poly twill work shirts with dual chest pockets and reinforced stress points",
    category: "Safety Wear",
    subcategory: "Work shirts and uniforms",
    image: "/images/grid_workwear.jpg",
  },
  {
    id: "prod-saf-4",
    title: "Industrial coveralls",
    description: "Heavy twill safety coveralls with two-way heavy brass zippers and tool storage loops",
    category: "Safety Wear",
    subcategory: "Industrial coveralls",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-saf-5",
    title: "Company-branded workwear",
    description: "Customized corporate workwear branded with direct embroidery, heat transfers, and high-visibility patches",
    category: "Safety Wear",
    subcategory: "Company-branded workwear",
    image: "/images/triptych_brand_tag.jpg",
  },

  // Leather Products
  {
    id: "prod-lea-1",
    title: "Leather jackets",
    description: "Handcrafted 100% genuine top-grain cowhide and sheepskin leather jackets with antique YKK hardware",
    category: "Leather Products",
    subcategory: "Leather jackets",
    image: "/images/grid_leather_jacket.jpg",
  },
  {
    id: "prod-lea-2",
    title: "Leather wallets and cardholders",
    description: "Full-grain bifold wallets, minimalist cardholders, and passport covers with RFID blocking liners",
    category: "Leather Products",
    subcategory: "Leather wallets and cardholders",
    image: "/images/grid_leather_hide.jpg",
  },
  {
    id: "prod-lea-3",
    title: "Leather belts",
    description: "Vegetable-tanned harness leather belts fitted with solid brass, stainless steel, or matte black buckles",
    category: "Leather Products",
    subcategory: "Leather belts",
    image: "/images/triptych_leather_stitch.jpg",
  },
  {
    id: "prod-lea-4",
    title: "Leather accessories",
    description: "Key fobs, luggage tags, watch straps, and small bespoke goods customized with foil stamping or debossing",
    category: "Leather Products",
    subcategory: "Leather accessories",
    image: "/images/triptych_leather_stitch.jpg",
  },
  {
    id: "prod-lea-5",
    title: "Custom leather products",
    description: "Custom-dyed and patterned specialty leather creations built to exact client CAD tech packs",
    category: "Leather Products",
    subcategory: "Custom leather products",
    image: "/images/grid_leather_hide.jpg",
  },

  // Custom Bags
  {
    id: "prod-bag-1",
    title: "Backpacks",
    description: "High-density Cordura daypacks with waterproof zippers, ergonomic straps, and laptop sleeves",
    category: "Custom Bags",
    subcategory: "Backpacks",
    image: "/images/grid_backpack.jpg",
  },
  {
    id: "prod-bag-2",
    title: "Gym and duffel bags",
    description: "Heavy-duty ripstop nylon gym bags with dedicated shoe compartments and ventilated wet pockets",
    category: "Custom Bags",
    subcategory: "Gym and duffel bags",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-bag-3",
    title: "Sports and team bags",
    description: "Large-capacity squad gear bags with reinforced bottoms, heavy-duty pull tabs, and player name slots",
    category: "Custom Bags",
    subcategory: "Sports and team bags",
    image: "/images/grid_backpack.jpg",
  },
  {
    id: "prod-bag-4",
    title: "Travel bags",
    description: "Cabin-size weekender duffels and rolling garment bags engineered for durability across transit",
    category: "Custom Bags",
    subcategory: "Travel bags",
    image: "/images/triptych_leather_stitch.jpg",
  },
  {
    id: "prod-bag-5",
    title: "Custom promotional bags",
    description: "Eco-friendly canvas totes, drawstring packs, and customized retail merchandise bags with screen printing",
    category: "Custom Bags",
    subcategory: "Custom promotional bags",
    image: "/images/triptych_embroidery.jpg",
  },
];

/* ---------------------------------------------------------------
   Products Queries & Mutations
--------------------------------------------------------------- */

export async function fetchProductsFromDb(): Promise<ProductItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    throw error;
  }

  const localMap = getStoredSubcategoryMap();

  return (data || []).map((row) => {
    const { cleanDescription, subcategory: descSub } = extractSubcategoryFromDescription(row.description || "");
    const localSub = localMap[row.id] || localMap[(row.title || "").toLowerCase().trim()] || "";
    const resolvedSub =
      row.subcategory ||
      descSub ||
      localSub ||
      inferSubcategory(row.title, row.category) ||
      "";

    // Keep cached in localMap
    if (resolvedSub && typeof window !== "undefined") {
      setStoredSubcategory(row.id, row.title, resolvedSub);
    }

    return {
      id: row.id,
      title: row.title,
      description: cleanDescription || row.description || "",
      category: row.category,
      subcategory: resolvedSub,
      subcategory_id: row.subcategory_id || null,
      image: row.image || "/images/triptych_leather_stitch.jpg",
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  });
}

export async function addProductToDb(product: {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  image: string;
}): Promise<ProductItem> {
  const chosenSub = product.subcategory || inferSubcategory(product.title, product.category);
  const encodedDesc = encodeSubcategoryInDescription(product.description, chosenSub);

  // Find category ID if exists
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("name", product.category)
    .maybeSingle();

  // Find subcategory ID if exists
  let subcategoryId: string | null = null;
  if (chosenSub) {
    const { data: subData } = await supabase
      .from("subcategories")
      .select("id")
      .eq("name", chosenSub)
      .eq("category", product.category)
      .maybeSingle();
    subcategoryId = subData?.id || null;
  }

  const insertPayload: any = {
    title: product.title,
    description: encodedDesc,
    category: product.category,
    category_id: catData?.id || null,
    subcategory: chosenSub,
    subcategory_id: subcategoryId,
    image: product.image,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([insertPayload])
    .select()
    .single();

  if (error) {
    // If subcategory column doesn't exist yet, retry without subcategory columns
    if (error.message?.includes("subcategory")) {
      delete insertPayload.subcategory;
      delete insertPayload.subcategory_id;
      const { data: retryData, error: retryErr } = await supabase
        .from("products")
        .insert([insertPayload])
        .select()
        .single();
      if (retryErr) throw retryErr;

      setStoredSubcategory(retryData.id, retryData.title, chosenSub);
      const { cleanDescription } = extractSubcategoryFromDescription(retryData.description || "");

      return {
        id: retryData.id,
        title: retryData.title,
        description: cleanDescription || product.description,
        category: retryData.category,
        subcategory: chosenSub,
        subcategory_id: null,
        image: retryData.image || "/images/triptych_leather_stitch.jpg",
        category_id: retryData.category_id,
      };
    }
    console.error("Error inserting product into Supabase:", error);
    throw error;
  }

  setStoredSubcategory(data.id, data.title, chosenSub);
  const { cleanDescription } = extractSubcategoryFromDescription(data.description || "");

  return {
    id: data.id,
    title: data.title,
    description: cleanDescription || product.description,
    category: data.category,
    subcategory: data.subcategory || chosenSub,
    subcategory_id: data.subcategory_id || null,
    image: data.image || "/images/triptych_leather_stitch.jpg",
    category_id: data.category_id,
  };
}

export async function updateProductInDb(
  id: string,
  updates: Partial<ProductItem>
): Promise<ProductItem> {
  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;

  if (updates.subcategory !== undefined || updates.description !== undefined) {
    const rawDesc = updates.description !== undefined ? updates.description : "";
    const rawSub = updates.subcategory !== undefined ? updates.subcategory : "";
    if (rawSub) {
      payload.description = encodeSubcategoryInDescription(rawDesc, rawSub);
    } else if (updates.description !== undefined) {
      payload.description = updates.description;
    }
  }

  if (updates.category !== undefined) {
    payload.category = updates.category;
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", updates.category)
      .maybeSingle();
    if (catData?.id) {
      payload.category_id = catData.id;
    }
  }

  if (updates.subcategory !== undefined) {
    payload.subcategory = updates.subcategory;
    const catName = updates.category;
    if (catName && updates.subcategory) {
      const { data: subData } = await supabase
        .from("subcategories")
        .select("id")
        .eq("name", updates.subcategory)
        .eq("category", catName)
        .maybeSingle();
      if (subData?.id) {
        payload.subcategory_id = subData.id;
      }
    }
  }

  if (updates.image !== undefined) payload.image = updates.image;

  let { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error && error.message?.includes("subcategory")) {
    // Retry without subcategory fields if columns not yet present in schema
    delete payload.subcategory;
    delete payload.subcategory_id;
    const res = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Error updating product in Supabase:", error);
    throw error;
  }

  if (updates.subcategory) {
    setStoredSubcategory(id, data.title || updates.title || "", updates.subcategory);
  }

  const { cleanDescription, subcategory: descSub } = extractSubcategoryFromDescription(data.description || "");

  return {
    id: data.id,
    title: data.title,
    description: cleanDescription || data.description || "",
    category: data.category,
    subcategory: data.subcategory || descSub || updates.subcategory || "",
    subcategory_id: data.subcategory_id || null,
    image: data.image,
    category_id: data.category_id,
  };
}

export async function removeProductFromDb(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product from Supabase:", error);
    throw error;
  }
  return true;
}

/* ---------------------------------------------------------------
   Categories Queries & Mutations
--------------------------------------------------------------- */

export async function fetchCategoriesFromDb(): Promise<string[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("name, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories from Supabase:", error);
    throw error;
  }

  return (data || []).map((c) => c.name);
}

export async function addCategoryToDb(name: string, displayOrder: number): Promise<string> {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, display_order: displayOrder }])
    .select()
    .single();

  if (error) {
    console.error("Error adding category to Supabase:", error);
    throw error;
  }
  return data.name;
}

export async function updateCategoryOrderInDb(name: string, displayOrder: number): Promise<boolean> {
  const { error } = await supabase
    .from("categories")
    .update({ display_order: displayOrder })
    .eq("name", name);
  return !error;
}

export async function renameCategoryInDb(oldName: string, newName: string): Promise<boolean> {
  // Update categories table
  const { error: catError } = await supabase
    .from("categories")
    .update({ name: newName })
    .eq("name", oldName);

  if (catError) {
    console.error("Error renaming category in Supabase:", catError);
    throw catError;
  }

  // Update products referencing this category name
  await supabase
    .from("products")
    .update({ category: newName })
    .eq("category", oldName);

  // Update subcategories referencing this category name
  await supabase
    .from("subcategories")
    .update({ category: newName })
    .eq("category", oldName);

  return true;
}

export async function deleteCategoryFromDb(name: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("name", name);
  if (error) {
    console.error("Error deleting category from Supabase:", error);
    throw error;
  }

  // Also remove subcategories linked to this category
  await supabase.from("subcategories").delete().eq("category", name);

  return true;
}

/* ---------------------------------------------------------------
   Subcategories Queries & Mutations
--------------------------------------------------------------- */

export async function fetchSubcategoriesFromDb(): Promise<SubcategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Notice: Subcategories table query fallback to default client list:", error.message);
      return getDefaultSubcategoriesList();
    }

    if (!data || data.length === 0) {
      return getDefaultSubcategoriesList();
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      category_id: row.category_id || null,
      display_order: row.display_order || 0,
      created_at: row.created_at,
    }));
  } catch (err) {
    console.warn("Subcategories fetch fallback to defaults:", err);
    return getDefaultSubcategoriesList();
  }
}

export function getDefaultSubcategoriesList(): SubcategoryItem[] {
  const list: SubcategoryItem[] = [];
  let order = 1;
  for (const [cat, subs] of Object.entries(DEFAULT_SUBCATEGORIES)) {
    for (const sub of subs) {
      list.push({
        id: `sub-${cat.toLowerCase().replace(/\s+/g, '-')}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
        name: sub,
        category: cat,
        display_order: order++,
      });
    }
  }
  return list;
}

export async function addSubcategoryToDb(
  name: string,
  category: string,
  displayOrder?: number
): Promise<SubcategoryItem> {
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("name", category)
    .maybeSingle();

  const payload: any = {
    name,
    category,
    category_id: catData?.id || null,
    display_order: displayOrder || 0,
  };

  const { data, error } = await supabase
    .from("subcategories")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.warn("Notice: Inserting subcategory into Supabase had error:", error.message);
    // Return constructed item so client UI stays functional
    return {
      id: `local-sub-${Date.now()}`,
      name,
      category,
      category_id: catData?.id || null,
      display_order: displayOrder || 0,
    };
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    category_id: data.category_id,
    display_order: data.display_order,
    created_at: data.created_at,
  };
}

export async function renameSubcategoryInDb(
  oldName: string,
  newName: string,
  category: string
): Promise<boolean> {
  const { error: subError } = await supabase
    .from("subcategories")
    .update({ name: newName })
    .eq("name", oldName)
    .eq("category", category);

  if (subError) {
    console.warn("Notice: Updating subcategory in Supabase had error:", subError.message);
  }

  // Also update products referencing this subcategory
  await supabase
    .from("products")
    .update({ subcategory: newName })
    .eq("subcategory", oldName)
    .eq("category", category);

  return true;
}

export async function deleteSubcategoryFromDb(
  name: string,
  category: string
): Promise<boolean> {
  const { error } = await supabase
    .from("subcategories")
    .delete()
    .eq("name", name)
    .eq("category", category);

  if (error) {
    console.warn("Notice: Deleting subcategory from Supabase had error:", error.message);
  }

  // Clear subcategory on products that used this subcategory
  await supabase
    .from("products")
    .update({ subcategory: null, subcategory_id: null })
    .eq("subcategory", name)
    .eq("category", category);

  return true;
}

/* ---------------------------------------------------------------
   Storage & Image Upload
--------------------------------------------------------------- */

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image to Supabase Storage:", uploadError);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
