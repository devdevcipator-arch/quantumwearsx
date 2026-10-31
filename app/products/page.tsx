"use client";

import { useMemo, useState } from "react";
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
  activewearEssentialFilters,
  bentoCategorySlugs,
  catalogListSlugs,
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

interface ProductCardData {
  title: string;
  tag?: string;
  image: string;
  alt: string;
  category: string;
}

const productCards: ProductCardData[] = [
  {
    title: "Gym T-Shirts & Tanks",
    tag: "PRIVATE LABEL",
    image: "/images/grid_sportswear.jpg",
    alt: "Engineered compression gym t-shirt with contrast panel design",
    category: "Activewear & Tracksuits",
  },
  {
    title: "Leggings & Sports Bras",
    tag: "SEAMLESS",
    image: "/images/hero_factory_sewing.jpg",
    alt: "Seamless performance leggings and sports bra manufacturing",
    category: "Activewear & Tracksuits",
  },
  {
    title: "Compression Wear",
    tag: "MOISTURE-WICK",
    image: "/images/triptych_brand_tag.jpg",
    alt: "Moisture-wicking compression base layers with woven brand tags",
    category: "Activewear & Tracksuits",
  },
  {
    title: "Workout Shorts & Joggers",
    image: "/images/grid_tracksuit.jpg",
    alt: "Custom workout shorts and joggers hanging in production studio",
    category: "Activewear & Tracksuits",
  },
  {
    title: "Custom Fitness Sets",
    image: "/images/triptych_embroidery.jpg",
    alt: "Matching custom fitness sets with precision embroidery detail",
    category: "Sportswear",
  },
  {
    title: "Athletic Outerwear",
    image: "/images/grid_leather_jacket.jpg",
    alt: "Premium athletic outerwear jacket with snap button hardware",
    category: "Leather Jackets",
  },
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
    () => collectionCategories.filter((c) => c.toLowerCase().includes(query)),
    [query]
  );

  const filteredEssentials = useMemo(
    () => activewearEssentials.filter((c) => c.toLowerCase().includes(query)),
    [query]
  );

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
          </motion.div>

          {/* Two-column category browser */}
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
            {productCards.map((card, index) => (
              <div
                key={card.title}
                className="product-card"
                data-reveal="reveal-up"
                style={{ "--reveal-delay": `${(index % 3) * 110}ms` } as CSSProperties}
              >
                <div className="product-card-media">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="product-card-image"
                    loading="lazy"
                  />
                  {card.tag && <span className="product-tag">{card.tag}</span>}
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{card.title}</h3>
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
