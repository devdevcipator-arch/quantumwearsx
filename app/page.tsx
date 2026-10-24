const products = [
  {
    id: 1,
    name: "Apex Runner Jacket",
    price: 4999,
    tag: "New Drop",
    emoji: "🧥",
    color: "#6d5efc",
  },
  {
    id: 2,
    name: "Quantum Flux Tee",
    price: 1999,
    tag: "Best Seller",
    emoji: "👕",
    color: "#2dd4bf",
  },
  {
    id: 3,
    name: "Nebula Cargo Pants",
    price: 3499,
    tag: "Limited",
    emoji: "👖",
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Ion Hoodie Pro",
    price: 4299,
    tag: "Restocked",
    emoji: "🦺",
    color: "#ef4489",
  },
];

const fmt = (n: number) => "PKR " + n.toLocaleString("en-PK");

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#" className="logo">
            Q<span className="logo-dot">W</span>
          </a>
          <div className="nav-links">
            <a href="#products">Shop</a>
            <a href="#about">About</a>
            <a href="#footer">Contact</a>
          </div>
          <a href="#products" className="nav-cta">Shop Now</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">✦ Season 01 — Available Now</p>
          <h1>
            Wear the <em>Future</em>.
            <br />
            Move in the Present.
          </h1>
          <p className="hero-sub">
            Tech-wear essentials engineered in Pakistan — breathable fabrics,
            utility-first cuts, zero compromise on style.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">Browse Collection</a>
            <a href="#about" className="btn btn-ghost">Our Story</a>
          </div>
          <div className="hero-stats">
            <div><strong>12K+</strong><span>Orders shipped</span></div>
            <div><strong>4.9★</strong><span>Average rating</span></div>
            <div><strong>48h</strong><span>Delivery nationwide</span></div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products">
        <div className="container">
          <div className="section-head">
            <h2>Fresh Drops</h2>
            <p>The pieces everyone is asking about.</p>
          </div>
          <div className="grid">
            {products.map((p) => (
              <article key={p.id} className="card">
                <div
                  className="card-art"
                  style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}55)` }}
                >
                  <span className="card-emoji">{p.emoji}</span>
                  <span className="card-tag">{p.tag}</span>
                </div>
                <div className="card-body">
                  <h3>{p.name}</h3>
                  <div className="card-row">
                    <span className="price">{fmt(p.price)}</span>
                    <button className="btn-buy">Add to Cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="container about-inner">
          <div>
            <h2>Built for motion.</h2>
            <p>
              Quantam Wear started with one question: why does performance
              clothing look boring? We blend technical fabrics with streetwear
              silhouettes so you never have to choose between comfort and
              presence. Every piece is wear-tested in real weather, real gyms,
              real streets.
            </p>
          </div>
          <ul className="about-list">
            <li>🧪 Premium, sweat-wicking fabrics</li>
            <li>🇵🇰 Designed &amp; stitched locally</li>
            <li>🚚 Free shipping over PKR 5,000</li>
            <li>↩️ 14-day easy returns</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="footer">
        <div className="container footer-inner">
          <p className="logo">Q<span className="logo-dot">W</span></p>
          <p>© {new Date().getFullYear()} Quantam Wear · quantumwearsx@gmail.com</p>
        </div>
      </footer>
    </main>
  );
}
