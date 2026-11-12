"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer w-full" id="site-footer">
      <div className="footer-container px-4 sm:px-8 max-w-[1360px] mx-auto w-full">
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
            <div className="footer-socials flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="footer-links-col" data-reveal="reveal-up">
            <h3 className="footer-heading">COMPANY</h3>
            <ul className="footer-links-list grid grid-cols-2 gap-x-4 gap-y-0.5 sm:block">
              <li>
                <Link href="/" className="footer-link inline-flex items-center min-h-[36px] py-1 text-xs sm:text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="footer-link inline-flex items-center min-h-[36px] py-1 text-xs sm:text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link inline-flex items-center min-h-[36px] py-1 text-xs sm:text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link inline-flex items-center min-h-[36px] py-1 text-xs sm:text-sm">
                  Contact us
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
                <strong>Phone:</strong> +92 331 4092799
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
        <div className="footer-bottom-bar flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs text-neutral-400 pt-6">
          <p>© {currentYear} QuantumWearX Inc. All Rights Reserved. ISO 9001:2015 Certified</p>
          <p className="footer-powered-by text-neutral-400 text-xs text-center">
            Powered by{" "}
            <a
              href="https://www.devcipator.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-200 font-medium underline underline-offset-2 hover:text-orange-600 transition-colors"
            >
              Devcipator
            </a>
          </p>
          <div className="footer-legal-links flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 text-xs">
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
