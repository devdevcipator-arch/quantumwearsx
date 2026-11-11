"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section className="about-hero-section" aria-label="About QuantumWear X">
      <img
        src="/images/hero_factory_sewing.jpg"
        alt="QuantumWear X manufacturing facility in Sialkot, Pakistan"
        className="about-hero-bg"
      />
      <div className="about-hero-overlay" />

      <div className="about-hero-container">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1100px] mx-auto px-2 sm:px-4"
        >
          <span className="about-hero-script">Precision in Every Stitch</span>
          <p className="about-hero-eyebrow">
            Established in 2020 · Sialkot, Pakistan
          </p>
          <h1 className="about-hero-title">
            ABOUT QUANTUMWEAR{" "}
            <br className="hidden md:inline" />
            X YOUR{" "}
            <br className="hidden md:inline" />
            MANUFACTURING{" "}
            <br className="hidden md:inline" />
            PARTNER.{" "}
            <span className="text-red">
              YOUR BRAND&apos;S{" "}
              <br className="hidden md:inline" />
              IDENTITY.
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
