"use client";

import { motion, useReducedMotion } from "motion/react";

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

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Faq() {
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="faq-container">
        <motion.div
          className="faq-heading-block"
          initial={reduce ? undefined : { opacity: 0, x: -28 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="faq-eyebrow">Common Inquiries</span>
          <h2 className="faq-title">FAQ Section</h2>
          <div className="faq-title-bar" />
        </motion.div>

        <motion.div
          className="faq-list"
          variants={list}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.15 }}
        >
          {faqs.map((faq) => (
            <motion.div className="faq-item" key={faq.question} variants={item}>
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
