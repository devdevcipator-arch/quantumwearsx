export default function Triptych() {
  return (
    <section className="triptych-section" id="craftsmanship" aria-label="Brand Craftsmanship Showcase">
      <div className="triptych-container">
        <div className="triptych-grid">
          {/* Panel 1: Leather Stitching */}
          <div className="triptych-panel">
            <img
              src="/images/triptych_leather_stitch.jpg"
              alt="Artisanal leather craftsmanship and detailed stitching"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </div>

          {/* Panel 2: Brand Tag */}
          <div className="triptych-panel">
            <img
              src="/images/triptych_brand_tag.jpg"
              alt="Custom embossed metal brand label tag on workwear canvas"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </div>

          {/* Panel 3: Embroidery */}
          <div className="triptych-panel">
            <img
              src="/images/triptych_embroidery.jpg"
              alt="High-precision automated industrial embroidery machine"
              loading="lazy"
            />
            <div className="triptych-panel-overlay" />
          </div>

          {/* Floating Gothic Centered Typography */}
          <div className="triptych-title-overlay">
            <h2 className="gothic-made-around">
              Made Around Your
              <br />
              Brand
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
