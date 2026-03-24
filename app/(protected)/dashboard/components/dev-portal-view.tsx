"use client";

import { motion } from "framer-motion";
import { Copy, RefreshCw, Key, Globe, Shield, Activity, ExternalLink, Terminal, Zap } from "lucide-react";

export default function DevPortalView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 pb-10 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-[10px] font-mono text-neon uppercase tracking-[0.2em] mb-4"
        >
          <Activity className="h-3 w-3 animate-pulse" />
          Protocol Initializing
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold text-white tracking-tighter"
        >
          Developer Portal <span className="text-white/20">Coming Soon.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed"
        >
          We are building a robust programmatic infrastructure for quantitative researchers. 
          Soon, you'll be able to bypass the UI and interact directly with the core engine.
        </motion.p>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full px-4">
        {[
          {
            title: "TraidingLab SDK v3.0",
            desc: "Native high-performance libraries for Python and Node.js. Build, test, and deploy strategies from your own IDE.",
            icon: <Terminal className="h-5 w-5 text-neon" />,
            color: "border-neon/20 bg-neon/5"
          },
          {
            title: "Custom Signal Webhooks",
            desc: "Bridge your external signals from TradingView or proprietary scripts directly into TraidingLab's execution layer.",
            icon: <Globe className="h-5 w-5 text-blue-400" />,
            color: "border-blue-400/20 bg-blue-400/5"
          },
          {
            title: "Neural Logic API",
            desc: "Programmatic access to the Lab Assistant's underlying LLM-to-JSON models for bulk strategy generation.",
            icon: <Zap className="h-5 w-5 text-violet-400" />,
            color: "border-violet-400/20 bg-violet-400/5"
          },
          {
            title: "Managed Infrastructure",
            desc: "Deploy your strategies to our low-latency global edge network for 24/7 institutional-grade execution.",
            icon: <Shield className="h-5 w-5 text-red-400" />,
            color: "border-red-400/20 bg-red-400/5"
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
             Notify me on Deployment 
             <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
