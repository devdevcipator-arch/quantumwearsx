"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Navbar from "@/app/components/Navbar";
import SmoothScroll from "@/app/components/SmoothScroll";
import ScrollProgress from "@/app/components/ScrollProgress";
import RevealObserver from "@/app/components/RevealObserver";
import Footer from "@/app/components/Footer";
import QuoteModal from "@/app/components/QuoteModal";
import { ProductDetailInfo } from "@/lib/product-details";

interface ProductDetailViewProps {
  product: ProductDetailInfo;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState<string>(product.mainImage);
  const [activeThumbIdx, setActiveThumbIdx] = useState<number>(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const handleOpenQuote = () => {
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
  };

  const handleSelectThumbnail = (img: string, idx: number) => {
    setActiveImage(img);
    setActiveThumbIdx(idx);
  };

  return (
    <main className="landing-page-root product-page-root">
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar
        active="products"
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Product Detail Main Section */}
      <section className="product-view-section" aria-label={`${product.title} Details`}>
        <div className="product-view-container">
          {/* Top Breadcrumb & Back Link */}
          <motion.div
            className="product-view-breadcrumb"
            initial={reduce ? undefined : { opacity: 0, y: -10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/products" className="product-view-back-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Catalog
            </Link>
            <span className="product-view-crumb-sep">/</span>
            <Link
              href={`/products/${product.categorySlug}`}
              className="product-view-crumb-cat"
            >
              {product.category}
            </Link>
            <span className="product-view-crumb-sep">/</span>
            <span className="product-view-crumb-current">{product.title}</span>
          </motion.div>

          {/* Main 2-Column Grid (Left: Info Card | Right: Visual Display & 3 Thumbnails) */}
          <div className="product-view-grid">
            {/* ================= LEFT COLUMN: PRODUCT INFO CARD ================= */}
            <motion.div
              className="product-view-info-card"
              initial={reduce ? undefined : { opacity: 0, x: -30 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category Eyebrow in Crimson */}
              <span className="product-view-eyebrow">
                {product.category.toUpperCase()}
              </span>

              {/* Bold Large Product Title */}
              <h1 className="product-view-title">{product.title}</h1>

              {/* Detailed Description Paragraphs matching mockup */}
              <div className="product-view-desc-wrap">
                <p className="product-view-desc-p">{product.description1}</p>
                <p className="product-view-desc-p">{product.description2}</p>
                {product.description3 && (
                  <p className="product-view-desc-p">{product.description3}</p>
                )}
              </div>

              {/* Specifications Block */}
              <div className="product-view-specs-box">
                <h2 className="product-view-specs-heading">Manufacturing Specifications</h2>
                <div className="product-view-specs-grid">
                  <div className="product-view-spec-row">
                    <span className="product-view-spec-label">MOQ</span>
                    <span className="product-view-spec-val">{product.specs.moq}</span>
                  </div>
                  <div className="product-view-spec-row">
                    <span className="product-view-spec-label">Materials</span>
                    <span className="product-view-spec-val">{product.specs.materials}</span>
                  </div>
                  <div className="product-view-spec-row">
                    <span className="product-view-spec-label">Branding</span>
                    <span className="product-view-spec-val">{product.specs.branding}</span>
                  </div>
                  <div className="product-view-spec-row">
                    <span className="product-view-spec-label">Lead Times</span>
                    <span className="product-view-spec-val">{product.specs.leadTime}</span>
                  </div>
                  <div className="product-view-spec-row">
                    <span className="product-view-spec-label">Compliance</span>
                    <span className="product-view-spec-val">{product.specs.standards}</span>
                  </div>
                </div>
              </div>

              {/* Direct Quote Trigger in Left Card */}
              <div className="product-view-info-footer">
                <button
                  type="button"
                  className="product-view-left-quote-btn"
                  onClick={handleOpenQuote}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Request Production Quote
                </button>
              </div>
            </motion.div>

            {/* ================= RIGHT COLUMN: VISUAL DISPLAY & 3 THUMBNAILS ================= */}
            <motion.div
              className="product-view-visual-col"
              initial={reduce ? undefined : { opacity: 0, x: 30 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 1. TOP MAIN SHOWCASE CARD */}
              <div className="product-view-showcase-card">
                {/* Top-Left Red Badge */}
                <div className="product-view-badge">
                  {product.badge}
                </div>

                {/* Main Visual Stage */}
                <div className="product-view-stage">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={`${product.title} showcase`}
                      className="product-view-main-image"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </AnimatePresence>

                  {/* High-fashion athletic typographic overlay matching mockup */}
                  <div className="product-view-stage-graphic" aria-hidden="true">
                    {/* Watermark product background typography */}
                    <span className="product-view-watermark-text">
                      {product.title}
                    </span>

                    {/* Bold Italic Center Branding with Red Corner Accent */}
                    <div className="product-view-push-badge">
                      <span className="product-view-push-text">
                        {product.graphicWord || "PUSH"}
                      </span>
                      {/* Red Right-Angle Corner Bracket Accent */}
                      <span className="product-view-corner-bracket" />
                    </div>
                  </div>
                </div>

                {/* Bottom-Right White REQUEST QUOTE Button */}
                <button
                  type="button"
                  className="product-view-quote-btn"
                  onClick={handleOpenQuote}
                  aria-label={`Request quote for ${product.title}`}
                >
                  REQUEST QUOTE
                </button>
              </div>

              {/* 2. BOTTOM ROW OF 3 THUMBNAIL CARDS */}
              <div className="product-view-thumbs-row">
                {product.thumbnails.slice(0, 3).map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-view-thumb-card ${activeThumbIdx === idx ? "active" : ""}`}
                    onClick={() => handleSelectThumbnail(thumb, idx)}
                    aria-label={`Select product image view ${idx + 1}`}
                  >
                    <img
                      src={thumb}
                      alt={`${product.title} view ${idx + 1}`}
                      className="product-view-thumb-img"
                      loading="lazy"
                    />
                    <div className="product-view-thumb-overlay" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Custom Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        initialCategory={product.quoteCategory}
      />
    </main>
  );
}
