"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

interface NavbarProps {
  onOpenQuote: () => void;
  active?: "home" | "products";
}

export default function Navbar({ onOpenQuote, active = "home" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Anchor into the home page only when it resolves on it; Products always
  // Prefix anchors with "/" on inner pages so they resolve to home sections
  const href = (anchor: string) => (onHome ? anchor : `/${anchor}`);
  // Products always routes to the dedicated catalog page
  const productsHref = "/products";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`site-nav ${scrolled ? "scrolled" : ""}`}
      initial={reduce ? undefined : { y: -80, opacity: 0 }}
      animate={reduce ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-container">
        {/* Brand Logo */}
        <a href="#" className="nav-brand" aria-label="QuantumWearX Home">
          <div className="brand-icon-box">Q</div>
          <span>
            QUANTUMWEAR<span className="logo-x">X</span>
          </span>
        </a>

        {/* Desktop Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <a href={href("#home")} className={`nav-link ${active === "home" ? "active" : ""}`}>
                Home
              </a>
            </li>
            <li>
              <a href={productsHref} className={`nav-link ${active === "products" ? "active" : ""}`}>
                Products
              </a>
            </li>
            <li>
              <a href={href("#about")} className="nav-link">
                About us
              </a>
            </li>
            <li>
              <a href={href("#services")} className="nav-link">
                Services
              </a>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="nav-actions">
          <button
            type="button"
            className="nav-quote-btn"
            onClick={onOpenQuote}
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
        <a
          href={href("#home")}
          className={`nav-link ${active === "home" ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </a>
        <a
          href={productsHref}
          className={`nav-link ${active === "products" ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Products
        </a>
        <a
          href={href("#about")}
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          About us
        </a>
        <a
          href={href("#services")}
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Services
        </a>
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
      </div>
    </motion.header>
  );
}
