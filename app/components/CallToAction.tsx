"use client";

import { useRef } from "react";
import BubbleLights from "./BubbleLights";

interface CallToActionProps {
  onOpenQuote: () => void;
}

export default function CallToAction({ onOpenQuote }: CallToActionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      className="cta-banner-section"
      aria-label="Call to Action"
      ref={sectionRef}
    >
      {/* Background with concentric circular pattern and deep atmospheric vignettes */}
      <div className="cta-bg-wrapper">
        <div className="cta-concentric-bg" />
        <div className="cta-top-glow" />
        <div className="cta-gradient-overlay" />
      </div>

      {/* Main Content with scroll-triggered reveal-up animation and 120ms stagger */}
      <div className="cta-content-container">
        {/* Eyebrow: START PRODUCTION */}
        <div className="cta-eyebrow-container" data-reveal="reveal-up">
          <span className="cta-eyebrow-dash" aria-hidden="true" />
          <span className="cta-eyebrow-text">START PRODUCTION</span>
        </div>

        {/* Headline: READY TO BUILD YOUR BRAND? */}
        <h2 className="cta-headline" data-reveal="reveal-up">
          <span className="cta-headline-white">READY TO BUILD</span>
          <span className="cta-headline-red">YOUR BRAND?</span>
        </h2>

        {/* Subtext description */}
        <p className="cta-subtext" data-reveal="reveal-up">
          Tell us what you want to create. From the first tech pack to the final
          carton, we are the manufacturing backbone behind your label.
        </p>

        {/* CTA Button */}
        <div className="cta-btn-wrapper" data-reveal="reveal-up">
          <button
            type="button"
            className="cta-red-pill-button"
            onClick={onOpenQuote}
            id="cta-request-custom-quote-btn"
          >
            <span>REQUEST A CUSTOM QUOTE</span>
            <svg
              className="cta-btn-arrow"
              viewBox="0 0 24 24"
              width="15"
              height="15"
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
        </div>

        {/* Specifications microcopy */}
        <div className="cta-micro-specs" data-reveal="reveal-up">
          <span>REPLY WITHIN 24 HOURS</span>
          <span className="cta-micro-dot" aria-hidden="true">·</span>
          <span>MOQ FROM 75 PCS</span>
          <span className="cta-micro-dot" aria-hidden="true">·</span>
          <span>NDA ON REQUEST</span>
        </div>
      </div>

      {/* Animated glowing bubble lights along the bottom */}
      <BubbleLights />
    </section>
  );
}
