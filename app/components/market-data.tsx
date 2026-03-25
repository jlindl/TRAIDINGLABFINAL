"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Strategy Carousel Data ── */
const STRATEGIES = [
  { name: "Momentum Alpha", asset: "BTC/USD", winRate: "73.2%", pnl: "+12.4k", color: "#00ff88" },
  { name: "Neutral Cross", asset: "ETH/USD", winRate: "68.5%", pnl: "+8.9k", color: "#00ff88" },
  { name: "Volatility Crush", asset: "SPX", winRate: "81.1%", pnl: "-2.1k", color: "#ff3b3b" },
  { name: "Order Flow v2", asset: "SOL/USD", winRate: "76.8%", pnl: "+5.6k", color: "#00ff88" },
  { name: "Mean Rev v4", asset: "NASDAQ", winRate: "64.2%", pnl: "+3.2k", color: "#00ff88" },
  { name: "Delta Neutral", asset: "EUR/USD", winRate: "71.9%", pnl: "-0.8k", color: "#ff3b3b" },
];

function StrategyCarousel() {
  return (
    <div className="relative w-full py-16 overflow-hidden bg-white/[0.01] border-y border-white/5">
      <motion.div 
        animate={{ x: [0, -100 * STRATEGIES.length] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 px-8"
      >
        {[...STRATEGIES, ...STRATEGIES, ...STRATEGIES].map((s, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[320px] p-8 glass-edge bg-white/[0.02] border-white/5 group hover:border-neon/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h4 className="text-xl font-black text-white tracking-tighter uppercase">{s.name}</h4>
                  <p className="font-mono text-[10px] text-white/40 tracking-[0.2em]">{s.asset}</p>
               </div>
               <div className={`font-mono text-xs font-black px-2 py-1 rounded bg-white/5`} style={{ color: s.color }}>
                  {s.pnl}
               </div>
            </div>
            
            <div className="flex items-end justify-between gap-4">
               <div>
                  <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest block mb-1">Win Rate</span>
                  <span className="text-2xl font-black text-white">{s.winRate}</span>
               </div>
               {/* Decorative Mini Chart */}
               <div className="h-8 w-24 opacity-40">
                  <svg viewBox="0 0 100 30" className="h-full w-full">
                     <path d="M0 25 L20 15 L40 20 L60 5 L80 12 L100 2" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                  </svg>
               </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
               <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">Institutional Grade</span>
               <div className="h-1 w-1 rounded-full bg-neon animate-pulse" />
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Cinematic End Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#050505] to-transparent z-10" />
    </div>
  );
}

/* ── AI Signal Scanner ───────────────── */
type Signal = {
  id: string;
  asset: string;
  type: string;
  confidence: number;
  time: string;
  locked: boolean;
};

const INITIAL_SIGNALS: Signal[] = [
  { id: "1", asset: "BTC/USD", type: "SMC Break of Structure", confidence: 92, time: "2m ago", locked: false },
  { id: "2", asset: "ETH/USD", type: "RSI Bearish Divergence", confidence: 88, time: "5m ago", locked: true },
  { id: "3", asset: "SOL/USD", type: "Order Block Mitigation", confidence: 94, time: "12m ago", locked: true },
  { id: "4", asset: "GBP/JPY", type: "Trend Continuation", confidence: 81, time: "15m ago", locked: false },
];

function SignalScanner() {
  const [signals, setSignals] = useState(INITIAL_SIGNALS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Shifting signals for "Live" feel
      setSignals(prev => {
        const next = [...prev];
        const last = next.pop()!;
        return [{...last, time: "Just now", id: Math.random().toString()}, ...next.map(s => ({...s, time: parseInt(s.time) ? (parseInt(s.time) + 1) + "m ago" : "1m ago"}))];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {signals.map((signal) => (
          <motion.div
             layout
             key={signal.id}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="glass-edge group relative flex items-center justify-between p-6 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-black text-white tracking-widest">{signal.asset}</span>
                <span className="h-1 w-1 rounded-full bg-neon animate-pulse" />
                <span className="font-mono text-[10px] text-white/30 uppercase">{signal.time}</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-neon transition-colors">{signal.type}</h4>
              <div className="mt-4 flex items-center gap-4">
                 <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.confidence}%` }}
                      className="h-full bg-neon shadow-[0_0_10px_rgba(0,255,136,0.5)]" 
                    />
                 </div>
                 <span className="font-mono text-[10px] text-neon font-black">{signal.confidence}% Confidence</span>
              </div>
            </div>

            {signal.locked ? (
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-neon/30 transition-colors">
                  <svg className="h-4 w-4 text-white/40 group-hover:text-neon transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/20 group-hover:text-neon/40">PRO ONLY</span>
              </div>
            ) : (
              <button className="relative z-10 px-4 py-2 bg-neon/10 border border-neon/20 hover:bg-neon hover:text-black transition-all font-mono text-[10px] font-black uppercase tracking-widest">
                View Audit
              </button>
            )}
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-neon/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Pricing Section ─────────────────── */
function PricingGrid() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="mt-32 max-w-5xl mx-auto">
      
      {/* Toggle Switch */}
      <div className="flex flex-col items-center mb-16 space-y-4">
        <div className="relative flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-full">
           <motion.div 
             layout
             className="absolute h-full w-1/2 bg-neon rounded-full"
             animate={{ x: isAnnual ? "100%" : "0%" }}
             transition={{ type: "spring", stiffness: 400, damping: 30 }}
           />
           <button 
             onClick={() => setIsAnnual(false)}
             className={`relative z-10 px-8 py-2 text-xs font-black uppercase tracking-widest transition-colors ${!isAnnual ? 'text-black' : 'text-white/40'}`}
           >
             Monthly
           </button>
           <button 
             onClick={() => setIsAnnual(true)}
             className={`relative z-10 px-8 py-2 text-xs font-black uppercase tracking-widest transition-colors ${isAnnual ? 'text-black' : 'text-white/40'}`}
           >
             Annual
           </button>
        </div>
        <div className="flex items-center gap-2">
           <span className="font-mono text-[10px] text-neon uppercase tracking-widest animate-pulse">Save 20%</span>
           <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">with annual billing</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Paper Trader */}
        <div className="glass-edge relative flex flex-col p-10 border-white/5 bg-white/[0.01]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Entry Level</span>
          <h3 className="text-3xl font-black text-white leading-none">Paper Trader</h3>
          <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">£0</span>
              <span className="text-sm text-white/30">/mo</span>
          </div>
          <p className="mt-6 text-sm text-white/40 leading-relaxed">
            Perfect for testing the waters. Master the AI Lab Assistant and build your first strategies risk-free.
          </p>
          <ul className="mt-8 space-y-4">
              {["5 AI Messages / Day", "3 Backtests / Day", "Full Indicator Suite", "Community Access"].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-xs text-white/60">
                  <svg className="h-4 w-4 text-neon/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
          </ul>
          <button className="mt-12 w-full py-4 border border-neon/20 hover:bg-neon/10 transition-all font-mono text-xs font-black uppercase tracking-widest text-[#55ff00]">
              Get Started Free
          </button>
        </div>

        {/* Pro Trader */}
        <div className="glass-edge relative flex flex-col p-10 border-neon/30 bg-neon/[0.02] shadow-[0_0_50px_rgba(0,255,136,0.05)] overflow-hidden group">
          <div className="absolute top-4 right-4 bg-neon px-2 py-1 rotate-3 font-mono text-[8px] font-black text-black uppercase tracking-widest">
            {isAnnual ? "Best Value" : "Highly Recommended"}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon mb-4">Elite Edge</span>
          <h3 className="text-3xl font-black text-white leading-none">Pro Trader</h3>
          <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">
                {isAnnual ? "£39" : "£49"}
              </span>
              <span className="text-sm text-white/30">/mo</span>
              {isAnnual && <span className="ml-2 font-mono text-[10px] text-neon uppercase tracking-widest underline underline-offset-4">Billed Annually</span>}
          </div>
          <p className="mt-6 text-sm text-white/60 leading-relaxed">
            For the ambitious trader. Unlock full AI intelligence and institutional-grade backtesting power.
          </p>
          <ul className="mt-8 space-y-4">
              {["40 AI Messages / Day", "100 Backtests / Day", "Priority AI Compute", "One-Click Automation", "Early Signal Access"].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-xs text-white">
                  <svg className="h-4 w-4 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
          </ul>
          <button className="mt-12 w-full py-4 bg-neon text-black hover:bg-[#55ff00] transition-all font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              Upgrade To Pro
          </button>
          
          {/* Background Glow */}
          <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-neon/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-neon/20 transition-all duration-700" />
        </div>
      </div>
    </div>
  );
}

export default function MarketData() {
  return (
    <section id="alpha-labs" className="relative py-[15vh] px-6 lg:px-12 overflow-hidden">
      
      {/* Section Neural Backdrop */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 text-center">
           <span className="font-mono text-xs uppercase tracking-[0.4em] text-neon/60">The Signal Scanner</span>
           <h2 className="gradient-text mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl uppercase">
             LIVE ALPHA AUDITS.
           </h2>
           <p className="mx-auto mt-6 max-w-lg text-sm text-white/30 leading-relaxed font-medium">
             Observe the TradingLab Neural Engine as it identifies institutional setups across 150+ global markets.
           </p>
        </div>

        <SignalScanner />
        
        <div className="mt-24 -mx-6 lg:-mx-12">
          <StrategyCarousel />
        </div>

        <PricingGrid />
      </div>
    </section>
  );
}
