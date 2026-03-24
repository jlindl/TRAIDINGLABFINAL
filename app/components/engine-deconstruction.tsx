"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function EngineDeconstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <section id="features" ref={containerRef} className="relative py-32 px-6 lg:px-12 bg-[#050505] overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div style={{ opacity }} className="text-center mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
            Proprietary Architecture
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
            The Intelligence Core
          </h2>
        </motion.div>

        <div className="relative grid gap-12 lg:grid-cols-3 items-center">
          {/* Node 1: Market Data */}
          <div className="glass-edge p-8 bg-white/5 backdrop-blur-xl relative z-20">
            <h3 className="text-xl font-bold text-white mb-4">Market Data Ingestion</h3>
            <p className="text-sm text-white/40">
              Low-latency aggregation of 150+ global markets, including Level 2 order books and dark pool flows.
            </p>
          </div>

          {/* Node 2: AI Optimization */}
          <div className="glass-edge p-8 bg-white/5 backdrop-blur-xl relative z-20 border-[#55ff00]/20 h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-[#55ff00] mb-4">Neural Strategy Optimization</h3>
            <p className="text-sm text-white/40">
              Genetic algorithms and reinforcement learning models evolve strategies in real-time to adapt to changing regimes.
            </p>
          </div>

          {/* Node 3: Alpha Generation */}
          <div className="glass-edge p-8 bg-white/5 backdrop-blur-xl relative z-20">
            <h3 className="text-xl font-bold text-white mb-4">Institutional Alpha</h3>
            <p className="text-sm text-white/40">
              Validated, risk-adjusted signals generated for sub-millisecond execution across distributed cloud nodes.
            </p>
          </div>

          {/* Animated SVG Path Connecting Nodes */}
          <div className="absolute inset-0 z-10 hidden lg:block pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 400" fill="none" className="w-full h-full">
              {/* Path 1 -> 2 */}
              <motion.path
                d="M330,200 L400,200"
                stroke="#55ff00"
                strokeWidth="2"
                strokeDasharray="10 5"
                style={{ pathLength }}
              />
              {/* Path 2 -> 3 */}
              <motion.path
                d="M600,200 L670,200"
                stroke="#55ff00"
                strokeWidth="2"
                strokeDasharray="10 5"
                style={{ pathLength }}
              />
              
              {/* Glow pulses */}
              <motion.circle 
                cx="330" cy="200" r="4" fill="#55ff00"
                animate={{ r: [4, 8, 4], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle 
                cx="670" cy="200" r="4" fill="#55ff00"
                animate={{ r: [4, 8, 4], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </svg>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] bg-[#55ff00]/5 blur-[160px] pointer-events-none" />
      </div>
    </section>
  );
}
