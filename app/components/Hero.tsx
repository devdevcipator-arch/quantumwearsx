"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface HeroProps {
  onOpenQuote: () => void;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero({ onOpenQuote }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Range keeps the oversized wrapper from exposing edges during parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20px", "60px"]);

  return (
    <section id="home" className="hero-section" ref={sectionRef}>
      <motion.div
        className="hero-bg-wrapper"
        style={reduce ? undefined : { y: bgY }}
      >
        <video
          className="hero-bg-image"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="High-end apparel manufacturing factory floor with precision machinery"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </motion.div>

      <div className="hero-container px-4 sm:px-8">
        <motion.div
          className="hero-content w-full"
          variants={container}
          initial={false}
          animate="show"
        >
          <motion.h1 className="hero-title" variants={item}>
            YOUR VISION.
            <span className="text-red">OUR MANUFACTURING</span>
            EXPERTISE.
          </motion.h1>

          <motion.p className="hero-script" variants={item}>
            Your trusted partner for custom apparel, leather goods, and bags.
          </motion.p>

          <motion.div
            className="hero-buttons flex flex-col w-full sm:flex-row sm:w-auto gap-3 items-stretch sm:items-center max-w-sm sm:max-w-none"
            variants={item}
          >
            <button
              type="button"
              className="btn-primary-red w-full sm:w-auto h-12 py-3.5 px-6 rounded-full sm:rounded-lg bg-[#8B0000] hover:bg-[#A30000] text-white shadow-lg shadow-red-950/40 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              onClick={onOpenQuote}
              id="hero-request-quote-btn"
            >
              <span>REQUEST A QUOTE</span>
              <svg
                className="cta-btn-arrow shrink-0"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
            <Link
              href="/products"
              className="btn-secondary-outline w-full sm:w-auto h-12 py-3.5 px-6 rounded-full sm:rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 backdrop-blur-sm text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              id="hero-explore-products-btn"
            >
              <span>EXPLORE PRODUCTS</span>
              <svg
                className="cta-btn-arrow shrink-0"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
