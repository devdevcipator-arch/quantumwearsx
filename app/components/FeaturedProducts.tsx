"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  fetchProductsFromDb,
  DEFAULT_PRODUCTS,
  ProductItem,
} from "@/lib/products-service";
import { getProductUrl } from "@/lib/product-details";

interface FeaturedProductsProps {
  onOpenQuote?: (category: string) => void;
  /** Live products pre-fetched on the server — first paint == final content */
  initialProducts?: ProductItem[];
}

export default function FeaturedProducts({
  onOpenQuote,
  initialProducts,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(
    initialProducts && initialProducts.length > 0
      ? initialProducts
      : DEFAULT_PRODUCTS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // With server-provided (truth) data, don't wholesale-replace from the
    // admin localStorage cache — that was the source of the visible swap on
    // refresh. Local-only products are merged in the DB-fetch step below.
    const hasServerData = initialProducts && initialProducts.length > 0;

    if (!hasServerData) {
      try {
        const cached = localStorage.getItem("qw_admin_products");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed.slice(0, 6));
          }
        }
      } catch {}
    }

    async function loadProducts() {
      try {
        const liveProducts = await fetchProductsFromDb();
        let localProducts: ProductItem[] = [];
        try {
          const cached = localStorage.getItem("qw_admin_products");
          if (cached) localProducts = JSON.parse(cached);
        } catch {}

        const liveIds = new Set((liveProducts || []).map((p) => p.id));
        const liveTitles = new Set(
          (liveProducts || []).map((p) => (p.title || "").toLowerCase().trim())
        );
        const merged = [
          ...localProducts.filter(
            (p) =>
              !liveIds.has(p.id) &&
              !liveTitles.has((p.title || "").toLowerCase().trim())
          ),
          ...(liveProducts || []),
        ];

        if (merged && merged.length > 0) {
          setProducts(merged.slice(0, 6)); // Top 6 featured
        }
      } catch (err) {
        console.warn("FeaturedProducts fallback to defaults:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section
      id="featured-products"
      className="products-showcase-section"
      aria-label="Featured Manufactured Products"
      style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "100px 0" }}
    >
      <div className="products-showcase-container">
        {/* Section Header */}
        <div className="products-header-block" data-reveal="reveal-up">
          <div className="products-eyebrow-container">
            <span className="products-eyebrow-dash" />
            <span className="products-eyebrow-text">Live Manufacturing Catalog</span>
          </div>
          <h2 className="products-heading">
            FEATURED
            <br />
            PRODUCTS
          </h2>
          <p
            className="products-subtext"
            data-reveal="reveal-up"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            Direct factory custom production across premium athletic apparel, fine leather
            goods, and tactical accessories. Real-time specifications managed directly from
            our production floor.
          </p>
        </div>

        {/* Dynamic Products Grid */}
        <div className="products-grid">
          {products.map((item, index) => (
            <div
              key={item.id || item.title}
              className="product-card"
              data-reveal="reveal-up"
              style={{ "--reveal-delay": `${(index % 3) * 110}ms` } as CSSProperties}
            >
              <div className="product-card-media">
                <img
                  src={item.image}
                  alt={`${item.title} - QuantumWear X custom manufactured product`}
                  className="product-card-image"
                  loading="lazy"
                />
                <span className="product-tag">{item.category.toUpperCase()}</span>
              </div>
              <div className="product-card-body">
                <h3 className="product-card-title">{item.title}</h3>
                {item.description && (
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
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.description}
                  </p>
                )}
                <Link
                  href={getProductUrl(item)}
                  className="product-quote-btn"
                  style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                >
                  DETAIL
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Catalog Link Button */}
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            justifyContent: "center",
          }}
          data-reveal="reveal-up"
        >
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#12121a",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "16px 36px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              transition: "all 0.25s ease",
            }}
            className="hover:border-white hover:bg-white hover:text-black"
          >
            <span>Explore Complete Catalog</span>
            <span style={{ fontSize: "15px" }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

