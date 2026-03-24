import { StrategyJSON } from "./engine.worker";

/**
 * EXPORTER UTILITY
 * Converts our internal JSON Strategy format into a standalone Python script
 * designed for live execution via CCXT (Crypto) or Alpaca (Equities).
 */
export function generatePythonScript(strategy: StrategyJSON, broker: string): string {
  const isCrypto = ['Bybit', 'Binance', 'Coinbase'].includes(broker);
  
  if (isCrypto) {
    return generateCCXTScript(strategy, broker);
  } else {
    return generateAlpacaScript(strategy);
  }
}

function generateCCXTScript(strategy: StrategyJSON, broker: string): string {
  const indicatorSetup = Object.entries(strategy.setup.indicators)
    .map(([name, config]) => {
      if (config.type === 'SMA') return `    df['${name}'] = df['close'].rolling(window=${config.period}).mean()`;
      if (config.type === 'EMA') return `    df['${name}'] = df['close'].ewm(span=${config.period}, adjust=false).mean()`;
      if (config.type === 'RSI') return `    delta = df['close'].diff()\n    gain = delta.where(delta > 0, 0)\n    loss = -delta.where(delta < 0, 0)\n    avg_gain = gain.rolling(window=${config.period}).mean()\n    avg_loss = loss.rolling(window=${config.period}).mean()\n    rs = avg_gain / avg_loss\n    df['${name}'] = 100 - (100 / (1 + rs))`;
      return '';
    }).join('\n');

  // Basic Python Template using CCXT
  return `
import ccxt
import pandas as pd
import time
import os

# --- CONFIGURATION ---
API_KEY = 'YOUR_API_KEY'
API_SECRET = 'YOUR_API_SECRET'
SYMBOL = 'BTC/USDT'
TIMEFRAME = '1h'
LOT_SIZE = 0.001 # Customize based on your risk

exchange = ccxt.${broker.toLowerCase()}({
    'apiKey': API_KEY,
    'secret': API_SECRET,
    'enableRateLimit': True,
})

def fetch_data():
    bars = exchange.fetch_ohlcv(SYMBOL, timeframe=TIMEFRAME, limit=500)
    df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    return df

def apply_strategy(df):
${indicatorSetup}
    
    # Entry Logic: ${strategy.entry.logic}
    # Exit Logic: ${strategy.exit.logic}
    
    # Note: Expression parsing in Python should match the logic defined in TRAIDINGLAB
    # This is a simplified implementation for local execution.
    last_row = df.iloc[-1]
    prev_row = df.iloc[-2]
    
    return last_row

def run_loop():
    print(f"Starting Live Execution on {SYMBOL}...")
    in_position = False
    
    while True:
        try:
            df = fetch_data()
            last_candle = apply_strategy(df)
            
            # TODO: Implement cross-translation of SafeEvaluate logic into Python conditions here
            # For now, we provide the template for the user to finalize the 'if' statements.
            
            print(f"Price: {last_candle['close']} | Waiting for signals...")
            time.sleep(60) # Poll every minute
            
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    run_loop()
`;
}

function generateAlpacaScript(strategy: StrategyJSON): string {
    return `# Alpaca Equities Script Template
import alpaca_trade_api as tradeapi
# Logic for ${strategy.entry.logic} ...
# [Content Omitted for brevity in initial draft]
`;
}
