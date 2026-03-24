export interface IndicatorDefinition {
  name: string;
  code: string;
  category: "Momentum" | "Volatility" | "Trend" | "Volume" | "SMC" | "Price Action";
  description: string;
  params: {
    [key: string]: {
      label: string;
      default: number | string;
      type: "number" | "select";
      options?: string[];
    };
  };
  returns: string[];
}

export const SUPPORTED_INDICATORS: IndicatorDefinition[] = [
  // --- MOMENTUM & OSCILLATORS ---
  {
    name: "Relative Strength Index",
    code: "RSI",
    category: "Momentum",
    description: "Measures the speed and change of price movements to identify overbought or oversold conditions.",
    params: { period: { label: "Period", default: 14, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Moving Average Convergence Divergence",
    code: "MACD",
    category: "Momentum",
    description: "A trend-following momentum indicator that shows the relationship between two moving averages of a security’s price.",
    params: {
      shortPeriod: { label: "Short Period", default: 12, type: "number" },
      longPeriod: { label: "Long Period", default: 26, type: "number" },
      signalPeriod: { label: "Signal Period", default: 9, type: "number" }
    },
    returns: ["{name}", "{name}_SIGNAL", "{name}_HIST"]
  },
  {
    name: "Stochastic Oscillator",
    code: "STOCH",
    category: "Momentum",
    description: "Compares a particular closing price of a security to a range of its prices over a certain period of time.",
    params: {
      period: { label: "K Period", default: 14, type: "number" },
      smoothK: { label: "Smooth K", default: 3, type: "number" },
      smoothD: { label: "Smooth D", default: 3, type: "number" }
    },
    returns: ["{name}_K", "{name}_D"]
  },
  {
    name: "Awesome Oscillator",
    code: "AO",
    category: "Momentum",
    description: "Used to measure market momentum. It calculates the difference of a 34-period and 5-period Simple Moving Averages.",
    params: {},
    returns: ["{name}"]
  },
  {
    name: "Williams %R",
    code: "WILLR",
    category: "Momentum",
    description: "A momentum indicator that measures overbought and oversold levels, similar to a stochastic oscillator.",
    params: { period: { label: "Period", default: 14, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Ultimate Oscillator",
    code: "UO",
    category: "Momentum",
    description: "Uses three different timeframes to reduce the volatility and false signals associated with other oscillators.",
    params: {
      p1: { label: "Short", default: 7, type: "number" },
      p2: { label: "Medium", default: 14, type: "number" },
      p3: { label: "Long", default: 28, type: "number" }
    },
    returns: ["{name}"]
  },
  {
    name: "True Strength Index",
    code: "TSI",
    category: "Momentum",
    description: "A double-smoothed momentum oscillator that helps traders identify trend direction and momentum shifts.",
    params: {
        r: { label: "Long", default: 25, type: "number" },
        s: { label: "Short", default: 13, type: "number" }
    },
    returns: ["{name}"]
  },

  // --- VOLATILITY ---
  {
    name: "Bollinger Bands",
    code: "BB",
    category: "Volatility",
    description: "Consists of a middle band (SMA) and two outer bands (standard deviations) to measure market volatility.",
    params: {
      period: { label: "Period", default: 20, type: "number" },
      stdDev: { label: "Std Dev", default: 2, type: "number" }
    },
    returns: ["{name}_UPPER", "{name}_MIDDLE", "{name}_LOWER"]
  },
  {
    name: "Average True Range",
    code: "ATR",
    category: "Volatility",
    description: "Measures market volatility by decomposing the entire range of an asset price for that period.",
    params: { period: { label: "Period", default: 14, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Keltner Channels",
    code: "KC",
    category: "Volatility",
    description: "Volatility-based envelopes set above and below an exponential moving average.",
    params: {
      period: { label: "Period", default: 20, type: "number" },
      multiplier: { label: "Multiplier", default: 2, type: "number" }
    },
    returns: ["{name}_UPPER", "{name}_MIDDLE", "{name}_LOWER"]
  },
  {
    name: "Donchian Channels",
    code: "DC",
    category: "Volatility",
    description: "Identify bullish and bearish extremes that favor either reversals or breakouts.",
    params: { period: { label: "Period", default: 20, type: "number" } },
    returns: ["{name}_UPPER", "{name}_MIDDLE", "{name}_LOWER"]
  },
  {
    name: "SuperTrend",
    code: "SUPERTREND",
    category: "Volatility",
    description: "A trend-following indicator which shows buy or sell signals based on ATR and Median Price.",
    params: {
      period: { label: "ATR Period", default: 10, type: "number" },
      multiplier: { label: "Multiplier", default: 3, type: "number" }
    },
    returns: ["{name}", "{name}_DIRECTION"]
  },

  // --- TREND ---
  {
    name: "Simple Moving Average",
    code: "SMA",
    category: "Trend",
    description: "The average price of a security over a specific number of time periods.",
    params: { period: { label: "Period", default: 50, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Exponential Moving Average",
    code: "EMA",
    category: "Trend",
    description: "A moving average that places a greater weight and significance on the most recent data points.",
    params: { period: { label: "Period", default: 20, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Triple Exponential Moving Average",
    code: "TEMA",
    category: "Trend",
    description: "A moving average that reduces lag by using triple exponential smoothing.",
    params: { period: { label: "Period", default: 9, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Hull Moving Average",
    code: "HMA",
    category: "Trend",
    description: "Extremely fast and smooth moving average that almost eliminates lag.",
    params: { period: { label: "Period", default: 9, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Average Directional Index",
    code: "ADX",
    category: "Trend",
    description: "Used to determine the strength of a trend. It does not indicate trend direction.",
    params: { period: { label: "Period", default: 14, type: "number" } },
    returns: ["{name}", "{name}_DI_PLUS", "{name}_DI_MINUS"]
  },
  {
    name: "Vortex Indicator",
    code: "VORTEX",
    category: "Trend",
    description: "Identify the start of a new trend and to confirm an existing trend.",
    params: { period: { label: "Period", default: 14, type: "number" } },
    returns: ["{name}_PLUS", "{name}_MINUS"]
  },
  {
    name: "Pivot Points (Floor)",
    code: "PIVOT",
    category: "Trend",
    description: "Price-derived levels used to determine the general trend of the market over different time frames.",
    params: {},
    returns: ["{name}_P", "{name}_R1", "{name}_S1", "{name}_R2", "{name}_S2"]
  },

  // --- SMART MONEY CONCEPTS & PRICE ACTION ---
  {
    name: "Fair Value Gaps",
    code: "FVG",
    category: "SMC",
    description: "Identifies three-bar imbalances where price skipped levels during impulsive moves.",
    params: {},
    returns: ["{name}"]
  },
  {
    name: "Order Blocks",
    code: "OB",
    category: "SMC",
    description: "The last opposite candle before a strong structural shift or expansion.",
    params: { threshold: { label: "Impulse Threshold", default: 10, type: "number" } },
    returns: ["{name}"]
  },
  {
    name: "Swing Fractals",
    code: "SWING",
    category: "Price Action",
    description: "Identifies structural highs and lows based on a multi-candle lookback window.",
    params: {
      left: { label: "Left Window", default: 3, type: "number" },
      right: { label: "Right Window", default: 3, type: "number" }
    },
    returns: ["{name}_HIGH", "{name}_LOW"]
  }
];

export interface StrategyJSON {
  setup: {
    indicators: {
      [name: string]: {
        type: string;
        timeframe?: string; // Optional MTF support (e.g., "1D", "4H")
        [param: string]: any;
      };
    };
  };
  entry: {
    logic: string;
  };
  exit: {
    logic: string;
    tpPct: number;
    slPct: number;
    [key: string]: any;
  };
}

export const CONTEXT_VARIABLES = [
  { name: "open", description: "Opening price of the previous candle." },
  { name: "high", description: "High price of the previous candle." },
  { name: "low", description: "Low price of the previous candle." },
  { name: "close", description: "Closing price of the previous candle." },
  { name: "volume", description: "Trading volume of the previous candle." },
  { name: "hour", description: "UTC Hour of the candle (0-23)." },
  { name: "minute", description: "UTC Minute of the candle (0-59)." },
  { name: "dayOfWeek", description: "UTC Day of the week (0 = Sunday, 1 = Monday...)." },
  { name: "dayOfMonth", description: "UTC Day of the month (1-31)." },
  { name: "month", description: "UTC Month (1 = Jan, 12 = Dec)." }
];

export const RISK_PARAMETERS = [
  { name: "tpPct", label: "Take Profit (%)", description: "Target profit percentage to close the entire position (e.g., 0.05 for 5%)." },
  { name: "slPct", label: "Stop Loss (%)", description: "Hard stop loss percentage (e.g., 0.02 for 2%)." },
  { name: "tslPct", label: "Trailing Stop (%)", description: "Dynamic stop that follows price upwards by X% from the peak profit." },
  { name: "bePct", label: "Break-even Trigger (%)", description: "Automatically moves stop loss to entry price after hitting this profit level." },
  { name: "partialTpPct", label: "Partial TP Target (%)", description: "Triggers a reduction in position size after hitting this profit level." },
  { name: "partialTpSize", label: "Partial TP Size (0-1)", description: "Fraction of the position to close at the Partial TP target (e.g., 0.5 for 50%)." }
];

export const STRATEGY_SCHEMA_PROMPT = `
{
  "setup": {
    "indicators": {
      "SMA_50_Daily": { "type": "SMA", "period": 50, "timeframe": "1D" },
      "RSI_14": { "type": "RSI", "period": 14 }
    }
  },
  "entry": {
    "logic": "CLOSE > SMA_50_Daily AND RSI_14 < 30"
  },
  "exit": {
    "logic": "CLOSE < SMA_50_Daily",
    "tpPct": 0.05,
    "slPct": 0.02
  }
}

NOTE: If "timeframe" is omitted, it defaults to the chart timeframe.
Supported Indicators: ${SUPPORTED_INDICATORS.map(i => i.code).join(", ")}
Supported Variables: ${CONTEXT_VARIABLES.map(v => v.name).join(", ")}
Supported Risk: ${RISK_PARAMETERS.map(r => r.name).join(", ")}
`;
