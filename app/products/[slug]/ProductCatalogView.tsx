"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../../components/Navbar";
import SmoothScroll from "../../components/SmoothScroll";
import ScrollProgress from "../../components/ScrollProgress";
import RevealObserver from "../../components/RevealObserver";
import Footer from "../../components/Footer";
import QuoteModal from "../../components/QuoteModal";
import { getProductUrl } from "@/lib/product-details";
import {
  categoryCatalogs,
  matchSubItem,
  type CategoryCatalog,
  type CatalogProduct,
} from "../../data/categories";
import {
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  fetchSubcategoriesFromDb,
  inferSubcategory,
  getStoredSubcategoryMap,
  extractSubcategoryFromDescription,
  SubcategoryItem,
  ProductItem,
} from "@/lib/products-service";
import {
  convertProductsForCategory,
  getCatalogFallbackImage,
} from "@/lib/catalog-convert";

interface ProductCatalogViewProps {
  category: CategoryCatalog;
  itemQuery?: string;
  /** Live data pre-fetched on the server — first paint == final content */
  initialProducts?: CatalogProduct[];
  initialCats?: string[];
  initialSubs?: SubcategoryItem[];
}


export default function ProductCatalogView({
  category,
  itemQuery,
  initialProducts,
  initialCats,
  initialSubs,
}: ProductCatalogViewProps) {
  const pathname = usePathname();

  // Derive active category directly from route parameters / URL pathname
  const currentCategorySlug = useMemo(() => {
    const parts = (pathname || "").split("/");
    return parts[2] || category.slug;
  }, [pathname, category.slug]);

  // Synchronize expanded accordion state with the active category slug
  const [expanded, setExpanded] = useState<string>(currentCategorySlug);
  const [itemFilter, setItemFilter] = useState(
    () => matchSubItem(itemQuery, category.subItems) || category.subItems[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    category.products[0]?.quoteCategory ?? "General Inquiry"
  );

  // Dynamic categories and subcategories from server truth / DB / localStorage
  const [dynamicCats, setDynamicCats] = useState<string[]>(
    initialCats && initialCats.length > 0 ? initialCats : []
  );
  const [dynamicSubs, setDynamicSubs] = useState<SubcategoryItem[]>(
    initialSubs && initialSubs.length > 0 ? initialSubs : []
  );

  useEffect(() => {
    const hasServerCats = initialCats !== undefined && initialCats.length > 0;
    const hasServerSubs =
      initialSubs !== undefined && initialSubs.length > 0;

    // Skip the wholesale cache read when the server already provided fresh
    // truth data — replacing server data with the possibly-stale localStorage
    // cache was one source of the visible garbage flash on refresh.
    if (!hasServerCats || !hasServerSubs) {
      try {
        if (!hasServerCats) {
          const cachedCats = localStorage.getItem("qw_admin_categories");
          if (cachedCats) {
            const parsed = JSON.parse(cachedCats);
            if (Array.isArray(parsed) && parsed.length > 0) setDynamicCats(parsed);
          }
        }
        if (!hasServerSubs) {
          const cachedSubs = localStorage.getItem("qw_admin_subcategories");
          if (cachedSubs) {
            const parsed = JSON.parse(cachedSubs);
            if (Array.isArray(parsed) && parsed.length > 0) setDynamicSubs(parsed);
          }
        }
      } catch {}
    }

    async function loadMeta() {
      try {
        const [cats, subs] = await Promise.all([
          fetchCategoriesFromDb(),
          fetchSubcategoriesFromDb(),
        ]);
        if (cats && cats.length > 0) setDynamicCats(cats);
        if (subs && subs.length > 0) setDynamicSubs(subs);
      } catch {}
    }
    loadMeta();
  }, []);

  // Helper to get sub-items for any category with user-created subcategories at the TOP
  const getCategorySubItems = (catName: string, staticSubItems: string[]) => {
    const allBtn = staticSubItems[0] || `All ${catName}`;
    const defaultSubs = staticSubItems.slice(1);

    const customSubs = dynamicSubs
      .filter((s) => s.category.toLowerCase() === catName.toLowerCase())
      .map((s) => s.name)
      .filter(
        (name) => !defaultSubs.some((def) => def.toLowerCase() === name.toLowerCase())
      );

    // Newly created subcategories appear at the TOP (right under "All ...")
    return [allBtn, ...customSubs, ...defaultSubs];
  };

  const currentCategorySubItems = useMemo(() => {
    return getCategorySubItems(category.name, category.subItems);
  }, [category.name, category.subItems, dynamicSubs]);

  // Sidebar categories with newly created categories at the TOP
  const sidebarCategories = useMemo(() => {
    if (dynamicCats.length === 0) return categoryCatalogs;

    const catalogMap = new Map(categoryCatalogs.map((c) => [c.name.toLowerCase(), c]));
    const ordered: CategoryCatalog[] = [];
    const seen = new Set<string>();

    for (const catName of dynamicCats) {
      const lower = catName.toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);

      const existing = catalogMap.get(lower);
      if (existing) {
        ordered.push(existing);
      } else {
        const slug = catName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        ordered.push({
          slug,
          name: catName,
          eyebrow: "CUSTOM PRODUCTION",
          headingTitle: `${catName.toUpperCase()} CATALOG`,
          engineeringTitle: "Performance Engineering",
          introTitle: `CUSTOM ${catName.toUpperCase()} MANUFACTURING`,
          intro: `QuantumWear X manufactures custom ${catName} engineered to enterprise grade.`,
          subItems: [`All ${catName}`],
          products: [],
        });
      }
    }

    for (const cat of categoryCatalogs) {
      if (!seen.has(cat.name.toLowerCase())) {
        ordered.push(cat);
      }
    }

    return ordered;
  }, [dynamicCats]);

  // Keep state synchronized whenever category route changes
  useEffect(() => {
    if (currentCategorySlug) {
      setExpanded(currentCategorySlug);
    }
    setItemFilter(matchSubItem(itemQuery, currentCategorySubItems) || currentCategorySubItems[0]);
    setSearchQuery("");
  }, [currentCategorySlug, currentCategorySubItems, itemQuery]);

  // Dynamic products from Supabase Live DB matching this category.
  // Initialized from server-truth data when available so SSR == final view.
  const [liveDbProducts, setLiveDbProducts] = useState<CatalogProduct[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : []
  );

  useEffect(() => {
    const hasServerProducts =
      initialProducts !== undefined && initialProducts.length > 0;
    const normCatName = (category.name || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    const normCatSlug = (category.slug || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    function filterAndConvert(items: any[]): CatalogProduct[] {
      // 1. Strict category matching: only match products that belong to this category
      const matched = items.filter((p: any) => {
        const normProdCat = (p.category || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
        if (!normProdCat) return false;
        return normProdCat === normCatName || normProdCat === normCatSlug;
      });

      const localMap = getStoredSubcategoryMap();

      // 2. Map and associate each product with its true subcategory
      return matched.map((p: any) => {
        const title = p.title || p.name || "";
        const { cleanDescription, subcategory: descSub } = extractSubcategoryFromDescription(p.description || "");
        const localSub = localMap[p.id] || localMap[(title || "").toLowerCase().trim()] || "";

        let sub = (p.subcategory || descSub || localSub || "").trim();
        if (!sub || sub.toLowerCase().startsWith("all ")) {
          sub = inferSubcategory(title, category.name);
        }

        // Match against category's subItems
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

    // Instant local cache check — ONLY when the server did not provide
    // fresh DB data. Overwriting server truth with the stale localStorage
    // cache produced the "old data for a second" flash on refresh.
    if (!hasServerProducts) {
      try {
        const cached = localStorage.getItem("qw_admin_products");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const converted = filterAndConvert(parsed);
            if (converted.length > 0) {
              setLiveDbProducts(converted);
            }
          }
        }
      } catch {}
    }

    async function loadCategoryProducts() {
      try {
        const allDbProducts = await fetchProductsFromDb();
        let localProducts: any[] = [];
        try {
          const cached = localStorage.getItem("qw_admin_products");
          if (cached) localProducts = JSON.parse(cached);
        } catch {}

        const liveIds = new Set(allDbProducts.map((p) => p.id));
        const merged = [
          ...localProducts.filter((p) => !liveIds.has(p.id)),
          ...allDbProducts,
        ];
        const converted = filterAndConvert(merged);
        setLiveDbProducts(converted);
      } catch (err) {
        console.warn("ProductCatalogView live DB fetch fallback:", err);
      }
    }

    loadCategoryProducts();
  }, [category.name, category.slug, currentCategorySubItems]);

  const handleOpenQuote = (quoteCategory?: string) => {
    if (quoteCategory) setSelectedCategory(quoteCategory);
    setQuoteModalOpen(true);
  };

  const isAllFilter = useMemo(() => {
    if (!itemFilter) return true;
    const clean = itemFilter.toLowerCase().trim();
    return (
      clean === (currentCategorySubItems[0] || "").toLowerCase().trim() ||
      clean.startsWith("all ")
    );
  }, [itemFilter, currentCategorySubItems]);

  const filteredProducts = useMemo(() => {
    const liveNames = new Set(
      liveDbProducts.map((p) => p.name.toLowerCase().trim())
    );
    const combined = [
      ...liveDbProducts,
      ...category.products.filter(
        (p) => !liveNames.has(p.name.toLowerCase().trim())
      ),
    ];

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = (p: CatalogProduct) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.filter || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q);

    // If "All ..." is selected, return all products matching search
    if (isAllFilter) {
      return combined.filter(matchesSearch);
    }

    const normTarget = itemFilter.toLowerCase().trim();

    // Specific subcategory filter: strictly match target subcategory
    return combined.filter((p) => {
      const pFilter = (p.filter || "").toLowerCase().trim();
      const pName = (p.name || "").toLowerCase().trim();

      const isFilterMatch =
        Boolean(pFilter) &&
        !pFilter.startsWith("all ") &&
        (pFilter === normTarget ||
          (pFilter.length >= 4 &&
            normTarget.length >= 4 &&
            (pFilter.includes(normTarget) || normTarget.includes(pFilter))));

      const isNameMatch =
        !pFilter &&
        Boolean(pName) &&
        (pName === normTarget ||
          (pName.length >= 4 &&
            normTarget.length >= 4 &&
            (pName.includes(normTarget) || normTarget.includes(pName))));

      const matchesSubcategory = isFilterMatch || isNameMatch;

      return matchesSubcategory && matchesSearch(p);
    });
  }, [itemFilter, isAllFilter, category.products, liveDbProducts, searchQuery]);

  // Mobile-only: the currently selected option (subcategory filter, or the
  // category itself when "All ..." is active). Rendered permanently inside
  // the <summary> header so it stays visible while the drawer is collapsed.
  const activeOptionLabel =
    !isAllFilter && itemFilter ? itemFilter : category.name;

  const mobileSidebarRef = useRef<HTMLDetailsElement>(null);

  // Mobile-only: close the categories drawer the instant a category link or
  // subcategory button is tapped. Delegated on the mobile wrapper so the
  // shared sidebarAccordion markup (also rendered in the desktop sidebar)
  // remains 100% untouched.
  const handleMobileSidebarItemClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Leaf actions only — accordion expand/collapse toggles must NOT close it.
    if (target.closest("a, .catalog-subbtn")) {
      mobileSidebarRef.current?.removeAttribute("open");
    }
  };

  // Shared categories accordion — rendered twice: inside the mobile
  // <details> drawer and inside the permanent desktop sidebar.
  const sidebarAccordion = (
    <ul className="catalog-accordion">
      {sidebarCategories.map((cat) => {
        const isCurrent = cat.slug === currentCategorySlug;
        const isOpen = expanded === cat.slug;
        const subs = getCategorySubItems(cat.name, cat.subItems);
        return (
          <li
            key={cat.slug}
            className={`catalog-accordion-item ${isOpen ? "open" : ""} ${
              isCurrent ? "active-route" : ""
            }`}
          >
            {isCurrent ? (
              <button
                type="button"
                className="catalog-accordion-toggle"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? "" : cat.slug)}
              >
                <span className="font-bold text-white">{cat.name}</span>
                <span className="catalog-accordion-chevron" aria-hidden="true">
                  {isOpen ? "⌄" : "›"}
                </span>
              </button>
            ) : (
              <Link
                href={`/products/${cat.slug}`}
                className="catalog-accordion-toggle"
                aria-expanded={isOpen}
                onClick={() => setExpanded(cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="catalog-accordion-chevron" aria-hidden="true">
                  {isOpen ? "⌄" : "›"}
                </span>
              </Link>
            )}

            {isOpen && (
              <ul className="catalog-sublist">
                {subs.map((sub) => (
                  <li key={sub}>
                    {isCurrent ? (
                      // Current category: filter stays on this page
                      <button
                        type="button"
                        className={`catalog-subbtn ${
                          itemFilter === sub ? "active" : ""
                        }`}
                        onClick={() => setItemFilter(sub)}
                      >
                        {sub}
                      </button>
                    ) : (
                      // Other categories: link to their catalog page
                      <Link
                        href={`/products/${cat.slug}?item=${encodeURIComponent(sub)}`}
                        className="catalog-subbtn"
                      >
                        {sub}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <main className="landing-page-root" id="top">
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      <Navbar
        active="products"
        onOpenQuote={() => handleOpenQuote("General Inquiry")}
      />

      {/* ================= CATEGORY CATALOG ================= */}
      <section
        className="catalog-view-section"
        aria-label={`${category.name} catalog`}
      >
        <div className="catalog-view-container">
          {/* Breadcrumb (left) directly across from Search bar (right) */}
          <div className="catalog-breadcrumb-bar">
            <nav aria-label="Breadcrumb" className="catalog-breadcrumb">
              <Link href="/products">Products</Link>
              <span className="crumb-sep">›</span>
              <span className="crumb-current">{category.name}</span>
            </nav>

            {/* Persistent, resilient search bar with dynamic category placeholder */}
            <div className="catalog-search-bar catalog-search-bar--header">
              <svg
                className="catalog-search-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
              <input
                type="search"
                className="catalog-search-input"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={`Search in ${category.name}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="catalog-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8e8e9f",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Eyebrow + Title */}
          <div className="catalog-view-header">
            <div>
              <p className="catalog-view-eyebrow">{category.eyebrow}</p>
              <h1 className="catalog-view-title">{category.headingTitle}</h1>
            </div>
          </div>

          <div className="catalog-view-layout">
            {/* ---------- Sidebar: Categories accordion ---------- */}
            <aside className="catalog-sidebar" aria-label="Categories">
              {/* Mobile: collapsible Categories drawer — native <details>, zero-JS.
                  Top summary row: hamburger button LEFT of the heading, with a
                  permanently visible "selected option" badge beneath it (<summary>
                  renders even while collapsed, so the active category/sub-filter
                  is always readable). Tapping any category link or subcategory
                  button instantly closes the drawer via delegated handler. */}
              <details
                ref={mobileSidebarRef}
                className="catalog-sidebar-collapse sm:hidden"
              >
                <summary className="catalog-sidebar-summary">
                  <span className="catalog-sidebar-summary-row flex items-center justify-start gap-6">
                    <span
                      className="catalog-sidebar-menu-badge flex h-9 w-9 items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                      >
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </span>
                    <span className="catalog-sidebar-heading catalog-sidebar-heading--mobile">
                      Categories
                    </span>
                  </span>
                  <span className="catalog-sidebar-active-row">
                    <span className="catalog-sidebar-active-dot" aria-hidden="true" />
                    <span className="catalog-sidebar-active-value">
                      {activeOptionLabel}
                    </span>
                  </span>
                </summary>
                {/* Mobile-only wrapper: closes the drawer on item selection.
                    Desktop renders sidebarAccordion directly, unchanged. */}
                <div
                  className="catalog-sidebar-mobile-list"
                  onClick={handleMobileSidebarItemClick}
                >
                  {sidebarAccordion}
                </div>
              </details>

              {/* Desktop: permanent categories directory — layout unchanged */}
              <div className="catalog-sidebar-desktop hidden sm:block">
                <h2 className="catalog-sidebar-heading">Categories</h2>
                {sidebarAccordion}
              </div>
            </aside>

            {/* ---------- Main content ---------- */}
            <div className="catalog-view-content">
              {/* Engineering intro */}
              <div>
                <h2 className="catalog-engineering-title">
                  {category.engineeringTitle}
                </h2>
                <h3 className="catalog-engineering-sub">{category.introTitle}</h3>
                {/* Mobile: description clamped to 2 lines with a native
                    zero-JS Read More / Show Less toggle (<details>) */}
                <details className="catalog-desc-collapse sm:hidden">
                  <summary className="catalog-desc-summary">
                    <span className="catalog-engineering-text catalog-desc-preview">
                      {category.intro}
                    </span>
                    <span className="catalog-desc-toggle">
                      <span className="catalog-desc-label catalog-desc-label--more">
                        Read More
                      </span>
                      <span className="catalog-desc-label catalog-desc-label--less">
                        Show Less
                      </span>
                      <span className="catalog-desc-chevron" aria-hidden="true">⌄</span>
                    </span>
                  </summary>
                </details>
                {/* Desktop: full unabridged description, no toggle */}
                <p className="catalog-engineering-text hidden sm:block">
                  {category.intro}
                </p>
              </div>

              {/* Active filters */}
              <div className="catalog-filters-row">
                <span className="catalog-filters-label">ACTIVE FILTERS:</span>
                <span className="catalog-filter-chip">
                  <span>{itemFilter}</span>
                  {!isAllFilter && (
                    <button
                      type="button"
                      className="catalog-chip-x"
                      onClick={() => setItemFilter(currentCategorySubItems[0])}
                      aria-label={`Clear filter ${itemFilter}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              </div>

              {/* Product grid (keyed so filtering re-runs cleanly) */}
              <div
                className="catalog-view-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5"
                key={itemFilter}
              >
                {filteredProducts.length === 0 && (
                  <p className="catalog-grid-empty">
                    {searchQuery.trim()
                      ? `No results for “${searchQuery.trim()}” in this category.`
                      : "No products under this filter yet — try “All " + category.name + "”."}
                  </p>
                )}
                {filteredProducts.map((product) => (
                  <div
                    key={product.name}
                    className="product-card catalog-view-card"
                  >
                    <div className="product-card-media aspect-[4/3]">
                      <img
                        src={product.image}
                        alt={product.alt}
                        className="product-card-image"
                        loading="lazy"
                        onError={(e) => {
                          const fallback = getCatalogFallbackImage(category.slug);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                      {product.tag && (
                        <span
                          className={`product-tag ${
                            product.tagVariant === "light" ? "product-tag-light" : ""
                          }`}
                        >
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <div className="product-card-body flex flex-col flex-1 justify-between p-2.5 sm:p-4 min-w-0">
                      <h3 className="product-card-title text-[11.5px] sm:text-sm font-bold text-white line-clamp-2 leading-snug">{product.name}</h3>
                      <div className="mt-auto pt-2 w-full">
                        <Link
                          href={getProductUrl({ name: product.name, title: product.name })}
                          className="product-quote-btn w-full h-8 sm:h-10 rounded-md bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center relative before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] shadow-sm"
                          style={{ textDecoration: "none" }}
                        >
                          DETAIL
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </main>
  );
}
