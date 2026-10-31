"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Navbar from "../../components/Navbar";
import SmoothScroll from "../../components/SmoothScroll";
import ScrollProgress from "../../components/ScrollProgress";
import RevealObserver from "../../components/RevealObserver";
import Footer from "../../components/Footer";
import QuoteModal from "../../components/QuoteModal";
import {
  categoryCatalogs,
  matchSubItem,
  type CategoryCatalog,
} from "../../data/categories";

const viewportConfig = { once: true, amount: 0.15 };

const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface ProductCatalogViewProps {
  category: CategoryCatalog;
  itemQuery?: string;
}

export default function ProductCatalogView({
  category,
  itemQuery,
}: ProductCatalogViewProps) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(category.slug);
  const [itemFilter, setItemFilter] = useState(
    () => matchSubItem(itemQuery, category.subItems) || category.subItems[0]
  );
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category.products[0]?.quoteCategory ?? "General Inquiry");

  const handleOpenQuote = (quoteCategory?: string) => {
    if (quoteCategory) setSelectedCategory(quoteCategory);
    setQuoteModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    if (itemFilter === category.subItems[0]) return category.products;
    return category.products.filter((p) => p.filter === itemFilter);
  }, [itemFilter, category]);

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
          <motion.nav
            aria-label="Breadcrumb"
            {...(reduce
              ? {}
              : { initial: "hidden" as const, animate: "show" as const, variants: fadeUp })}
            className="catalog-breadcrumb"
          >
            <Link href="/products">Products</Link>
            <span className="crumb-sep">›</span>
            <span className="crumb-current">{category.name}</span>
          </motion.nav>

          {/* Eyebrow + Title */}
          <motion.div
            {...(reduce
              ? {}
              : { initial: "hidden" as const, animate: "show" as const, variants: fadeUp })}
          >
            <p className="catalog-view-eyebrow">{category.eyebrow}</p>
            <h1 className="catalog-view-title">{category.headingTitle}</h1>
          </motion.div>

          <div className="catalog-view-layout">
            {/* ---------- Sidebar: Categories accordion ---------- */}
            <motion.aside
              {...(reduce
                ? {}
                : {
                    initial: "hidden" as const,
                    whileInView: "show" as const,
                    viewport: viewportConfig,
                    variants: slideFromLeft,
                  })}
              className="catalog-sidebar"
              aria-label="Categories"
            >
              <h2 className="catalog-sidebar-heading">Categories</h2>
              <ul className="catalog-accordion">
                {categoryCatalogs.map((cat) => {
                  const isOpen = expanded === cat.slug;
                  const isCurrent = cat.slug === category.slug;
                  return (
                    <li
                      key={cat.slug}
                      className={`catalog-accordion-item ${isOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="catalog-accordion-toggle"
                        aria-expanded={isOpen}
                        onClick={() => {
                          if (isCurrent) {
                            setExpanded(isOpen ? "" : cat.slug);
                          } else {
                            setExpanded(cat.slug);
                          }
                        }}
                      >
                        <span>{cat.name}</span>
                        <span className="catalog-accordion-chevron" aria-hidden="true">
                          {isOpen ? "⌄" : "›"}
                        </span>
                      </button>

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
                                  href={`/products/${cat.slug}`}
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
            </motion.aside>

            {/* ---------- Main content ---------- */}
            <div className="catalog-view-content">
              {/* Engineering intro */}
              <motion.div
                {...(reduce
                  ? {}
                  : {
                      initial: "hidden" as const,
                      animate: "show" as const,
                      variants: fadeUp,
                    })}
              >
                <h2 className="catalog-engineering-title">
                  {category.engineeringTitle}
                </h2>
                <h3 className="catalog-engineering-sub">{category.introTitle}</h3>
                <p className="catalog-engineering-text">{category.intro}</p>
              </motion.div>

              {/* Active filters */}
              <div className="catalog-filters-row" data-reveal="reveal-up">
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

              {/* Product grid (keyed so filtering re-runs the reveal animation) */}
              <div className="catalog-view-grid" key={itemFilter}>
                {filteredProducts.length === 0 && (
                  <p className="catalog-grid-empty">
                    No products under this filter yet — try “All {category.name}”.
                  </p>
                )}
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    {...(reduce
                      ? {}
                      : {
                          initial: "hidden" as const,
                          whileInView: "show" as const,
                          viewport: viewportConfig,
                          variants: fadeUp,
                        })}
                    transition={{ delay: index * 0.12 }}
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
                        onClick={() => handleOpenQuote(product.quoteCategory)}
                      >
                        REQUEST QUOTE
                      </button>
                    </div>
                  </motion.div>
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
