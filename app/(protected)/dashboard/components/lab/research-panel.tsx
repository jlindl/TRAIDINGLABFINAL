"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Activity, 
  Newspaper, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  ChevronRight,
  Zap,
  Loader2
} from "lucide-react";

interface ResearchPanelProps {
  symbol?: string;
}

export default function ResearchPanel({ symbol: initialSymbol = "BTC" }: ResearchPanelProps) {
  const [activeSymbol, setActiveSymbol] = useState(initialSymbol);
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with prop if it changes
  useEffect(() => {
    setActiveSymbol(initialSymbol);
  }, [initialSymbol]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/market/news?symbol=${activeSymbol}`);
        if (!res.ok) throw new Error("Failed to load evidence");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeSymbol]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSymbol(searchInput.trim().toUpperCase());
      setSearchInput("");
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden border-l border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="flex-1 p-4 px-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {/* Header Hook */}
        <div className="flex flex-col gap-4 pb-2 border-b border-white/5">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Zap className="h-3.5 w-3.5 text-neon" />
                 <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Neural Evidence</h3>
              </div>
              <span className="text-[8px] font-mono text-neon bg-neon/10 border border-neon/20 px-1.5 py-0.5 rounded leading-none uppercase tracking-tighter">Live Feed</span>
           </div>

           {/* Manual Search */}
           <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search Market (current: ${activeSymbol})...`}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-1.5 pl-3 pr-8 text-[10px] font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-neon/40 focus:bg-white/[0.05] transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-neon transition-colors">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
           </form>
        </div>

        {/* Market Context Section */}
        <section>
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe className="h-3 w-3" /> Market Context
           </h4>
           
           <div className="space-y-3">
              <div className="rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-3.5 group hover:border-neon/30 transition-all shadow-lg">
                 <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-white tracking-tight">{activeSymbol} / USD</span>
                    <div className="flex items-center gap-1 text-neon italic text-[12px] font-bold">
                       <ArrowUpRight className="h-3 w-3" />
                       {data?.score !== undefined ? (data.score > 0 ? "Bullish" : "Bearish") : "Analyzing..."}
                    </div>
                 </div>
                 <div className="text-[9px] text-white/20 font-mono tracking-tighter uppercase px-0.5">
                    {data?.count || 0} RECENT REPORTS
                 </div>
              </div>
           </div>
        </section>

        {/* Technical Signals (Simplified for now) */}
        <section>
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="h-3 w-3" /> Sentiment Pulse
           </h4>
           <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                 <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Aggregated Sentiment</span>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/90">{data?.label || "Neutral"}</span>
                    <div className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${data?.score > 0.15 ? "text-neon border-neon/20" : "text-red-400 border-red-400/20"}`}>
                       {(Math.abs(data?.score || 0)).toFixed(2)}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global News Sentiment */}
        <section className="flex-1 min-h-0">
           <h4 className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Newspaper className="h-3 w-3" /> Intelligence
           </h4>
           
           {loading && (
             <div className="flex flex-col items-center justify-center py-10 gap-3">
               <Loader2 className="h-5 w-5 text-neon animate-spin" />
               <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">Synthesizing Reports...</p>
             </div>
           )}

           {error && (
             <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
               <p className="text-[10px] text-red-400 font-mono uppercase tracking-[0.2em] mb-1">
                 {error === "ALPHA_VANTAGE_RATE_LIMIT" ? "Rate Limit Exceeded" : 
                  error === "ALPHA_VANTAGE_INVALID_KEY" ? "Invalid API Key" : 
                  "Evidence Sync Failed"}
               </p>
               <p className="text-[8px] text-white/20 font-mono uppercase">
                 {error === "ALPHA_VANTAGE_RATE_LIMIT" ? "AlphaVantage Free Tier: 25 calls/day. Try again later." : 
                  error === "ALPHA_VANTAGE_INVALID_KEY" ? "Check your AlphaVantage key in Settings." : 
                  "Check your connection or API status."}
               </p>
             </div>
           )}

           <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
              {data?.feed?.map((item: any, i: number) => {
                const sentiment = item.ticker_sentiment.find((t: any) => t.ticker === activeSymbol);
                const score = sentiment ? parseFloat(sentiment.ticker_sentiment_score) : 0;
                const scorePct = Math.round(((score + 1) / 2) * 100);

                return (
                  <a 
                    key={i} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:from-white/[0.05] transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowUpRight className="h-3 w-3 text-white/20" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest font-bold">
                         {item.source}
                       </span>
                       <span className="text-[8px] text-white/20">
                         {new Date(item.time_published.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <h5 className="text-[11px] font-medium text-white/70 group-hover:text-white transition-colors leading-relaxed line-clamp-2">
                       {item.title}
                    </h5>
                    <div className="mt-3 flex flex-col gap-1.5">
                         <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-tighter">
                            <span className="text-white/30">Sentiment</span>
                            <span className={score >= 0 ? "text-neon" : "text-red-400"}>
                              {Math.round(score * 100)}% {score >= 0 ? "Positive" : "Negative"}
                            </span>
                         </div>
                         <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${scorePct}%` }}
                               className={`h-full ${score >= 0 ? "bg-neon/50" : "bg-red-500/50"} shadow-[0_0_8px_rgba(0,255,136,0.3)]`} 
                            />
                         </div>
                    </div>
                  </a>
                );
              })}
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
