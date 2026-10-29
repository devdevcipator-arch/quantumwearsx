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
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="faq-container">
        <div className="faq-heading-block" data-reveal="reveal-up">
          <span className="faq-eyebrow">Common Inquiries</span>
          <h2 className="faq-title">FAQ Section</h2>
          <div className="faq-title-bar" />
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <div className="faq-item" key={faq.question} data-reveal="reveal-up">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
