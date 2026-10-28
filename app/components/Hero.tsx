"use client";

interface HeroProps {
  onOpenQuote: () => void;
}

export default function Hero({ onOpenQuote }: HeroProps) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-wrapper">
        <video
          className="hero-bg-image"
          poster="/images/hero_factory_sewing.jpg"
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
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            YOUR VISION.
            <span className="text-red">OUR MANUFACTURING</span>
            EXPERTISE.
          </h1>

          <p className="hero-script">
            Your trusted partner for custom apparel, leather goods, and bags.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="btn-primary-red"
              onClick={onOpenQuote}
              id="hero-request-quote-btn"
            >
              REQUEST A QUOTE
            </button>
            <a
              href="#products"
              className="btn-secondary-outline"
              id="hero-explore-products-btn"
            >
              EXPLORE PRODUCTS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
