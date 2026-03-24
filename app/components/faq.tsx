"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is the typical execution latency?",
    answer: "Our co-located infrastructure in LD4 (London) and NY4 (New York) delivers sub-millisecond execution, typically averaging 0.82ms from signal generation to exchange fill.",
  },
  {
    question: "Which markets are supported for backtesting?",
    answer: "We support 150+ global markets including major Currencies (Forex), Equities (Stocks/Indices), and digital assets (Crypto). All datasets include institutional-grade history.",
  },
  {
    question: "How does the AI Strategy Optimizer work?",
    answer: "Our engine uses reinforcement learning and genetic algorithms to iteratively optimize your strategy parameters against historical regimes, ensuring robustness before live deployment.",
  },
  {
    question: "Can I deploy strategies directly to my broker?",
    answer: "Yes. TraidingLab provides a secure API bridge (v3.0) for seamless deployment to major institutional brokers and decentralized exchanges.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="help" className="relative py-32 px-6 lg:px-12 bg-[#050505]">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
            Intelligence Support
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
            Frequently Asked
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-lg font-bold text-white pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  className="text-[#55ff00]/40 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-white/40 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
