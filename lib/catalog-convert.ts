import {
  inferSubcategory,
  getStoredSubcategoryMap,
  extractSubcategoryFromDescription,
  SubcategoryItem,
} from "./products-service";
import { CategoryCatalog, CatalogProduct } from "@/app/data/categories";

/**
 * Convert live Supabase ProductItems into the CatalogProduct shape used by
 * the category catalog view. Must be callable BOTH on the server (for SSR)
 * and on the client (for live refreshes) so both produce identical output —
 * identical output means no visible data swap on hydration/refresh.
 */
export function convertProductsForCategory(
  category: CategoryCatalog,
  items: Array<any>,
  customSubs: SubcategoryItem[] = []
): CatalogProduct[] {
  const normCatName = (category.name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
  const normCatSlug = (category.slug || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  // 1. Strict category matching: only products belonging to this category
  const matched = (items || []).filter((p: any) => {
    const normProdCat = (p.category || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (!normProdCat) return false;
    return normProdCat === normCatName || normProdCat === normCatSlug;
  });

  const localMap = getStoredSubcategoryMap();

  // 2. Sub-item filter list with custom subcategories at the TOP
  const staticSubItems = category.subItems || [];
  const allBtn = staticSubItems[0] || `All ${category.name}`;
  const defaultSubs = staticSubItems.slice(1);
  const customSubNames = (customSubs || [])
    .filter(
      (s) => (s.category || "").toLowerCase() === (category.name || "").toLowerCase()
    )
    .map((s) => s.name)
    .filter(
      (name) =>
        !defaultSubs.some((def) => def.toLowerCase() === name.toLowerCase())
    );
  const currentCategorySubItems = [allBtn, ...customSubNames, ...defaultSubs];

  // 3. Map each product to its true subcategory filter
  return matched.map((p: any) => {
    const title = p.title || p.name || "";
    const { cleanDescription, subcategory: descSub } =
      extractSubcategoryFromDescription(p.description || "");
    const localSub =
      localMap[p.id] || localMap[(title || "").toLowerCase().trim()] || "";

    let sub = (p.subcategory || descSub || localSub || "").trim();
    if (!sub || sub.toLowerCase().startsWith("all ")) {
      sub = inferSubcategory(title, category.name);
    }

    let matchedSubItem = "";
    if (sub) {
      matchedSubItem =
        currentCategorySubItems.find(
          (item, idx) =>
            idx > 0 &&
            (item.toLowerCase().trim() === sub.toLowerCase().trim() ||
              item.toLowerCase().trim().includes(sub.toLowerCase().trim()) ||
              sub.toLowerCase().trim().includes(item.toLowerCase().trim()))
        ) || "";
    }
    if (!matchedSubItem && title) {
      matchedSubItem =
        currentCategorySubItems.find(
          (item, idx) =>
            idx > 0 &&
            title.toLowerCase().trim().includes(item.toLowerCase().trim())
        ) || "";
    }

    const finalFilter = matchedSubItem || sub || "";

    return {
      name: title,
      description: cleanDescription || p.description || "",
      filter: finalFilter,
      tag: p.tag || "CUSTOM PRODUCTION",
      image: p.image || getCatalogFallbackImage(category.slug),
      alt: `${title} - QuantumWear X custom manufactured product`,
      quoteCategory: category.products[0]?.quoteCategory ?? "General Inquiry",
    };
  });
}

/** Category-based fallback image, shared by server + client conversion */
export function getCatalogFallbackImage(slug?: string) {
  switch (slug) {
    case "leather-products":
      return "/images/grid_leather_hide.jpg";
    case "safety-wear":
      return "/images/grid_workwear.jpg";
    case "sportswear":
      return "/images/grid_sportswear.jpg";
    case "custom-bags":
      return "/images/grid_backpack.jpg";
    case "streetwear":
      return "/images/grid_tracksuit.jpg";
    default:
      return "/images/grid_sportswear.jpg";
  }
}
