"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import RevealObserver from "./components/RevealObserver";
import Hero from "./components/Hero";
import Triptych from "./components/Triptych";
import Collections from "./components/Collections";
import FeaturedProducts from "./components/FeaturedProducts";
import Faq from "./components/Faq";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import QuoteModal from "./components/QuoteModal";
import { ProductItem } from "@/lib/products-service";

interface HomeClientProps {
  /** Live products pre-fetched on the server so the first paint is final content */
  initialProducts?: ProductItem[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
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
      {/* Smooth scrolling (Lenis) + scroll progress indicator + scroll reveal */}
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />

      {/* Top Fixed Navigation */}
      <Navbar active="home" onOpenQuote={() => handleOpenQuote("General Inquiry")} />

      {/* Hero Section */}
      <Hero onOpenQuote={() => handleOpenQuote("Full Collection")} />

      {/* Made Around Your Brand 3-Panel Showcase */}
      <Triptych />

      {/* Complete Product Range Bento Grid */}
      <Collections onSelectCategory={(cat) => handleOpenQuote(cat)} />

      {/* Live Featured Manufactured Products from Supabase DB */}
      <FeaturedProducts
        initialProducts={initialProducts}
        onOpenQuote={(cat) => handleOpenQuote(cat)}
      />

      {/* Common Inquiries / FAQ */}
      <Faq />

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
