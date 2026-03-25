"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

/* ── Feature Detail Component ── */
function FeatureDetail({ 
  title, 
  subtitle, 
  description, 
  img, 
  reversed = false 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  img: string; 
  reversed?: boolean;
}) {
  return (
    <div className={`relative flex flex-col lg:flex-row items-center gap-12 py-32 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2"
      >
        <div className="glass-edge relative aspect-video overflow-hidden group">
          <img 
            src={img} 
            alt={title} 
            className="h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 space-y-6"
      >
        <span className="font-mono text-xs text-neon uppercase tracking-[0.4em]">{subtitle}</span>
        <h2 className="text-4xl lg:text-5xl font-black text-white leading-none uppercase tracking-tighter">{title}</h2>
        <p className="text-lg text-white/40 leading-relaxed font-medium">
          {description}
        </p>
        <div className="pt-8">
           <Link href="/signup" className="inline-flex items-center gap-2 text-neon font-mono text-xs uppercase tracking-widest hover:gap-4 transition-all">
             Try it in the Lab <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
           </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative z-10 bg-[#050505] min-h-screen overflow-hidden">
      
      {/* Background Grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-neon/60 mb-8 block">Hardware Accelerated Alpha</span>
          <h1 className="gradient-text text-6xl lg:text-[120px] font-black leading-none uppercase tracking-[-0.05em] mb-8">
             UNLEASH THE<br />INSTITUTION.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/30 leading-relaxed font-medium">
             TradingLab bridges the gap between retail intuition and institutional precision. 
             Architected for high-performance quants.
          </p>
        </motion.div>
      </section>

      {/* Feature Deep Dives */}
      <section className="relative px-6 lg:px-12 pb-48">
        <div className="mx-auto max-w-7xl">
          
          <FeatureDetail 
            subtitle="Generative Logic"
            title="AI Lab Assistant"
            description="Our neural-integrated LLM isn't just a chatbot. It's a strategy architect. Describe your market thesis in natural language, and witness the engine synthesize production-ready code in milliseconds."
            img="/assets/landing/ai-hologram.png"
          />

          <FeatureDetail 
            subtitle="Zero-Bias Simulation"
            title="Quantum Backtester"
            description="Stop relying on incomplete data. Our engine processes decades of tick-accurate history with zero survivorship bias. Validate your edge against real market conditions, not sanitized averages."
            img="/assets/landing/feature-backtest.png"
            reversed
          />

          <FeatureDetail 
            subtitle="Unified Execution"
            title="Multi-Asset Console"
            description="One dashboard. Infinite possibilities. Monitor and trade Crypto, FX, and Equities across multiple exchanges with a single, high-fidelity institutional terminal."
            img="/assets/landing/feature-console.png"
          />

          <FeatureDetail 
            subtitle="Tactical Deployment"
            title="Precision Automation"
            description="Click to Deploy. Our secure-vault infrastructure ensures your strategies are executed with sub-millisecond latency. Total control. Zero emotional intervention."
            img="/assets/landing/feature-automation.png"
            reversed
          />

        </div>
      </section>

      {/* Horizontal Divider with Features */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Final Conversion CTA & Roadmap CTA */}
      <section className="relative py-48 px-6 text-center">
         <div className="glass-edge mx-auto max-w-5xl p-24 bg-neon/[0.02] border-neon/10">
            <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter">Ready for the Moon?</h2>
            <p className="mx-auto max-w-lg text-lg text-white/40 mb-12 font-medium leading-relaxed">
              The public beta is now live for a limited time. Secure your spot in the lab before the next market cycle begins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/signup" className="w-full sm:w-auto px-12 py-5 bg-neon text-black font-black uppercase text-sm tracking-widest shadow-[0_0_40px_rgba(85,255,0,0.3)] hover:shadow-[0_0_60px_rgba(85,255,0,0.5)] transition-all">
                  Join the Lab
               </Link>
               <Link href="/#roadmap" className="w-full sm:w-auto px-12 py-5 border border-white/10 hover:border-neon/30 text-white font-black uppercase text-sm tracking-widest transition-all">
                  View Future Plans
               </Link>
            </div>
         </div>
      </section>

      {/* Footer Floating Glow */}
      <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-neon/10 blur-[150px] rounded-full pointer-events-none opacity-50" />
    </main>
  );
}
