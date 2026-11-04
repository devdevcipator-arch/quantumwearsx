"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";
import RevealObserver from "../components/RevealObserver";
import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import Collections from "../components/Collections";
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
      {/* Smooth scrolling (Lenis) + scroll progress bar + scroll reveal animations */}
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

      {/* 2. Story & Heritage ("Turning Sketches Into Reality") */}
      <AboutStory />

      {/* 3. Product & Performance Range (Using the site's signature Collections section) */}
      <Collections
        eyebrow="Engineered For Champions"
        title="ENGINEERED PERFORMANCE"
        description="Every stitch is driven by passion, every seam built to endure. We combine advanced textile engineering, custom fit, and modern aesthetics for performance that speaks for itself."
        onSelectCategory={(cat) => handleOpenQuote(cat)}
      />

      {/* 4. Brand Enablement & Global Manufacturing Partner (Mission & Vision) */}
      <AboutMissionVision />

      {/* 5. Call To Action Banner ("Ready to Build Your Brand?") */}
      <CallToAction onOpenQuote={() => handleOpenQuote("Custom Production")} />

      {/* 6. Footer */}
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

