"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AboutStory() {
  const reduce = useReducedMotion();

  return (
    <section className="about-story-section" aria-label="Company History & Story">
      <div className="about-story-container">
        <div className="about-story-grid">
          {/* Left Column: Studio Craftsmanship Image with Badge */}
          <motion.div
            className="about-story-image-wrap"
            initial={reduce ? undefined : { opacity: 0, x: -40 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/about_sketching_designer.jpg"
              alt="QuantumWear X garment design and pattern drafting in Sialkot, Pakistan"
              className="about-story-image"
              loading="lazy"
            />
            {/* Circular Badge */}
            <div className="about-badge-circle" aria-label="Established 2020 in Sialkot, Pakistan">
              <span>EST. 2020</span>
              <span>SIALKOT, PK</span>
              <span>CUSTOM &amp;</span>
              <span>PRIVATE LABEL</span>
            </div>
          </motion.div>

          {/* Right Column: Authentic Narrative */}
          <motion.div
            className="about-story-content"
            initial={reduce ? undefined : { opacity: 0, x: 40 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about-story-eyebrow">COMPANY HISTORY · OUR STORY</span>
            <h2 className="about-story-title">BRINGING YOUR BRAND&apos;S IDENTITY TO LIFE</h2>

            <p className="about-story-p1">
              QuantumWear X was established in 2020 as a family-owned manufacturing business in
              Sialkot, Pakistan, with a clear vision: to deliver high-quality customized apparel
              and manufacturing solutions to businesses around the world.
            </p>

            <p className="about-story-p2">
              What began as a family-driven passion for garment manufacturing gradually evolved
              into a broader manufacturing operation spanning custom clothing, leather products,
              fashion accessories, and bags. Every brand has its own identity, and our role is to
              bring that identity to life through quality materials, precision stitching, professional
              finishing, and complete customization.
            </p>

            {/* Core Values Indicators */}
            <div className="about-story-features">
              <div className="about-feature-item">
                <div className="about-feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <span className="about-feature-title">Quality Creates Trust</span>
                  <span className="about-feature-desc">Family-driven craftsmanship</span>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <span className="about-feature-title">Complete Customization</span>
                  <span className="about-feature-desc">From sketch to finished product</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
