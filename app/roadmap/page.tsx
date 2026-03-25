"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Zap, 
  PenTool, 
  Code2, 
  Cloud, 
  Coins, 
  BarChart4, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Search,
  Globe,
  Plus
} from "lucide-react";
import Link from "next/link";

/* ── Asset Mapping ────────────────────── */
const ASSETS = {
  foundation: "/tradinglab_feature_backtest_1774386811262.png",
  ghostWriter: "/tradinglab_ai_hologram_1774385365598.png",
  labScript: "/tradinglab_ideate_visual_1774386049408.png",
  deployment: "/tradinglab_feature_automation_1774386826004.png",
  ecosystem: "/tradinglab_multi_asset_console_1774387181350.png",
};

/* ── Feature Data ─────────────────────── */
const PHASES = [
  {
    id: "01",
    key: "foundation",
    title: "Precision Foundation",
    status: "CURRENT",
    description: "Establishing the core quantitative research layer for non-coders.",
    image: ASSETS.foundation,
    features: [
      { name: "AI Strategy Lab", icon: <Zap className="h-4 w-4" /> },
      { name: "Tick-Backtesting", icon: <Search className="h-4 w-4" /> },
      { name: "Global Asset Coverage", icon: <Globe className="h-4 w-4" /> }
    ]
  },
  {
    id: "02",
    key: "ghost-writer",
    title: "The Ghost Writer",
    status: "IN DEVELOPMENT",
    description: "Bridging the gap between discretionary intuition and algorithmic precision.",
    image: ASSETS.ghostWriter,
    details: "The Ghost Writer is a behavioral translation engine. As you trade manually, the system observes your entries, exits, and risk adjustments. It then refines this data into a repeatable 'Logic Signature'—automatically generating a strategy that trades exactly like you do.",
    features: [
      { name: "Behavioral Translation", icon: <PenTool className="h-4 w-4" /> },
      { name: "Logic Signatures", icon: <Zap className="h-4 w-4" /> }
    ]
  },
  {
    id: "03",
    key: "labscript",
    title: "LabScript Core",
    status: "STRATEGIC",
    description: "The proprietary technology layer powering the entire TRADINGLAB ecosystem.",
    image: ASSETS.labScript,
    details: "LabScript is our deterministic logic layer. Unlike generic code, LabScript is structured to prevent arbitrary execution while ensuring sub-millisecond interpretation between human input, AI, and execution APIs.",
    features: [
      { name: "Deterministic Engine", icon: <Code2 className="h-4 w-4" /> },
      { name: "Universal Translation", icon: <Globe className="h-4 w-4" /> }
    ]
  },
  {
    id: "04",
    key: "deployment",
    title: "Live Execution",
    status: "ROADMAP",
    description: "Transitioning from pure research to live-market capital deployment.",
    image: ASSETS.deployment,
    details: "This milestone enables deep integration with major broker APIs. Strategies proven in the lab can be deployed to high-priority cloud clusters with institutional-grade risk guards.",
    features: [
      { name: "Broker API Nexus", icon: <Cloud className="h-4 w-4" /> },
      { name: "Safety Protocols", icon: <ShieldCheck className="h-4 w-4" /> }
    ]
  },
  {
    id: "05",
    key: "ecosystem",
    title: "Marketplace Economy",
    status: "ROADMAP",
    description: "Decentralizing strategy ownership through the TRAID Coin economy.",
    image: ASSETS.ecosystem,
    details: "Introducing TRAID Coin—the native fuel of the ecosystem. Users can list their validated strategies on the Marketplace. Creators earn TRAID tokens, while traders gain access to proven signals.",
    features: [
      { name: "Strategy Exchange", icon: <Search className="h-4 w-4" /> }, // Use search for market
      { name: "TRAID Tokenization", icon: <Coins className="h-4 w-4" /> }
    ]
  }
];

function StickyPhase({ phase, isLast }: { phase: typeof PHASES[0], isLast: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative flex flex-col lg:flex-row gap-8 lg:gap-24 mb-48 lg:mb-96">
      
      {/* Left Column: Sticky Title */}
      <div className="lg:sticky lg:top-32 lg:h-fit w-full lg:w-[350px] shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="font-mono text-xs text-neon border border-neon/30 bg-neon/10 px-3 py-1 rounded-full font-black">
               PHASE {phase.id}
             </span>
             <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{phase.status}</span>
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            {phase.title.split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h2>
          <p className="text-lg text-white/40 leading-relaxed font-medium">
            {phase.description}
          </p>
        </div>
      </div>

      {/* Right Column: Visual Journey & Bento */}
      <div className="flex-1 space-y-12">
        
        {/* Cinematic Asset */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative aspect-video lg:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] group"
        >
          <img 
            src={phase.image} 
            alt={phase.title}
            className="h-full w-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          
          {/* Floating Feature Tags */}
          <div className="absolute bottom-8 left-8 flex flex-wrap gap-2">
            {phase.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-white/80 tracking-widest">
                {feat.icon}
                {feat.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Deep Dive Bento */}
        {phase.details && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="glass-edge p-8 bg-white/[0.01] border-white/5 lg:col-span-2">
               <h3 className="text-xs font-black text-neon uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                 <Zap className="h-4 w-4" />
                 Strategic Infrastructure Update
               </h3>
               <p className="text-xl text-white/60 leading-relaxed font-medium">
                 {phase.details}
               </p>
            </div>
            
            <div className="glass-edge p-6 bg-white/[0.01] border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all">
               <div>
                 <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block mb-1">Architecture</span>
                 <p className="text-sm font-bold text-white group-hover:text-neon transition-colors">LabScript Runtime 2.4</p>
               </div>
               <Plus className="h-4 w-4 text-white/20 group-hover:text-neon group-hover:rotate-90 transition-all" />
            </div>

            <div className="glass-edge p-6 bg-white/[0.01] border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all">
               <div>
                 <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block mb-1">Security</span>
                 <p className="text-sm font-bold text-white group-hover:text-neon transition-colors">Quantum Position Lockdown</p>
               </div>
               <Plus className="h-4 w-4 text-white/20 group-hover:text-neon group-hover:rotate-90 transition-all" />
            </div>
          </motion.div>
        )}

      </div>

      {!isLast && (
         <div className="absolute bottom-[-100px] left-1/2 lg:left-[175px] h-32 w-[1px] bg-gradient-to-b from-white/10 to-transparent lg:block hidden" />
      )}
    </div>
  );
}

export default function RoadmapPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative z-10 bg-[#050505] min-h-screen text-white pt-16">
      
      {/* Scroll Progress Line */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-neon z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background Decor */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />
      <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-neon/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative pt-[15vh] pb-[10vh] px-6 lg:px-12 text-center overflow-hidden">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-edge inline-flex items-center gap-3 px-6 py-2 border-neon/20 bg-neon/5 text-neon mb-8"
        >
           <Zap className="h-4 w-4 animate-pulse" />
           <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-black">The Lab Blueprint V: Evolution</span>
        </motion.div>
        
        <h1 className="text-6xl lg:text-[10rem] font-black leading-[0.8] uppercase tracking-tighter mb-12">
          STRATEGIC <br/>
          <span className="text-white/20">SENTINEL.</span>
        </h1>

        <div className="mx-auto max-w-2xl">
           <p className="text-lg text-white/40 leading-relaxed font-medium">
             A high-fidelity roadmap chronicling the transition from quantitative research tool to global trading infrastructure.
           </p>
        </div>
      </header>

      {/* Journey Sections */}
      <section className="relative px-6 lg:px-24 pt-24">
        <div className="mx-auto max-w-7xl">
           {PHASES.map((phase, i) => (
             <StickyPhase 
               key={phase.id} 
               phase={phase} 
               isLast={i === PHASES.length - 1} 
             />
           ))}
        </div>
      </section>

      {/* Pre-Institutional CTA */}
      <section className="relative px-6 lg:px-12 pb-48 text-center pt-24 border-t border-white/5">
         <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">
               The Laboratory <br/>
               <span className="text-white/20">is Never Static.</span>
            </h2>
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center gap-4 bg-white text-black px-12 py-6 font-black uppercase tracking-widest text-sm hover:bg-neon transition-all hover:shadow-[0_0_50px_rgba(0,255,136,0.5)]"
            >
              Enter Research Command
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
         </div>
      </section>

      {/* Institutional Expansion Footer */}
      <footer className="relative py-24 border-t border-white/5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 grid gap-12 lg:grid-cols-3">
           <div className="space-y-4">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Institutional Research</span>
              <h4 className="text-xl font-bold text-white">Monte Carlo Engine</h4>
              <p className="text-sm text-white/30 leading-relaxed">Stress-testing strategies against 100,000+ random market iterations for ultimate robustness.</p>
           </div>
           <div className="space-y-4">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Evolutionary Logic</span>
              <h4 className="text-xl font-bold text-white">Walk-Forward Pulse</h4>
              <p className="text-sm text-white/30 leading-relaxed">Recursive out-of-sample validation to prevent curve-fitting and survivorship bias.</p>
           </div>
           <div className="space-y-4">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Governance</span>
              <h4 className="text-xl font-bold text-white">Quant Compliance</h4>
              <p className="text-sm text-white/30 leading-relaxed">Regulatory-ready logs and verified-execution audits for institutional compliance.</p>
           </div>
        </div>
      </footer>

    </main>
  );
}
