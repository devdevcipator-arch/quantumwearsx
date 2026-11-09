"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  openWhatsAppQuote,
  getWhatsAppQuoteUrl,
  WHATSAPP_DISPLAY_NUMBER,
} from "../data/whatsapp";

export default function ContactHero() {
  const reduce = useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Custom Manufacturing Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    openWhatsAppQuote({
      contactName: fullName,
      email,
      category: subject || "Custom Manufacturing Inquiry",
      details: message,
      source: "contact_page",
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setSubject("Custom Manufacturing Inquiry");
    setMessage("");
    setSubmitted(false);
  };

  return (
    <section className="contact-hero-section" aria-label="Contact QuantumWear X">
      <img
        src="/images/hero_factory_sewing.jpg"
        alt="QuantumWear X production floor with industrial sewing lines"
        className="contact-hero-bg"
      />
      <div className="contact-hero-overlay" />

      <div className="contact-hero-container">
        {/* Left Column: Headline & Direct Contact Info */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="contact-title">
            Let&apos;s Build Your<br />
            <span className="text-red">Future</span><br />
            <span className="text-red">Collection.</span>
          </h1>
          <p className="contact-subtitle">Contact our production experts.</p>
          <p className="contact-desc">
            Ready to scale your brand? Whether you have a complete tech pack or
            just a vision, our team is ready to guide you through materials,
            manufacturing, and global logistics.
          </p>

          <div className="contact-info-grid">
            <div>
              <p className="contact-info-label">Sales Inquiry</p>
              <a href="mailto:quantumwearsx@gmail.com" className="contact-info-value">
                quantumwearsx@gmail.com
              </a>
            </div>
            <div>
              <p className="contact-info-label">Production HQ</p>
              <a href="tel:+923143351255" className="contact-info-value">
                +92 314 3351255
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Send a Message Card */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 40 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-card">
            <h2 className="contact-card-title">Send a Message</h2>

            {submitted ? (
              <div className="contact-success">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(37, 211, 102, 0.15)",
                    border: "2px solid #25D366",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 18px",
                    fontSize: "26px",
                    color: "#25D366",
                  }}
                >
                  ✓
                </div>
                <h3 className="modal-title">Inquiry Transferred!</h3>
                <p className="modal-desc" style={{ maxWidth: "380px", margin: "10px auto 20px", fontSize: "14px", lineHeight: "1.5" }}>
                  Thank you, <strong>{fullName || "Partner"}</strong>. Your message has been formatted and opened directly in our official WhatsApp production desk (<strong>{WHATSAPP_DISPLAY_NUMBER}</strong>).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <a
                    href={getWhatsAppQuoteUrl({
                      contactName: fullName,
                      email,
                      category: subject || "Custom Manufacturing Inquiry",
                      details: message,
                      source: "contact_page",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      background: "#25D366",
                      color: "#000",
                      fontWeight: 700,
                      padding: "14px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Open WhatsApp Chat Again ↗</span>
                  </a>
                  <button
                    type="button"
                    className="btn-primary-red"
                    onClick={handleReset}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#181822",
                      border: "1px solid #282836",
                      color: "#d0d0dc",
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@brand.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Custom Manufacturing Inquiry"
                    className="form-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Tell us about your project..."
                    className="form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-submit-quote" id="contact-submit-btn">
                  <svg style={{ color: "#FFF", marginRight: "8px" }} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>SEND MESSAGE &amp; CHAT ON WHATSAPP</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
