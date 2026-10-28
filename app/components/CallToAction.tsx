"use client";

interface CallToActionProps {
  onOpenQuote: () => void;
}

export default function CallToAction({ onOpenQuote }: CallToActionProps) {
  return (
    <section className="cta-banner-section" aria-label="Call to Action">
      <div className="cta-bg-wrapper">
        <img
          src="/images/triptych_leather_stitch.jpg"
          alt="Close-up of deep black leather with precise double stitching"
          className="cta-bg-image"
          loading="lazy"
        />
        <div className="cta-gradient-overlay" />
      </div>

      <div className="cta-content-container">
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
      </div>
    </section>
  );
}
