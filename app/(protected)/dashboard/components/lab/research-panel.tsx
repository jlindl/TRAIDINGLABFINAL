"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Activity, 
  Newspaper, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  ChevronRight,
  Zap
} from "lucide-react";

export default function ResearchPanel() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden border-l border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="flex-1 p-4 px-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {/* Header Hook */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
           <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-neon" />
              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Neural Evidence</h3>
           </div>
           <span className="text-[8px] font-mono text-neon bg-neon/10 border border-neon/20 px-1.5 py-0.5 rounded leading-none uppercase">Live</span>
        </div>

        {/* Market Context Section */}
        <section>
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe className="h-3 w-3" /> Market Context
           </h4>
           
           <div className="space-y-3">
              <div className="rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-3.5 group hover:border-neon/30 transition-all shadow-lg">
                 <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-white tracking-tight">BTC / USDT</span>
                    <div className="flex items-center gap-1 text-neon italic text-[12px] font-bold">
                       <ArrowUpRight className="h-3 w-3" />
                       $64,120
                    </div>
                 </div>
                 <div className="text-[9px] text-white/20 font-mono tracking-tighter uppercase px-0.5">+2.41% REALTIME</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <div className="rounded-lg border border-white/5 bg-white/[0.01] p-2.5 text-center">
                    <div className="text-[8px] font-mono text-white/20 uppercase mb-0.5">Vol (24h)</div>
                    <div className="text-[11px] font-bold text-white/80">$42.1B</div>
                 </div>
                 <div className="rounded-lg border border-white/5 bg-white/[0.01] p-2.5 text-center">
                    <div className="text-[8px] font-mono text-white/20 uppercase mb-0.5">O.I.</div>
                    <div className="text-[11px] font-bold text-white/80">$14.8B</div>
                 </div>
              </div>
           </div>
        </section>

        {/* Technical Signals */}
        <section>
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="h-3 w-3" /> Technical Pulse
           </h4>
           <div className="space-y-2">
              {[
                { label: "RSI (14)", value: "64.2", status: "Neutral", color: "text-white/40" },
                { label: "MACD", value: "Bullish X", status: "Strong", color: "text-neon" },
                { label: "Bollinger", value: "Upper Test", status: "Warning", color: "text-red-400" },
              ].map((sig, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
                   <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-tighter">{sig.label}</span>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-white/90">{sig.value}</span>
                      <div className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${sig.color.replace('text-', 'border-').replace('white/40', 'white/10')} ${sig.color}`}>
                         {sig.status}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Global News Sentiment */}
        <section className="flex-1 min-h-0">
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Newspaper className="h-3 w-3" /> Intelligence
           </h4>
           <div className="space-y-3 overflow-y-auto pr-1">
              {[1, 2].map((i) => (
                <div key={i} className="p-3.5 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:from-white/[0.05] transition-all cursor-pointer group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-3 w-3 text-white/20" />
                   </div>
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-bold">SEC / MACRO</span>
                      <span className="text-[8px] text-white/20">4m ago</span>
                   </div>
                   <h5 className="text-[11px] font-medium text-white/70 group-hover:text-white transition-colors leading-relaxed line-clamp-2">
                      Institutional adoption accelerates as spot ETF flows hit record $1.2B weekly high...
                   </h5>
                   <div className="mt-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-tighter">
                           <span className="text-white/30">Sentiment Analysis</span>
                           <span className="text-neon">84% Positive</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "84%" }}
                              className="h-full bg-neon/50 shadow-[0_0_8px_rgba(0,255,136,0.3)]" 
                           />
                        </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Footer Branding */}
      <div className="p-4 bg-neon/10 border-t border-neon/30 flex items-start gap-3">
         <Info className="h-3.5 w-3.5 text-neon mt-0.5 flex-shrink-0" />
         <div>
            <p className="text-[9px] text-white/60 leading-relaxed font-medium">
               Terminal Feed active via <span className="text-white uppercase px-1 px-1 py-0.5 bg-white/5 rounded-sm border border-white/10 mx-0.5">AlphaVantage v2.1</span>.
            </p>
         </div>
      </div>
    </div>
  );
}
