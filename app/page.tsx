"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Triptych from "./components/Triptych";
import Collections from "./components/Collections";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import QuoteModal from "./components/QuoteModal";

export default function Home() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Sportswear");

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
    <main className="landing-page-root">
      {/* Top Fixed Navigation */}
      <Navbar onOpenQuote={() => handleOpenQuote("General Inquiry")} />

      {/* Hero Section */}
      <Hero onOpenQuote={() => handleOpenQuote("Full Collection")} />

      {/* Made Around Your Brand 3-Panel Showcase */}
      <Triptych />

      {/* Complete Product Range Bento Grid */}
      <Collections onSelectCategory={(cat) => handleOpenQuote(cat)} />

      {/* Ready to Build Your Brand Banner */}
      <CallToAction onOpenQuote={() => handleOpenQuote("Custom Production")} />

      {/* Global Footer */}
      <Footer />

      {/* Interactive Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        initialCategory={selectedCategory}
      />
    </main>
  );
}
