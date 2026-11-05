import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="landing-page-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "600px" }}>
        <p style={{ color: "var(--accent-red)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.875rem", marginBottom: "1rem" }}>
          404 Error
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: "1.25rem", color: "var(--text-white)" }}>
          Page Not Found
        </h1>
        <p style={{ color: "var(--text-gray)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          The product catalog or page you requested could not be found. Explore our full manufacturing collection or return to home.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary-red" style={{ display: "inline-flex", textDecoration: "none" }}>
            Return Home
          </Link>
          <Link href="/products" className="btn-secondary-outline" style={{ display: "inline-flex", textDecoration: "none" }}>
            Explore Products
          </Link>
        </div>
      </div>
    </main>
  );
}

