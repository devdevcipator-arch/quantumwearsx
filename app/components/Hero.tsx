"use client";

interface HeroProps {
  onOpenQuote: () => void;
}

export default function Hero({ onOpenQuote }: HeroProps) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-wrapper">
        <img
          src="/images/hero_factory_sewing.jpg"
          alt="High-end apparel manufacturing factory floor with precision machinery"
          className="hero-bg-image"
          loading="eager"
        />
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
