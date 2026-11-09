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
