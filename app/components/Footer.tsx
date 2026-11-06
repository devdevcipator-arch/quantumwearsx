"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Column 1: Brand info */}
          <div className="footer-brand-col" data-reveal="reveal-up">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="QuantumWearX Logo" className="brand-icon-box" />
              <span>
                QUANTUMWEAR<span className="logo-x">X</span>
              </span>
            </div>
            <p className="footer-desc">
              Your trusted global manufacturing partner for custom athletic apparel,
              fine leather goods, streetwear, and tactical bags. Established in 2020 in Sialkot, Pakistan.
            </p>
            <div className="footer-socials">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="footer-links-col" data-reveal="reveal-up">
            <h3 className="footer-heading">COMPANY</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/#craftsmanship" className="footer-link">
                  Craftsmanship
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Headquarters & Contact */}
          <div className="footer-contact-col" id="contact" data-reveal="reveal-up">
            <h3 className="footer-heading">HEADQUARTERS</h3>
            <div className="footer-contact-info">
              <p>
                14 Industrial Avenue, Sialkot, PK
                <br />
                Global Supply Chain & Logistics Hub
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 019-4821
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:quantumwearsx@gmail.com"
                  style={{ color: "var(--accent-red)", textDecoration: "underline" }}
                >
                  quantumwearsx@gmail.com
                </a>
              </p>
              <p>
                <strong>Factory Audits:</strong> SEDEX & BSCI Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom-bar">
          <p>© {currentYear} QuantumWearX Inc. All Rights Reserved. ISO 9001:2015 Certified</p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span>·</span>
            <a href="#terms">Terms of Manufacturing</a>
            <span>·</span>
            <a href="#compliance">Global Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
