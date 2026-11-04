"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section className="about-hero-section" aria-label="About QuantumWear X">
      <img
        src="/images/hero_factory_sewing.jpg"
        alt="QuantumWear X precision industrial manufacturing facility"
        className="about-hero-bg"
      />
      <div className="about-hero-overlay" />

      <div className="about-hero-container">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-hero-script">Crafted With Precision</span>
          <h1 className="about-hero-title">
            ABOUT QUANTUMWEAR<br />
            X YOUR<br />
            MANUFACTURING<br />
            PARTNER. <span className="text-red">YOUR BRAND&apos;S<br />VISION.</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

