"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Minimize2, Upload, Terminal, BarChart3, Save, Check, Code2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseCSVData, fetchAlphaVantageData } from "@/lib/backtest/data-loader";
import { createClient } from "@/lib/supabase/client";
import StrategyImporter from "./strategy-importer";

const DEFAULT_STRATEGY = `{
  "setup": {
    "indicators": {
      "SMA_50": { "type": "SMA", "period": 50 },
      "SMA_200": { "type": "SMA", "period": 200 }
    }
  },
  "entry": {
    "logic": "SMA_50 > SMA_200"
  },
  "exit": {
    "logic": "SMA_50 < SMA_200",
    "tpPct": 0.05,
    "slPct": 0.02
  }
}`;

interface BacktestingViewProps {
  initialStrategy?: any;
  onClearInitial?: () => void;
}

export default function BacktestingView({ initialStrategy, onClearInitial }: BacktestingViewProps) {
  const [symbol, setSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1D");
  const [strategyJson, setStrategyJson] = useState(DEFAULT_STRATEGY);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("settings")
        .eq("id", user.id)
        .single();

      if (profile?.settings?.backtesting_defaults) {
        const defaults = profile.settings.backtesting_defaults;
        // Update default TP/SL if user has preferences
        const baseStrategy = JSON.parse(DEFAULT_STRATEGY);
        if (defaults.risk) {
          baseStrategy.exit.tpPct = defaults.risk.tpPct || baseStrategy.exit.tpPct;
          baseStrategy.exit.slPct = defaults.risk.slPct || baseStrategy.exit.slPct;
        }
        
        // If not loading an initial strategy, set the customized default
        if (!initialStrategy) {
          setStrategyJson(JSON.stringify(baseStrategy, null, 2));
        }
      }
    };

    fetchUserSettings();

    if (initialStrategy) {
      if (initialStrategy.strategy_json) {
        // Payload from Database (SavedStrategiesView)
        setStrategyJson(JSON.stringify(initialStrategy.strategy_json, null, 2));
      } else if (initialStrategy.logic) {
        // Payload from AI SDK (LabAssistantView)
        // Check if user has risk defaults
        const formattedJson = {
          setup: {
            indicators: initialStrategy.parameters || {}
          },
          entry: {
            logic: initialStrategy.logic
          },
          exit: {
            logic: `NOT (${initialStrategy.logic})`, // Adaptive inverse exit
            tpPct: initialStrategy.tpPct || 0.05,
            slPct: initialStrategy.slPct || 0.02
          }
        };
        setStrategyJson(JSON.stringify(formattedJson, null, 2));
        if (initialStrategy.symbol) setSymbol(initialStrategy.symbol);
        if (initialStrategy.timeframe) setTimeframe(initialStrategy.timeframe);
        if (initialStrategy.name) setStrategyName(initialStrategy.name);
      }
      
      setResults(null); // Reset current results when loading new strategy
      setError(null);
      onClearInitial?.();
    }
  }, [initialStrategy, onClearInitial]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [strategyName, setStrategyName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  // Handle Strategy Import from Code
  const handleImportStrategy = (json: any) => {
    setStrategyJson(JSON.stringify(json, null, 2));
    setResults(null);
    setError(null);
    setShowImporter(false);
  };

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL("@/lib/backtest/engine.worker.ts", import.meta.url));
    
    workerRef.current.onmessage = (e) => {
      if (e.data.status === 'success') {
        setResults(e.data.results);
      } else {
        setError(e.data.error || "Simulation failed");
      }
      setIsRunning(false);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleRunTest = async () => {
    try {
      setError(null);
      setIsRunning(true);
      setResults(null);

      const parsedStrategy = JSON.parse(strategyJson);
      
      // 1. Fetch Primary Data
      let data = [];
      if (csvFile) {
        data = await parseCSVData(csvFile);
      } else {
        data = await fetchAlphaVantageData(symbol, timeframe);
      }

      // 2. Detect and Fetch HTF Dependencies
      const htfTimeframes = new Set<string>();
      if (parsedStrategy.setup?.indicators) {
        Object.values(parsedStrategy.setup.indicators).forEach((ind: any) => {
          if (ind.timeframe && ind.timeframe !== timeframe) {
            htfTimeframes.add(ind.timeframe);
          }
        });
      }

      const htfData: Record<string, any> = {};
      await Promise.all(
        Array.from(htfTimeframes).map(async (tf) => {
          const result = await fetchAlphaVantageData(symbol, tf);
          htfData[tf] = result;
        })
      );

      const params = {
        initialCapital: 100000,
        commission: 0.001,
        slippageBps: 5,
        positionSizing: 1.0
      };

      workerRef.current?.postMessage({
        id: Date.now(),
        data,
        strategy: parsedStrategy,
        params,
        htfData
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during the simulation.");
      setIsRunning(false);
    }
  };

  const handleSaveStrategy = async () => {
    if (!strategyName.trim()) {
      setError("Please enter a name for your strategy.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: strategyName,
          strategy_json: JSON.parse(strategyJson),
          performance_snapshot: results ? {
             totalReturn: (results.finalEquity - 10000) / 10000, // Assuming 10k initial for snapshot
             winRate: results.winRate
          } : {}
        })
      });

      if (!res.ok) throw new Error("Failed to save strategy");

      setSaveSuccess(true);
      setShowSaveInput(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save strategy");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 flex flex-col h-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Backtesting Engine</h2>
          <p className="text-sm text-white/40">Validate JSON strategies against high-fidelity Intrabar data.</p>
        </div>
        <div className="flex items-center gap-4">
           {error && (
               <div className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded border border-red-500/20 max-w-[200px] truncate">
                   {error}
               </div>
           )}

           {showSaveInput ? (
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 animate-in fade-in slide-in-from-right-4">
               <input 
                 type="text"
                 placeholder="Strategy Name..."
                 className="bg-transparent border-none text-xs text-white focus:outline-none w-32"
                 value={strategyName}
                 onChange={(e) => setStrategyName(e.target.value)}
                 autoFocus
               />
               <button 
                 onClick={handleSaveStrategy}
                 disabled={isSaving}
                 className="p-1 hover:bg-white/10 rounded-full text-neon disabled:opacity-50"
                 title="Confirm Save"
               >
                 {isSaving ? (
                    <div className="h-3 w-3 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                 ) : (
                    <Check className="h-4 w-4" />
                 )}
               </button>
               <button 
                 onClick={() => setShowSaveInput(false)}
                 className="p-1 hover:bg-white/10 rounded-full text-white/40"
                 title="Cancel"
               >
                 <Minimize2 className="h-4 w-4 rotate-45" />
               </button>
             </div>
           ) : (
             <button 
               onClick={() => setShowSaveInput(true)}
               disabled={!results}
               className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                 saveSuccess 
                   ? "bg-green-500/20 border border-green-500/50 text-green-400" 
                   : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
               }`}
             >
               {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
               <span>{saveSuccess ? "Saved!" : "Save Strategy"}</span>
             </button>
           )}

           <button 
             onClick={() => setShowImporter(true)}
             className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
           >
             <Code2 className="h-4 w-4" />
             <span>Import Code</span>
           </button>

           <button 
             onClick={handleRunTest}
             disabled={isRunning}
             className="rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:bg-neon-dim transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
           >
             <Play className="h-4 w-4 fill-current" />
             {isRunning ? "Simulating..." : "Run Backtest"}
           </button>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main Chart Area */}
        <div className="space-y-6 min-h-[600px] flex flex-col">
           <div className="flex-1 glass-edge p-8 bg-[#0c0c0c] border border-white/5 relative group overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <h3 className="font-bold text-white tracking-widest uppercase text-xs">Equity Curve</h3>
                    {results && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-neon/5 border border-neon/20 text-[9px] font-bold text-neon uppercase">
                            FINAL EQUITY: ${results.finalEquity.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                    )}
                 </div>
                 <Minimize2 className="h-4 w-4 text-white/20 hover:text-white cursor-pointer" />
              </div>
              
              <div className="flex-1 relative border border-white/10 mt-4 rounded-xl overflow-hidden bg-black/40 p-4 min-h-[400px]">
                 {results ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.equityCurve}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="timestamp" 
                            stroke="rgba(255,255,255,0.2)"
                            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                            tick={{fontSize: 10}}
                          />
                          <YAxis 
                            domain={['dataMin', 'dataMax']} 
                            stroke="rgba(255,255,255,0.2)"
                            tickFormatter={(tick) => '$' + tick.toLocaleString()}
                            tick={{fontSize: 10}}
                          />
                          <Tooltip 
                              contentStyle={{backgroundColor: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
                              labelFormatter={(label) => new Date(label).toLocaleString()}
                              formatter={(value: any) => ['$' + Number(value).toLocaleString(undefined, {minimumFractionDigits: 2}), 'Equity']}
                          />
                          <Line 
                              type="monotone" 
                              dataKey="equity" 
                              stroke="#00ff88" 
                              strokeWidth={2} 
                              dot={false}
                              activeDot={{ r: 6, fill: '#00ff88', stroke: '#000', strokeWidth: 2 }}
                          />
                        </LineChart>
                     </ResponsiveContainer>
                 ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-mono flex-col gap-4">
                         <BarChart3 className="h-12 w-12 opacity-50" />
                         <span>Awaiting Simulation...</span>
                     </div>
                 )}
              </div>
           </div>
           
           <div className="grid gap-6 md:grid-cols-4">
              {[
                { label: "Total Trades", value: results?.totalTrades || "-", color: "text-white" },
                { label: "Win Rate", value: results ? (results.winRate * 100).toFixed(1) + "%" : "-", color: "text-white/60" },
                { label: "Max Drawdown", value: results ? (results.mdd * 100).toFixed(2) + "%" : "-", color: "text-red-500" },
                { label: "Final Capital", value: results ? "$" + results.finalEquity.toLocaleString(undefined, {maximumFractionDigits:0}) : "-", color: "text-neon" }
              ].map((stat, i) => (
                <div key={i} className="glass-edge p-6 bg-white/[0.01]">
                   <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{stat.label}</span>
                   <div className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
           </div>
           
           {/* Trade Log Table */}
           {results && results.trades && results.trades.length > 0 && (
              <div className="glass-edge p-6 bg-[#0c0c0c] border border-white/5 overflow-x-auto">
                 <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Trade Log</h3>
                 <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="text-white/40 border-b border-white/10 uppercase font-mono text-[10px]">
                       <tr>
                          <th className="pb-3 pr-4">Time</th>
                          <th className="pb-3 pr-4">Type</th>
                          <th className="pb-3 pr-4 text-right">Price</th>
                          <th className="pb-3 pr-4 text-right">Size</th>
                          <th className="pb-3 text-right">Realized PnL</th>
                       </tr>
                    </thead>
                    <tbody className="text-white/80 font-mono">
                       {results.trades.map((trade: any, i: number) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                             <td className="py-2 pr-4">{new Date(trade.timestamp).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                             <td className={`py-2 pr-4 font-bold ${trade.type === 'BUY' ? 'text-neon' : 'text-red-400'}`}>{trade.type}</td>
                             <td className="py-2 pr-4 text-right">${trade.price.toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                             <td className="py-2 pr-4 text-right">{trade.size.toLocaleString(undefined, {maximumFractionDigits:4})}</td>
                             <td className={`py-2 text-right ${trade.pnl && trade.pnl > 0 ? 'text-neon' : trade.pnl && trade.pnl < 0 ? 'text-red-400' : 'text-white/40'}`}>
                                {trade.pnl ? (trade.pnl > 0 ? '+' : '') + '$' + trade.pnl.toLocaleString(undefined, {minimumFractionDigits:2}) : '-'}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6 flex flex-col">
            {/* Input Data source */}
           <div className="glass-edge p-6">
              <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Upload className="h-4 w-4 text-neon" /> Data Source
              </h3>
              
              <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] text-white/40 uppercase">Ticker Symbol</span>
                     <input 
                        type="text" 
                        value={symbol}
                        onChange={e => setSymbol(e.target.value)}
                        placeholder="BTC, AAPL..."
                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon/50"
                     />
                  </div>
                  
                  <div className="relative pt-2">
                     <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-white/10" />
                     </div>
                     <div className="relative flex justify-center">
                        <span className="bg-[#0c0c0c] px-2 text-[10px] text-white/40 uppercase">OR ODD CSV</span>
                     </div>
                  </div>

                  <input 
                      type="file" 
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
                  />
                  {csvFile && <div className="text-xs text-neon mt-2 font-mono truncate">Loaded: {csvFile.name}</div>}
              </div>
           </div>

            {/* Strategy JSON editor */}
           <div className="glass-edge p-0 flex-1 flex flex-col min-h-[300px] overflow-hidden">
               <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
                   <Terminal className="h-4 w-4 text-white/40" />
                   <h3 className="text-xs font-bold text-white uppercase tracking-widest">Strategy JSON</h3>
               </div>
               <textarea
                   value={strategyJson}
                   onChange={e => setStrategyJson(e.target.value)}
                   className="flex-1 w-full bg-black/40 text-white/80 p-4 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-neon/30"
                   spellCheck={false}
               />
           </div>

           <div className="glass-edge p-6 bg-white/[0.01]">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Download className="h-3.5 w-3.5 text-white/40" />
                 Export Results
              </h3>
              <div className="flex flex-col gap-2">
                 <button className="w-full rounded-lg bg-white/5 py-2.5 text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase">
                    Trade Log (CSV)
                 </button>
                 <button className="w-full rounded-lg bg-white/5 py-2.5 text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase">
                    Full Engine Report
                 </button>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showImporter && (
          <StrategyImporter 
            onImport={handleImportStrategy}
            onClose={() => setShowImporter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
