"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FloatingWhatsApp from "./FloatingWhatsApp";

interface NavbarProps {
  onOpenQuote?: () => void;
  active?: "home" | "products" | "about" | "contact";
}

export default function Navbar({ onOpenQuote, active }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Dynamic route matching using usePathname()
  const isHome = pathname === "/" || active === "home";
  const isProducts = pathname.startsWith("/products") || active === "products";
  const isAbout = pathname.startsWith("/about") || active === "about";
  const isContact = pathname.startsWith("/contact") || active === "contact";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuoteClick = () => {
    if (onOpenQuote) {
      onOpenQuote();
    }
  };

  return (
    <>
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
      {/* Top Horizontal Sliding Bar */}
      <div className="top-sliding-bar" aria-label="Free shipping announcement">
        <div className="top-sliding-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`a-${i}`} className="top-sliding-item">
              FREE SHIPPING
              <span className="top-sliding-dot" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
          <span aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={`b-${i}`} className="top-sliding-item">
                FREE SHIPPING
                <span className="top-sliding-dot">✦</span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="nav-container">
        {/* Brand Logo */}
        <Link href="/" className="nav-brand" aria-label="QuantumWearX Home">
          <img src="/images/logo.png" alt="QuantumWearX Logo" className="brand-icon-box" />
          <span>
            QUANTUMWEAR<span className="logo-x">X</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-link ${isHome ? "active" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`nav-link ${isProducts ? "active" : ""}`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`nav-link ${isAbout ? "active" : ""}`}
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`nav-link ${isContact ? "active" : ""}`}
              >
                Contact us
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="nav-actions">
          {onOpenQuote ? (
            <button
              type="button"
              className="nav-quote-btn"
              onClick={handleQuoteClick}
              id="nav-request-quote-btn"
            >
              <span>REQUEST A QUOTE</span>
              <svg style={{ color: "#25D366", marginRight: "6px" }} viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <svg
                className="cta-btn-arrow"
                viewBox="0 0 24 24"
                width="13"
                height="13"
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
          ) : (
            <Link
              href="/contact"
              className="nav-quote-btn"
              id="nav-request-quote-btn"
            >
              <span>REQUEST A QUOTE</span>
              <svg style={{ color: "#25D366", marginRight: "6px" }} viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <svg
                className="cta-btn-arrow"
                viewBox="0 0 24 24"
                width="13"
                height="13"
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
            </Link>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <Link
          href="/"
          className={`nav-link ${isHome ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/products"
          className={`nav-link ${isProducts ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Products
        </Link>
        <Link
          href="/about"
          className={`nav-link ${isAbout ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          About us
        </Link>
        <Link
          href="/contact"
          className={`nav-link ${isContact ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact us
        </Link>
        {onOpenQuote ? (
          <button
            type="button"
            className="nav-quote-btn"
            style={{ width: "100%", marginTop: "10px" }}
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
          >
            REQUEST A QUOTE
          </button>
        ) : (
          <Link
            href="/contact"
            className="nav-quote-btn"
            style={{ width: "100%", marginTop: "10px", textAlign: "center", display: "block" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            REQUEST A QUOTE
          </Link>
        )}
      </div>
    </header>

      {/* Floating WhatsApp Button (bottom-right) */}
      <FloatingWhatsApp />
    </>
  );
}
