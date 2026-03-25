/**
 * Standardized High-Performance Technical Indicators for the Backtesting Engine.
 * Note: These are simplified implementations optimized for sequential array processing.
 */

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(0);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= period) {
      sum -= data[i - period];
    }
    if (i >= period - 1) {
      result[i] = sum / period;
    } else {
      result[i] = NaN; // Not enough data
    }
  }
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(0);
  const k = 2 / (period + 1);

  // Initialize with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
    if (i < period - 1) {
      result[i] = NaN;
    } else {
      result[i] = sum / period;
    }
  }

  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    result[i] = data[i] * k + result[i - 1] * (1 - k);
  }

  return result;
}

/**
 * Relative Strength Index (RSI)
 */
export function calculateRSI(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(0);
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
    result[i - 1] = NaN;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) {
    result[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    result[period] = 100 - (100 / (1 + rs));
  }

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    let gain = 0;
    let loss = 0;

    if (diff >= 0) {
      gain = diff;
    } else {
      loss = -diff;
    }

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - (100 / (1 + rs));
    }
  }

  return result;
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(data: number[], shortPeriod: number = 12, longPeriod: number = 26): number[] {
  const shortEma = calculateEMA(data, shortPeriod);
  const longEma = calculateEMA(data, longPeriod);
  const macd: number[] = new Array(data.length).fill(NaN);
  
  for (let i = longPeriod - 1; i < data.length; i++) {
    macd[i] = shortEma[i] - longEma[i];
  }
  return macd;
}

/**
 * Bollinger Bands (Upper, Middle, Lower)
 */
export function calculateBollingerBands(data: number[], period: number = 20, numStdDev: number = 2): { upper: number[], middle: number[], lower: number[] } {
  const middle = calculateSMA(data, period);
  const upper = new Array(data.length).fill(NaN);
  const lower = new Array(data.length).fill(NaN);

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j] - middle[i];
      sum += diff * diff;
    }
    const stdDev = Math.sqrt(sum / period);
    upper[i] = middle[i] + (stdDev * numStdDev);
    lower[i] = middle[i] - (stdDev * numStdDev);
  }

  return { upper, middle, lower };
}

/**
 * Average True Range (ATR)
 */
export function calculateATR(data: OHLCV[], period: number = 14): number[] {
  const tr = new Array(data.length).fill(NaN);
  if (data.length === 0) return tr;
  tr[0] = data[0].high - data[0].low;

  for (let i = 1; i < data.length; i++) {
    const highLow = data[i].high - data[i].low;
    const highClose = Math.abs(data[i].high - data[i - 1].close);
    const lowClose = Math.abs(data[i].low - data[i - 1].close);
    tr[i] = Math.max(highLow, highClose, lowClose);
  }

  const atr = new Array(data.length).fill(NaN);
  if (data.length < period) return atr;
  
  let trSum = 0;
  for (let i = 0; i < period; i++) trSum += tr[i];
  atr[period - 1] = trSum / period;

  for (let i = period; i < data.length; i++) {
    atr[i] = (atr[i - 1] * (period - 1) + tr[i]) / period;
  }

  return atr;
}

/**
 * Volume Weighted Average Price (VWAP)
 */
export function calculateVWAP(data: OHLCV[]): number[] {
  const vwap = new Array(data.length).fill(NaN);
  let cumVol = 0;
  let cumVolPrice = 0;

  for (let i = 0; i < data.length; i++) {
    const typPrice = (data[i].high + data[i].low + data[i].close) / 3;
    const vol = data[i].volume || 1;
    cumVol += vol;
    cumVolPrice += typPrice * vol;
    vwap[i] = cumVolPrice / cumVol;
  }

  return vwap;
}

/**
 * On-Balance Volume (OBV)
 */
export function calculateOBV(data: OHLCV[]): number[] {
  const obv = new Array(data.length).fill(NaN);
  if (data.length === 0) return obv;
  obv[0] = data[0].volume;

  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) {
      obv[i] = obv[i - 1] + data[i].volume;
    } else if (data[i].close < data[i - 1].close) {
      obv[i] = obv[i - 1] - data[i].volume;
    } else {
      obv[i] = obv[i - 1];
    }
  }

  return obv;
}

/**
 * Stochastic Oscillator (%K and %D)
 * Returns { k: number[], d: number[] }
 */
export function calculateStochastic(data: OHLCV[], period: number = 14, smoothK: number = 1, smoothD: number = 3): { k: number[], d: number[] } {
  const kLine = new Array(data.length).fill(NaN);
  
  for (let i = period - 1; i < data.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < period; j++) {
      if (data[i - j].high > highestHigh) highestHigh = data[i - j].high;
      if (data[i - j].low < lowestLow) lowestLow = data[i - j].low;
    }
    
    if (highestHigh === lowestLow) {
      kLine[i] = 100;
    } else {
      kLine[i] = ((data[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;
    }
  }

  // Smooth %K
  const smoothedK = smoothK > 1 ? calculateSMA(kLine, Math.floor(smoothK)) : kLine;
  // Smooth %D
  const dLine = calculateSMA(smoothedK, smoothD);

  return { k: smoothedK, d: dLine };
}

/**
 * Average Directional Index (ADX)
 */
export function calculateADX(data: OHLCV[], period: number = 14): { adx: number[], plusDI: number[], minusDI: number[] } {
  const tr = calculateATR(data, 1); // 1-period ATR is just True Range
  const plusDM = new Array(data.length).fill(NaN);
  const minusDM = new Array(data.length).fill(NaN);
  
  if (data.length > 0) {
    plusDM[0] = 0;
    minusDM[0] = 0;
  }

  for (let i = 1; i < data.length; i++) {
    const upMove = data[i].high - data[i - 1].high;
    const downMove = data[i - 1].low - data[i].low;

    if (upMove > downMove && upMove > 0) plusDM[i] = upMove;
    else plusDM[i] = 0;

    if (downMove > upMove && downMove > 0) minusDM[i] = downMove;
    else minusDM[i] = 0;
  }

  // Wilder's Smoothing (using simple average for first period, then smoothed)
  const atr = calculateATR(data, period);
  const smoothPlusDM = new Array(data.length).fill(NaN);
  const smoothMinusDM = new Array(data.length).fill(NaN);
  const plusDI = new Array(data.length).fill(NaN);
  const minusDI = new Array(data.length).fill(NaN);

  if (data.length >= period + 1) {
    let sumPlus = 0, sumMinus = 0;
    for (let i = 1; i <= period; i++) {
      sumPlus += plusDM[i];
      sumMinus += minusDM[i];
    }
    smoothPlusDM[period] = sumPlus;
    smoothMinusDM[period] = sumMinus;
    
    for (let i = period + 1; i < data.length; i++) {
      smoothPlusDM[i] = smoothPlusDM[i - 1] - (smoothPlusDM[i - 1] / period) + plusDM[i];
      smoothMinusDM[i] = smoothMinusDM[i - 1] - (smoothMinusDM[i - 1] / period) + minusDM[i];
    }

    for (let i = period; i < data.length; i++) {
      if (atr[i] === 0) {
        plusDI[i] = 0;
        minusDI[i] = 0;
      } else {
        plusDI[i] = (smoothPlusDM[i] / atr[i]) * 100;
        minusDI[i] = (smoothMinusDM[i] / atr[i]) * 100;
      }
    }
  }

  const dx = new Array(data.length).fill(NaN);
  for (let i = period; i < data.length; i++) {
    const sumDI = plusDI[i] + minusDI[i];
    if (sumDI === 0) dx[i] = 0;
    else dx[i] = Math.abs(plusDI[i] - minusDI[i]) / sumDI * 100;
  }

  // Final ADX (Moving Average of DX)
  let adx = new Array(data.length).fill(NaN);
  if (data.length >= period * 2) {
    let dxSum = 0;
    for (let i = period; i < period * 2; i++) dxSum += dx[i];
    adx[period * 2 - 1] = dxSum / period;

    for (let i = period * 2; i < data.length; i++) {
      adx[i] = (adx[i - 1] * (period - 1) + dx[i]) / period;
    }
  }

  return { adx, plusDI, minusDI };
}

/**
 * Commodity Channel Index (CCI)
 */
export function calculateCCI(data: OHLCV[], period: number = 20): number[] {
  const cci = new Array(data.length).fill(NaN);
  const typicalPrice = data.map(d => (d.high + d.low + d.close) / 3);
  const smaTP = calculateSMA(typicalPrice, period);

  for (let i = period - 1; i < data.length; i++) {
    let meanDeviation = 0;
    for (let j = 0; j < period; j++) {
      meanDeviation += Math.abs(typicalPrice[i - j] - smaTP[i]);
    }
    meanDeviation /= period;
    
    if (meanDeviation === 0) cci[i] = 0;
    else cci[i] = (typicalPrice[i] - smaTP[i]) / (0.015 * meanDeviation);
  }

  return cci;
}

/**
 * Parabolic SAR (PSAR)
 */
export function calculatePSAR(data: OHLCV[], step: number = 0.02, maxStep: number = 0.2): number[] {
  const psar = new Array(data.length).fill(NaN);
  if (data.length < 2) return psar;

  let isLong = true;
  let af = step;
  let ep = data[0].high;
  psar[0] = data[0].low;

  for (let i = 1; i < data.length; i++) {
    psar[i] = psar[i - 1] + af * (ep - psar[i - 1]);

    if (isLong) {
      if (data[i].low < psar[i]) {
        // Reverse to short
        isLong = false;
        psar[i] = ep;
        ep = data[i].low;
        af = step;
      } else {
        if (data[i].high > ep) {
          ep = data[i].high;
          af = Math.min(af + step, maxStep);
        }
        // Bound by prior two lows
        if (i > 1 && psar[i] > Math.min(data[i - 1].low, data[i - 2].low)) {
          psar[i] = Math.min(data[i - 1].low, data[i - 2].low);
        }
      }
    } else {
      if (data[i].high > psar[i]) {
        // Reverse to long
        isLong = true;
        psar[i] = ep;
        ep = data[i].high;
        af = step;
      } else {
        if (data[i].low < ep) {
          ep = data[i].low;
          af = Math.min(af + step, maxStep);
        }
        // Bound by prior two highs
        if (i > 1 && psar[i] < Math.max(data[i - 1].high, data[i - 2].high)) {
          psar[i] = Math.max(data[i - 1].high, data[i - 2].high);
        }
      }
    }
  }

  return psar;
}

/**
 * Donchian Channels
 */
export function calculateDonchianChannels(data: OHLCV[], period: number = 20): { upper: number[], middle: number[], lower: number[] } {
  const upper = new Array(data.length).fill(NaN);
  const lower = new Array(data.length).fill(NaN);
  const middle = new Array(data.length).fill(NaN);

  for (let i = period - 1; i < data.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < period; j++) {
      if (data[i - j].high > highestHigh) highestHigh = data[i - j].high;
      if (data[i - j].low < lowestLow) lowestLow = data[i - j].low;
    }
    
    upper[i] = highestHigh;
    lower[i] = lowestLow;
    middle[i] = (highestHigh + lowestLow) / 2;
  }

  return { upper, middle, lower };
}

/**
 * Keltner Channels
 */
export function calculateKeltnerChannels(data: OHLCV[], period: number = 20, multiplier: number = 2): { upper: number[], middle: number[], lower: number[] } {
  const atr = calculateATR(data, period);
  const closes = data.map(d => d.close);
  const middle = calculateEMA(closes, period); // Commonly EMA is used
  const upper = new Array(data.length).fill(NaN);
  const lower = new Array(data.length).fill(NaN);

  for (let i = period - 1; i < data.length; i++) {
    upper[i] = middle[i] + (atr[i] * multiplier);
    lower[i] = middle[i] - (atr[i] * multiplier);
  }

  return { upper, middle, lower };
}

/**
 * Momentum (MOM)
 */
export function calculateMomentum(data: number[], period: number = 10): number[] {
  const mom = new Array(data.length).fill(NaN);
  for (let i = period; i < data.length; i++) {
    mom[i] = data[i] - data[i - period];
  }
  return mom;
}

/**
 * Rate of Change (ROC)
 */
export function calculateROC(data: number[], period: number = 9): number[] {
  const roc = new Array(data.length).fill(NaN);
  for (let i = period; i < data.length; i++) {
    if (data[i - period] === 0) roc[i] = 0;
    else roc[i] = ((data[i] - data[i - period]) / data[i - period]) * 100;
  }
  return roc;
}

/**
 * Weighted Moving Average (WMA)
 */
export function calculateWMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  let weightSum = (period * (period + 1)) / 2;

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j] * (period - j);
    }
    result[i] = sum / weightSum;
  }
  return result;
}

/**
 * Hull Moving Average (HMA)
 */
export function calculateHMA(data: number[], period: number): number[] {
  const halfPeriod = Math.floor(period / 2);
  const sqrtPeriod = Math.floor(Math.sqrt(period));

  const wmaHalf = calculateWMA(data, halfPeriod);
  const wmaFull = calculateWMA(data, period);
  
  const diff = new Array(data.length).fill(NaN);
  for (let i = 0; i < data.length; i++) {
    if (!isNaN(wmaHalf[i]) && !isNaN(wmaFull[i])) {
      diff[i] = 2 * wmaHalf[i] - wmaFull[i];
    }
  }

  return calculateWMA(diff, sqrtPeriod);
}

/**
 * Chaikin Money Flow (CMF)
 */
export function calculateCMF(data: OHLCV[], period: number = 20): number[] {
  const cmf = new Array(data.length).fill(NaN);
  const mfv = new Array(data.length).fill(0);

  for (let i = 0; i < data.length; i++) {
    const high = data[i].high, low = data[i].low, close = data[i].close;
    if (high === low) {
       mfv[i] = 0;
    } else {
       const mult = ((close - low) - (high - close)) / (high - low);
       mfv[i] = mult * data[i].volume;
    }
  }

  for (let i = period - 1; i < data.length; i++) {
    let mfvSum = 0;
    let volSum = 0;
    for (let j = 0; j < period; j++) {
      mfvSum += mfv[i - j];
      volSum += data[i - j].volume;
    }
    if (volSum === 0) cmf[i] = 0;
    else cmf[i] = mfvSum / volSum;
  }

  return cmf;
}

/**
 * SuperTrend
 * Returns { trend: number[], supertrend: number[] }
 * trend: 1 for bullish, -1 for bearish
 */
export function calculateSuperTrend(data: OHLCV[], period: number = 10, multiplier: number = 3): { supertrend: number[], direction: number[] } {
  const atr = calculateATR(data, period);
  const supertrend = new Array(data.length).fill(NaN);
  const direction = new Array(data.length).fill(1); // 1 = up, -1 = down

  const upperBand = new Array(data.length).fill(NaN);
  const lowerBand = new Array(data.length).fill(NaN);

  for (let i = period; i < data.length; i++) {
    const hl2 = (data[i].high + data[i].low) / 2;
    const basicUpperBand = hl2 + (multiplier * atr[i]);
    const basicLowerBand = hl2 - (multiplier * atr[i]);

    upperBand[i] = (basicUpperBand < upperBand[i - 1] || data[i - 1].close > upperBand[i - 1]) ? basicUpperBand : upperBand[i - 1];
    lowerBand[i] = (basicLowerBand > lowerBand[i - 1] || data[i - 1].close < lowerBand[i - 1]) ? basicLowerBand : lowerBand[i - 1];

    if (direction[i - 1] === 1) {
      if (data[i].close < lowerBand[i]) {
        direction[i] = -1;
        supertrend[i] = upperBand[i];
      } else {
        direction[i] = 1;
        supertrend[i] = lowerBand[i];
      }
    } else {
      if (data[i].close > upperBand[i]) {
        direction[i] = 1;
        supertrend[i] = lowerBand[i];
      } else {
        direction[i] = -1;
        supertrend[i] = upperBand[i];
      }
    }
  }

  return { supertrend, direction };
}

/**
 * Triple Exponential Moving Average (TEMA)
 */
export function calculateTEMA(data: number[], period: number): number[] {
  const ema1 = calculateEMA(data, period);
  const ema2 = calculateEMA(ema1, period);
  const ema3 = calculateEMA(ema2, period);
  const result = new Array(data.length).fill(NaN);

  for (let i = 0; i < data.length; i++) {
    if (!isNaN(ema1[i]) && !isNaN(ema2[i]) && !isNaN(ema3[i])) {
      result[i] = 3 * ema1[i] - 3 * ema2[i] + ema3[i];
    }
  }
  return result;
}

/**
 * Awesome Oscillator (AO)
 */
export function calculateAO(data: OHLCV[]): number[] {
  const hl2 = data.map(d => (d.high + d.low) / 2);
  const sma5 = calculateSMA(hl2, 5);
  const sma34 = calculateSMA(hl2, 34);
  const ao = new Array(data.length).fill(NaN);

  for (let i = 0; i < data.length; i++) {
    if (!isNaN(sma5[i]) && !isNaN(sma34[i])) {
      ao[i] = sma5[i] - sma34[i];
    }
  }
  return ao;
}

/**
 * Williams %R
 */
export function calculateWilliamsR(data: OHLCV[], period: number = 14): number[] {
  const result = new Array(data.length).fill(NaN);

  for (let i = period - 1; i < data.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    for (let j = 0; j < period; j++) {
      if (data[i - j].high > highestHigh) highestHigh = data[i - j].high;
      if (data[i - j].low < lowestLow) lowestLow = data[i - j].low;
    }
    if (highestHigh === lowestLow) result[i] = -50;
    else result[i] = ((highestHigh - data[i].close) / (highestHigh - lowestLow)) * -100;
  }
  return result;
}

/**
 * Ultimate Oscillator
 */
export function calculateUltimateOscillator(data: OHLCV[], p1: number = 7, p2: number = 14, p3: number = 28): number[] {
  const uo = new Array(data.length).fill(NaN);
  const bp = new Array(data.length).fill(0); // Buying Pressure
  const tr = new Array(data.length).fill(0); // True Range

  for (let i = 1; i < data.length; i++) {
    const minLowClose = Math.min(data[i].low, data[i - 1].close);
    const maxHighClose = Math.max(data[i].high, data[i - 1].close);
    bp[i] = data[i].close - minLowClose;
    tr[i] = maxHighClose - minLowClose;
  }

  const avgMap = (p: number) => {
    const res = new Array(data.length).fill(0);
    let bpSum = 0, trSum = 0;
    for (let i = 1; i < data.length; i++) {
      bpSum += bp[i];
      trSum += tr[i];
      if (i >= p) {
        res[i] = trSum === 0 ? 0 : bpSum / trSum;
        bpSum -= bp[i - p + 1];
        trSum -= tr[i - p + 1];
      }
    }
    return res;
  };

  const a7 = avgMap(p1);
  const a14 = avgMap(p2);
  const a28 = avgMap(p3);

  for (let i = p3; i < data.length; i++) {
    uo[i] = 100 * ((4 * a7[i] + 2 * a14[i] + a28[i]) / (4 + 2 + 1));
  }
  return uo;
}

/**
 * Vortex Indicator (VI)
 */
export function calculateVortex(data: OHLCV[], period: number = 14): { plus: number[], minus: number[] } {
  const plusVM = new Array(data.length).fill(0);
  const minusVM = new Array(data.length).fill(0);
  const tr = new Array(data.length).fill(0);

  for (let i = 1; i < data.length; i++) {
    plusVM[i] = Math.abs(data[i].high - data[i - 1].low);
    minusVM[i] = Math.abs(data[i].low - data[i - 1].high);
    tr[i] = Math.max(data[i].high - data[i].low, Math.abs(data[i].high - data[i - 1].close), Math.abs(data[i].low - data[i - 1].close));
  }

  const plusVI = new Array(data.length).fill(NaN);
  const minusVI = new Array(data.length).fill(NaN);

  for (let i = period; i < data.length; i++) {
    let sumPlus = 0, sumMinus = 0, sumTR = 0;
    for (let j = 0; j < period; j++) {
      sumPlus += plusVM[i - j];
      sumMinus += minusVM[i - j];
      sumTR += tr[i - j];
    }
    if (sumTR === 0) {
      plusVI[i] = 1;
      minusVI[i] = 1;
    } else {
      plusVI[i] = sumPlus / sumTR;
      minusVI[i] = sumMinus / sumTR;
    }
  }

  return { plus: plusVI, minus: minusVI };
}

/**
 * True Strength Index (TSI)
 */
export function calculateTSI(data: number[], r: number = 25, s: number = 13): number[] {
  const diff = new Array(data.length).fill(0);
  for (let i = 1; i < data.length; i++) diff[i] = data[i] - data[i - 1];

  const firstSmooth = calculateEMA(diff, r);
  const secondSmooth = calculateEMA(firstSmooth, s);

  const absDiff = diff.map(d => Math.abs(d));
  const firstAbsSmooth = calculateEMA(absDiff, r);
  const secondAbsSmooth = calculateEMA(firstAbsSmooth, s);

  const tsi = new Array(data.length).fill(NaN);
  for (let i = 0; i < data.length; i++) {
    if (secondAbsSmooth[i] !== 0) {
      tsi[i] = 100 * (secondSmooth[i] / secondAbsSmooth[i]);
    } else {
      tsi[i] = 0;
    }
  }
  return tsi;
}

/**
 * Pivot Points (Floor/Standard)
 * Calculated on a daily basis (if data has daily candles) 
 * or purely based on the previous period.
 */
export function calculatePivotPoints(data: OHLCV[]): { p: number[], r1: number[], s1: number[], r2: number[], s2: number[] } {
  const p = new Array(data.length).fill(NaN);
  const r1 = new Array(data.length).fill(NaN);
  const s1 = new Array(data.length).fill(NaN);
  const r2 = new Array(data.length).fill(NaN);
  const s2 = new Array(data.length).fill(NaN);

  for (let i = 1; i < data.length; i++) {
     const prev = data[i-1];
     const pivot = (prev.high + prev.low + prev.close) / 3;
     p[i] = pivot;
     r1[i] = 2 * pivot - prev.low;
     s1[i] = 2 * pivot - prev.high;
     r2[i] = pivot + (prev.high - prev.low);
     s2[i] = pivot - (prev.high - prev.low);
  }
  return { p, r1, s1, r2, s2 };
}

/**
 * ========================================================
 * SMART MONEY CONCEPTS (SMC) & PRICE ACTION
 * ========================================================
 */

/**
 * Fair Value Gaps (FVG) / Imbalances
 * Returns +1 for Bullish FVG, -1 for Bearish FVG, 0 otherwise.
 * A Bullish FVG occurs when the current low is higher than the high two bars ago.
 * A Bearish FVG occurs when the current high is lower than the low two bars ago.
 */
export function calculateFVG(data: OHLCV[]): number[] {
  const fvg = new Array(data.length).fill(0);
  for (let i = 2; i < data.length; i++) {
    // Bullish FVG: Candle i-2 High < Candle i Low (Gap)
    // Candle i-1 is the large expansion candle
    if (data[i - 2].high < data[i].low && data[i - 1].close > data[i - 1].open) {
      fvg[i] = 1;
    }
    // Bearish FVG: Candle i-2 Low > Candle i High (Gap)
    // Candle i-1 is the large drop candle
    else if (data[i - 2].low > data[i].high && data[i - 1].close < data[i - 1].open) {
      fvg[i] = -1;
    }
  }
  return fvg;
}

/**
 * Swing Highs and Lows (Fractal Structure)
 * Identifies local peaks and troughs over a 'left' and 'right' lookback window.
 * Returns { swingHigh: number[], swingLow: number[] }
 * Value holds the price of the swing point, NaN everywhere else.
 */
export function calculateSwings(data: OHLCV[], leftWindow: number = 3, rightWindow: number = 3): { swingHigh: number[], swingLow: number[] } {
  const swingHigh = new Array(data.length).fill(NaN);
  const swingLow = new Array(data.length).fill(NaN);

  for (let i = leftWindow; i < data.length - rightWindow; i++) {
    let isHigh = true;
    let isLow = true;

    for (let j = 1; j <= leftWindow; j++) {
      if (data[i].high <= data[i - j].high) isHigh = false;
      if (data[i].low >= data[i - j].low) isLow = false;
    }

    for (let j = 1; j <= rightWindow; j++) {
      if (data[i].high <= data[i + j].high) isHigh = false;
      if (data[i].low >= data[i + j].low) isLow = false;
    }

    if (isHigh) swingHigh[i] = data[i].high;
    if (isLow) swingLow[i] = data[i].low;
  }
  return { swingHigh, swingLow };
}

/**
 * Order Blocks (OB)
 * A simplistic implementation: 
 * Bullish OB = The last down candle before a strong impulsive up move (often breaking structure or creating FVG).
 * Bearish OB = The last up candle before a strong impulsive down move.
 * For vectorized simulation, we trigger a signal when an OB is detected mathematically based on momentum shifts.
 * Returns +1 for newly formed Bullish OB, -1 for newly formed Bearish OB.
 */
export function calculateOrderBlocks(data: OHLCV[], impulsiveThresholdPeriods: number = 10): number[] {
  const ob = new Array(data.length).fill(0);
  const atr = calculateATR(data, impulsiveThresholdPeriods);

  for (let i = 2; i < data.length; i++) {
    const isBullExp = (data[i].close - data[i].open) > atr[i] * 1.5;
    const isBearExp = (data[i].open - data[i].close) > atr[i] * 1.5;

    // Bullish OB: Large bullish candle following a bearish candle
    if (isBullExp && data[i-1].close < data[i-1].open) {
       ob[i] = 1; // Candle i-1 is geometrically the OB, signal triggers on confirmation at i
    }
    // Bearish OB: Large bearish candle following a bullish candle
    else if (isBearExp && data[i-1].close > data[i-1].open) {
       ob[i] = -1;
    }
  }
  
  return ob;
}

/**
 * Ichimoku Cloud (Ichimoku Kinko Hyo)
 * Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
 * Kijun-sen (Base Line): (26-period high + 26-period low) / 2
 * Senkou Span A (Leading Span A): (Tenkan-sen + Kijun-sen) / 2 (plotted 26 periods ahead)
 * Senkou Span B (Leading Span B): (52-period high + 52-period low) / 2 (plotted 26 periods ahead)
 * Chikou Span (Lagging Span): Close plotted 26 periods behind
 */
export function calculateIchimoku(data: OHLCV[], tenkanPeriod: number = 9, kijunPeriod: number = 26, senkouBPeriod: number = 52, displacement: number = 26): { 
  tenkan: number[], 
  kijun: number[], 
  senkouA: number[], 
  senkouB: number[], 
  chikou: number[] 
} {
  const tenkan = new Array(data.length).fill(NaN);
  const kijun = new Array(data.length).fill(NaN);
  const senkouA = new Array(data.length).fill(NaN);
  const senkouB = new Array(data.length).fill(NaN);
  const chikou = new Array(data.length).fill(NaN);

  const getHighLow = (start: number, end: number) => {
    let h = -Infinity, l = Infinity;
    for (let i = start; i <= end; i++) {
       if (data[i].high > h) h = data[i].high;
       if (data[i].low < l) l = data[i].low;
    }
    return { h, l };
  };

  for (let i = 0; i < data.length; i++) {
    if (i >= tenkanPeriod - 1) {
      const { h, l } = getHighLow(i - tenkanPeriod + 1, i);
      tenkan[i] = (h + l) / 2;
    }
    if (i >= kijunPeriod - 1) {
      const { h, l } = getHighLow(i - kijunPeriod + 1, i);
      kijun[i] = (h + l) / 2;
    }
  }

  for (let i = 0; i < data.length; i++) {
    // Senkou A & B are plotted 26 periods AHEAD
    // In our sequential array, we calculate them and put them at index i + displacement
    const targetIdx = i + displacement;
    if (targetIdx < data.length) {
       if (!isNaN(tenkan[i]) && !isNaN(kijun[i])) {
          senkouA[targetIdx] = (tenkan[i] + kijun[i]) / 2;
       }
       if (i >= senkouBPeriod - 1) {
          const { h, l } = getHighLow(i - senkouBPeriod + 1, i);
          senkouB[targetIdx] = (h + l) / 2;
       }
    }
    
    // Chikou is plotted 26 periods BEHIND
    const sourceIdx = i + displacement;
    if (sourceIdx < data.length) {
       chikou[i] = data[sourceIdx].close;
    }
  }

  return { tenkan, kijun, senkouA, senkouB, chikou };
}

/**
 * ATR Trailing Stop (Chandelier Exit variant)
 * Calculates a dynamic stop based on ATR and recent high/low.
 */
export function calculateATRTrailingStop(data: OHLCV[], period: number = 22, multiplier: number = 3): number[] {
  const atr = calculateATR(data, period);
  const stop = new Array(data.length).fill(NaN);
  let isLong = true;

  for (let i = period; i < data.length; i++) {
    const prevStop = stop[i-1];
    const currentAtr = atr[i];
    
    if (isLong) {
      const newStop = data[i].close - (currentAtr * multiplier);
      stop[i] = isNaN(prevStop) ? newStop : Math.max(newStop, prevStop);
      if (data[i].close < stop[i]) {
        isLong = false;
        stop[i] = data[i].close + (currentAtr * multiplier);
      }
    } else {
      const newStop = data[i].close + (currentAtr * multiplier);
      stop[i] = isNaN(prevStop) ? newStop : Math.min(newStop, prevStop);
      if (data[i].close > stop[i]) {
        isLong = true;
        stop[i] = data[i].close - (currentAtr * multiplier);
      }
    }
  }
  return stop;
}

/**
 * Liquidity Voids
 * Detects large gaps in price action that act as magnets for future returns.
 * Similar to FVG but specifically looking for 'untested' expanses.
 */
export function calculateLiquidityVoids(data: OHLCV[], checkPeriod: number = 20): number[] {
  const voids = new Array(data.length).fill(0);
  const threshold = calculateATR(data, checkPeriod).map(a => a * 2); // 2x ATR expansion

  for (let i = 1; i < data.length; i++) {
     const candleSize = Math.abs(data[i].close - data[i].open);
     if (candleSize > threshold[i]) {
        voids[i] = data[i].close > data[i].open ? 1 : -1;
     }
  }
  return voids;
}
