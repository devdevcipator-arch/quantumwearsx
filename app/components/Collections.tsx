"use client";

interface CollectionsProps {
  onSelectCategory: (category: string) => void;
}

export default function Collections({ onSelectCategory }: CollectionsProps) {
  return (
    <section id="products" className="collections-section" aria-label="Our Complete Product Range">
      <div className="collections-header">
        <span className="collections-eyebrow">Our Collections</span>
        <h2 className="collections-title">COMPLETE PRODUCT RANGE</h2>
        <div className="collections-title-bar" />
      </div>

      <div className="collections-container">
        <div className="bento-layout">
          {/* Top Section: Left tall card + Right 2x2 cluster */}
          <div className="bento-top-row">
            {/* Card 1: Sportswear (Tall Card) */}
            <div
              className="bento-tall-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Sportswear")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Sportswear")}
              aria-label="View Sportswear Collection"
            >
              <img
                src="/images/grid_sportswear.jpg"
                alt="Engineered athletic technical sportswear compression apparel"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Sportswear</span>
                <span className="arrow-icon">↗</span>
              </div>
            </div>

            {/* Right Cluster: 2 top cards + 1 wide card below */}
            <div className="bento-cluster-column">
              <div className="bento-cluster-top-subgrid">
                {/* Card 2: Leather Goods */}
                <div
                  className="bento-square-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCategory("Leather Goods")}
                  onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Leather Goods")}
                  aria-label="View Leather Goods Collection"
                >
                  <img
                    src="/images/grid_leather_hide.jpg"
                    alt="Premium full-grain natural leather hide"
                    className="bento-card-image"
                    loading="lazy"
                  />
                  <div className="bento-card-overlay" />
                  <div className="bento-pill-badge">
                    <span>Leather Goods</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                </div>

                {/* Card 3: Activewear / Tracksuits */}
                <div
                  className="bento-square-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCategory("Activewear & Tracksuits")}
                  onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Activewear & Tracksuits")}
                  aria-label="View Activewear Collection"
                >
                  <img
                    src="/images/grid_tracksuit.jpg"
                    alt="Streetwear athletic sweatpants and gym shorts on hangers"
                    className="bento-card-image"
                    loading="lazy"
                  />
                  <div className="bento-card-overlay" />
                  <div className="bento-pill-badge">
                    <span>Activewear / Tracksuits</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Workwear & Uniforms (Wide Card) */}
              <div
                className="bento-wide-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectCategory("Workwear & Uniforms")}
                onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Workwear & Uniforms")}
                aria-label="View Workwear & Uniforms Collection"
              >
                <img
                  src="/images/grid_workwear.jpg"
                  alt="Textile plant specialist in safety gear and industrial apparel"
                  className="bento-card-image"
                  loading="lazy"
                />
                <div className="bento-card-overlay" />
                <div className="bento-pill-badge">
                  <span>Workwear & Uniforms</span>
                  <span className="arrow-icon">↗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: 2 medium cards */}
          <div className="bento-bottom-row">
            {/* Card 5: Leather Jackets */}
            <div
              className="bento-medium-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Leather Jackets")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Leather Jackets")}
              aria-label="View Leather Jackets Collection"
            >
              <img
                src="/images/grid_leather_jacket.jpg"
                alt="Black biker genuine leather jacket with snap button hardware"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Leather Jackets</span>
                <span className="arrow-icon">↗</span>
              </div>
            </div>

            {/* Card 6: Custom Bags */}
            <div
              className="bento-medium-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory("Custom Bags")}
              onKeyDown={(e) => e.key === "Enter" && onSelectCategory("Custom Bags")}
              aria-label="View Custom Bags Collection"
            >
              <img
                src="/images/grid_backpack.jpg"
                alt="Two-tone tan and black technical canvas and leather backpack"
                className="bento-card-image"
                loading="lazy"
              />
              <div className="bento-card-overlay" />
              <div className="bento-pill-badge">
                <span>Custom Bags</span>
                <span className="arrow-icon">↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
