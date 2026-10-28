"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface CallToActionProps {
  onOpenQuote: () => void;
}

export default function CallToAction({ onOpenQuote }: CallToActionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section className="cta-banner-section" aria-label="Call to Action" ref={sectionRef}>
      <div className="cta-bg-wrapper">
        <motion.img
          src="/images/triptych_leather_stitch.jpg"
          alt="Close-up of deep black leather with precise double stitching"
          className="cta-bg-image"
          loading="lazy"
          style={reduce ? undefined : { y: bgY, scale: 1.18 }}
        />
        <div className="cta-gradient-overlay" />
      </div>

      <motion.div
        className="cta-content-container"
        initial={reduce ? undefined : { opacity: 0, y: 30 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="cta-headline">READY TO BUILD YOUR BRAND?</h2>
        <p className="cta-subtext">
          Tell us what you want to create. From first sample to final shipment,
          we are your manufacturing backbone.
        </p>
        <button
          type="button"
          className="cta-black-button"
          onClick={onOpenQuote}
          id="cta-request-custom-quote-btn"
        >
          REQUEST A CUSTOM QUOTE
        </button>
      </motion.div>
    </section>
  );
}
