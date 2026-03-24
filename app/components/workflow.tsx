"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Data Ingestion",
    description:
      "Real-time feeds from 150+ markets streamed through our co-located infrastructure with <1ms latency.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "AI Optimization",
    description:
      "Neural networks analyze patterns across multiple timeframes, optimizing entry/exit signals in real time.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Execution",
    description:
      "Orders are routed through smart execution algorithms ensuring best price with minimal slippage.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function Workflow() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const pathLength = useTransform(smoothProgress, [0.1, 0.7], [0, 1]);

  return (
    <section
      id="workflow"
      ref={containerRef}
      className="relative py-[var(--section-py)] px-6 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon/70">
            How It Works
          </span>
          <h2 className="gradient-text mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            The Money Flow
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            From raw market data to executed positions — fully automated,
            continuously optimized.
          </p>
        </motion.div>

        {/* Flow */}
        <div className="relative flex flex-col items-center gap-24">
          {/* SVG Neon Path */}
          <svg
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 lg:block"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00cc6a" />
              </linearGradient>
            </defs>
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="url(#flow-grad)"
              strokeWidth="2"
              style={{ pathLength }}
              strokeLinecap="round"
            />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              className="relative flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Step indicator dot */}
              <div className="absolute left-1/2 top-0 hidden h-5 w-5 -translate-x-1/2 items-center justify-center lg:flex">
                <div className="h-3 w-3 rounded-full bg-neon shadow-[0_0_12px_rgba(0,255,136,0.5)]" />
              </div>

              {/* Card — alternating sides */}
              <div
                className={`glass-edge shimmer w-full max-w-md p-8 lg:w-[45%] ${
                  i % 2 === 0 ? "lg:mr-auto lg:text-right" : "lg:ml-auto"
                }`}
              >
                <div
                  className={`flex items-center gap-4 ${
                    i % 2 === 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-neon/5 text-neon border border-neon/10">
                    {step.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Step {step.id}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/45">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
