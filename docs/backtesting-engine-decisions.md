# Backtesting Engine — Technical Decisions & Requirements

To bridge the gap between AI-driven IDEAS and empirical VALIDATION, we have finalized the following architectural decisions for the TRADINGLAB Backtesting Engine.

---

## 1. Simulation Execution Model
- **Decision**: **Client-side Web Worker Simulation**.
    - *Rationale*: By offloading the simulation loop to a Web Worker, we keep the UI responsive during 10-year backtests without incurring server-side compute costs. This also enhances privacy as the strategy logic and data remains localized.
- **Requirement**: Implement a `Worker` script in `lib/backtest/engine.worker.ts` that handles the candle iteration loop.

## 2. Data Granularity & Precision
- **Decision**: **OHLCV (Candle) Iteration with Intra-Period Modeling**.
    - *Rationale*: Pure "Tick" data is too heavy for rapid iteration. We use OHLCV data but simulate "Worst-Case Execution" for entry/exit (e.g., filling at the HIGH of the candle for a buy if volatility is spiked).
- **Requirement**: Use Alpha Vantage's "Intraday" (1m, 5m, 15m) and "Daily" endpoints to fuel the environment.

## 3. Strategy Expression Grammar
- **Decision**: **Safe Functional Mapping (No `eval`)**.
    - *Rationale*: The JSON strategy from the Lab Assistant (e.g., `{ "indicator": "RSI", "threshold": 70 }`) is mapped to a pre-defined set of TS functions. This prevents malicious code execution and ensures deterministic results.
- **Requirement**: Build an `ExpressionEvaluator` utility that resolves the strategy's "Logic" string against the current candle's indicators.

## 4. Cost & Slippage Modeling
- **Decision**: **Hybrid Slip/Fee Model**.
    - *Mechanics*: 
        - **Static**: Fixed percentage fee per trade (e.g., 0.1% for Binance Spot).
        - **Dynamic**: Slippage calculated as a function of the Average True Range (ATR) during the candle.
- **Requirement**: The simulation engine must subtract transaction costs *at the moment of execution* to reflect real-world equity decay.

## 5. result Persistence & Comparison
- **Decision**: **Supabase JSONB Result Storage**.
    - *Storage*: Every finalized backtest is stored in the `backtest_results` table, including the equity curve array and full trade logs.
- **Requirement**: Users should be able to "Overlay" two different backtests on the same chart to visualize performance improvements.

## 6. Benchmarking (Alpha Discovery)
- **Decision**: **Mandatory Buy & Hold Baseline**.
    - *Rationale*: To prove a strategy's worth, the engine will automatically calculate the performance of simply holding the asset for the same period.
- **Requirement**: Render the "Benchmark Curve" as a dashed grey line underneath the strategy's green equity curve.

---

## 📈 Integration Roadmap
1. **Define Core Loop**: Create the iterator that moves through the dataset.
2. **Implement Indicator Lib**: Add SMA/EMA, RSI, MACD, and Bollinger Bands.
3. **Build the "Scrubber"**: Sync the Backtesting UI with the historical trade markers.
4. **Finalize JSON Contract**: Ensure the Lab Assistant only outputs keys that the Engine recognizes.
