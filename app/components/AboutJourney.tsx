"use client";

import { motion, useReducedMotion } from "motion/react";

const milestones = [
  {
    year: "2020",
    title: "The Beginning",
    desc: "QuantumWear X began as a family manufacturing business in Sialkot, focusing on customized garments and establishing a reliable foundation built on quality, trust, and customer satisfaction.",
  },
  {
    year: "2021–2022",
    title: "Building Our Foundation",
    desc: "Continued developing garment manufacturing capabilities, expanding our product range and improving production processes to meet diverse customer specifications.",
  },
  {
    year: "2023–2024",
    title: "Expanding Capabilities",
    desc: "Evolved beyond traditional garments into fine leather goods, fashion handbags, backpacks, duffle bags, and customized accessories for comprehensive manufacturing solutions.",
  },
  {
    year: "2025–Present",
    title: "Global Opportunities",
    desc: "Serving international brands, retailers, startups, wholesalers, and sports organizations with long-term partnerships across the USA, UK, Europe, and the Middle East.",
  },
];

export default function AboutJourney() {
  const reduce = useReducedMotion();

  return (
    <section className="about-journey-section" aria-label="Our Journey Since 2020">
      <div className="about-journey-container">
        <motion.div
          className="about-section-header"
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-section-eyebrow">Milestones &amp; Evolution</span>
          <h2 className="about-section-title">OUR JOURNEY SINCE 2020</h2>
          <p className="about-section-subtitle">
            From our beginnings as a family manufacturing business in Sialkot to our expanding
            product capabilities serving international markets worldwide.
          </p>
        </motion.div>

        <div className="about-journey-grid">
          {milestones.map((item, idx) => (
            <motion.div
              key={item.year}
              className="about-journey-card"
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="about-journey-card-year">{item.year}</span>
              <h3 className="about-journey-card-title">{item.title}</h3>
              <p className="about-journey-card-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

