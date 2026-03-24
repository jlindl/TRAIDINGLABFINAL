# 🏛️ Backtesting Engine — Supported Features & Synthetic Grammar

This document defines the computational capabilities of the **TRADINGLAB Backtesting Engine**. It is the official reference for strategy developers and the Lab Assistant.

---

## 1. Logic & Calculation Context
The engine evaluates logic at the **Close** of a bar to prepare execution for the **Open** of the next bar (preventing look-ahead bias).

### Available Context Variables:
These variables representing the *previous* candle's data can be used directly in any logic string without needing to define them in the `setup`.

| Variable | Description |
| :--- | :--- |
| `open` | Opening price |
| `high` | Highest price |
| `low` | Lowest price |
| `close` | Closing price |
| `volume` | Trading volume |
| `hour` | UTC Hour of the candle (0-23) |
| `minute` | UTC Minute of the candle (0-59) |
| `dayOfWeek` | UTC Day of the week (0 = Sunday, 1 = Monday...) |
| `dayOfMonth` | UTC Day of the month (1-31) |
| `month` | UTC Month (1 = Jan, 12 = Dec) |

*Example:* `hour >= 13 AND hour <= 19 AND dayOfWeek != 0 AND dayOfWeek != 6 AND close > SMA_50`

---

## 2. Logical Operators (AST Parser)
The engine uses a recursive safe evaluator. Supported operators (in order of precedence):

| Operator | Type | Example |
| :--- | :--- | :--- |
| `(...)` | Grouping | `(RSI < 30 OR RSI > 70) AND ...` |
| `NOT` | Negation | `NOT (SMA_50 > SMA_200)` |
| `AND` | Boolean | `A AND B` |
| `OR` | Boolean | `A OR B` |
| `>`, `<` | Relational | `close > SMA_50` |
| `>=`, `<=` | Relational | `close <= BB_UPPER` |
| `==`, `!=` | Equality | `signal == 1` |

---

## 3. Supported Technical Indicators (16)

### Momentum & Oscillators
| Code | Name | Required Parameters | Return Series |
| :--- | :--- | :--- | :--- |
| `RSI` | Relative Strength Index | `period` | `{name}` |
| `MACD` | Moving Avg Conv/Div | `shortPeriod`, `longPeriod` | `{name}` |
| `STOCH` | Stochastic Oscillator | `period`, `smoothK`, `smoothD` | `{name}_K`, `{name}_D` |
| `CCI` | Commodity Channel Index | `period` | `{name}` |
| `MOM` | Momentum | `period` | `{name}` |
| `ROC` | Rate of Change | `period` | `{name}` |
| `CMF` | Chaikin Money Flow | `period` | `{name}` |
| `AO` | Awesome Oscillator | - | `{name}` |
| `WILLR` | Williams %R | `period` | `{name}` |
| `UO` | Ultimate Oscillator | `p1`, `p2`, `p3` | `{name}` |
| `TSI` | True Strength Index | `r`, `s` | `{name}` |

### Volatility & Channels
| Code | Name | Required Parameters | Return Series |
| :--- | :--- | :--- | :--- |
| `BB` | Bollinger Bands | `period`, `stdDev` | `{name}_UPPER`, `{name}_MIDDLE`, `{name}_LOWER` |
| `KC` | Keltner Channels | `period`, `multiplier` | `{name}_UPPER`, `{name}_MIDDLE`, `{name}_LOWER` |
| `DC` | Donchian Channels | `period` | `{name}_UPPER`, `{name}_MIDDLE`, `{name}_LOWER` |
| `ATR` | Average True Range | `period` | `{name}` |
| `SUPERTREND`| SuperTrend | `period`, `multiplier` | `{name}`, `{name}_DIRECTION` |
| `VORTEX` | Vortex Indicator | `period` | `{name}_PLUS`, `{name}_MINUS` |

### Trend & Volume
| Code | Name | Required Parameters | Return Series |
| :--- | :--- | :--- | :--- |
| `SMA` | Simple Moving Average | `period` | `{name}` |
| `EMA` | Exponential Moving Avg| `period` | `{name}` |
| `WMA` | Weighted Moving Avg | `period` | `{name}` |
| `HMA` | Hull Moving Average | `period` | `{name}` |
| `TEMA` | Triple Exponential MA | `period` | `{name}` |
| `VWAP` | Vol-Weighted Avg Price | - | `{name}` |
| `OBV` | On-Balance Volume | - | `{name}` |
| `PSAR` | Parabolic SAR | `step`, `maxStep` | `{name}` |
| `ADX` | Avg Directional Index | `period` | `{name}`, `{name}_DI_PLUS`, `{name}_DI_MINUS` |
| `PIVOT` | Pivot Points (Floor) | - | `{name}_P`, `{name}_R1`, `{name}_S1`, `{name}_R2`, `{name}_S2` |

### Smart Money Concepts & Price Action
| Code | Name | Required Parameters | Return Series |
| :--- | :--- | :--- | :--- |
| `FVG` | Fair Value Gaps | - | `{name}` (+1 Bull / -1 Bear) |
| `OB` | Order Blocks | `threshold` (impulse lookback) | `{name}` (+1 Bull / -1 Bear) |
| `SWING` | Fractals / Swing Points | `left`, `right` (window size) | `{name}_HIGH`, `{name}_LOW` |

---

## 4. JSON Strategy Schema
Strategies must strictly follow this structure:

```json
{
  "setup": {
    "indicators": {
      "RSI_14": { "type": "RSI", "period": 14 },
      "PIVOTS": { "type": "PIVOT" }
    }
  },
  "entry": {
    "logic": "close > PIVOTS_P AND RSI_14 > 70"
  },
  "exit": {
    "logic": "close < PIVOTS_S1",
    "tpPct": 0.05,
    "slPct": 0.02,
    "tslPct": 0.01,
    "bePct": 0.02,
    "partialTpPct": 0.03,
    "partialTpSize": 0.5
  }
}
```

- **tpPct**: Take Profit percentage.
- **slPct**: Stop Loss percentage (static).
- **tslPct**: Trailing Stop Loss percentage (dynamic).
- **bePct**: Break-even trigger percentage (moves SL to entry price).
- **partialTpPct**: Target profit to trigger a partial exit.
- **partialTpSize**: Fraction of position to close at `partialTpPct` (0.1 to 0.9).
