"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AboutMissionVision() {
  const reduce = useReducedMotion();

  return (
    <section className="about-mission-section" aria-label="Our Mission and Vision">
      <div className="about-mission-container">
        <div className="about-mission-grid">
          {/* Mission Card (Dark Card) */}
          <motion.div
            className="about-card-mission"
            initial={reduce ? undefined : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="about-card-script-red">Our Mission</span>
              <h3 className="about-card-title">BRAND ENABLEMENT</h3>
              <p className="about-card-body-gray">
                To democratize high-end manufacturing by providing brands with the technical
                resources, craftsmanship, and infrastructure needed to compete with global titans.
              </p>
            </div>
            <div className="about-card-bar" aria-hidden="true" />
          </motion.div>

          {/* Vision Card (Vivid Red Card) */}
          <motion.div
            className="about-card-vision"
            initial={reduce ? undefined : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="about-card-script-white">Our Vision</span>
              <h3 className="about-card-title">GLOBAL MANUFACTURING PARTNER</h3>
              <p className="about-card-body-white">
                To become the world&apos;s most trusted agile manufacturing partner, transforming
                the relationship between designer, maker, and customer through innovation.
              </p>
            </div>
            <div className="about-card-bar" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
