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
  const hasServerData = !!(initialProducts && initialProducts.length > 0);
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const source = hasServerData ? initialProducts : DEFAULT_PRODUCTS;
    return (source || []).slice(0, 6);
  });

  useEffect(() => {
    // Server already provided fresh featured data (ISR). Skip client DB/local
    // refetch+merge+setState here — that re-render during scroll caused jank
    // near this section. Only hydrate from cache/fetch when server data absent.
    if (hasServerData) return;

    try {
      const cached = localStorage.getItem("qw_admin_products");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.slice(0, 6));
        }
      }
    } catch {}

    let cancelled = false;
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

        if (!cancelled && merged.length > 0) {
          setProducts(merged.slice(0, 6));
        }
      } catch (err) {
        console.warn("FeaturedProducts fallback to defaults:", err);
      }
    }
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [hasServerData]);

  return (
    <section
      id="featured-products"
      className="products-showcase-section w-full overflow-hidden"
      aria-label="Featured Manufactured Products"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "clamp(48px, 7vw, 96px) 0",
      }}
    >
      <div className="products-showcase-container px-3 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        {/* Section Header */}
        <div className="products-header-block mb-8 sm:mb-14" data-reveal="reveal-up">
          <div className="products-eyebrow-container mb-3 sm:mb-4">
            <span className="products-eyebrow-dash" />
            <span className="products-eyebrow-text">Live Manufacturing Catalog</span>
          </div>
          <h2 className="products-heading text-3xl sm:text-5xl lg:text-6xl font-black mb-3 sm:mb-5">
            FEATURED
            <br />
            PRODUCTS
          </h2>
          <p
            className="products-subtext text-xs sm:text-sm lg:text-base text-[#a6a6b5] leading-relaxed max-w-xl"
            data-reveal="reveal-up"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            Direct factory custom production across premium athletic apparel, fine leather
            goods, and tactical accessories. Real-time specifications managed directly from
            our production floor.
          </p>
        </div>

        {/* Dynamic Products Grid - Strictly Two Rows on All Viewports */}
        <div className="products-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 w-full">
          {products.slice(0, 6).map((item, index) => {
            const isHiddenOnMobile = index >= 4;
            return (
              <div
                key={item.id || item.title}
                className={`product-card rounded-lg sm:rounded-xl overflow-hidden flex-col w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] ${
                  isHiddenOnMobile ? "hidden lg:flex" : "flex"
                }`}
                data-reveal="reveal-up"
                style={{ "--reveal-delay": `${(index % 3) * 110}ms` } as CSSProperties}
              >
                <div className="product-card-media aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.title} - QuantumWear X custom manufactured product`}
                    className="product-card-image w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="product-tag text-[8px] sm:text-[9.5px] py-0.5 px-1.5 sm:py-1 sm:px-2 rounded top-1.5 left-1.5 sm:top-3 sm:left-3">{item.category.toUpperCase()}</span>
                </div>
                <div className="product-card-body p-2.5 sm:p-4 lg:p-5 flex flex-col flex-1 justify-between gap-1 sm:gap-2.5 min-w-0">
                  <h3 className="product-card-title text-xs sm:text-sm lg:text-base font-bold text-white line-clamp-1 sm:line-clamp-2 leading-snug">{item.title}</h3>
                  <p
                    className="product-card-desc text-[10px] sm:text-xs text-[#a6a6b5] line-clamp-1 sm:line-clamp-2 my-0.5 sm:my-1 leading-tight"
                    style={{
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.description || ""}
                  </p>
                  <div className="mt-auto pt-1.5 sm:pt-2 w-full">
                    <Link
                      href={getProductUrl(item)}
                      className="product-quote-btn w-full h-8 sm:h-10 rounded-md bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center relative before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-[''] shadow-sm"
                      style={{ textDecoration: "none" }}
                    >
                      DETAIL
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More Products Button — same design as the products page */}
        <div
          className="products-more-wrap mt-8 sm:mt-12 lg:mt-14 w-full px-3 sm:px-4"
          data-reveal="reveal-up"
        >
          <Link
            href="/products"
            className="products-more-btn w-full max-w-xs sm:w-auto justify-center text-center"
            style={{ textDecoration: "none" }}
          >
            More Products
            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

