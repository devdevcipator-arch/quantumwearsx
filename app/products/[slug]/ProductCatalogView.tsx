"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../../components/Navbar";
import SmoothScroll from "../../components/SmoothScroll";
import ScrollProgress from "../../components/ScrollProgress";
import RevealObserver from "../../components/RevealObserver";
import Footer from "../../components/Footer";
import QuoteModal from "../../components/QuoteModal";
import ProductDetailModal, {
  type ProductDetailInfo,
} from "../../components/ProductDetailModal";
import {
  categoryCatalogs,
  matchSubItem,
  type CategoryCatalog,
  type CatalogProduct,
} from "../../data/categories";
import { fetchProductsFromDb } from "@/lib/products-service";

interface ProductCatalogViewProps {
  category: CategoryCatalog;
  itemQuery?: string;
}

export default function ProductCatalogView({
  category,
  itemQuery,
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
  const [detailProduct, setDetailProduct] = useState<ProductDetailInfo | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    category.products[0]?.quoteCategory ?? "General Inquiry"
  );

  // Keep state synchronized whenever category route changes
  useEffect(() => {
    if (currentCategorySlug) {
      setExpanded(currentCategorySlug);
    }
    setItemFilter(matchSubItem(itemQuery, category.subItems) || category.subItems[0]);
    setSearchQuery("");
  }, [currentCategorySlug, category.subItems, itemQuery]);

  // Dynamic products from Supabase Live DB matching this category
  const [liveDbProducts, setLiveDbProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    const normCatName = category.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normCatSlug = category.slug.toLowerCase().replace(/[^a-z0-9]/g, "");

    function filterAndConvert(items: any[]): CatalogProduct[] {
      const matched = items.filter((p: any) => {
        const normProdCat = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          normProdCat === normCatName ||
          normProdCat === normCatSlug ||
          normCatName.includes(normProdCat) ||
          normProdCat.includes(normCatName)
        );
      });

      return matched.map((p: any) => ({
        name: p.title,
        filter: category.subItems[0],
        tag: "CUSTOM PRODUCTION",
        image: p.image,
        alt: `${p.title} - QuantumWear X custom manufactured product`,
        quoteCategory: category.products[0]?.quoteCategory ?? "General Inquiry",
      }));
    }

    // Instant local cache check
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

    async function loadCategoryProducts() {
      try {
        const allDbProducts = await fetchProductsFromDb();
        const converted = filterAndConvert(allDbProducts);
        setLiveDbProducts(converted);
      } catch (err) {
        console.warn("ProductCatalogView live DB fetch fallback:", err);
      }
    }

    loadCategoryProducts();
  }, [category.name, category.slug, category.subItems]);

  const handleOpenQuote = (quoteCategory?: string) => {
    if (quoteCategory) setSelectedCategory(quoteCategory);
    setQuoteModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    const liveNames = new Set(liveDbProducts.map((p) => p.name.toLowerCase().trim()));
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
      (p.filter || "").toLowerCase().includes(q);

    if (itemFilter === category.subItems[0]) {
      return combined.filter(matchesSearch);
    }
    return combined.filter(
      (p) =>
        (p.filter === itemFilter || liveNames.has(p.name.toLowerCase().trim())) &&
        matchesSearch(p)
    );
  }, [itemFilter, category, liveDbProducts, searchQuery]);

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
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="catalog-breadcrumb">
            <Link href="/products">Products</Link>
            <span className="crumb-sep">›</span>
            <span className="crumb-current">{category.name}</span>
          </nav>

          {/* Eyebrow + Title (left) — Search bar (right) */}
          <div className="catalog-view-header">
            <div>
              <p className="catalog-view-eyebrow">{category.eyebrow}</p>
              <h1 className="catalog-view-title">{category.headingTitle}</h1>
            </div>

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

          <div className="catalog-view-layout">
            {/* ---------- Sidebar: Categories accordion ---------- */}
            <aside className="catalog-sidebar" aria-label="Categories">
              <h2 className="catalog-sidebar-heading">Categories</h2>
              <ul className="catalog-accordion">
                {categoryCatalogs.map((cat) => {
                  const isCurrent = cat.slug === currentCategorySlug;
                  const isOpen = expanded === cat.slug;
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
                          {cat.subItems.map((sub) => (
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
            </aside>

            {/* ---------- Main content ---------- */}
            <div className="catalog-view-content">
              {/* Engineering intro */}
              <div>
                <h2 className="catalog-engineering-title">
                  {category.engineeringTitle}
                </h2>
                <h3 className="catalog-engineering-sub">{category.introTitle}</h3>
                <p className="catalog-engineering-text">{category.intro}</p>
              </div>

              {/* Active filters */}
              <div className="catalog-filters-row">
                <span className="catalog-filters-label">ACTIVE FILTERS:</span>
                <span className="catalog-filter-chip">
                  <span>{itemFilter}</span>
                  <button
                    type="button"
                    className="catalog-chip-x"
                    onClick={() => setItemFilter(category.subItems[0])}
                    aria-label={`Clear filter ${itemFilter}`}
                  >
                    ×
                  </button>
                </span>
              </div>

              {/* Product grid (keyed so filtering re-runs cleanly) */}
              <div className="catalog-view-grid" key={itemFilter}>
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
                    <div className="product-card-media">
                      <img
                        src={product.image}
                        alt={product.alt}
                        className="product-card-image"
                        loading="lazy"
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
                    <div className="product-card-body">
                      <h3 className="product-card-title">{product.name}</h3>
                      <button
                        type="button"
                        className="product-quote-btn"
                        onClick={() =>
                          setDetailProduct({
                            title: product.name,
                            category: category.name,
                            image: product.image,
                            tag: product.tag,
                            quoteCategory: product.quoteCategory,
                          })
                        }
                      >
                        DETAIL
                      </button>
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onRequestQuote={(quoteCat) => {
          setDetailProduct(null);
          handleOpenQuote(quoteCat);
        }}
      />
    </main>
  );
}
