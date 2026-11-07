"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Navbar from "@/app/components/Navbar";
import SmoothScroll from "@/app/components/SmoothScroll";
import ScrollProgress from "@/app/components/ScrollProgress";
import RevealObserver from "@/app/components/RevealObserver";
import Footer from "@/app/components/Footer";
import { ProductDetailInfo } from "@/lib/product-details";

interface ProductDetailViewProps {
  product: ProductDetailInfo;
}

const customizationOptions = [
  "Custom Embroidery",
  "3D Silicone Badges",
  "Screen / Sublimation Printing",
  "Embossing / Debossing",
  "Woven & Care Labels",
  "Custom Hardware & Zippers",
];

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState<string>(product.mainImage);
  const [activeThumbIdx, setActiveThumbIdx] = useState<number>(0);

  // Quote Form State
  const [contactName, setContactName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("100–300 pcs");
  const [selectedCustoms, setSelectedCustoms] = useState<string[]>([
    "Custom Embroidery",
    "Woven & Care Labels",
  ]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSelectThumbnail = (img: string, idx: number) => {
    setActiveImage(img);
    setActiveThumbIdx(idx);
  };

  const toggleCustomization = (option: string) => {
    setSelectedCustoms((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleResetQuote = () => {
    setSubmitted(false);
    setNotes("");
  };

  const whatsappMessage = encodeURIComponent(
    `Hi QuantumWear X, I would like to request a factory quote for ${product.title} (${product.category}). Target quantity: ${quantity}.`
  );

  return (
    <main className="landing-page-root product-page-root">
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar active="products" />

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

          {/* ================= TOP TWO SECTIONS: 2-COLUMN GRID ================= */}
          <div className="product-view-grid">
            {/* 1. LEFT COLUMN: PRODUCT INFO & SPECIFICATIONS CARD */}
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
            </motion.div>

            {/* 2. RIGHT COLUMN: VISUAL DISPLAY & 3 THUMBNAILS */}
            <motion.div
              className="product-view-visual-col"
              initial={reduce ? undefined : { opacity: 0, x: 30 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Showcase Card (Clean display without floating quote button) */}
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
                </div>
              </div>

              {/* Bottom Row of 3 Thumbnail Cards */}
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

          {/* ================= REQUEST QUOTE SECTION BENEATH THE TWO SECTIONS ================= */}
          <motion.div
            id="product-quote-section"
            className="product-view-quote-section"
            initial={reduce ? undefined : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="product-quote-section-header">
              <span className="product-quote-section-eyebrow">
                B2B Custom Production · Direct Factory Pricing
              </span>
              <h2 className="product-quote-section-title">
                REQUEST A PRODUCTION QUOTE FOR {product.title.toUpperCase()}
              </h2>
              <p className="product-quote-section-subtitle">
                Looking to manufacture {product.title} under your private label? Submit your required
                quantities, custom branding preferences, and specifications below. Our production engineering
                team in Sialkot, Pakistan will review your project and email you a direct factory quote within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="product-quote-success-box">
                <div className="product-quote-success-icon" aria-hidden="true">
                  ✓
                </div>
                <h3 className="product-quote-success-title">Quote Request Received!</h3>
                <p className="product-quote-success-desc">
                  Thank you, <strong>{contactName || brandName || "Partner"}</strong>. We have received your
                  manufacturing inquiry for <strong>{product.title}</strong> ({quantity}). Our production team is
                  evaluating your custom specifications and will send a detailed pricing and lead time breakdown
                  to <strong>{email}</strong> within 24 hours.
                </p>
                <div className="product-quote-success-actions">
                  <button
                    type="button"
                    className="product-quote-reset-btn"
                    onClick={handleResetQuote}
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href={`https://wa.me/15550194821?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-quote-whatsapp-btn"
                  >
                    Discuss on WhatsApp ↗
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="product-quote-form">
                <div className="product-quote-grid">
                  {/* Contact Name */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-name">
                      Your Full Name
                    </label>
                    <input
                      id="pq-name"
                      type="text"
                      className="product-quote-input"
                      placeholder="e.g. John Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-brand">
                      Brand / Business Name
                    </label>
                    <input
                      id="pq-brand"
                      type="text"
                      className="product-quote-input"
                      placeholder="e.g. Apex Apparel Co."
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>

                  {/* Work Email */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-email">
                      Work Email Address <span style={{ color: "var(--accent-red)" }}>*</span>
                    </label>
                    <input
                      id="pq-email"
                      type="email"
                      required
                      className="product-quote-input"
                      placeholder="e.g. procurement@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-phone">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      id="pq-phone"
                      type="tel"
                      className="product-quote-input"
                      placeholder="e.g. +1 (555) 019-4821"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Quantity / MOQ */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-qty">
                      Target Production Quantity
                    </label>
                    <select
                      id="pq-qty"
                      className="product-quote-select"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      <option value="50–100 pcs (Sample & Trial Run)">50–100 pcs (Sample & Trial Run)</option>
                      <option value="100–300 pcs (Standard Run)">100–300 pcs (Standard Run)</option>
                      <option value="300–500 pcs (Growth Volume)">300–500 pcs (Growth Volume)</option>
                      <option value="500–1,000 pcs (Wholesale Order)">500–1,000 pcs (Wholesale Order)</option>
                      <option value="1,000+ pcs (Enterprise Contract)">1,000+ pcs (Enterprise Contract)</option>
                    </select>
                  </div>

                  {/* Product Category (Read-Only Confirmation) */}
                  <div className="product-quote-field">
                    <label className="product-quote-label" htmlFor="pq-category">
                      Product Category
                    </label>
                    <input
                      id="pq-category"
                      type="text"
                      readOnly
                      className="product-quote-input"
                      style={{ opacity: 0.8, cursor: "not-allowed" }}
                      value={`${product.category} · ${product.title}`}
                    />
                  </div>
                </div>

                {/* Customization Options Multi-Select */}
                <div className="product-quote-custom-wrap">
                  <label className="product-quote-label">
                    Required Custom Branding &amp; Finishing Options:
                  </label>
                  <div className="product-quote-pills-row">
                    {customizationOptions.map((opt) => {
                      const active = selectedCustoms.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          className={`product-quote-pill-btn ${active ? "active" : ""}`}
                          onClick={() => toggleCustomization(opt)}
                        >
                          {active ? "✓ " : "+ "}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Tech Pack Notes */}
                <div className="product-quote-field" style={{ marginTop: "16px" }}>
                  <label className="product-quote-label" htmlFor="pq-notes">
                    Project Specifications, Colors &amp; Tech Pack Details
                  </label>
                  <textarea
                    id="pq-notes"
                    rows={4}
                    className="product-quote-textarea"
                    placeholder={`Tell us about your requirements for ${product.title} (e.g. target Pantone colors, material weight, sizing breakdown, custom embroidery or embossing specs)...`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Submit Row with WhatsApp Alternative */}
                <div className="product-quote-btn-row">
                  <button type="submit" className="product-quote-submit-btn">
                    <span>Submit Factory Quote Request</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <a
                    href={`https://wa.me/15550194821?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-quote-whatsapp-pill"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Instant WhatsApp Chat</span>
                  </a>
                </div>

                {/* B2B Assurance Badges */}
                <div className="product-quote-assurances">
                  <div className="product-quote-assurance-item">
                    <span className="product-quote-assurance-dot" />
                    <span>Free Digital Tech Pack Review</span>
                  </div>
                  <div className="product-quote-assurance-item">
                    <span className="product-quote-assurance-dot" />
                    <span>Direct Factory Price (No Middlemen)</span>
                  </div>
                  <div className="product-quote-assurance-item">
                    <span className="product-quote-assurance-dot" />
                    <span>Full NDA Protection Guaranteed</span>
                  </div>
                  <div className="product-quote-assurance-item">
                    <span className="product-quote-assurance-dot" />
                    <span>Worldwide Express Air &amp; Sea Shipping</span>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
