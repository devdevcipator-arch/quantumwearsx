"use client";

import { motion, useReducedMotion } from "motion/react";

interface CollectionsProps {
  onSelectCategory: (category: string) => void;
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const card = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Collections({ onSelectCategory }: CollectionsProps) {
  const reduce = useReducedMotion();
  const animate = reduce
    ? {}
    : { variants: list, initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.1 } };

  return (
    <section id="products" className="collections-section" aria-label="Our Complete Product Range">
      <div className="collections-header">
        <span className="collections-eyebrow">Our Collections</span>
        <h2 className="collections-title">COMPLETE PRODUCT RANGE</h2>
        <div className="collections-title-bar" />
      </div>

      <div className="collections-container">
        <motion.div className="bento-layout" {...animate}>
          {/* Top Section: Left tall card + Right 2x2 cluster */}
          <div className="bento-top-row">
            {/* Card 1: Sportswear (Tall Card) */}
            <motion.div
              variants={card}
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

            {/* Right Cluster: 2 top cards + 1 wide card below */}
            <div className="bento-cluster-column">
              <div className="bento-cluster-top-subgrid">
                {/* Card 2: Leather Goods */}
                <motion.div
                  variants={card}
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
                  variants={card}
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
                variants={card}
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

          {/* Bottom Section: 2 medium cards */}
          <div className="bento-bottom-row">
            {/* Card 5: Leather Jackets */}
            <motion.div
              variants={card}
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

            {/* Card 6: Custom Bags */}
            <motion.div
              variants={card}
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
        </motion.div>
      </div>
    </section>
  );
}
