"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export interface CertificateItem {
  id: string;
  title: string;
  subtitle: string;
  category: "chamber" | "eco" | "quality";
  categoryLabel: string;
  issuer: string;
  regNo: string;
  issueDate?: string;
  validity?: string;
  image: string;
  alt: string;
  summary: string;
  highlights: string[];
  verifiedStatus: string;
  featured?: boolean;
}

const certificates: CertificateItem[] = [
  {
    id: "sialkot-chamber-fbr",
    title: "Sialkot Chamber & FBR Accreditations",
    subtitle: "Official Corporate Legal Registry & Chamber Excellence",
    category: "chamber",
    categoryLabel: "Chamber & Government",
    issuer: "Sialkot Chamber of Commerce & Federal Board of Revenue (Pakistan)",
    regNo: "Verified Commercial Exporter & Chamber Member",
    issueDate: "Established 2020",
    validity: "Active Corporate Standing",
    image: "/images/certificates/sialkot-chamber-fbr-framed.jpeg",
    alt: "QuantumWear X official certificates of excellence registered in the Sialkot Chamber of Pakistan and Federal Board of Revenue",
    summary:
      "QuantumWear X is a professionally registered manufacturing corporation in the Sialkot Chamber of Commerce and Industry and the Federal Board of Revenue (Pakistan). We never compromise on quality, upholding statutory transparency, ethical labor protocols, and global export compliance.",
    highlights: [
      "Officially registered with the Sialkot Chamber of Commerce & Industry",
      "Federal Board of Revenue (FBR) verified corporate taxpayer",
      "Authorized export facility delivering to USA, UK, Europe & Middle East",
      "Strict compliance with anti-child labor and fair compensation regulations",
    ],
    verifiedStatus: "Fully Verified & Active",
    featured: true,
  },
  {
    id: "oeko-tex-100",
    title: "OEKO-TEX® STANDARD 100",
    subtitle: "Confidence in Textiles · Product Class I",
    category: "eco",
    categoryLabel: "Eco & Material Safety",
    issuer: "OEKO-TEX® Association (Zurich, Switzerland)",
    regNo: "Certificate: SH015 245712 · Test Report: 24.0.76334",
    issueDate: "15.05.2025",
    validity: "14.05.2026",
    image: "/images/certificates/oeko-tex-standard-100.jpeg",
    alt: "OEKO-TEX Standard 100 Certificate awarded to QuantumWear X for garments, leather products, and bags",
    summary:
      "Globally recognized certification confirming that all QuantumWear X garments, leather products, and bags are tested for harmful substances, allergens, and toxic compounds under Appendix 4, Product Class I standards.",
    highlights: [
      "100% free from restricted harmful chemicals and irritants",
      "Tested and certified safe for direct skin contact (Product Class I)",
      "Strict ecological assurance for international apparel & leather goods",
    ],
    verifiedStatus: "Active Standard",
  },
  {
    id: "icmes-standards",
    title: "ICMES International Standards",
    subtitle: "Corporate Management & Ethics Standards",
    category: "quality",
    categoryLabel: "Operations & Ethics",
    issuer: "ICMES Global Compliance Standards",
    regNo: "Registration No: QWX-INTL-2024-007",
    issueDate: "October 26, 2024",
    validity: "Until October 25, 2029 (5-Year Audit)",
    image: "/images/certificates/icmes-international-standards.jpeg",
    alt: "International Standards Certificate ICMES for QuantumWear X sports apparel and wearable tech",
    summary:
      "Official certificate recognizing QuantumWear X as a compliant organization for manufacturing, innovation, and global operational compliance in the wearable technology and sports apparel sector.",
    highlights: [
      "Compliance with International Corporate Management & Ethics Standards",
      "Certified manufacturing processes for technical sportswear & apparel",
      "5-Year operational audit validation through October 2029",
    ],
    verifiedStatus: "Audited & Compliant",
  },
  {
    id: "cic-apparel",
    title: "CIC Apparel Registration",
    subtitle: "Clothing Industry Commission License",
    category: "quality",
    categoryLabel: "Apparel Compliance",
    issuer: "Clothing Industry Commission (CIC)",
    regNo: "Registration No: QWX-789314",
    issueDate: "October 26, 2023",
    validity: "Official Active Seal",
    image: "/images/certificates/cic-apparel-registration.jpeg",
    alt: "Certificate of Registration as compliant apparel manufacturer for QuantumWear X",
    summary:
      "Certifies that QuantumWear X is officially registered as a compliant apparel manufacturer adhering to verified clothing industry commission factory, safety, and production regulations.",
    highlights: [
      "Officially registered compliant apparel manufacturer",
      "Adherence to certified clothing industry safety protocols",
      "Full traceability and authenticated manufacturing registry",
    ],
    verifiedStatus: "Licensed Manufacturer",
  },
  {
    id: "iqsb-quality",
    title: "IQSB Quality Management",
    subtitle: "Certificate of Excellence for Quality Systems",
    category: "quality",
    categoryLabel: "Quality Assurance",
    issuer: "International Quality Standards Board (IQSB)",
    regNo: "Accreditation No: QWX-QM-001",
    issueDate: "October 26, 2023",
    validity: "Active Protocol",
    image: "/images/certificates/iqsb-quality-management.jpeg",
    alt: "Certificate of Excellence for Quality Management awarded to QuantumWear X",
    summary:
      "Awarded to QuantumWear X for excellence in quality management systems, zero-defect production tolerances, disciplined material selection, and rigorous end-to-end client satisfaction control.",
    highlights: [
      "Zero-defect quality assurance inspection workflow",
      "Multi-stage stitch, seam, and fabric tolerance testing",
      "Certified client quality satisfaction protocols",
    ],
    verifiedStatus: "Excellence Certified",
  },
];

const filterOptions = [
  { key: "all", label: "All Accreditations (5)" },
  { key: "chamber", label: "Government & Chamber" },
  { key: "eco", label: "Textile Safety & Eco" },
  { key: "quality", label: "Operations & Quality" },
];

export default function AboutCertificates() {
  const reduce = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Filter items
  const filteredCerts =
    activeFilter === "all"
      ? certificates
      : certificates.filter((c) => c.category === activeFilter);

  // Keyboard navigation & modal lock
  const handleCloseModal = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : certificates.length - 1));
  }, [selectedIdx]);

  const handleNext = useCallback(() => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! < certificates.length - 1 ? prev! + 1 : 0));
  }, [selectedIdx]);

  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIdx, handleCloseModal, handlePrev, handleNext]);

  const currentModalCert =
    selectedIdx !== null ? certificates[selectedIdx] : null;

  return (
    <section
      className="about-certificates-section"
      aria-label="Accreditations and Certifications"
    >
      <div className="about-cert-ambient-glow" aria-hidden="true" />

      <div className="about-certificates-container">
        {/* Section Header */}
        <motion.div
          className="about-section-header"
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="about-section-eyebrow">
            Accreditations &amp; Verified Standards
          </span>
          <h2 className="about-section-title">
            OFFICIALLY CERTIFIED &amp; GLOBALLY COMPLIANT
          </h2>
          <p className="about-section-subtitle">
            QuantumWear X is a professionally registered manufacturing corporation in the
            Sialkot Chamber of Pakistan and Federal Board of Revenue. We adhere to
            rigorous international textile safety, ethical governance, and certified quality protocols.
          </p>
        </motion.div>

        {/* Quick Trust Verification Strip */}
        <motion.div
          className="about-cert-trust-bar"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="about-cert-trust-pill">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Sialkot Chamber Registered</span>
          </div>

          <div className="about-cert-trust-pill">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>FBR Pakistan Tax Compliant</span>
          </div>

          <div className="about-cert-trust-pill">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
            <span>OEKO-TEX® Standard 100</span>
          </div>

          <div className="about-cert-trust-pill">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>IQSB Quality Excellence</span>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="about-cert-tabs">
          {filterOptions.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`about-cert-tab-btn ${activeFilter === tab.key ? "active" : ""}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Featured Master Showcase: Sialkot Chamber & FBR Registration (Displays if filter is "all" or "chamber") */}
        {(activeFilter === "all" || activeFilter === "chamber") && (
          <motion.div
            className="about-cert-featured-card"
            initial={reduce ? undefined : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Visual Image Area */}
            <div
              className="about-cert-featured-img-wrap"
              onClick={() => setSelectedIdx(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedIdx(0);
                }
              }}
              aria-label="Enlarge Sialkot Chamber and FBR certificate showcase"
            >
              <img
                src={certificates[0].image}
                alt={certificates[0].alt}
                className="about-cert-featured-img"
                loading="lazy"
              />
              <div className="about-cert-featured-overlay">
                <span className="about-cert-enlarge-pill">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  Inspect Credentials
                </span>
              </div>
            </div>

            {/* Credibility Content */}
            <div className="about-cert-featured-content">
              <div className="about-cert-badge-row">
                <span className="about-cert-pill-gold">
                  ★ Official Registry Showcase
                </span>
                <span className="about-cert-status-badge">
                  <span className="about-cert-status-dot" aria-hidden="true" />
                  {certificates[0].verifiedStatus}
                </span>
              </div>

              <h3 className="about-cert-featured-title">
                Sialkot Chamber of Commerce &amp; FBR Registered
              </h3>

              <p className="about-cert-featured-desc">
                {certificates[0].summary}
              </p>

              <div className="about-cert-highlight-list">
                {certificates[0].highlights.map((h, i) => (
                  <div key={i} className="about-cert-highlight-item">
                    <svg
                      className="about-cert-highlight-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="about-cert-btn-primary"
                onClick={() => setSelectedIdx(0)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                Inspect Official Credential
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Grid of Individual International Certifications */}
        <div className="about-cert-grid">
          {filteredCerts
            .filter((c) => !c.featured || activeFilter === "chamber")
            .map((cert) => {
              const fullIndex = certificates.findIndex((x) => x.id === cert.id);
              return (
                <motion.div
                  key={cert.id}
                  className="about-cert-card"
                  initial={reduce ? undefined : { opacity: 0, y: 30 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedIdx(fullIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIdx(fullIndex);
                    }
                  }}
                  aria-label={`View certificate ${cert.title}`}
                >
                  <div className="about-cert-card-top">
                    <span className="about-cert-category-tag">
                      {cert.categoryLabel}
                    </span>
                    <span className="about-cert-verified-tiny">
                      <span className="about-cert-verified-tiny-dot" />
                      Verified
                    </span>
                  </div>

                  <div className="about-cert-thumb-wrap">
                    <img
                      src={cert.image}
                      alt={cert.alt}
                      className="about-cert-thumb-img"
                      loading="lazy"
                    />
                    <div className="about-cert-thumb-overlay">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                      <span>Click to Enlarge</span>
                    </div>
                  </div>

                  <div className="about-cert-card-body">
                    <h3 className="about-cert-card-title">{cert.title}</h3>
                    <span className="about-cert-card-issuer">{cert.issuer}</span>
                    <span className="about-cert-card-reg">{cert.regNo}</span>
                    <p className="about-cert-card-desc">{cert.summary}</p>
                  </div>

                  <div className="about-cert-card-footer">
                    <span className="about-cert-card-link">
                      View Certificate
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7"/>
                        <polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* 3. Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && currentModalCert && (
          <motion.div
            className="about-cert-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${currentModalCert.title} preview`}
          >
            <motion.div
              className="about-cert-lightbox-container"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Modal Top Bar */}
              <div className="about-cert-lightbox-header">
                <div className="about-cert-lightbox-meta">
                  <span className="about-cert-status-badge">
                    <span className="about-cert-status-dot" />
                    {currentModalCert.verifiedStatus}
                  </span>
                  <span className="about-cert-lightbox-counter">
                    Certificate {selectedIdx + 1} of {certificates.length}
                  </span>
                </div>
                <button
                  type="button"
                  className="about-cert-lightbox-close"
                  onClick={handleCloseModal}
                  aria-label="Close certificate viewer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="about-cert-lightbox-body">
                {/* Image Display Area with Nav Arrows */}
                <div className="about-cert-lightbox-img-area">
                  <button
                    type="button"
                    className="about-cert-nav-btn about-cert-nav-prev"
                    onClick={handlePrev}
                    aria-label="Previous certificate"
                  >
                    ‹
                  </button>

                  <img
                    src={currentModalCert.image}
                    alt={currentModalCert.alt}
                    className="about-cert-lightbox-img"
                  />

                  <button
                    type="button"
                    className="about-cert-nav-btn about-cert-nav-next"
                    onClick={handleNext}
                    aria-label="Next certificate"
                  >
                    ›
                  </button>
                </div>

                {/* Info & Metadata Panel */}
                <div className="about-cert-lightbox-info">
                  <div>
                    <h4 className="about-cert-lightbox-title">
                      {currentModalCert.title}
                    </h4>
                    <p className="about-cert-lightbox-desc">
                      {currentModalCert.summary}
                    </p>
                  </div>

                  <div className="about-cert-lightbox-actions">
                    <span className="about-cert-lightbox-reg">
                      {currentModalCert.regNo}
                    </span>
                    <a
                      href={currentModalCert.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-cert-raw-btn"
                    >
                      Open Full Size Document ↗
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

