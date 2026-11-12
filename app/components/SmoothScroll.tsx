"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll behavior for the whole site.
 *
 * Previously this component ran Lenis ("smooth scroll"), which hijacks wheel
 * input and animates the page toward the scroll target over ~1.15s. On any
 * dropped frame the page visibly lagged behind the wheel — users perceived
 * the screen as "stuck". It has been removed in favor of native scrolling,
 * which responds 1:1 and never feels stuck.
 *
 * What remains:
 * - Native browser scrolling (no rAF loop, no scroll hijacking).
 * - Smooth in-page anchor scrolling comes from CSS `scroll-behavior: smooth`
 *   (see globals.css, disabled for prefers-reduced-motion).
 * - Resetting the scroll position on route changes, which Next.js App Router
 *   does not always do reliably.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  // Reset scroll on route changes (Next.js can otherwise preserve the
  // previous page's scroll position, sometimes landing mid/bottom).
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Let in-page hash navigation work on initial deep links
    if (window.location.hash) return;

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
