import HomeClient from "./HomeClient";
import { fetchProductsFromDb, ProductItem } from "@/lib/products-service";

// Revalidate on edge CDN every 60 seconds for instant page loads & prefetching
export const revalidate = 60;

export default async function Home() {
  let initialProducts: ProductItem[] | undefined;
  try {
    const live = await fetchProductsFromDb();
    if (live && live.length > 0) initialProducts = live.slice(0, 6);
  } catch {
    // Client components fall back to cached/default data on their own
  }

  return <HomeClient initialProducts={initialProducts} />;
}
