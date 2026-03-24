"use client";

import { useState } from "react";
import { Search, Info, Code, Zap, Clock, ShieldCheck, Layers } from "lucide-react";
import { SUPPORTED_INDICATORS, CONTEXT_VARIABLES, RISK_PARAMETERS, IndicatorDefinition } from "@/lib/backtest/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function BacktestingGuide() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "SMC", "Trend", "Momentum", "Volatility", "Price Action", "Volume"];

  const filteredIndicators = SUPPORTED_INDICATORS.filter(ind => {
    const matchesSearch = ind.name.toLowerCase().includes(search.toLowerCase()) || ind.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || ind.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-neon text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-neon transition-all" />
          <input
            type="text"
            placeholder="Search indicators (e.g. RSI, FVG)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon transition-all"
          />
        </div>
      </div>

      {/* Indicator Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredIndicators.map((ind) => (
            <motion.div
              layout
              key={ind.code}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-edge p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-neon/60 uppercase tracking-widest">{ind.category}</span>
                  <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <Code className="h-3 w-3 text-white/20" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-lg group-hover:text-neon transition-colors">{ind.name}</h4>
                <p className="text-xs text-white/40 leading-relaxed mt-2">{ind.description}</p>
                
                {Object.keys(ind.params).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Parameters</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(ind.params).map(([key, val]) => (
                        <div key={key} className="px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1.5">
                          <span className="text-[10px] text-white/60 font-mono">{key}:</span>
                          <span className="text-[10px] text-neon/80 font-bold">{val.default}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                       <span className="text-[8px] uppercase text-white/20 font-bold">Series Code</span>
                       <span className="text-[10px] font-mono text-white/80">{ind.code}</span>
                    </div>
                 </div>
                 <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="h-4 w-4 text-neon" />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Supplemental Context Section */}
      <div className="grid gap-6 md:grid-cols-2 pt-10 border-t border-white/5">
         {/* Built-in Context Variables */}
         <div className="glass-edge p-8 bg-blue-500/[0.02]">
            <div className="flex items-center gap-3 mb-6">
               <Clock className="h-5 w-5 text-blue-400" />
               <h3 className="font-bold text-white uppercase tracking-widest text-sm">Time & Context Variables</h3>
            </div>
            <div className="grid gap-3">
               {CONTEXT_VARIABLES.map((v) => (
                 <div key={v.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-400/20 transition-all group">
                    <div>
                       <code className="text-xs font-bold text-blue-400 group-hover:text-blue-300">{v.name}</code>
                       <p className="text-[10px] text-white/40 mt-0.5">{v.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Risk & Execution Parameters */}
         <div className="glass-edge p-8 bg-neon/[0.02]">
            <div className="flex items-center gap-3 mb-6">
               <ShieldCheck className="h-5 w-5 text-neon" />
               <h3 className="font-bold text-white uppercase tracking-widest text-sm">Portfolio Risk Controls</h3>
            </div>
            <div className="grid gap-3">
               {RISK_PARAMETERS.map((p) => (
                 <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-neon/20 transition-all group">
                    <div>
                       <code className="text-xs font-bold text-neon group-hover:text-neon-dim">{p.name}</code>
                       <p className="text-[10px] text-white/40 mt-0.5">{p.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
      
      {/* Logical Rules Callout */}
      <div className="glass-edge p-8 bg-white/[0.01] border-dashed border-white/10">
         <div className="flex items-start gap-4">
            <Layers className="h-6 w-6 text-neon mt-1" />
            <div>
               <h3 className="text-white font-bold">The Syntax of Logic</h3>
               <p className="text-sm text-white/40 mt-1 max-w-2xl leading-relaxed">
                 You can combine any of the indicators above using technical logical operators. 
                 The engine uses a strict AST recursive evaluator:
               </p>
               <div className="flex flex-wrap gap-4 mt-6">
                  {["AND", "OR", "NOT", ">", "<", "==", "!=", "( ... )"].map(op => (
                    <div key={op} className="px-3 py-1.5 rounded-lg bg-white/5 font-mono text-xs text-neon border border-neon/20">
                      {op}
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-white/60">
                  <span className="text-neon/60">// Example: Buy on SMC breakout with ADX strength</span><br/>
                  <span className="text-white">close {">"} PIVOT_R1 AND OB_1 == 1 AND ADX_14 {">"} 25</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
