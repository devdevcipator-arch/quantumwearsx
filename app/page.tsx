import HomeClient from "./HomeClient";
import { fetchProductsFromDb, ProductItem } from "@/lib/products-service";

// Server-render the live Supabase data so the first paint already matches
// the final content — no placeholder → cached → live swap on refresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  let initialProducts: ProductItem[] | undefined;
  try {
    const live = await fetchProductsFromDb();
    if (live && live.length > 0) initialProducts = live;
  } catch {
    // Client components fall back to cached/default data on their own
  }

  return <HomeClient initialProducts={initialProducts} />;
}
