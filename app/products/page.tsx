import ProductsClient from "./ProductsClient";
import {
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  fetchSubcategoriesFromDb,
  SubcategoryItem,
} from "@/lib/products-service";

// Revalidate on edge CDN every 60 seconds for instant page loads & prefetching
export const revalidate = 60;

export default async function Products() {
  let initialProducts;
  let initialCategories;
  let initialSubcategories: SubcategoryItem[] | undefined;

  try {
    const [products, cats, subs] = await Promise.all([
      fetchProductsFromDb(),
      fetchCategoriesFromDb(),
      fetchSubcategoriesFromDb(),
    ]);

    if (products && products.length > 0) initialProducts = products;
    if (cats && cats.length > 0) initialCategories = cats;
    if (subs && subs.length > 0) initialSubcategories = subs;
  } catch {
    // Client components fall back to cached/default data on their own
  }

  return (
    <ProductsClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialSubcategories={initialSubcategories}
    />
  );
}
