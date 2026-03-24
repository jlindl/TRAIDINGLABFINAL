"use client";

import { MessageSquare, Copy, Sparkles, TrendingUp, Shield, Zap, Target } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const templates = [
  {
    title: "SMC Price Action Strategy",
    description: "Detects institutional order blocks and fair value gaps for high-probability entries.",
    prompt: "Create a 5-minute scalping strategy that enters long when a Bullish Order Block (OB) forms and there is a Bullish Fair Value Gap (FVG) present. Use a 2:1 Reward-to-Risk ratio with a 0.5% Stop Loss.",
    icon: Shield,
    color: "text-neon",
    bg: "bg-neon/10"
  },
  {
    title: "Triple Exponential Trend Following",
    description: "Uses TEMA and ADX to jump onto strong momentum moves during the NY Session.",
    prompt: "I want a trend-following strategy using TEMA(9) and ADX(14). Enter during the New York Session (hour 13 to 19) when close is above TEMA and ADX is above 25. Include a 1% Trailing Stop Loss.",
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "Mean Reversion with Bollinger Bands",
    description: "Fades overextended moves when volatility hits extreme levels.",
    prompt: "Build a mean reversion strategy. Buy when price closes below the Lower Bollinger Band and RSI(14) is oversold (< 30). Move stop to break-even once we hit 2% profit.",
    icon: Target,
    color: "text-violet-400",
    bg: "bg-violet-400/10"
  },
  {
    title: "Vortex & SuperTrend Breakout",
    description: "Combines volatility and trend detection for explosive volatility breakouts.",
    prompt: "Generate a breakout strategy using SuperTrend and the Vortex Indicator. Enter when SuperTrend flips bullish (Direction == 1) and Vortex Plus crosses above Vortex Minus. Use a 3% Break-even trigger.",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  }
];

export default function PromptingGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl bg-gradient-to-br from-neon/10 via-transparent to-transparent border border-neon/20">
         <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-neon flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
               <Sparkles className="h-5 w-5 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">AI Lab Best Practices</h3>
         </div>
         <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            The Lab Assistant understands technical Greek, SMC, and AST logic. To get the highest quality JSON Strategy Contracts, be specific about your **Entry Logic**, **Session Times**, and **Risk Management**.
         </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         {templates.map((template, i) => (
           <div key={i} className="glass-edge p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col justify-between group">
              <div>
                 <div className={`h-12 w-12 rounded-2xl ${template.bg} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                    <template.icon className={`h-6 w-6 ${template.color}`} />
                 </div>
                 <h4 className="font-bold text-white text-lg">{template.title}</h4>
                 <p className="text-xs text-white/40 leading-relaxed mt-2">{template.description}</p>
                 
                 <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 relative group/prompt">
                    <p className="text-[11px] text-white/50 italic leading-relaxed pr-8">
                       "{template.prompt}"
                    </p>
                    <button 
                       onClick={() => copyToClipboard(template.prompt, i)}
                       className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon hover:text-black transition-all"
                    >
                       {copiedIndex === i ? (
                          <span className="text-[8px] font-bold">SAVED</span>
                       ) : (
                          <Copy className="h-3.5 w-3.5" />
                       )}
                    </button>
                 </div>
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                 <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Optimized for Ultima Engine</span>
              </div>
           </div>
         ))}
      </div>

      <div className="glass-edge p-8 bg-white/[0.01] border-dashed border-white/10 mt-10">
         <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-neon" />
            Prompting Pro-Tips
         </h4>
         <ul className="grid gap-3 sm:grid-cols-2">
            {[
               "Always mention the specific indicator period (e.g. RSI 14).",
               "Define session times using UTC (e.g. NY Session).",
               "Specify risk parameters (e.g. 1% TSL).",
               "Mention SMC concepts by name for structural strategies.",
               "Ask the AI to explain the logic before generating the JSON.",
               "Request recursive logic like (A OR B) AND C for complex setups."
            ].map((tip, i) => (
               <li key={i} className="text-xs text-white/40 flex items-center gap-3">
                  <span className="text-neon font-mono font-bold">/</span>
                  {tip}
               </li>
            ))}
         </ul>
      </div>
    </div>
  );
}
