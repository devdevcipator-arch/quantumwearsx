"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function ContactHero() {
  const reduce = useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Custom Manufacturing Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <a href="tel:+923314092799" className="contact-info-value">
                +92 331 4092799
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
                    background: "rgba(209, 0, 20, 0.15)",
                    border: "2px solid var(--accent-red)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 18px",
                    fontSize: "24px",
                    color: "var(--accent-red)",
                  }}
                >
                  ✓
                </div>
                <h3 className="modal-title">Message Sent!</h3>
                <p className="modal-desc" style={{ maxWidth: "380px", margin: "10px auto 24px" }}>
                  Thank you, <strong>{fullName || "Partner"}</strong>. Our production team has
                  received your message and will get back to you at{" "}
                  <strong>{email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  className="btn-primary-red"
                  onClick={handleReset}
                  style={{ width: "100%", padding: "14px" }}
                >
                  Send Another Message
                </button>
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
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
