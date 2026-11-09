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
          From first samples to final shipment, we are your manufacturing backbone.
        </p>

        {/* CTA Buttons - Matching the design with Quote and WhatsApp options */}
        <div className="cta-btn-wrapper" data-reveal="reveal-up" style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", alignItems: "center" }}>
          <button
            type="button"
            className="cta-red-pill-button"
            onClick={onOpenQuote}
            id="cta-request-custom-quote-btn"
          >
            <span>REQUEST A CUSTOM QUOTE</span>
            <svg style={{ color: "#25D366", marginRight: "6px" }} viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
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

          <a
            href="https://wa.me/923143351255?text=Hi%20QuantumWear%20X%2C%20I%20would%20like%20to%20discuss%20custom%20manufacturing%20and%20production."
            target="_blank"
            rel="noopener noreferrer"
            className="cta-whatsapp-pill-button"
            id="cta-discuss-whatsapp-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 28px",
              borderRadius: "9999px",
              background: "rgba(18, 18, 22, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: "#25D366" }}>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>DISCUSS ON WHATSAPP</span>
          </a>
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
