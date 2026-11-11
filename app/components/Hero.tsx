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

      <div className="hero-container flex flex-1 flex-col justify-between px-6 pb-32 pt-16 sm:px-12 sm:pb-12">
        <motion.div
          className="hero-content w-full max-w-2xl flex flex-col justify-center my-auto"
          variants={container}
          initial={false}
          animate="show"
        >
          <div className="hero-text-block mb-6 sm:mb-8">
            <motion.h1
              className="hero-title text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.15]"
              variants={item}
            >
              <span className="block text-white">YOUR VISION.</span>
              <span className="text-red block">OUR MANUFACTURING</span>
              <span className="block text-white">EXPERTISE.</span>
            </motion.h1>

            <motion.p
              className="hero-script mt-6 max-w-sm text-sm sm:text-lg text-zinc-300 font-normal leading-relaxed"
              variants={item}
            >
              Your trusted partner for custom apparel, leather goods, and bags.
            </motion.p>
          </div>

          <motion.div
            className="hero-buttons mt-auto sm:mt-8 flex flex-col sm:flex-row w-full max-w-md sm:max-w-none sm:w-auto gap-3.5 sm:gap-4 items-stretch sm:items-center"
            variants={item}
          >
            <button
              type="button"
              className="btn-primary-red w-full sm:w-auto h-[52px] min-h-[52px] px-4 sm:px-6 rounded-full bg-[#D10014] hover:bg-[#E80017] text-white shadow-lg shadow-red-950/40 font-bold text-sm tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
              onClick={onOpenQuote}
              id="hero-request-quote-btn"
            >
              <span>REQUEST A QUOTE</span>
              <svg
                className="cta-btn-arrow shrink-0"
                viewBox="0 0 24 24"
                width="12"
                height="12"
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
              className="btn-secondary-outline w-full sm:w-auto h-[52px] min-h-[52px] px-4 sm:px-6 rounded-full bg-black/70 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm font-bold text-sm tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
              id="hero-explore-products-btn"
            >
              <span>EXPLORE PRODUCTS</span>
              <svg
                className="cta-btn-arrow shrink-0"
                viewBox="0 0 24 24"
                width="12"
                height="12"
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
