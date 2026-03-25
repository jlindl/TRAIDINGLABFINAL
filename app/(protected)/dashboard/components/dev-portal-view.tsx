"use client";

import { motion } from "framer-motion";
import { Terminal, Rocket } from "lucide-react";
import Link from "next/link";

export default function DevPortalView() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-edge relative max-w-xl p-12 bg-white/[0.01] border-white/5 overflow-hidden group"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-neon/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-neon/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-neon/10 text-neon border border-neon/20 mx-auto shadow-[0_0_30px_rgba(0,255,136,0.1)]">
            <Terminal className="h-10 w-10 animate-pulse" />
          </div>
          
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-neon/60 mb-4 block">Developer Infrastructure Pending</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">Quant API Gateway</h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-md mx-auto mb-10">
            The developer portal and REST/WebSocket API endpoints are currently in alpha testing. Scheduled for integration in **Phase 2: Alpha Expansion**.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/#roadmap" 
              className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 hover:border-neon/30 text-white font-black uppercase text-[10px] tracking-widest transition-all group/btn"
            >
              <Rocket className="h-3.5 w-3.5 group-hover:text-neon transition-colors" />
              View Roadmap
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
