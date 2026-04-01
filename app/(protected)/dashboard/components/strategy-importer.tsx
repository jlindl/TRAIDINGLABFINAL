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
  Cpu,
  X,
  ChevronDown,
  ChevronLeft,
  FileCode,
  Zap
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
  const [reviewJson, setReviewJson] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { value: "pinescript", label: "PineScript (TradingView)" },
    { value: "python", label: "Python (Pandas/Backtrader)" },
    { value: "mql4", label: "MQL4/MQL5 (MetaTrader)" },
    { value: "csharp", label: "C# (NinjaTrader)" },
    { value: "auto", label: "Auto-Detect Logic" },
  ];

  const handleTranslate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const translateRes = await fetch("/api/backtest/translate", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });

      if (!translateRes.ok) throw new Error("Translation service failed");

      const rawResult = await translateRes.text();
      
      // Robust Sanitization
      let cleaned = rawResult;
      // Remove any markdown code blocks
      cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      // Remove any trailing/leading non-JSON text the AI might have added
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const strategyJson = JSON.parse(cleaned);

      if (!strategyJson || Object.keys(strategyJson).length === 0) {
        throw new Error("Could not extract valid logic. Please check the source code.");
      }

      setReviewJson(strategyJson);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to translate strategy. The code might be too complex or obfuscated.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeImport = () => {
    onImport(reviewJson);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Zap className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Cross-Language Compiler</h3>
              <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-0.5">Translate Legacy Source to Native Lab Logic</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!reviewJson ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Source Language</label>
                      
                      {/* Custom Modern Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-pointer group"
                        >
                          <span className="flex items-center gap-2">
                             <FileCode className="h-4 w-4 text-orange-500" />
                             {languages.find(l => l.value === language)?.label}
                          </span>
                          <ChevronDown className={`h-4 w-4 text-white/20 group-hover:text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                              >
                                {languages.map((lang) => (
                                  <button
                                    key={lang.value}
                                    type="button"
                                    onClick={() => {
                                      setLanguage(lang.value);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-white flex items-center justify-between ${
                                      language === lang.value ? 'bg-white/5 text-orange-500 font-medium' : 'text-white/60'
                                    }`}
                                  >
                                    {lang.label}
                                    {language === lang.value && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>
                   <div className="flex items-end pb-1 px-4 hidden sm:flex">
                      <div className="flex items-center gap-3 text-xs text-white/30 italic">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        Ready to process legacy scripts...
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Paste Strategy Source</label>
                  <div className="relative group">
                    <textarea 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="// e.g. input(14, 'RSI ...')\n// buy = crossover(rsi, 30)"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-sm font-mono text-white/90 focus:border-orange-500/50 focus:outline-none transition-all h-[320px] custom-scrollbar resize-none group-hover:border-white/20"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/20 font-mono">SOURCE_BUFFER</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between px-1">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                        <Terminal className="h-4 w-4 text-orange-500" />
                        COMPILED_STRATEGY.json
                      </h4>
                      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-mono">Verify logic extraction before deployment</p>
                    </div>
                    <button 
                       onClick={() => setReviewJson(null)}
                       className="text-[10px] font-bold text-orange-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      Edit Source
                    </button>
                 </div>

                 <div className="relative group">
                    <textarea 
                      value={JSON.stringify(reviewJson, null, 2)}
                      onChange={(e) => {
                        try {
                          setReviewJson(JSON.parse(e.target.value));
                        } catch(err) {} 
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-xs font-mono text-white/80 focus:border-orange-500/50 focus:outline-none transition-all h-[360px] custom-scrollbar resize-none group-hover:border-white/20"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/5 transition-all text-[10px] text-white/10 font-mono p-4 flex justify-end items-start">
                      JSON_VERIFIED
                    </div>
                 </div>

                 <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-orange-500/80">
                    <p className="text-xs font-medium leading-relaxed">
                      <span className="font-bold">PRO TIP:</span> AI translation is highly accurate but may occasionally misinterpret complex nested functions. Please verify the logic operators and indicator metrics above.
                    </p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </motion.div>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3 justify-end items-center">
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold"
              >
                CANCEL
              </button>
              
              {!reviewJson ? (
                <button
                  onClick={handleTranslate}
                  disabled={loading || !code.trim()}
                  className="px-8 py-2.5 rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 group relative overflow-hidden transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Play className="h-3 w-3 fill-current group-hover:translate-x-0.5 transition-transform" />}
                  {loading ? "COMPILING..." : "TRANSLATE & IMPORT"}
                </button>
              ) : (
                <button
                  onClick={finalizeImport}
                  className="px-8 py-2.5 rounded-full bg-white text-black font-bold text-xs shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  FINALIZE IMPORT
                </button>
              )}
        </div>
      </motion.div>
    </motion.div>
  );
}
