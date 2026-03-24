"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, MessageSquare, PlayCircle, FileText, ChevronRight, Zap, Target, ArrowLeft } from "lucide-react";
import { useState } from "react";
import BacktestingGuide from "./help/backtesting-guide";
import PromptingGuide from "./help/prompting-guide";

const articles = [
  { title: "Guide: Deploying your Strategy to a Live Broker", category: "Deployment", time: "4 min" },
  { title: "Guide: Writing your first Mean Reversion Bot", category: "Basics", time: "5 min" },
  { title: "Advanced Monte Carlo Optimization", category: "Quantitative", time: "12 min" },
  { title: "Configuring Webhooks for Private Servers", category: "Infrastructure", time: "8 min" },
];

export default function HelpView() {
  const [activeTab, setActiveTab] = useState<"main" | "backtesting" | "prompting">("main");

  if (activeTab === "backtesting") {
    return (
      <div className="space-y-8 pb-10">
        <button 
          onClick={() => setActiveTab("main")}
          className="flex items-center gap-2 text-white/40 hover:text-neon transition-colors group mb-4"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Help Center</span>
        </button>
        <div className="max-w-4xl">
           <h2 className="text-3xl font-bold text-white mb-2">Backtesting Engine Manual</h2>
           <p className="text-sm text-white/40 mb-10 leading-relaxed">
             Full technical specification of the TRADINGLAB Ultima engine. Explore 30+ native indicators, SMC structures, and institutional risk parameters.
           </p>
           <BacktestingGuide />
        </div>
      </div>
    );
  }

  if (activeTab === "prompting") {
    return (
      <div className="space-y-8 pb-10">
        <button 
          onClick={() => setActiveTab("main")}
          className="flex items-center gap-2 text-white/40 hover:text-neon transition-colors group mb-4"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Help Center</span>
        </button>
        <div className="max-w-4xl">
           <h2 className="text-3xl font-bold text-white mb-2">Lab Assistant Prompting Guide</h2>
           <p className="text-sm text-white/40 mb-10 leading-relaxed">
             Master the art of AI quantitative research. Learn how to trigger the highest-fidelity Strategy Contracts using specific engineering keywords.
           </p>
           <PromptingGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-white">How can we help?</h2>
        <p className="text-sm text-white/40 mt-1">Search our knowledge base or contact a support engineer.</p>
        <div className="mt-8 relative group">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 group-focus-within:text-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search documentation, tutorials, or FAQs..." 
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-16 py-5 text-sm text-white focus:border-neon focus:outline-none transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
           <div className="grid gap-6 md:grid-cols-2">
              <div 
                onClick={() => setActiveTab("backtesting")}
                className="glass-edge p-8 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                 <div className="h-12 w-12 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Book className="h-6 w-6 text-neon" />
                 </div>
                 <h3 className="font-bold text-white text-lg">Backtesting Engine Manual</h3>
                 <p className="text-sm text-white/40 mt-2 leading-relaxed">
                   Comprehensive guide on 30+ indicators, SMC logic, and institutional risk parameters.
                 </p>
                 <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-neon opacity-0 group-hover:opacity-100 transition-opacity">
                    EXPAND DOCUMENTATION <ChevronRight className="h-3 w-3" />
                 </div>
              </div>
              <div 
                onClick={() => setActiveTab("prompting")}
                className="glass-edge p-8 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                 <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-violet-400" />
                 </div>
                 <h3 className="font-bold text-white text-lg">Lab Assistant Pro-Tips</h3>
                 <p className="text-sm text-white/40 mt-2 leading-relaxed">
                   Master prompting to generate high-fidelity Strategy Contracts and SMC setups.
                 </p>
                 <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    OPEN PROMPTING GUIDE <ChevronRight className="h-3 w-3" />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <FileText className="h-4 w-4 text-white/20" />
                 Popular Articles
              </h3>
              <div className="grid gap-4">
                 {articles.map((article, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="glass-edge p-5 flex items-center justify-between group cursor-pointer bg-white/[0.01] hover:bg-white/[0.03]"
                    >
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-neon/60 uppercase tracking-widest">{article.category}</span>
                          <h4 className="font-bold text-white group-hover:text-neon transition-colors">{article.title}</h4>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] font-mono text-white/20">{article.time}</span>
                          <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-neon transition-all" />
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

            <div className="glass-edge p-8 bg-white/[0.01] mt-10">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Zap className="h-4 w-4 text-neon" />
                 Live Deployment Flow (Step-by-Step)
              </h3>
              <div className="grid gap-6">
                 {[
                   { step: "01", title: "Save Strategy", desc: "Build and backtest your logic, then click 'Save Strategy' to add it to your permanent library." },
                   { step: "02", title: "Affiliate Select", desc: "Go to the Deployment tab and sign up with one of our elite partners (Bybit, OKX, Alpaca, etc.) via our link." },
                   { step: "03", title: "Link UID", desc: "Enter your Broker UID in the 'Initiate Deployment' form to verify your affiliate status." },
                   { step: "04", title: "Unlock Export", desc: "Select your strategy and click 'Unlock'. This registers your request for a live-ready script." },
                   { step: "05", title: "Download Bot", desc: "Find your strategy in the 'Manage Exports' table and click 'Get Script' to download the Python bot." },
                   { step: "06", title: "Run Locally", desc: "Run the script on your machine or VPS using CCXT. You manage your own API keys for total security." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className="text-neon font-mono text-xs font-bold pt-1">{item.step}</div>
                      <div>
                         <h4 className="text-white font-bold text-sm group-hover:text-neon transition-colors">{item.title}</h4>
                         <p className="text-xs text-white/40 leading-relaxed mt-1">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
         </div>

        <div className="space-y-6">
           <div className="glass-edge p-8 bg-neon/5 border-neon/20">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                 <MessageSquare className="h-4 w-4 text-neon" />
                 Live Support
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                 Can't find what you need? Talk to our Expert Support team.
              </p>
              <button className="w-full rounded-xl bg-neon py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:bg-neon-dim transition-all active:scale-95">
                 Start Live Chat
              </button>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                 <span className="text-[10px] font-mono text-neon/80 uppercase">5 min wait time</span>
              </div>
           </div>

           <div className="glass-edge p-8 bg-white/[0.01]">
              <Zap className="h-6 w-6 text-violet-400 mb-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Quant Expert Slack</h3>
              <p className="text-[10px] text-white/40 leading-relaxed mb-6">
                 Join our private community of institutional traders and quant developers.
              </p>
              <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-bold text-white hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]">
                 Request Access
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
