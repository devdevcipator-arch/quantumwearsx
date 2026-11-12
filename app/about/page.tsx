"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";
import RevealObserver from "../components/RevealObserver";
import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import AboutCertificates from "../components/AboutCertificates";
import AboutPhilosophy from "../components/AboutPhilosophy";
import AboutMissionVision from "../components/AboutMissionVision";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import QuoteModal from "../components/QuoteModal";

export default function AboutPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Custom Manufacturing");

  const handleOpenQuote = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
  };

  return (
    <main className="landing-page-root about-page-root">
      {/* Native scrolling + scroll progress bar + scroll reveal animations */}
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar
        active="about"
        onOpenQuote={() => handleOpenQuote("About Us Inquiry")}
      />

      {/* 1. About Hero Section */}
      <AboutHero />

      {/* 2. Story: Established 2020 in Sialkot, Pakistan */}
      <AboutStory />

      {/* 3. Official Accreditations & Verified Certifications */}
      <AboutCertificates />

      {/* 4. Manufacturing Philosophy: Direct pricing, customization, craftsmanship */}
      <AboutPhilosophy />

      {/* 5. Mission & Vision */}
      <AboutMissionVision />

      {/* 6. Call To Action Banner */}
      <CallToAction onOpenQuote={() => handleOpenQuote("Custom Production")} />

      {/* 7. Global Footer */}
      <Footer />

      {/* Interactive Custom Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        initialCategory={selectedCategory}
      />
    </main>
  );
}
