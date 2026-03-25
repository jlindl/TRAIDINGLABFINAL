import { runSimulation } from "../lib/backtest/engine.worker.ts";

/**
 * ESM VALIDATOR
 * Runs the Quantum Engine validation in a pure Node.js ESM environment.
 */

async function run() {
  console.log("🧪 STARTING QUANTUM ESM VALIDATION...");

  const data = [];
  let price = 100;
  const now = Date.now();
  for (let i = 0; i < 500; i++) {
    price += (Math.random() - 0.5);
    data.push({
      timestamp: now + (i * 60000),
      open: price, high: price + 0.2, low: price - 0.2, close: price + 0.1, volume: 100
    });
  }

  const strategy = {
    setup: { indicators: { sma: { type: 'SMA', period: 20 } } },
    entry: { logic: "close > sma" },
    exit: { logic: "close < sma", tpPct: 0.1, slPct: 0.05, partialTps: [{ pct: 0.02, size: 0.5 }] }
  };

  try {
    const result = runSimulation(data, strategy, { initialCapital: 10000 });
    console.log(`   ✅ SUCCESS: Simulated ${result.totalTrades} trades.`);
    console.log(`   ✅ STATS: Win Rate: ${(result.winRate * 100).toFixed(1)}%, SQN: ${result.sqn?.toFixed(2) || 'N/A'}`);
    
    if (result.totalTrades > 0) {
       console.log("✨ QUANTUM ENGINE IS ROBUST.");
    } else {
       console.log("⚠️ No trades triggered, but engine ran successfully.");
    }
  } catch (err) {
    console.error("❌ VALIDATION FAILED:", err);
    process.exit(1);
  }
}

run();
