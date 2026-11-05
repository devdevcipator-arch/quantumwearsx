"use client";

import { useEffect } from "react";

export interface ProductDetailInfo {
  title: string;
  category?: string;
  description?: string;
  image: string;
  tag?: string;
  /** Category pre-selected inside the quote modal when requesting a quote */
  quoteCategory?: string;
}

interface ProductDetailModalProps {
  /** Product to display — when null the modal stays closed */
  product: ProductDetailInfo | null;
  onClose: () => void;
  /** Fired by the "REQUEST QUOTE" button inside the modal */
  onRequestQuote?: (category: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onRequestQuote,
}: ProductDetailModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="modal-overlay product-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} details`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="product-detail-modal">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close product details"
        >
          ✕
        </button>

        {/* Left side — product image */}
        <div className="product-detail-media">
          <img
            src={product.image}
            alt={product.title}
            className="product-detail-image"
          />
          {product.tag && (
            <span className="product-detail-tag">{product.tag}</span>
          )}
        </div>

        {/* Right side — product info */}
        <div className="product-detail-body">
          {product.category && (
            <span className="product-detail-category">
              {product.category.toUpperCase()}
            </span>
          )}
          <h3 className="product-detail-title">{product.title}</h3>
          <p className="product-detail-desc">
            {product.description ||
              "Custom-manufactured to your exact specifications at our production facility. Choose your preferred materials, weight, colors, sizing, and private label branding. Sampling and full tech pack support available before bulk production — contact us for detailed specifications, pricing, and lead times."}
          </p>
          <button
            type="button"
            className="product-detail-quote-btn"
            onClick={() =>
              onRequestQuote?.(product.quoteCategory || product.category || "General Inquiry")
            }
          >
            REQUEST QUOTE
          </button>
        </div>
      </div>
    </div>
  );
}
