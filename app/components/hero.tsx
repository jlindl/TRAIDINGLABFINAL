"use client";

import { useRef, useState } from "react";
import { motion, type Variants, useScroll, useTransform } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 10]);

  const btnRef = useRef<HTMLAnchorElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setBtnOffset({
      x: (e.clientX - cx) * 0.15,
      y: (e.clientY - cy) * 0.15,
    });
  };

  const handleMouseLeave = () => setBtnOffset({ x: 0, y: 0 });

  return (
    <motion.section
      id="hero"
      ref={containerRef}
      style={{ opacity, scale, filter: `blur(${blur}px)` }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Image — Full 8K panoramic Peaks */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale-[0.2] opacity-50 mix-blend-lighten"
        style={{ backgroundImage: "url('/assets/landing/hero_bg_peaks.png')" }}
      />
      
      {/* Deep Overlays for Premium Contrast */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#050505]/0 via-transparent to-[#050505]" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60" />

      {/* Dark overlays for readability — Softened for more background visibility */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/30" />

      {/* Neon accent glow */}
      <div className="pointer-events-none absolute inset-0 z-[4]">
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[600px] bg-[radial-gradient(ellipse,rgba(85,255,0,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[200px] w-[400px] bg-[radial-gradient(ellipse,rgba(85,255,0,0.05)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_450px] items-center">
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div
              variants={item}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-4 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#55ff00]">
                TradingLab v1.0 — Public Beta Now Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-[80px]"
            >
              YOUR MARKET EDGE. <br className="hidden sm:block" />
              <span className="neon-title-gradient">AUTOMATED.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/50"
            >
              Transform your market intuition into high-performance automated strategies. 
              No code, no emotional bias—just institutional-grade intelligence architected for 
              the modern trader.
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12"
            >
              {[
                { value: "150+", label: "Markets" },
                { value: "<1ms", label: "Latency" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={item} className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.a
                ref={btnRef}
                href="/login"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: btnOffset.x, y: btnOffset.y }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#55ff00] px-8 py-3.5 text-sm font-black text-black shadow-[0_0_40px_rgba(85,255,0,0.25)] transition-shadow hover:shadow-[0_0_60px_rgba(85,255,0,0.45)]"
              >
                <span>Get Started Free</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>

              <a
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-8 py-3.5 text-sm font-bold text-white/70 transition-all hover:border-neon/50 hover:text-white"
              >
                View Marketplace
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side: Clear Logo Exhibit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:flex items-center justify-center relative group"
          >
             <img 
               src="/Logo.png" 
               alt="TraidingLab Official Logo" 
               className="relative z-10 w-full h-auto max-w-[420px] object-contain"
             />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to page */}
      <div className="absolute bottom-0 left-0 z-[5] h-32 w-full bg-gradient-to-t from-[#050505] to-transparent" />
    </motion.section>
  );
}
