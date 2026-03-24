"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Zap, Download, Search, Filter } from "lucide-react";

const strategies = [
  { id: 1, name: "Neural Breakout v2", author: "QuantLabs", rating: 4.9, pf: 2.1, sharpe: 1.8, price: "$49/mo" },
  { id: 2, name: "Titan Scalper", author: "DrTrade", rating: 4.7, pf: 1.8, sharpe: 1.5, price: "Free" },
  { id: 3, name: "Midnight Whale", author: "CryptoMage", rating: 5.0, pf: 3.4, sharpe: 2.2, price: "$120/mo" },
  { id: 4, name: "Liquid Grid", author: "MeshNet", rating: 4.5, pf: 1.6, sharpe: 1.2, price: "$25/mo" },
];

export default function MarketplaceView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 pb-10 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-[10px] font-mono text-neon uppercase tracking-[0.2em] mb-4"
        >
          <Zap className="h-3 w-3 animate-pulse" />
          Market Protocol: Syncing
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold text-white tracking-tighter"
        >
          Strategy Marketplace <span className="text-white/20">Coming Soon.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed"
        >
          We are aggregating the world's most robust quantitative algorithms. 
          Soon, you'll be able to browse, test, and deploy community-vetted strategies instantly.
        </motion.p>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full px-4">
        {[
          {
            title: "Vetted Strategy Library",
            desc: "Access a curated library of trading algorithms that have passed our rigorous stress-testing and risk-auditing protocols.",
            icon: <ShieldCheck className="h-5 w-5 text-neon" />,
            color: "border-neon/20 bg-neon/5"
          },
          {
            title: "Social Copy-Trading",
            desc: "Follow top-performing quantitative researchers and mirror their live deployments with automated risk-syncing.",
            icon: <Star className="h-5 w-5 text-blue-400" />,
            color: "border-blue-400/20 bg-blue-400/5"
          },
          {
            title: "Risk-Adjusted Leaderboards",
            desc: "Discover algorithms based on real-world performance metrics: Sharpe Ratio, Sortino, and Maximum Drawdown.",
            icon: <Filter className="h-5 w-5 text-violet-400" />,
            color: "border-violet-400/20 bg-violet-400/5"
          },
          {
            title: "Multi-Pool Connectivity",
            desc: "Seamlessly list your strategies for sale or lease across both centralized and decentralized liquidity pools.",
            icon: <Download className="h-5 w-5 text-orange-400" />,
            color: "border-orange-400/20 bg-orange-400/5"
          }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`glass-edge p-6 flex flex-col gap-4 border ${feat.color} hover:bg-white/[0.04] transition-all group cursor-default`}
          >
             <div className="h-10 w-10 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all shadow-inner">
                {feat.icon}
             </div>
             <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{feat.title}</h3>
                <p className="text-[12px] text-white/40 leading-relaxed font-medium">{feat.desc}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* CTA / Updates */}
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <button className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all group">
             Notify me on Launch
             <Download className="h-3 w-3 group-hover:translate-y-1 transition-transform rotate-180" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
