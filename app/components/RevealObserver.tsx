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

    /** Elements that have started (or finished) revealing — no double-fire. */
    const revealed = new WeakSet<HTMLElement>();

    const reveal = (target: HTMLElement) => {
      if (revealed.has(target)) return;
      revealed.add(target);

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
      };

      // Fallback safety timer: 800ms duration + stagger delay + buffer.
      // transitionend can be missed (e.g. element scrolled out mid-animation),
      // so the timer is the guaranteed cleanup path.
      setTimeout(cleanup, 800 + delayMs + 150);
    };

    const observer =
      hasIO && !prefersReducedMotion
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const target = entry.target as HTMLElement;
                  obs.unobserve(target);
                  reveal(target);
                  target.classList.add("is-revealed");
                }
              });
            },
            {
              // threshold 0: reveal as soon as any pixel enters the viewport.
              // A higher threshold (e.g. 0.15) permanently hides tall sections
              // whose 15% height never fits inside the viewport.
              threshold: 0,
              rootMargin: "0px 0px -40px 0px",
            }
          )
        : null;

    /**
     * Dedupe within THIS effect run only (WeakSet, not a data attribute).
     * Previously a persistent `dataset.revealBound` flag was used, which
     * survived route changes: after client-side navigation a fresh observer
     * was created, but React-reused DOM nodes still carried the old flag and
     * were skipped — leaving them hidden (opacity: 0) until a full reload.
     */
    const bound = new WeakSet<HTMLElement>();

    const showImmediately = (el: HTMLElement) => {
      el.removeAttribute("data-reveal");
      el.classList.remove("is-revealed");
    };

    /**
     * Bind an element to the reveal system. Safe to call multiple times.
     * Runs on initial mount AND whenever new [data-reveal] elements are
     * inserted into the DOM later (e.g. products loaded from the database
     * after the page has already rendered), which keeps dynamically loaded
     * content from being stuck invisible.
     */
    const register = (el: HTMLElement) => {
      if (!(el instanceof HTMLElement)) return;
      if (bound.has(el)) return;
      bound.add(el);
      if (revealed.has(el)) {
        showImmediately(el);
        return;
      }

      if (!observer) {
        showImmediately(el);
        return;
      }

      // Stagger: sibling [data-reveal] elements come in one after another,
      // 120ms apart (applied via the CSS --reveal-delay variable).
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

    /**
     * Safety net: shortly after mount, force-reveal any element that is
     * already inside the viewport but has not been revealed yet. This closes
     * any remaining race (e.g. observer callbacks delayed on slow devices, or
     * elements observed while `display: none`) so content can never get stuck
     * invisible until refresh.
     */
    const safetySweep = () => {
      const viewportLimit = window.innerHeight - 40;
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => {
          if (revealed.has(el)) return;
          const rect = el.getBoundingClientRect();
          if (rect.top < viewportLimit && rect.bottom > 0) {
            reveal(el);
            el.classList.add("is-revealed");
          }
        });
    };
    const safetyTimer = window.setTimeout(safetySweep, 1800);

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
      clearTimeout(safetyTimer);
    };
  }, [pathname]);

  return null;
}
