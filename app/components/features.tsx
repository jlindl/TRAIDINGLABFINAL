"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Live Stats Tile ─────────────────── */
function LiveStatsTile() {
  const [trades, setTrades] = useState(128_493);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrades((prev) => prev + Math.floor(Math.random() * 7 + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-edge shimmer flex flex-col justify-between p-8 h-full">
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-neon/70">
          Live Exchange
        </span>
        <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
          {trades.toLocaleString()}
        </h3>
        <p className="mt-1 text-sm text-white/40">Trades executed today</p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {/* Pulse */}
        <div className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-neon opacity-60 animate-pulse-ring" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
        </div>
        <span className="font-mono text-xs text-[#55ff00]">
          Systems Operational
        </span>
      </div>

      {/* Decorative mini chart */}
      <svg
        className="mt-6 h-16 w-full opacity-20"
        viewBox="0 0 200 60"
        fill="none"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,45 20,40 40,48 60,30 80,35 100,20 120,25 140,15 160,22 180,10 200,18"
          stroke="url(#stat-grad)"
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="stat-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--neon)" />
            <stop offset="1" stopColor="var(--neon-dim)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── AI Sphere Tile ──────────────────── */
function AiSphereTile() {
  return (
    <div className="glass-edge shimmer flex flex-col items-center justify-center p-8 h-full">
      <div className="relative h-36 w-36" style={{ perspective: "600px" }}>
        {/* Rotating wireframe rings */}
        {[0, 60, 120].map((rot) => (
          <div
            key={rot}
            className="absolute inset-0 animate-spin-slow rounded-full border border-neon/25"
            style={{
              transform: `rotateY(${rot}deg) rotateX(15deg)`,
              animationDuration: `${12 + rot * 0.02}s`,
            }}
          />
        ))}
        {/* Core glow */}
        <div className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-neon/30 blur-xl" />
        <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-neon" />
      </div>
      <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-neon/70">
        AI Engine
      </span>
      <p className="mt-1 text-sm text-white/40 text-center">
        Neural strategy optimization
      </p>
    </div>
  );
}

/* ── Speed Tile ──────────────────────── */
function SpeedTile() {
  return (
    <div className="glass-edge shimmer flex flex-col items-center justify-center p-8 h-full">
      <div className="relative flex items-center justify-center">
        {/* Ping circles */}
        <span className="absolute inline-flex h-20 w-20 rounded-full border border-neon/20 animate-pulse-ring" />
        <span
          className="absolute inline-flex h-14 w-14 rounded-full border border-neon/15 animate-pulse-ring"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="relative flex flex-col items-center">
          <span className="text-4xl font-bold text-white tracking-tight">
            {"<"}1
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon/70">
            ms
          </span>
        </div>
      </div>
      <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-neon/70">
        Execution Latency
      </span>
      <p className="mt-1 text-sm text-white/40 text-center">
        Co-located infrastructure
      </p>
    </div>
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
      className="relative py-[var(--section-py)] px-6 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon/70">
            Core Infrastructure
          </span>
          <h2 className="gradient-text mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for Performance
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Every millisecond counts. Our infrastructure is architected from the
            ground up for institutional-grade speed and reliability.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Tile A — spans 2 rows on large */}
          <motion.div
            className="lg:row-span-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <LiveStatsTile />
          </motion.div>

          {/* Tile B */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <AiSphereTile />
          </motion.div>

          {/* Tile C */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <SpeedTile />
          </motion.div>

          {/* Tile D — Extra stat */}
          <motion.div
            className="lg:col-span-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          >
            <div className="glass-edge shimmer flex items-center justify-between gap-8 p-8 h-full">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neon/70">
                  Global Coverage
                </span>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  150+ Markets
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Crypto, Forex, Equities & Commodities
                </p>
              </div>
              <div className="hidden sm:flex gap-3">
                {["NYSE", "NASDAQ", "LSE", "BINANCE", "CME"].map((ex) => (
                  <span
                    key={ex}
                    className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/40"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
