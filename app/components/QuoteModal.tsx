"use client";

import { useState, useEffect } from "react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function QuoteModal({
  isOpen,
  onClose,
  initialCategory = "Sportswear",
}: QuoteModalProps) {
  const [category, setCategory] = useState(initialCategory);
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("100-300 pcs");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Re-sync the selected category each time the modal opens
  useEffect(() => {
    if (isOpen) setCategory(initialCategory);
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(209, 0, 20, 0.15)",
                border: "2px solid var(--accent-red)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 18px",
                fontSize: "24px",
                color: "var(--accent-red)",
              }}
            >
              ✓
            </div>
            <h3 className="modal-title">Quote Request Received!</h3>
            <p className="modal-desc" style={{ maxWidth: "420px", margin: "10px auto 24px" }}>
              Thank you, <strong>{brandName || "Partner"}</strong>. Our production engineering team has
              received your inquiry for <strong>{category}</strong> ({quantity}). We will review your specs
              and email you a formal quote at <strong>{email}</strong> within 24 hours.
            </p>
            <button
              type="button"
              className="btn-primary-red"
              onClick={handleReset}
              style={{ width: "100%", padding: "14px" }}
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Request a Custom Quote</h3>
            <p className="modal-desc">
              Direct-from-factory pricing with full custom sampling, private labeling, and worldwide delivery.
            </p>

            <form onSubmit={handleSubmit} className="quote-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-brand">
                    Brand / Company Name
                  </label>
                  <input
                    id="quote-brand"
                    type="text"
                    required
                    placeholder="e.g. Apex Apparel Studio"
                    className="form-input"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="quote-email">
                    Work Email Address
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    required
                    placeholder="you@brand.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="quote-category">
                    Product Category
                  </label>
                  <select
                    id="quote-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Sportswear">Sportswear & Technical Jerseys</option>
                    <option value="Leather Goods">Leather Goods & Swatches</option>
                    <option value="Activewear & Tracksuits">Activewear & Tracksuits</option>
                    <option value="Workwear & Uniforms">Workwear & Uniforms</option>
                    <option value="Leather Jackets">Leather Jackets & Outerwear</option>
                    <option value="Custom Bags">Custom Bags & Backpacks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="quote-quantity">
                    Estimated Production Volume
                  </label>
                  <select
                    id="quote-quantity"
                    className="form-select"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    <option value="Sample Only (1-5 pcs)">Sampling Prototype (1-5 pcs)</option>
                    <option value="50-100 pcs">50 - 100 pcs (Low MOQ)</option>
                    <option value="100-300 pcs">100 - 300 pcs (Standard)</option>
                    <option value="500-1000 pcs">500 - 1,000 pcs</option>
                    <option value="2000+ pcs">2,000+ pcs (Bulk Scale)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quote-details">
                  Project Details / Tech Pack Notes (Optional)
                </label>
                <textarea
                  id="quote-details"
                  rows={3}
                  placeholder="Mention fabrics, GSM, custom trims, embroidery, Pantone colors, or deadlines..."
                  className="form-textarea"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-submit-quote" id="modal-submit-quote-btn">
                <span>SUBMIT QUOTE REQUEST</span>
                <svg
                  className="cta-btn-arrow"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
