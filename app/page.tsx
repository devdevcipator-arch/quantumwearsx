export default function Home() {
  return (
    <main className="soon">
      <div className="soon-inner">
        <p className="logo">
          Q<span className="logo-dot">W</span>
        </p>
        <p className="eyebrow">✦ Something is arriving</p>
        <h1>
          Coming <em>Soon</em>
        </h1>
        <p className="soon-sub">
          Quantam Wear is in the lab. Tech-wear essentials engineered for
          motion, comfort and style — dropping here first.
        </p>
        <a href="mailto:quantumwearsx@gmail.com" className="btn-primary">
          Notify Me
        </a>
        <p className="small">© {new Date().getFullYear()} Quantam Wear · quantumwearsx@gmail.com</p>
      </div>
    </main>
  );
}
