"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Strategy {
  id: number;
  name: string;
  asset: string;
  winRate: number;
  pnl: number;
  status: "Active" | "Paused" | "Backtesting";
  sparkline: number[];
}

const strategies: Strategy[] = [
  {
    id: 1,
    name: "Momentum Alpha",
    asset: "BTC/USD",
    winRate: 73.2,
    pnl: 12450.8,
    status: "Active",
    sparkline: [20, 25, 22, 30, 28, 35, 33, 40, 38, 45, 42, 48],
  },
  {
    id: 2,
    name: "Mean Reversion v3",
    asset: "ETH/USD",
    winRate: 68.5,
    pnl: 8920.3,
    status: "Active",
    sparkline: [30, 28, 33, 25, 35, 30, 38, 32, 42, 36, 40, 44],
  },
  {
    id: 3,
    name: "Volatility Crush",
    asset: "SPX",
    winRate: 81.1,
    pnl: -2140.5,
    status: "Paused",
    sparkline: [40, 38, 35, 32, 30, 28, 25, 27, 24, 22, 23, 20],
  },
  {
    id: 4,
    name: "Pair Arbitrage",
    asset: "GOLD/SILVER",
    winRate: 76.8,
    pnl: 5630.2,
    status: "Active",
    sparkline: [15, 20, 18, 25, 22, 28, 30, 27, 35, 32, 38, 36],
  },
  {
    id: 5,
    name: "Trend Follower Pro",
    asset: "EUR/USD",
    winRate: 62.4,
    pnl: 3210.7,
    status: "Backtesting",
    sparkline: [25, 28, 30, 27, 32, 35, 33, 36, 38, 35, 40, 42],
  },
  {
    id: 6,
    name: "Gamma Scalper",
    asset: "TSLA",
    winRate: 71.9,
    pnl: -890.4,
    status: "Paused",
    sparkline: [35, 33, 30, 28, 32, 29, 26, 28, 25, 23, 25, 22],
  },
];

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 120;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg className="h-10 w-30" viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`spark-${positive ? "g" : "r"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#00ff88" : "#ff3b3b"} stopOpacity={0.3} />
          <stop offset="100%" stopColor={positive ? "#00ff88" : "#ff3b3b"} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        stroke={positive ? "#00ff88" : "#ff3b3b"}
        strokeWidth="1.5"
        fill="none"
      />
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-${positive ? "g" : "r"})`}
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: Strategy["status"] }) {
  const colors = {
    Active: "bg-neon/10 text-neon border-neon/20",
    Paused: "bg-red/10 text-red border-red/20",
    Backtesting: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${colors[status]}`}
    >
      {status === "Active" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
        </span>
      )}
      {status}
    </span>
  );
}

export default function MarketData() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section
      id="market-data"
      className="relative py-[var(--section-py)] px-6 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon/70">
            Strategy Dashboard
          </span>
          <h2 className="gradient-text mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Live Strategies
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Monitor and manage your algorithmic strategies in real time.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          className="glass-edge overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Table header */}
          <div className="hidden border-b border-white/5 px-6 py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] md:gap-4">
            {["Strategy", "Asset", "Win Rate", "PnL", "Status", ""].map(
              (h) => (
                <span
                  key={h}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
                >
                  {h}
                </span>
              )
            )}
          </div>

          {/* Rows */}
          {strategies.map((s) => (
            <div key={s.id}>
              <button
                onClick={() =>
                  setExpandedId(expandedId === s.id ? null : s.id)
                }
                className="group w-full cursor-pointer border-b border-white/5 px-6 py-4 text-left transition-colors hover:bg-white/[0.03] md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] md:items-center md:gap-4"
              >
                <span className="text-sm font-medium text-white">
                  {s.name}
                </span>
                <span className="font-mono text-sm text-white/50">
                  {s.asset}
                </span>
                <span className="font-mono text-sm text-white/70">
                  {s.winRate}%
                </span>
                <span
                  className={`font-mono text-sm font-medium ${
                    s.pnl >= 0 ? "text-neon" : "text-red"
                  }`}
                >
                  {s.pnl >= 0 ? "+" : ""}
                  ${Math.abs(s.pnl).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <StatusBadge status={s.status} />
                <span className="hidden text-right font-mono text-xs text-white/30 transition-colors group-hover:text-white/60 md:inline">
                  {expandedId === s.id ? "Close" : "View"}
                </span>
              </button>

              {/* Expanded Detail */}
              <AnimatePresence>
                {expandedId === s.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden border-b border-white/5 bg-white/[0.015]"
                  >
                    <div className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                          Performance Chart
                        </span>
                        <div className="mt-2">
                          <MiniSparkline
                            data={s.sparkline}
                            positive={s.pnl >= 0}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                            Sharpe Ratio
                          </span>
                          <p className="mt-1 font-mono text-lg font-bold text-white">
                            {(1.2 + s.winRate * 0.01).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                            Max Drawdown
                          </span>
                          <p className="mt-1 font-mono text-lg font-bold text-red">
                            -{(3 + Math.random() * 8).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                            Trades (30d)
                          </span>
                          <p className="mt-1 font-mono text-lg font-bold text-white">
                            {Math.floor(100 + Math.random() * 500)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
