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
      <div className="cta-content-container px-4 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Eyebrow: START PRODUCTION */}
        <div className="cta-eyebrow-container mb-3 sm:mb-4" data-reveal="reveal-up">
          <span className="cta-eyebrow-dash" aria-hidden="true" />
          <span className="cta-eyebrow-text">START PRODUCTION</span>
        </div>

        {/* Headline: READY TO BUILD YOUR BRAND? */}
        <h2 className="cta-headline text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-5 tracking-tight" data-reveal="reveal-up">
          <span className="cta-headline-white">READY TO BUILD</span>
          <span className="cta-headline-red">YOUR BRAND?</span>
        </h2>

        {/* Subtext description */}
        <p className="cta-subtext text-xs sm:text-sm md:text-base text-neutral-300 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed" data-reveal="reveal-up">
          From first samples to final shipment, we are your manufacturing backbone.
        </p>

        {/* CTA Buttons - Balanced Relative Structure on Mobile */}
        <div className="cta-btn-wrapper flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto px-2 pt-4 mb-6 sm:mb-8" data-reveal="reveal-up">
          <button
            type="button"
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all"
            onClick={onOpenQuote}
            id="cta-request-custom-quote-btn"
          >
            <span>REQUEST A CUSTOM QUOTE</span>
            <svg
              className="cta-btn-arrow shrink-0"
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

          <a
            href="https://wa.me/923143351255?text=Hi%20QuantumWear%20X%2C%20I%20would%20like%20to%20discuss%20custom%20manufacturing%20and%20production."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 py-2.5 px-5 w-full sm:w-auto min-h-[44px] rounded-full bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-[#25D366]/40 text-neutral-300 hover:text-white text-xs font-semibold tracking-wide transition-all group"
            id="cta-discuss-whatsapp-btn"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform shrink-0" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>DISCUSS ON WHATSAPP</span>
          </a>
        </div>

        {/* Specifications microcopy */}
        <div className="cta-micro-specs flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest px-2" data-reveal="reveal-up">
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
