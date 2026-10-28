"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

interface NavbarProps {
  onOpenQuote: () => void;
}

export default function Navbar({ onOpenQuote }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduce = useReducedMotion();

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
              <a href="#home" className="nav-link active">
                Home
              </a>
            </li>
            <li>
              <a href="#products" className="nav-link">
                Products
              </a>
            </li>
            <li>
              <a href="#about" className="nav-link">
                About us
              </a>
            </li>
            <li>
              <a href="#services" className="nav-link">
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
            REQUEST A QUOTE
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
          href="#home"
          className="nav-link active"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </a>
        <a
          href="#products"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Products
        </a>
        <a
          href="#about"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          About us
        </a>
        <a
          href="#services"
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
