"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";
import RevealObserver from "../components/RevealObserver";
import ContactHero from "../components/ContactHero";
import Footer from "../components/Footer";
import QuoteModal from "../components/QuoteModal";

export default function ContactPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const handleOpenQuote = () => setQuoteModalOpen(true);
  const handleCloseQuote = () => setQuoteModalOpen(false);

  return (
    <main className="landing-page-root contact-page-root">
      {/* Native scrolling + scroll progress bar + scroll reveal animations */}
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar
        active="contact"
        onOpenQuote={handleOpenQuote}
      />

      {/* 1. Contact Hero: "Let's Build Your Future Collection." + Send a Message form */}
      <ContactHero />

      {/* 2. Footer */}
      <Footer />

      {/* Interactive Custom Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
      />
    </main>
  );
}
