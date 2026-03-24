"use client";

import { motion } from "framer-motion";
import { Play, Pause, TrendingUp, Settings2, BarChart3, Clock } from "lucide-react";

const bots = [
  { id: 1, name: "Alpha Scalp v4", asset: "BTC/USDT", pnl: 12.4, status: "online", uptime: "14d 2h", orders: 1542 },
  { id: 2, name: "Mean Rev ETH", asset: "ETH/USDT", pnl: -2.1, status: "online", uptime: "5d 11h", orders: 412 },
  { id: 3, name: "TrendFollower", asset: "SOL/USDT", pnl: 45.2, status: "paused", uptime: "0d 0h", orders: 89 },
];

export default function BotsView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bots</h2>
          <p className="text-sm text-white/40">Manage and monitor your active algorithmic instances.</p>
        </div>
        <button className="rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:bg-neon-dim transition-all active:scale-95">
          + New Bot
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bots.map((bot) => (
          <motion.div
            key={bot.id}
            whileHover={{ y: -5 }}
            className="glass-edge shimmer group relative overflow-hidden p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  bot.status === 'online' ? 'bg-neon/10 border-neon/20 text-neon' : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-neon transition-colors">{bot.name}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{bot.asset}</span>
                </div>
              </div>
              <button className="rounded-lg p-2 text-white/20 hover:bg-white/5 hover:text-white transition-all">
                <Settings2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-white/[0.01] border border-white/5 p-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/20">PnL (24h)</span>
                <div className={`text-lg font-bold mt-1 ${bot.pnl >= 0 ? 'text-neon' : 'text-red-500'}`}>
                  {bot.pnl > 0 ? '+' : ''}{bot.pnl}%
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-white/20">Total Orders</span>
                <div className="text-lg font-bold mt-1 text-white">{bot.orders.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-white/20" />
                  <span className="text-[10px] font-mono text-white/30">{bot.uptime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neon">
                  <div className={`h-1.5 w-1.5 rounded-full bg-neon ${bot.status === 'online' ? 'animate-pulse' : 'opacity-20'}`} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">
                    {bot.status}
                  </span>
                </div>
              </div>

              <button className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                bot.status === 'online' 
                  ? 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                  : 'border-neon/20 bg-neon/10 text-neon hover:bg-neon/20'
              }`}>
                {bot.status === 'online' ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-neon/5 blur-[50px] group-hover:bg-neon/10 transition-all pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
