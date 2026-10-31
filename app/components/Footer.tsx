"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const onHome = usePathname() === "/";
  // Prefix anchors with "/" on inner pages so they resolve to home sections
  const href = (anchor: string) => (onHome ? anchor : `/${anchor}`);

  return (
    <footer className="site-footer" id="about">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Column 1: Brand info */}
          <div className="footer-brand-col" data-reveal="reveal-up">
            <div className="footer-logo">
              <div className="brand-icon-box">Q</div>
              <span>
                QUANTUMWEAR<span className="logo-x">X</span>
              </span>
            </div>
            <p className="footer-desc">
              Your trusted global manufacturing partner for custom athletic apparel,
              fine leather goods, streetwear, and tactical bags. Precision engineered since 2008.
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
                <a href={href("#home")} className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href={href("#products")} className="footer-link">
                  Products
                </a>
              </li>
              <li>
                <a href={href("#about")} className="footer-link">
                  About us
                </a>
              </li>
              <li>
                <a href={href("#services")} className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="footer-link">
                  Craftsmanship
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Headquarters & Contact */}
          <div className="footer-contact-col" id="services" data-reveal="reveal-up">
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
