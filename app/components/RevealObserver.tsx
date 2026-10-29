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

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-revealed");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => {
        el.removeAttribute("data-reveal");
      });
      return;
    }

    // Stagger: elements with data-reveal that sit side by side (same parent, like a row of cards)
    // come in one after another, 120ms apart.
    const parentMap = new Map<HTMLElement, HTMLElement[]>();
    elements.forEach((el) => {
      const parent = el.parentElement;
      if (parent) {
        if (!parentMap.has(parent)) {
          parentMap.set(parent, []);
        }
        parentMap.get(parent)!.push(el);
      }
    });

    parentMap.forEach((children) => {
      if (children.length > 1) {
        children.forEach((child, index) => {
          child.style.setProperty("--reveal-delay", `${index * 120}ms`);
        });
      } else if (children.length === 1) {
        children[0].style.setProperty("--reveal-delay", "0ms");
      }
    });

    // RevealObserver uses an IntersectionObserver.
    // An element animates once 15% of it is visible, counted 40px up from the bottom of the screen.
    // It only plays once per element.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            obs.unobserve(target);
            target.classList.add("is-revealed");

            const delayStr = target.style.getPropertyValue("--reveal-delay") || "0ms";
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
              if (e.target === target && e.propertyName === "transform") {
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
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
