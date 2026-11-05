"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // If user's device is set to reduce motion, skip animation and show everything
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasIO = "IntersectionObserver" in window;

    const observer =
      hasIO && !prefersReducedMotion
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const target = entry.target as HTMLElement;
                  obs.unobserve(target);
                  target.classList.add("is-revealed");

                  const delayStr =
                    target.style.getPropertyValue("--reveal-delay") || "0ms";
                  const delayMs = parseInt(delayStr, 10) || 0;

                  // After the animation ends, the data-reveal attribute is removed
                  // so the element's own hover transitions work normally again.
                  const cleanup = () => {
                    target.removeAttribute("data-reveal");
                    target.classList.remove("is-revealed");
                    target.style.removeProperty("--reveal-delay");
                    target.style.removeProperty("will-change");
                    target.removeEventListener("transitionend", onTransitionEnd);
                  };

                  const onTransitionEnd = (e: TransitionEvent) => {
                    if (
                      e.target === target &&
                      e.propertyName === "transform"
                    ) {
                      cleanup();
                    }
                  };

                  target.addEventListener("transitionend", onTransitionEnd);

                  // Fallback safety timer: 800ms duration + stagger delay + buffer
                  setTimeout(cleanup, 800 + delayMs + 120);
                }
              });
            },
            {
              threshold: 0.15,
              rootMargin: "0px 0px -40px 0px",
            }
          )
        : null;

    const showImmediately = (el: HTMLElement) => {
      el.removeAttribute("data-reveal");
      el.classList.remove("is-revealed");
    };

    /**
     * Bind an element to the reveal system. Safe to call multiple times
     * for the same element (deduplicated via a data attribute).
     *
     * This runs both on initial mount AND whenever new [data-reveal]
     * elements are inserted into the DOM later (e.g. products loaded
     * from the database after the page has already rendered), which
     * keeps dynamically loaded content from being stuck invisible.
     */
    const register = (el: HTMLElement) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.dataset.revealBound === "1") return;
      el.dataset.revealBound = "1";

      if (!observer) {
        showImmediately(el);
        return;
      }

      // Stagger: elements with data-reveal that sit side by side (same parent,
      // like a row of cards) come in one after another, 120ms apart.
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(
          parent.querySelectorAll<HTMLElement>(":scope > [data-reveal]")
        );
        const index = siblings.indexOf(el);
        const delay = index >= 0 ? index * 120 : 0;
        el.style.setProperty("--reveal-delay", `${delay}ms`);
      } else {
        el.style.setProperty("--reveal-delay", "0ms");
      }

      observer.observe(el);
    };

    // Initial scan: bind everything already in the DOM
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => register(el));

    // Watch the DOM so content injected AFTER mount (live Supabase data,
    // client filters, etc.) is bound and revealed instead of staying
    // at opacity: 0 forever.
    const mutation = new MutationObserver((mutations) => {
      for (const mutationRecord of mutations) {
        mutationRecord.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) {
              register(node);
            }
            node
              .querySelectorAll<HTMLElement>("[data-reveal]")
              .forEach((el) => register(el));
          }
        });
      }
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutation.disconnect();
    };
  }, [pathname]);

  return null;
}
