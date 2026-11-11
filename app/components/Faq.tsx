"use client";

import { useEffect, useState } from "react";

const faqs = [
  {
    question: "What is your Minimum Order Quantity (MOQ)?",
    answer:
      "Our standard MOQ for activewear starts at 100 pieces per style/color, which can be split across multiple sizes to help you launch your collection efficiently.",
  },
  {
    question: "What are the typical lead times?",
    answer:
      "Sampling usually takes 10–14 days. Once samples are approved, bulk production typically ranges from 4–6 weeks depending on the complexity and order volume.",
  },
  {
    question: "Can I get a sample before bulk production?",
    answer:
      "Absolutely. We provide proto-samples for fit and construction testing, and PPS (Pre-Production Samples) for final approval before the bulk run begins.",
  },
  {
    question: "Do you provide design support?",
    answer:
      "Yes, our technical team can assist in creating tech packs from your sketches or physical samples to ensure manufacturing accuracy.",
  },
];

const lgQuery = "(min-width: 1024px)";

export default function Faq() {
  // Mobile: closed by default (no hardcoded open attribute).
  // Desktop (lg+): all answers forced open via the matchMedia listener below.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(lgQuery);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="faq" className="faq-section w-full py-16 sm:py-20 lg:py-24" aria-label="Frequently Asked Questions">
      <div className="faq-container px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        <div className="faq-heading-block mb-8 sm:mb-0" data-reveal="reveal-up">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D10014] mb-2 inline-block">{`Common Inquiries`}</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3">FAQ Section</h2>
          <div className="faq-title-bar" />
        </div>

        <div className="faq-list divide-y divide-white/10">
          {faqs.map((faq) => (
            <details
              className="group py-6 sm:py-8"
              key={faq.question}
              open={isDesktop}
              data-reveal="reveal-up"
            >
              <summary
                onClick={(e) => {
                  // Lock the summary shut on desktop — answers stay expanded there.
                  if (isDesktop) e.preventDefault();
                }}
                className="flex min-h-[56px] w-full cursor-pointer select-none list-none items-center justify-between gap-3 lg:cursor-default [&::-webkit-details-marker]:hidden"
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-snug">
                  {faq.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#D10014] transition-transform duration-300 ease-out group-open:rotate-45 lg:hidden"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="text-sm sm:text-base text-[#a6a6b5] leading-relaxed max-w-2xl mt-4 sm:mt-5">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
