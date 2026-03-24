"use client";

import { useState } from "react";
import { 
  Code2, 
  Settings2, 
  Play, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StrategyImporterProps {
  onImport: (strategy: any) => void;
  onClose: () => void;
}

export default function StrategyImporter({ onImport, onClose }: StrategyImporterProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("pinescript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/backtest/translate", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) throw new Error("Translation service unavailable");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
        }
      }

      // Clean up potential markdown formatting if AI ignored instructions
      const cleaned = result.replace(/```json/g, "").replace(/```/g, "").trim();
      const strategyJson = JSON.parse(cleaned);

      if (Object.keys(strategyJson).length === 0) {
        throw new Error("Could not extract valid logic. Please check the source code.");
      }

      onImport(strategyJson);
    } catch (err: any) {
      setError(err.message || "Failed to translate strategy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
    >
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neon/10 border border-neon/20">
              <Code2 className="h-5 w-5 text-neon" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Cross-Language Compiler</h3>
              <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-0.5">Translate foreign Source to Native Lab Logic</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <Settings2 className="h-5 w-5 rotate-45" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Source Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon focus:outline-none transition-all cursor-pointer"
                >
                  <option value="pinescript">PineScript (TradingView)</option>
                  <option value="python">Python (Pandas/Backtrader)</option>
                  <option value="mql4">MQL4/MQL5 (MetaTrader)</option>
                  <option value="csharp">C# (NinjaTrader)</option>
                  <option value="auto">Auto-Detect Logic</option>
                </select>
             </div>
             <div className="flex items-end pb-1">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Terminal className="h-4 w-4" />
                  <span className="text-xs font-medium">Native V8 Engine Ready</span>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Paste Strategy Code</label>
            <div className="relative group">
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Enter your code here..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-sm font-mono text-neon/80 focus:border-neon focus:outline-none transition-all h-[300px] custom-scrollbar resize-none group-hover:border-white/20"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/20 font-mono">UTF-8</div>
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4 text-[10px] text-white/20">
               <div className="flex items-center gap-1.5 font-medium italic">
                  <Cpu className="h-3 w-3" />
                  AI-Assisted Compilation
               </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={handleTranslate}
                disabled={loading || !code.trim()}
                className="px-8 py-2.5 rounded-xl bg-neon text-black font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 group"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current group-hover:translate-x-0.5 transition-transform" />}
                {loading ? "COMPILING..." : "TRANSLATE & IMPORT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
