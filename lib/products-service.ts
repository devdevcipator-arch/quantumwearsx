import { supabase } from "./supabase";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  category_id?: string | null;
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

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    title: "Gym T-shirts and tank tops",
    description: "Custom breathable athletic fabrics engineered for gym performance and durability",
    category: "Activewear",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-2",
    title: "Football and hockey uniforms",
    description: "Reinforced tear-resistant match jerseys and socks with vivid all-over sublimation printing",
    category: "Sportswear",
    image: "/images/grid_sportswear.jpg",
  },
  {
    id: "prod-3",
    title: "Oversized T-shirts",
    description: "Vintage-washed heavyweight combed cotton tees featuring dropped shoulders and custom fit blocks",
    category: "Streetwear",
    image: "/images/hero_factory_sewing.jpg",
  },
  {
    id: "prod-4",
    title: "High-visibility safety vests",
    description: "ANSI/ISEA 107 Class 2 certified mesh and solid polyester safety vests with silver reflective tape",
    category: "Safety Wear",
    image: "/images/grid_workwear.jpg",
  },
  {
    id: "prod-5",
    title: "Leather jackets",
    description: "Handcrafted 100% genuine top-grain cowhide and sheepskin leather jackets with antique YKK hardware",
    category: "Leather Products",
    image: "/images/grid_leather_jacket.jpg",
  },
  {
    id: "prod-6",
    title: "Backpacks",
    description: "High-density Cordura daypacks with waterproof zippers, ergonomic straps, and laptop sleeves",
    category: "Custom Bags",
    image: "/images/grid_backpack.jpg",
  },
];

export async function fetchProductsFromDb(): Promise<ProductItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    throw error;
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || "",
    category: row.category,
    image: row.image || "/images/triptych_leather_stitch.jpg",
    category_id: row.category_id,
    created_at: row.created_at,
  }));
}

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

export async function addProductToDb(product: {
  title: string;
  description: string;
  category: string;
  image: string;
}): Promise<ProductItem> {
  // Find category ID if exists
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("name", product.category)
    .single();

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title: product.title,
        description: product.description,
        category: product.category,
        category_id: catData?.id || null,
        image: product.image,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error inserting product into Supabase:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    category: data.category,
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
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.category !== undefined) {
    payload.category = updates.category;
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", updates.category)
      .single();
    if (catData?.id) {
      payload.category_id = catData.id;
    }
  }
  if (updates.image !== undefined) payload.image = updates.image;

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product in Supabase:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    category: data.category,
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
  const { error: prodError } = await supabase
    .from("products")
    .update({ category: newName })
    .eq("category", oldName);

  if (prodError) {
    console.warn("Notice: Updating category name across products had warning:", prodError);
  }

  return true;
}

export async function deleteCategoryFromDb(name: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("name", name);
  if (error) {
    console.error("Error deleting category from Supabase:", error);
    throw error;
  }
  return true;
}

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

