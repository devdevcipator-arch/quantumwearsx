"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AboutStory() {
  const reduce = useReducedMotion();

  return (
    <section className="about-story-section" aria-label="Our Story & Craftsmanship">
      <div className="about-story-container">
        <div className="about-story-grid">
          {/* Left Column: Sketching Atelier Image with Floating Circular Badge */}
          <motion.div
            className="about-story-image-wrap"
            initial={reduce ? undefined : { opacity: 0, x: -40 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/about_sketching_designer.jpg"
              alt="Fashion designer drafting garment tech packs in the QuantumWear X studio"
              className="about-story-image"
              loading="lazy"
            />
            {/* Circular Red Badge */}
            <div className="about-badge-circle" aria-label="Custom and Private Label Solutions">
              <span>CUSTOM AND</span>
              <span>PRIVATE</span>
              <span>LABEL</span>
              <span>SOLUTIONS</span>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Craftsmanship Features */}
          <motion.div
            className="about-story-content"
            initial={reduce ? undefined : { opacity: 0, x: 40 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about-story-eyebrow">OUR STORY &amp; CRAFTSMANSHIP</span>
            <h2 className="about-story-title">TURNING SKETCHES INTO REALITY</h2>

            <p className="about-story-p1">
              Since 2012, QuantumWear X has stood as the silent backbone for global fashion
              houses and emerging streetwear labels. We don&apos;t just manufacture garments; we
              engineer movements and bring vision into reality. From concept to finished
              garment, we engineer every seam with precision, pride, and an obsession with quality.
            </p>

            <p className="about-story-p2">
              Our mission is simple: to make custom apparel manufacturing seamless and accessible
              for visionary brands. With our state-of-the-art facilities and dedicated
              craftspeople, we turn complex designs into market-ready products with uncompromising
              speed and excellence.
            </p>

            {/* Quality & Ethics Indicators */}
            <div className="about-story-features">
              <div className="about-feature-item">
                <div className="about-feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <span className="about-feature-title">Ethical Sourcing</span>
                  <span className="about-feature-desc">Sustainably produced</span>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <span className="about-feature-title">Global Standards</span>
                  <span className="about-feature-desc">Rigorous QA checks</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

