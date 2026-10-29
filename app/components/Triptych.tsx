"use client";

import { motion, useReducedMotion } from "motion/react";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const panel = {
  hidden: { opacity: 0, scale: 1.05 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Triptych() {
  const reduce = useReducedMotion();

  return (
    <section className="triptych-section" id="craftsmanship" aria-label="Brand Craftsmanship Showcase">
      <div className="triptych-container">
        <motion.div
          className="triptych-grid"
          variants={grid}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Panel 1: Leather Stitching */}
          <motion.div className="triptych-panel" variants={panel}>
            <img
              src="/images/triptych_leather_stitch.jpg"
              alt="Artisanal leather craftsmanship and detailed stitching"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </motion.div>

          {/* Panel 2: Brand Tag */}
          <motion.div className="triptych-panel" variants={panel}>
            <img
              src="/images/triptych_brand_tag.jpg"
              alt="Custom embossed metal brand label tag on workwear canvas"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </motion.div>

          {/* Panel 3: Embroidery */}
          <motion.div className="triptych-panel" variants={panel}>
            <img
              src="/images/triptych_embroidery.jpg"
              alt="High-precision automated industrial embroidery machine"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </motion.div>

          {/* Floating Gothic Centered Typography */}
          <motion.div
            className="triptych-title-overlay"
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="gothic-made-around">
              <span>Made Around Your</span>
              <span>Brand</span>
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
