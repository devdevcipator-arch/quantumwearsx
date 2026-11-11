"use client";

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

export default function Faq() {
  return (
    <section id="faq" className="faq-section w-full py-12 sm:py-16 lg:py-24" aria-label="Frequently Asked Questions">
      <div className="faq-container px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        <div className="faq-heading-block" data-reveal="reveal-up">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D10014] mb-2 inline-block">{`Common Inquiries`}</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3">FAQ Section</h2>
          <div className="faq-title-bar" />
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details
              className="group border-b border-white/10"
              key={faq.question}
              data-reveal="reveal-up"
            >
              <summary className="flex min-h-[48px] w-full cursor-pointer select-none list-none items-center justify-between gap-3 py-4 sm:py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-snug">
                  {faq.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#D10014] transition-transform duration-300 ease-out group-open:rotate-45"
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
              <p className="text-xs sm:text-sm text-[#a6a6b5] leading-relaxed pt-2.5 sm:pt-3 pb-4 sm:pb-6 max-w-[680px]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
