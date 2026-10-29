"use client";

import { motion, useReducedMotion } from "motion/react";

interface CollectionsProps {
  onSelectCategory: (category: string) => void;
}

const viewportConfig = { once: true, amount: 0.15 };

// Left-side cards slide in smoothly from the left screen border
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

// Right-side cards slide in smoothly from the right screen border with a clean delay
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

// Workwear card in right cluster with natural cascade
const slideFromRightSubtle = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      delay: 0.36,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Bottom-left card slides in smoothly from the left screen border
const slideFromLeftBottom = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      delay: 0.14,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// Bottom-right card slides in smoothly from the right screen border
const slideFromRightBottom = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      delay: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Collections({ onSelectCategory }: CollectionsProps) {
  const reduce = useReducedMotion();

  const animLeft = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: viewportConfig,
        variants: slideFromLeft,
      };

  const animRight = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: viewportConfig,
        variants: slideFromRight,
      };

  const animRightSubtle = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: viewportConfig,
        variants: slideFromRightSubtle,
      };

  const animLeftBottom = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: viewportConfig,
        variants: slideFromLeftBottom,
      };

  const animRightBottom = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: viewportConfig,
        variants: slideFromRightBottom,
      };

  return (
    <section id="products" className="collections-section" aria-label="Our Complete Product Range">
      <div className="collections-header" data-reveal="reveal-up">
        <span className="collections-eyebrow">Our Collections</span>
        <h2 className="collections-title">COMPLETE PRODUCT RANGE</h2>
        <div className="collections-title-bar" />
      </div>

      <div className="collections-container">
        <div className="bento-layout">
          {/* Top Section: Left tall card + Right 2x2 cluster */}
          <div className="bento-top-row">
            {/* Card 1: Sportswear (Tall Card) - Appears from left screen border */}
            <motion.div
              {...animLeft}
              className="bento-tall-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Sportswear")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Sportswear")}
              aria-label="View Sportswear Collection"
            >
              <img
                src="/images/grid_sportswear.jpg"
                alt="Engineered athletic technical sportswear compression apparel"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Sportswear</span>
                <span className="arrow-icon">↗</span>
              </div>
            </motion.div>

            {/* Right Cluster: Appears from right screen border */}
            <div className="bento-cluster-column">
              <div className="bento-cluster-top-subgrid">
                {/* Card 2: Leather Goods */}
                <motion.div
                  {...animRight}
                  className="bento-square-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCategory("Leather Goods")}
                  onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Leather Goods")}
                  aria-label="View Leather Goods Collection"
                >
                  <img
                    src="/images/grid_leather_hide.jpg"
                    alt="Premium full-grain natural leather hide"
                    className="bento-card-image"
                    loading="lazy"
                  />
                  <div className="bento-card-overlay" />
                  <div className="bento-pill-badge">
                    <span>Leather Goods</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                </motion.div>

                {/* Card 3: Activewear / Tracksuits */}
                <motion.div
                  {...animRight}
                  className="bento-square-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCategory("Activewear & Tracksuits")}
                  onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Activewear & Tracksuits")}
                  aria-label="View Activewear Collection"
                >
                  <img
                    src="/images/grid_tracksuit.jpg"
                    alt="Streetwear athletic sweatpants and gym shorts on hangers"
                    className="bento-card-image"
                    loading="lazy"
                  />
                  <div className="bento-card-overlay" />
                  <div className="bento-pill-badge">
                    <span>Activewear / Tracksuits</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                </motion.div>
              </div>

              {/* Card 4: Workwear & Uniforms (Wide Card) */}
              <motion.div
                {...animRightSubtle}
                className="bento-wide-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectCategory("Workwear & Uniforms")}
                onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Workwear & Uniforms")}
                aria-label="View Workwear & Uniforms Collection"
              >
                <img
                  src="/images/grid_workwear.jpg"
                  alt="Textile plant specialist in safety gear and industrial apparel"
                  className="bento-card-image"
                  loading="lazy"
                />
                <div className="bento-card-overlay" />
                <div className="bento-pill-badge">
                  <span>Workwear & Uniforms</span>
                  <span className="arrow-icon">↗</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section: Left card + Right card */}
          <div className="bento-bottom-row">
            {/* Card 5: Leather Jackets - Appears from left screen border */}
            <motion.div
              {...animLeftBottom}
              className="bento-medium-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Leather Jackets")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Leather Jackets")}
              aria-label="View Leather Jackets Collection"
            >
              <img
                src="/images/grid_leather_jacket.jpg"
                alt="Black biker genuine leather jacket with snap button hardware"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Leather Jackets</span>
                <span className="arrow-icon">↗</span>
              </div>
            </motion.div>

            {/* Card 6: Custom Bags - Appears from right screen border */}
            <motion.div
              {...animRightBottom}
              className="bento-medium-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Custom Bags")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Custom Bags")}
              aria-label="View Custom Bags Collection"
            >
              <img
                src="/images/grid_backpack.jpg"
                alt="Two-tone tan and black technical canvas and leather backpack"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Custom Bags</span>
                <span className="arrow-icon">↗</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
