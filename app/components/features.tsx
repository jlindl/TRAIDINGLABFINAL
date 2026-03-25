"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Feature Tile Component ── */
function FeatureTile({ 
  title, 
  subtitle, 
  description, 
  img, 
  icon, 
  className = "" 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  img: string; 
  icon: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, borderColor: "rgba(85, 255, 0, 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-edge group relative flex flex-col justify-end p-8 h-full overflow-hidden ${className}`}
    >
      {/* Background Visual */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center grayscale opacity-10 group-hover:opacity-30 group-hover:grayscale-0 transition-all duration-700"
        style={{ backgroundImage: `url(${img})` }} 
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      
      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon border border-neon/20 shadow-[0_0_15px_rgba(0,255,136,0.1)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.2)] transition-all">
          {icon}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon/70">
          {subtitle}
        </span>
        <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="mt-3 text-sm text-white/40 leading-relaxed max-w-[280px]">
          {description}
        </p>
      </div>

      {/* Decorative Corner Trace */}
      <div className="absolute top-0 right-0 h-16 w-16 opacity-10 group-hover:opacity-30 transition-opacity">
        <svg viewBox="0 0 100 100" className="h-full w-full stroke-neon fill-none" strokeWidth="2">
          <path d="M70 10 H90 V30" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── Features Section ────────────────── */
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-[var(--section-py)] mb-[10vh] px-6 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center lg:text-left"
        >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon/60">
                Institutional Infrastructure
            </span>
            <h2 className="gradient-text mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                THE QUANTUM ADVANTAGE.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/30 leading-relaxed font-medium">
                Eliminate emotional fatigue and chart noise. TradingLab provides the 
                backtesting speed and AI intelligence reserved for elite institutions.
            </p>
        </motion.div>

        {/* Bento Grid layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Tile 1: Backtesting (Large) */}
          <div className="lg:row-span-2">
            <FeatureTile 
              img="/assets/landing/feature-backtest.png"
              subtitle="Precision Testing"
              title="Quantum Backtesting"
              description="Analyze years of historical tick data in seconds with zero survivorship bias and total precision."
              icon={(
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            />
          </div>

          {/* Tile 2: AI Lab (Standard) */}
          <FeatureTile 
            img="/assets/landing/ai-hologram.png"
            subtitle="Neural Intelligence"
            title="AI Lab Assistant"
            description="Speak your market intuition and watch the AI translate it into production-ready algorithmic logic."
            icon={(
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          />

          {/* Tile 3: Automation (Standard) */}
          <FeatureTile 
            img="/assets/landing/feature-automation.png"
            subtitle="Direct Execution"
            title="Precision Automation"
            description="Deploy validated strategies directly to secure execution contracts with institutional routing."
            icon={(
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
              </svg>
            )}
          />

          {/* Tile 4: Markets (Wide) */}
          <div className="lg:col-span-2">
             <FeatureTile 
                img="/assets/landing/market-noise.png"
                subtitle="Global Connectivity"
                title="150+ Audited Markets"
                description="Trade Crypto, FX, and Equities with co-located hardware and zero-slippage connectivity."
                className="lg:min-h-[300px]"
                icon={(
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )}
             />
          </div>

        </div>
      </div>
    </section>
  );
}
