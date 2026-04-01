import { lintStrategy } from "../lib/backtest/linter";

async function testLinter() {
    console.log("--- Testing Strategy Linter ---");

    const brokenStrategy = {
        name: "Broken Strategy",
        ticker: "BTC",
        timeframe: "1h",
        entryLogic: "close > SMA_50 AND RSI_14 < 30",
        exitLogic: "close < SMA_50",
        indicators: {
            "RSI_14": { type: "RSI", period: 14 }
        },
        tpPct: 0.1,
        slPct: 0.05
    };

    console.log("Input Logic:", brokenStrategy.entryLogic);
    console.log("Input Indicators:", Object.keys(brokenStrategy.indicators));

    const result = lintStrategy(brokenStrategy);

    console.log("\nLinter Valid:", result.valid);
    console.log("Fixes:", result.fixes);
    console.log("Errors:", result.errors);

    if (result.fixedStrategy.setup.indicators["SMA_50"]) {
        console.log("✅ Auto-fixed SMA_50:", result.fixedStrategy.setup.indicators["SMA_50"]);
    } else {
        console.error("❌ FAILED to auto-fix SMA_50");
    }

    if (result.fixes.length > 0 && result.valid) {
        console.log("✅ Linter successfully repaired the strategy.");
    }

    // Test with _prev
    const crossoverStrategy = {
        entryLogic: "CROSSOVER(close, SMA_200)",
        indicators: { "SMA_200": { type: "SMA", period: 200 } }
    };
    
    console.log("\nTesting crossover logic extraction...");
    const crossoverResult = lintStrategy(crossoverStrategy);
    // CROSSOVER expands to (close > SMA_200 AND close_prev <= SMA_200_prev)
    // So SMA_200_prev should be recognized and SMA_200 should be the base.
    
    console.log("Crossover Result Valid:", crossoverResult.valid);
    console.log("Fixes:", crossoverResult.fixes);
}

testLinter().catch(console.error);
