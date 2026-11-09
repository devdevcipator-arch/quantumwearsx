"use client";

import { useState, useEffect } from "react";
import {
  openWhatsAppQuote,
  getWhatsAppQuoteUrl,
  WHATSAPP_DISPLAY_NUMBER,
} from "../data/whatsapp";

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
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    if (!email) return;

    // Immediately redirect to WhatsApp with the structured inquiry data
    openWhatsAppQuote({
      brandName,
      contactName,
      email,
      phone,
      category,
      quantity,
      details,
      source: "modal",
    });

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
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(37, 211, 102, 0.15)",
                border: "2px solid #25D366",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
                fontSize: "26px",
                color: "#25D366",
              }}
            >
              ✓
            </div>
            <h3 className="modal-title">Quote Request Transferred!</h3>
            <p
              className="modal-desc"
              style={{
                maxWidth: "440px",
                margin: "10px auto 20px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Thank you, <strong>{contactName || brandName || "Partner"}</strong>. Your quote request for <strong>{category}</strong> ({quantity}) has been formatted and opened in our official WhatsApp chat (<strong>{WHATSAPP_DISPLAY_NUMBER}</strong>).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              <a
                href={getWhatsAppQuoteUrl({
                  brandName,
                  contactName,
                  email,
                  phone,
                  category,
                  quantity,
                  details,
                  source: "modal",
                })}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#25D366",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Continue to WhatsApp Chat ↗</span>
              </a>
              <button
                type="button"
                className="btn-primary-red"
                onClick={handleReset}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#181822",
                  border: "1px solid #282836",
                  color: "#d0d0dc",
                }}
              >
                Close &amp; Back to Catalog
              </button>
            </div>
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
                  <label className="form-label" htmlFor="quote-name">
                    Contact Person Name
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    placeholder="e.g. John Doe"
                    className="form-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
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

                <div className="form-group">
                  <label className="form-label" htmlFor="quote-phone">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    placeholder="e.g. +1 555-019-2834"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <svg style={{ color: "#FFF", marginRight: "8px" }} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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
