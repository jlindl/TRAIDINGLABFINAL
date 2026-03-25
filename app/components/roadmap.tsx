"use client";

import { motion } from "framer-motion";

const PHASES = [
  {
    tag: "Phase 1",
    title: "The Foundation",
    status: "Completed",
    features: ["Neural Strategy Engine", "Multi-Asset Backtesting", "Direct Execution Gateways"],
    date: "Q1 2024"
  },
  {
    tag: "Phase 2",
    title: "Alpha Expansion",
    status: "Public Beta",
    features: ["Alternative Data Streams", "LLM-Powered Optimizer", "Mobile Command Center"],
    date: "Q2 2024"
  },
  {
    tag: "Phase 3",
    title: "Autonomous Dominance",
    status: "R&D",
    features: ["Self-Evolving AI Agents", "Decentralized Liquidity Pooing", "Predictive Order-Block Detection"],
    date: "Q4 2024"
  }
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-[var(--section-py)] px-6 lg:px-12 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-neon/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="mx-auto max-w-5xl">
        <div className="mb-24 text-center">
           <span className="font-mono text-xs uppercase tracking-[0.4em] text-neon/60">Visionary Path</span>
           <h2 className="gradient-text mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl uppercase">
             THE FUTURE HUB.
           </h2>
           <p className="mx-auto mt-6 max-w-lg text-base text-white/30 leading-relaxed font-medium">
             Our mission is to democratize high-frequency intelligence. Witness the evolution of the TradingLab ecosystem.
           </p>
        </div>

        <div className="relative">
          {/* Vertical Beam */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:-translate-x-1/2" />

          <div className="space-y-24">
            {PHASES.map((phase, idx) => (
              <motion.div 
                key={phase.tag}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className={`relative flex flex-col lg:flex-row items-start ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute left-8 lg:left-1/2 h-4 w-4 rounded-full border-4 border-[#050505] bg-neon lg:-translate-x-1/2 shadow-[0_0_15px_rgba(0,255,136,0.5)] z-10" />

                <div className="lg:w-1/2 pl-20 lg:pl-0 lg:px-16">
                  <div className={`glass-edge p-10 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-white/5`}>
                     <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-[10px] text-neon uppercase tracking-[0.3em]">{phase.tag}</span>
                        <span className="font-mono text-[10px] text-white/20 uppercase">{phase.date}</span>
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{phase.title}</h3>
                     <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono uppercase text-white/40 tracking-widest mb-6">
                        Status: {phase.status}
                     </span>
                     <ul className="space-y-3">
                        {phase.features.map(feat => (
                          <li key={feat} className="flex items-center gap-3 text-xs text-white/40 group">
                             <div className="h-1 w-1 rounded-full bg-neon/40 group-hover:bg-neon transition-colors" />
                             {feat}
                          </li>
                        ))}
                     </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
