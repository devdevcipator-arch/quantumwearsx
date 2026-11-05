"use client";

import { motion, useReducedMotion } from "motion/react";

const philosophyItems = [
  {
    title: "Factory-Level Pricing",
    desc: "Direct manufacturing from our Sialkot facility with transparent pricing, eliminating middleman markups.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: "Complete Customization",
    desc: "Every product tailored to your exact designs, materials, Pantone colors, measurements, and finishing specs.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    title: "Skilled Craftsmanship",
    desc: "Premium grade fabrics, precision stitching, high-durability thread, and master finishing in every unit.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: "Professional Branding",
    desc: "Screen printing, sublimation, 3D silicone badges, precision embroidery, custom tags, and woven labels.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    title: "Flexible Order Quantities",
    desc: "Accessible minimum order quantities tailored for emerging startups as well as volume runs for global retailers.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    title: "Quality & Global Logistics",
    desc: "Multi-stage quality control, reliable production timelines, dedicated support, and express global shipping.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export default function AboutPhilosophy() {
  const reduce = useReducedMotion();

  return (
    <section className="about-philosophy-section" aria-label="Our Manufacturing Philosophy">
      <div className="about-philosophy-container">
        <motion.div
          className="about-section-header"
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-section-eyebrow">Our Philosophy</span>
          <h2 className="about-section-title">BUILT FOR YOUR BRAND&apos;S GROWTH</h2>
          <p className="about-section-subtitle">
            We are more than just a supplier. We aim to become a dependable manufacturing partner
            for businesses looking to develop and grow their own brands.
          </p>
        </motion.div>

        <div className="about-philosophy-grid">
          {philosophyItems.map((item, idx) => (
            <motion.div
              key={item.title}
              className="about-philosophy-card"
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: (idx % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="about-philosophy-card-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="about-philosophy-card-title">{item.title}</h3>
              <p className="about-philosophy-card-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
