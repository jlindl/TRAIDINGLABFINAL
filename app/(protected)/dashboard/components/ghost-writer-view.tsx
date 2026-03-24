"use client";

import { motion } from "framer-motion";
import { Send, Wand2, Terminal, Code2, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function GhostWriterView() {
  const [prompt, setPrompt] = useState("");

  const mockCode = `// TraidingLab AI v1.4 - Generated Mean Reversion Strategy
import { Strategy, Order } from "@traidinglab/engine";

export default class MeanReversionBTC extends Strategy {
  private sma = this.indicator("sma", { length: 20 });
  private std = this.indicator("std", { length: 20 });
  
  async next(candle: Candle) {
    const basis = await this.sma.getValue();
    const dev = 2 * (await this.std.getValue());
    const upper = basis + dev;
    const lower = basis - dev;
    
    if (candle.close < lower) {
      return this.buy({ type: "MARKET", amount: 0.1 });
    }
    
    if (candle.close > upper) {
      return this.sell({ type: "MARKET", amount: 0.1 });
    }
  }
}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 pb-10 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-400 uppercase tracking-[0.2em] mb-4"
        >
          <Sparkles className="h-3 w-3 animate-pulse" />
          Neural Synthesis: Offline
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold text-white tracking-tighter"
        >
          Ghost Writer <span className="text-white/20">Coming Soon.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed"
        >
          We are training our most advanced neural models for quantitative code generation. 
          Soon, the Ghost Writer will translate your complex trading ideas into production-ready logic.
        </motion.p>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full px-4">
        {[
          {
            title: "Natural Language Compiler",
            desc: "Convert your trading ideas into PineScript, MQL, or Python instantly using our custom-tuned LLMs.",
            icon: <Code2 className="h-5 w-5 text-neon" />,
            color: "border-neon/20 bg-neon/5"
          },
          {
            title: "Multi-Strategy Merging",
            desc: "Seamlessly combine disparate strategy components and indicators into a single, unified execution script.",
            icon: <Ghost className="h-5 w-5 text-blue-400" />,
            color: "border-blue-400/20 bg-blue-400/5"
          },
          {
            title: "Logic Optimization AI",
            desc: "The Ghost Writer analyzes your code to identify latency bottlenecks and redundant math, refactoring for performance.",
            icon: <Terminal className="h-5 w-5 text-violet-400" />,
            color: "border-violet-400/20 bg-violet-400/5"
          },
          {
            title: "Institutional Auditing",
            desc: "Real-time security auditing to detect logic flaws, look-ahead bias, and high-risk order execution patterns.",
            icon: <AlertCircle className="h-5 w-5 text-red-400" />,
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
             Register for Alpha Access
             <Send className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Ghost({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
