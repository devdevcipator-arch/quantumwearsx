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

      <style jsx global>{`
        :root {
          --bg: #0a0a0f;
          --card: #12121a;
          --line: #26262f;
          --text: #ececf1;
          --muted: #9a9aa8;
          --accent: #6d5efc;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
        }
        .container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        a { color: inherit; text-decoration: none; }

        .nav { position: sticky; top: 0; z-index: 50; background: rgba(10,10,15,.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
        .nav-inner { display: flex; align-items: center; gap: 24px; padding: 14px 20px; }
        .logo { font-weight: 800; font-size: 22px; letter-spacing: -1px; }
        .logo-dot { color: var(--accent); }
        .nav-links { display: flex; gap: 20px; margin-left: auto; color: var(--muted); }
        .nav-links a:hover { color: var(--text); }
        .nav-cta {
          background: var(--accent); color: #fff; padding: 8px 16px;
          border-radius: 999px; font-weight: 600; font-size: 14px;
        }

        .hero { padding: 90px 0 70px; }
        .eyebrow { color: var(--accent); font-weight: 600; margin-bottom: 12px; }
        .hero h1 { font-size: clamp(38px, 7vw, 64px); line-height: 1.1; letter-spacing: -2px; }
        .hero h1 em { color: var(--accent); font-style: normal; }
        .hero-sub { color: var(--muted); font-size: 18px; max-width: 560px; margin: 18px 0 28px; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn { padding: 13px 24px; border-radius: 999px; font-weight: 600; }
        .btn-primary { background: var(--accent); color: #fff; }
        .btn-ghost { border: 1px solid var(--line); color: var(--text); }
        .hero-stats { display: flex; gap: 40px; margin-top: 48px; flex-wrap: wrap; }
        .hero-stats div { display: flex; flex-direction: column; }
        .hero-stats strong { font-size: 22px; }
        .hero-stats span { color: var(--muted); font-size: 13px; }

        .products { padding: 60px 0; border-top: 1px solid var(--line); }
        .section-head { margin-bottom: 32px; }
        .section-head h2 { font-size: 32px; letter-spacing: -1px; }
        .section-head p { color: var(--muted); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 20px; }
        .card { background: var(--card); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; transition: transform .15s ease, border-color .15s ease; }
        .card:hover { transform: translateY(-4px); border-color: var(--accent); }
        .card-art { position: relative; aspect-ratio: 1/1; display: grid; place-items: center; }
        .card-emoji { font-size: 64px; }
        .card-tag {
          position: absolute; top: 12px; left: 12px; font-size: 12px; font-weight: 600;
          background: rgba(10,10,15,.75); padding: 4px 10px; border-radius: 999px;
        }
        .card-body { padding: 16px; }
        .card-body h3 { font-size: 16px; margin-bottom: 12px; }
        .card-row { display: flex; align-items: center; justify-content: space-between; }
        .price { font-weight: 700; }
        .btn-buy {
          background: var(--accent); color: #fff; border: 0; cursor: pointer;
          padding: 8px 14px; border-radius: 999px; font-weight: 600; font-size: 13px;
        }
        .btn-buy:hover { filter: brightness(1.1); }

        .about { padding: 70px 0; border-top: 1px solid var(--line); }
        .about-inner { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; }
        .about h2 { font-size: 32px; letter-spacing: -1px; margin-bottom: 14px; }
        .about p { color: var(--muted); }
        .about-list { list-style: none; display: flex; flex-direction: column; gap: 14px; color: var(--text); }

        .footer { border-top: 1px solid var(--line); padding: 30px 0; }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer p { color: var(--muted); font-size: 14px; }

        @media (max-width: 720px) {
          .nav-links { display: none; }
          .about-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
