"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Play, Trash2, Clock, Calculator, ChevronRight } from "lucide-react";

interface SavedStrategy {
  id: string;
  name: string;
  strategy_json: any;
  performance_snapshot: any;
  created_at: string;
}

interface SavedStrategiesViewProps {
  onSelectStrategy: (strategy: any) => void;
}

export default function SavedStrategiesView({ onSelectStrategy }: SavedStrategiesViewProps) {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/strategies");
      if (!res.ok) throw new Error("Failed to fetch strategies");
      const data = await res.json();
      setStrategies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;

    try {
      const res = await fetch(`/api/strategies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete strategy");
      setStrategies(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Saved Strategies</h2>
        <p className="text-sm text-white/40">Manage and reload your previous backtest configurations.</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      ) : strategies.length === 0 ? (
        <div className="glass-edge p-12 text-center flex flex-col items-center gap-4 bg-white/[0.02]">
           <Save className="h-12 w-12 text-white/10" />
           <div>
              <p className="text-white/60 font-medium">No saved strategies found</p>
              <p className="text-white/20 text-xs mt-1">Run a backtest and click "Save Strategy" to see them here.</p>
           </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-edge p-6 bg-[#0c0c0c] border border-white/5 hover:border-white/10 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white truncate pr-4">{strategy.name}</h3>
                  <button 
                    onClick={() => handleDelete(strategy.id)}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    <span>Saved {new Date(strategy.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {strategy.performance_snapshot && (
                    <div className="grid grid-cols-2 gap-2">
                       <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                          <div className="text-[8px] text-white/20 uppercase font-bold">Return</div>
                          <div className={`text-xs font-bold ${strategy.performance_snapshot.totalReturn >= 0 ? 'text-neon' : 'text-red-400'}`}>
                             {strategy.performance_snapshot.totalReturn !== undefined ? (strategy.performance_snapshot.totalReturn * 100).toFixed(1) + "%" : "-"}
                          </div>
                       </div>
                       <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                          <div className="text-[8px] text-white/20 uppercase font-bold">Win Rate</div>
                          <div className="text-xs font-bold text-white/60">
                             {strategy.performance_snapshot.winRate !== undefined ? (strategy.performance_snapshot.winRate * 100).toFixed(1) + "%" : "-"}
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.keys(strategy.strategy_json.setup?.indicators || {}).map((ind, i) => (
                       <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-white/40 font-mono">
                          {ind}
                       </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onSelectStrategy(strategy)}
                className="w-full mt-auto bg-neon/10 border border-neon/20 hover:bg-neon/20 p-2.5 rounded-lg flex items-center justify-center gap-2 text-neon text-xs font-bold transition-all group-hover:shadow-[0_0_15px_rgba(0,255,136,0.1)]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Load to Backtester
                <ChevronRight className="h-4 w-4 ml-auto opacity-40" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
