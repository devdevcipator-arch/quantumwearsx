"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import Navbar from "../components/Navbar";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";
import RevealObserver from "../components/RevealObserver";
import Collections from "../components/Collections";
import Footer from "../components/Footer";
import QuoteModal from "../components/QuoteModal";
import {
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  DEFAULT_PRODUCTS,
  ProductItem,
} from "@/lib/products-service";
import {
  activewearEssentialFilters,
  bentoCategorySlugs,
  catalogListSlugs,
  categoryCatalogs,
} from "../data/categories";

const viewportConfig = { once: true, amount: 0.15 };

// Slide-in variants matching the home page language
const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      delay: 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      delay: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* ---------------------------------------------------------------
   Data
--------------------------------------------------------------- */

const collectionCategories = [
  "Activewear",
  "Sportswear",
  "Streetwear",
  "Safety Wear",
  "Leather Products",
  "Custom Bags",
];

const activewearEssentials = [
  "Gym T-shirts & Tank Tops",
  "Leggings & Sports Bras",
  "Compression Wear",
  "Workout Shorts & Joggers",
  "Custom Fitness Sets",
  "Athletic Outerwear",
];

// Map browsed categories onto the quote modal's select options
const quoteCategoryMap: Record<string, string> = {
  activewear: "Activewear & Tracksuits",
  sportswear: "Sportswear",
  streetwear: "Sportswear",
  "safety wear": "Workwear & Uniforms",
  "leather products": "Leather Goods",
  "custom bags": "Custom Bags",
  "gym t-shirts & tank tops": "Activewear & Tracksuits",
  "leggings & sports bras": "Activewear & Tracksuits",
  "compression wear": "Activewear & Tracksuits",
  "workout shorts & joggers": "Activewear & Tracksuits",
  "custom fitness sets": "Sportswear",
  "athletic outerwear": "Leather Jackets",
};

/* ---------------------------------------------------------------
   Page
--------------------------------------------------------------- */

export default function ProductsPage() {
  const router = useRouter();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General Inquiry");
  const [searchQuery, setSearchQuery] = useState("");
  const reduce = useReducedMotion();

  // Dynamic products & categories from Supabase Live DB
  const [dbProducts, setDbProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [dbCategories, setDbCategories] = useState<string[]>(collectionCategories);

  useEffect(() => {
    // Instant cache read for zero-latency UI update
    try {
      const cached = localStorage.getItem("qw_admin_products");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDbProducts(parsed);
        }
      }
    } catch {}

    async function loadLiveData() {
      try {
        const [liveProds, liveCats] = await Promise.all([
          fetchProductsFromDb(),
          fetchCategoriesFromDb(),
        ]);
        if (liveProds && liveProds.length > 0) {
          setDbProducts(liveProds);
          try {
            localStorage.setItem("qw_admin_products", JSON.stringify(liveProds));
          } catch {}
        }
        if (liveCats && liveCats.length > 0) {
          setDbCategories(liveCats);
        }
      } catch (err) {
        console.warn("ProductsPage live DB fetch fallback:", err);
      }
    }
    loadLiveData();
  }, []);

  const handleOpenQuote = (category?: string) => {
    if (category) {
      const mapped =
        quoteCategoryMap[category.toLowerCase()] ??
        (["General Inquiry", "Sportswear", "Leather Goods", "Activewear & Tracksuits", "Workwear & Uniforms", "Leather Jackets", "Custom Bags"].includes(category)
          ? category
          : "General Inquiry");
      setSelectedCategory(mapped);
    }
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => setQuoteModalOpen(false);

  const query = searchQuery.trim().toLowerCase();

  const filteredCollections = useMemo(
    () => dbCategories.filter((c) => c.toLowerCase().includes(query)),
    [dbCategories, query]
  );

  const filteredEssentials = useMemo(
    () => activewearEssentials.filter((c) => c.toLowerCase().includes(query)),
    [query]
  );

  // Complete collection of searchable products across the platform (Live DB + Category Catalogs)
  const allSearchableProducts = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: string;
      description?: string;
      image: string;
      quoteCategory?: string;
      tag?: string;
    }> = [];

    const seenTitles = new Set<string>();

    // 1. Live DB Products (priority)
    for (const p of dbProducts) {
      const lower = p.title.toLowerCase().trim();
      if (!seenTitles.has(lower)) {
        seenTitles.add(lower);
        list.push({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          image: p.image || "/images/triptych_leather_stitch.jpg",
          quoteCategory: p.category,
          tag: "CUSTOM PRODUCTION",
        });
      }
    }

    // 2. Static Category Catalog Products
    for (const cat of categoryCatalogs) {
      for (const p of cat.products) {
        const lower = p.name.toLowerCase().trim();
        if (!seenTitles.has(lower)) {
          seenTitles.add(lower);
          list.push({
            id: `cat-${cat.slug}-${lower}`,
            title: p.name,
            category: cat.name,
            description: `${cat.name} · Custom manufacturing specification`,
            image: p.image,
            quoteCategory: p.quoteCategory,
            tag: p.tag,
          });
        }
      }
    }

    return list;
  }, [dbProducts]);

  const matchingProducts = useMemo(() => {
    if (!query) return [];
    return allSearchableProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [allSearchableProducts, query]);

  const filteredProducts = useMemo(() => {
    if (!query) return dbProducts;
    return dbProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [dbProducts, query]);

  const revealAnim = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: viewportConfig,
        variants: fadeUp,
      };

  return (
    <main className="landing-page-root" id="top">
      {/* Smooth scrolling (Lenis) + scroll progress indicator + scroll reveal */}
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar
        active="products"
        onOpenQuote={() => handleOpenQuote("General Inquiry")}
      />

      {/* ================= COLLECTIONS / CATEGORIES BROWSER ================= */}
      <section
        id="catalog"
        className="catalog-section"
        aria-label="Collections and Categories Browser"
      >
        <div className="catalog-container">
          {/* Page heading */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: "hidden" as const,
                  animate: "show" as const,
                  variants: fadeUp,
                })}
            className="catalog-page-heading"
          >
            <span className="catalog-eyebrow">Our Catalog</span>
            <h1 className="catalog-page-title">
              EXPLORE OUR <span className="text-red">PRODUCTS</span>
            </h1>
            <div className="catalog-title-bar" />
          </motion.div>

          {/* Search bar */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: "hidden" as const,
                  animate: "show" as const,
                  variants: fadeUp,
                })}
            className="catalog-search-bar"
          >
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
              placeholder="Search products and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products and categories"
            />
            {searchQuery && (
              <button
                type="button"
                className="catalog-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </motion.div>

          {/* Instant Search Results Section (Shown when user searches) */}
          {query ? (
            <div className="search-results-container">
              {/* 1. Products Matching Search */}
              <div className="search-products-header">
                <div className="search-results-top">
                  <h2 className="search-results-title">
                    Matching Products{" "}
                    <span className="search-results-count">({matchingProducts.length})</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="search-clear-btn"
                  >
                    Clear Search ×
                  </button>
                </div>

                {matchingProducts.length === 0 ? (
                  <div className="search-empty-box">
                    <p>No products matching &ldquo;{searchQuery}&rdquo;</p>
                    <span>Try searching for another term like &ldquo;leather&rdquo;, &ldquo;tracksuit&rdquo;, &ldquo;jacket&rdquo;, or &ldquo;activewear&rdquo;</span>
                  </div>
                ) : (
                  <div className="search-products-grid">
                    {matchingProducts.map((prod) => (
                      <div key={prod.id} className="product-card">
                        <div className="product-card-media">
                          <img
                            src={prod.image}
                            alt={`${prod.title} - QuantumWear X custom manufactured product`}
                            className="product-card-image"
                            loading="lazy"
                          />
                          {prod.tag && <span className="product-tag">{prod.tag}</span>}
                        </div>
                        <div className="product-card-body">
                          <span className="search-product-cat">{prod.category}</span>
                          <h3 className="product-card-title">{prod.title}</h3>
                          {prod.description && (
                            <p className="search-product-desc">{prod.description}</p>
                          )}
                          <button
                            type="button"
                            className="product-quote-btn"
                            onClick={() => handleOpenQuote(prod.quoteCategory || prod.category)}
                          >
                            REQUEST QUOTE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Categories Matching Search */}
              {filteredCollections.length > 0 && (
                <div className="search-categories-section">
                  <h3 className="search-categories-title">
                    Matching Categories ({filteredCollections.length})
                  </h3>
                  <div className="search-categories-chips">
                    {filteredCollections.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className="search-category-chip"
                        onClick={() => {
                          const slug = catalogListSlugs[category];
                          if (slug) router.push(`/products/${slug}`);
                        }}
                      >
                        <span>{category}</span>
                        <span>↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Two-column category browser when not searching */
            <div className="catalog-columns">
              {/* Left column: Collections / Categories */}
              <motion.div
                {...(reduce
                  ? {}
                  : {
                      initial: "hidden" as const,
                      whileInView: "show" as const,
                      viewport: viewportConfig,
                      variants: slideFromLeft,
                    })}
                className="catalog-column"
              >
                <h2 className="catalog-column-heading">Collections / Categories</h2>
                <ul className="catalog-column-list">
                  {filteredCollections.length === 0 && (
                    <li className="catalog-empty">No categories found</li>
                  )}
                  {filteredCollections.map((category) => (
                    <li key={category}>
                      <button
                        type="button"
                        className="catalog-link-item"
                        onClick={() => {
                          const slug = catalogListSlugs[category];
                          if (slug) router.push(`/products/${slug}`);
                        }}
                      >
                        <span>{category}</span>
                        <span className="catalog-item-arrow">↗</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Right column: Activewear Essentials */}
              <motion.div
                {...(reduce
                  ? {}
                  : {
                      initial: "hidden" as const,
                      whileInView: "show" as const,
                      viewport: viewportConfig,
                      variants: slideFromRight,
                    })}
                className="catalog-column"
              >
                <h2 className="catalog-column-heading">Activewear Essentials</h2>
                <ul className="catalog-column-list">
                  {filteredEssentials.length === 0 && (
                    <li className="catalog-empty">No products found</li>
                  )}
                  {filteredEssentials.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="catalog-link-item"
                        onClick={() =>
                          router.push(
                            `/products/activewear?item=${encodeURIComponent(item)}`
                          )
                        }
                      >
                        <span>{item}</span>
                        <span className="catalog-item-arrow">↗</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ================= COMPLETE PRODUCT RANGE (BENTO GRID) ================= */}
      <Collections
        onSelectCategory={(cat) => handleOpenQuote(cat)}
        getHref={(cat) => {
          const slug = bentoCategorySlugs[cat];
          return slug ? `/products/${slug}` : undefined;
        }}
      />

      {/* ================= ENGINEERED PERFORMANCE SHOWCASE ================= */}
      <section
        id="product-grid"
        className="products-showcase-section"
        aria-label="Engineered Performance Product Showcase"
      >
        <div className="products-showcase-container">
          {/* Section header */}
          <div className="products-header-block" data-reveal="reveal-up">
            <div className="products-eyebrow-container">
              <span className="products-eyebrow-dash" />
              <span className="products-eyebrow-text">Manufacturing Excellence</span>
            </div>
            <h2 className="products-heading">
              ENGINEERED
              <br />
              PERFORMANCE
            </h2>
            <p
              className="products-subtext"
              data-reveal="reveal-up"
              style={{ "--reveal-delay": "120ms" } as CSSProperties}
            >
              Industry-leading technical specifications meet custom manufacturing. From
              high-GSM private label tanks to seamless compression technology,
              QuantumWear X delivers elite athletic apparel built for intensity.
            </p>
          </div>

          {/* Product grid */}
          <div className="products-grid">
            {filteredProducts.map((card, index) => (
              <div
                key={card.id || card.title}
                className="product-card"
                data-reveal="reveal-up"
                style={{ "--reveal-delay": `${(index % 3) * 110}ms` } as CSSProperties}
              >
                <div className="product-card-media">
                  <img
                    src={card.image}
                    alt={`${card.title} - custom manufacturing`}
                    className="product-card-image"
                    loading="lazy"
                  />
                  <span className="product-tag">{card.category.toUpperCase()}</span>
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{card.title}</h3>
                  {card.description && (
                    <p
                      style={{
                        color: "#a6a6b5",
                        fontSize: "13.5px",
                        lineHeight: "1.55",
                        margin: "8px 0 16px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {card.description}
                    </p>
                  )}
                  <button
                    type="button"
                    className="product-quote-btn"
                    onClick={() => handleOpenQuote(card.category)}
                  >
                    REQUEST QUOTE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GLOBAL FOOTER ================= */}
      <Footer />

      {/* Interactive Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        initialCategory={selectedCategory}
      />
    </main>
  );
}
