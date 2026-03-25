"use client";

import { 
  OHLCV, calculateSMA, calculateEMA, calculateRSI, calculateMACD, 
  calculateBollingerBands, calculateATR, calculateVWAP, calculateOBV, 
  calculateStochastic, calculateADX, calculateCCI, calculatePSAR, 
  calculateDonchianChannels, calculateKeltnerChannels, calculateMomentum, 
  calculateROC, calculateWMA, calculateHMA, calculateCMF, 
  calculateSuperTrend, calculateTEMA, calculateAO, calculateWilliamsR, 
  calculateUltimateOscillator, calculateVortex, calculateTSI, 
  calculatePivotPoints, calculateFVG, calculateSwings, calculateOrderBlocks,
  calculateIchimoku, calculateATRTrailingStop, calculateLiquidityVoids
} from "./indicators";
import { safeEvaluate } from "./parser";

export interface StrategyParameters {
  initialCapital?: number;
  commission?: number; // e.g. 0.001 for 0.1%
  slippageBps?: number; // e.g. 5 for 5 bps
  positionSizing?: number; // percentage of equity, e.g. 1.0 for 100%
  // Dynamic parameters passed from the Lab Assistant
  [key: string]: any;
}

export interface TradeLocation {
  timestamp: number;
  price: number;
  type: 'BUY' | 'SELL' | 'PARTIAL_SELL';
  size: number;
  pnl?: number;
  mfe?: number;
  mae?: number;
  duration?: number;
}

export interface BacktestResult {
  equityCurve: { timestamp: number, equity: number }[];
  trades: TradeLocation[];
  finalEquity: number;
  totalTrades: number;
  winRate: number;
  mdd: number;
  benchmarkCurve: { timestamp: number, equity: number }[];
  sharpeRatio?: number;
  profitFactor?: number;
  expectancy?: number;
  recoveryFactor?: number;
  sqn?: number; // System Quality Number
  monteCarlo?: {
    luckFactor: number;
    ruinProb: number;
    medianEquity: number;
  };
  correlationMatrix?: Record<string, Record<string, number>>;
  diversificationBenefit?: number;
}

export interface StrategyJSON {
  setup: {
    indicators: { [key: string]: Record<string, any> };
  };
  entry: {
    logic: string; 
    shortLogic?: string; // Optional: separate logic for shorts
  };
  exit: {
    logic: string;
    shortLogic?: string; // Optional: separate logic for short exits
    tpPct?: number;
    slPct?: number;
    tslPct?: number; 
    bePct?: number; 
    partialTps?: { pct: number, size: number }[]; 
    expiryBars?: number; 
    endOfDayExit?: boolean;
  };
}

export function runSimulation(
  data: OHLCV[],
  strategy: StrategyJSON,
  params: StrategyParameters,
  htfData?: Record<string, OHLCV[]>
): BacktestResult {
  const initialCap = params.initialCapital ?? 10000;
  const comms = params.commission ?? 0.001; 

  // 1. Pre-calculate all requested indicators
  const indData: Record<string, number[]> = {};
  
  if (strategy.setup && strategy.setup.indicators) {
    for (const [name, config] of Object.entries(strategy.setup.indicators)) {
      const targetTF = config.timeframe; 
      const sourceData = (targetTF && htfData?.[targetTF]) ? htfData[targetTF] : data;
      const prices = sourceData.map(d => d.close);
      
      let results: any = null;
      
      if (config.type === 'SMA') results = calculateSMA(prices, config.period);
      else if (config.type === 'EMA') results = calculateEMA(prices, config.period);
      else if (config.type === 'RSI') results = calculateRSI(prices, config.period);
      else if (config.type === 'MACD') results = calculateMACD(prices, config.shortPeriod || 12, config.longPeriod || 26);
      else if (config.type === 'BB') results = calculateBollingerBands(prices, config.period || 20, config.stdDev || 2);
      else if (config.type === 'ATR') results = calculateATR(sourceData, config.period || 14);
      else if (config.type === 'VWAP') results = calculateVWAP(sourceData);
      else if (config.type === 'OBV') results = calculateOBV(sourceData);
      else if (config.type === 'STOCH') results = calculateStochastic(sourceData, config.period || 14, config.smoothK || 1, config.smoothD || 3);
      else if (config.type === 'ADX') results = calculateADX(sourceData, config.period || 14);
      else if (config.type === 'CCI') results = calculateCCI(sourceData, config.period || 20);
      else if (config.type === 'PSAR') results = calculatePSAR(sourceData, config.step || 0.02, config.maxStep || 0.2);
      else if (config.type === 'DC') results = calculateDonchianChannels(sourceData, config.period || 20);
      else if (config.type === 'KC') results = calculateKeltnerChannels(sourceData, config.period || 20, config.multiplier || 2);
      else if (config.type === 'MOM') results = calculateMomentum(prices, config.period || 10);
      else if (config.type === 'ROC') results = calculateROC(prices, config.period || 9);
      else if (config.type === 'WMA') results = calculateWMA(prices, config.period || 14);
      else if (config.type === 'HMA') results = calculateHMA(prices, config.period || 20);
      else if (config.type === 'CMF') results = calculateCMF(sourceData, config.period || 20);
      else if (config.type === 'SUPERTREND') results = calculateSuperTrend(sourceData, config.period || 10, config.multiplier || 3);
      else if (config.type === 'TEMA') results = calculateTEMA(prices, config.period || 14);
      else if (config.type === 'AO') results = calculateAO(sourceData);
      else if (config.type === 'WILLR') results = calculateWilliamsR(sourceData, config.period || 14);
      else if (config.type === 'UO') results = calculateUltimateOscillator(sourceData, config.p1 || 7, config.p2 || 14, config.p3 || 28);
      else if (config.type === 'VORTEX') results = calculateVortex(sourceData, config.period || 14);
      else if (config.type === 'TSI') results = calculateTSI(prices, config.r || 25, config.s || 13);
      else if (config.type === 'PIVOT') results = calculatePivotPoints(sourceData);
      else if (config.type === 'FVG') results = calculateFVG(sourceData);
      else if (config.type === 'SWING') results = calculateSwings(sourceData, config.left || 3, config.right || 3);
      else if (config.type === 'OB') results = calculateOrderBlocks(sourceData, config.threshold || 10);
      else if (config.type === 'ICHIMOKU') results = calculateIchimoku(sourceData, config.tenkan || 9, config.kijun || 26, config.senkouB || 52);
      else if (config.type === 'ATR_TS') results = calculateATRTrailingStop(sourceData, config.period || 22, config.multiplier || 3);
      else if (config.type === 'VOID') results = calculateLiquidityVoids(sourceData, config.period || 20);

      // ALIGNMENT
      if (results) {
         if (targetTF && htfData?.[targetTF]) {
            const alignedResults: Record<string, number[]> = {};
            const resultKeys = Array.isArray(results) ? [name] : Object.keys(results);
            resultKeys.forEach(k => { alignedResults[k] = new Array(data.length).fill(0); });
            let htfIdx = 0;
            for (let i = 0; i < data.length; i++) {
               const ltfBar = data[i];
               while (htfIdx + 1 < sourceData.length && sourceData[htfIdx + 1].timestamp <= ltfBar.timestamp) htfIdx++;
               resultKeys.forEach(k => {
                  const rawVal = Array.isArray(results) ? results[htfIdx] : (results as any)[k][htfIdx];
                  alignedResults[k][i] = rawVal;
               });
            }
            Object.assign(indData, alignedResults);
         } else {
            if (Array.isArray(results)) indData[name] = results;
            else {
               for (const [k, v] of Object.entries(results)) indData[k === '0' ? name : k] = v as number[];
            }
         }
      }
    }
  }

  // State initialization
  let equity = initialCap;
  let cash = initialCap;
  let positionSize = 0; 
  let posType: 'LONG' | 'SHORT' | null = null;
  let entryPrice = 0;
  let entryIndex = 0;
  
  const trades: TradeLocation[] = [];
  const equityCurve: { timestamp: number, equity: number }[] = [];
  const benchmarkCurve: { timestamp: number, equity: number }[] = [];
  const initialDataPrice = data.length > 0 ? data[0].open : 1;
  const benchShares = initialCap / initialDataPrice;

  let totalWins = 0, totalLosses = 0, peakEquity = initialCap, maxDrawdown = 0;
  let highestPriceSinceEntry = 0, lowestPriceSinceEntry = 0;
  let partialsExecuted: number[] = []; 
  let stopLossAdjusted = 0;

  const maxPeriod = Object.values(strategy.setup?.indicators || {}).reduce((max, ind) => Math.max(max, ind.period || 0), 0);
  const startIndex = Math.max(1, maxPeriod);

  for (let i = startIndex; i < data.length; i++) {
    const candle = data[i];
    const prevCandle = data[i - 1];
    const candleDate = new Date(candle.timestamp);
    
    const context: Record<string, number> = {
        close: prevCandle.close, open: prevCandle.open, high: prevCandle.high, low: prevCandle.low, volume: prevCandle.volume,
        hour: candleDate.getUTCHours(), minute: candleDate.getUTCMinutes(), dayOfWeek: candleDate.getUTCDay(),
        dayOfMonth: candleDate.getUTCDate(), month: candleDate.getUTCMonth() + 1
    };
    
    for (const key in indData) {
        context[key] = indData[key][i - 1];
        context[`${key}_prev`] = i > 1 ? indData[key][i - 2] : indData[key][i - 1];
    }

    const entryLong = safeEvaluate(strategy.entry.logic, context);
    const entryShort = strategy.entry.shortLogic ? safeEvaluate(strategy.entry.shortLogic, context) : false;
    const exitLong = safeEvaluate(strategy.exit.logic, context);
    const exitShort = strategy.exit.shortLogic ? safeEvaluate(strategy.exit.shortLogic, context) : exitLong;

    // ORDER EXECUTION (ENTRY)
    if (posType === null) {
        if (entryLong || entryShort) {
            posType = entryLong ? 'LONG' : 'SHORT';
            const execPrice = candle.open;
            const slippageVal = (execPrice * ((params.slippageBps || 0) / 10000));
            
            // LONG entry: paying ask (price + slippage), SHORT entry: receiving bid (price - slippage)
            const totalExecPrice = posType === 'LONG' 
                ? execPrice + (execPrice * comms) + slippageVal
                : execPrice - (execPrice * comms) - slippageVal;

            const alloc = params.positionSizing ?? 1.0;
            const capitalToDeploy = cash * alloc;
            
            positionSize = capitalToDeploy / execPrice; // Use raw price for unit calculation
            
            if (posType === 'LONG') {
                cash -= (positionSize * totalExecPrice);
            } else {
                cash += (positionSize * totalExecPrice);
            }

            entryPrice = totalExecPrice;
            highestPriceSinceEntry = candle.high;
            lowestPriceSinceEntry = candle.low;
            entryIndex = i;
            partialsExecuted = [];
            stopLossAdjusted = 0;
            trades.push({ 
                timestamp: candle.timestamp, 
                price: totalExecPrice, 
                type: posType === 'LONG' ? 'BUY' : 'SELL', 
                size: positionSize 
            });
        }
    } 
    // ORDER EXECUTION (MANAGEMENT / EXIT)
    else if (posType !== null) {
        if (candle.high > highestPriceSinceEntry) highestPriceSinceEntry = candle.high;
        if (candle.low < lowestPriceSinceEntry) lowestPriceSinceEntry = candle.low;

        const isLong = posType === 'LONG';

        // Break-even logic
        if (!stopLossAdjusted && strategy.exit.bePct) {
            const triggered = isLong 
                ? candle.high >= entryPrice * (1 + strategy.exit.bePct)
                : candle.low <= entryPrice * (1 - strategy.exit.bePct);
            if (triggered) stopLossAdjusted = entryPrice;
        }

        // Multi-tier Partial Profit
        if (strategy.exit.partialTps) {
           strategy.exit.partialTps.forEach((tp, idx) => {
              const triggered = isLong 
                ? candle.high >= entryPrice * (1 + tp.pct)
                : candle.low <= entryPrice * (1 - tp.pct);

              if (!partialsExecuted.includes(idx) && triggered) {
                 partialsExecuted.push(idx);
                 const sizeToClose = positionSize * tp.size;
                 const ptpExecPrice = isLong 
                    ? Math.max(candle.open, entryPrice * (1 + tp.pct))
                    : Math.min(candle.open, entryPrice * (1 - tp.pct));
                 
                 const slippageVal = (ptpExecPrice * ((params.slippageBps || 0) / 10000));
                 const totalExitPrice = isLong
                    ? ptpExecPrice - (ptpExecPrice * comms) - slippageVal
                    : ptpExecPrice + (ptpExecPrice * comms) + slippageVal;

                 if (isLong) cash += sizeToClose * totalExitPrice;
                 else cash -= sizeToClose * totalExitPrice;

                 positionSize -= sizeToClose;
                 const pnl = isLong 
                    ? (totalExitPrice - entryPrice) * sizeToClose
                    : (entryPrice - totalExitPrice) * sizeToClose;

                 trades.push({ 
                     timestamp: candle.timestamp, 
                     price: totalExitPrice, 
                     type: 'PARTIAL_SELL', 
                     size: sizeToClose, 
                     pnl 
                 });
              }
           });
        }

        // Exit Checks
        let shouldExit = isLong ? exitLong : exitShort;
        let exitPriceTarget = candle.open;

        // Stop Loss
        const sl = stopLossAdjusted || (strategy.exit.slPct 
            ? (isLong ? entryPrice * (1 - strategy.exit.slPct) : entryPrice * (1 + strategy.exit.slPct)) 
            : 0);
        
        if (sl > 0) {
            if (isLong && candle.low <= sl) { shouldExit = true; exitPriceTarget = Math.min(candle.open, sl); }
            if (!isLong && candle.high >= sl) { shouldExit = true; exitPriceTarget = Math.max(candle.open, sl); }
        }

        // Trailing Stop
        if (!shouldExit && strategy.exit.tslPct) {
            if (isLong) {
                const tsl = highestPriceSinceEntry * (1 - strategy.exit.tslPct);
                if (candle.low <= tsl) { shouldExit = true; exitPriceTarget = Math.min(candle.open, tsl); }
            } else {
                const tsl = lowestPriceSinceEntry * (1 + strategy.exit.tslPct);
                if (candle.high >= tsl) { shouldExit = true; exitPriceTarget = Math.max(candle.open, tsl); }
            }
        }

        // Take Profit
        if (!shouldExit && strategy.exit.tpPct) {
            if (isLong) {
                const tp = entryPrice * (1 + strategy.exit.tpPct);
                if (candle.high >= tp) { shouldExit = true; exitPriceTarget = Math.max(candle.open, tp); }
            } else {
                const tp = entryPrice * (1 - strategy.exit.tpPct);
                if (candle.low <= tp) { shouldExit = true; exitPriceTarget = Math.min(candle.open, tp); }
            }
        }

        // Expiry & EOD
        if (!shouldExit && strategy.exit.expiryBars && (i - entryIndex) >= strategy.exit.expiryBars) { shouldExit = true; exitPriceTarget = candle.open; }
        if (!shouldExit && strategy.exit.endOfDayExit && candleDate.getUTCHours() === 20 && candleDate.getUTCMinutes() >= 30) { shouldExit = true; exitPriceTarget = candle.close; }

        if (shouldExit) {
             const slippageVal = (exitPriceTarget * ((params.slippageBps || 0) / 10000));
             const finalExitPrice = isLong
                ? exitPriceTarget - (exitPriceTarget * comms) - slippageVal
                : exitPriceTarget + (exitPriceTarget * comms) + slippageVal;

             const pnl = isLong
                ? (positionSize * finalExitPrice) - (positionSize * entryPrice)
                : (positionSize * entryPrice) - (positionSize * finalExitPrice);
             
             if (isLong) cash += (positionSize * finalExitPrice);
             else cash -= (positionSize * finalExitPrice);

             if (pnl > 0) totalWins++; else totalLosses++;
             
             trades.push({ 
               timestamp: candle.timestamp, 
               price: finalExitPrice, 
               type: isLong ? 'SELL' : 'BUY', // Buying back a short is a 'BUY' order
               size: positionSize, 
               pnl,
               mfe: isLong ? (highestPriceSinceEntry - entryPrice) / entryPrice * 100 : (entryPrice - lowestPriceSinceEntry) / entryPrice * 100,
               mae: isLong ? (lowestPriceSinceEntry - entryPrice) / entryPrice * 100 : (entryPrice - highestPriceSinceEntry) / entryPrice * 100,
               duration: i - entryIndex
             });
             
             positionSize = 0; entryPrice = 0; posType = null;
        }
    }

    // Equity calculation
    if (posType === 'LONG') {
        equity = cash + (positionSize * candle.close);
    } else if (posType === 'SHORT') {
        equity = cash - (positionSize * candle.close);
    } else {
        equity = cash;
    }
    equityCurve.push({ timestamp: candle.timestamp, equity });
    benchmarkCurve.push({ timestamp: candle.timestamp, equity: benchShares * candle.close });
    if (equity > peakEquity) peakEquity = equity;
    const dd = (peakEquity - equity) / peakEquity;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  // Force close final
  if (posType !== null) {
      const fc = data[data.length - 1];
      const isLong = posType === 'LONG';
      const fcPrice = fc.close;
      const slippageVal = (fcPrice * ((params.slippageBps || 0) / 10000));
      const finalExitPrice = isLong 
        ? fcPrice - (fcPrice * comms) - slippageVal
        : fcPrice + (fcPrice * comms) + slippageVal;

      const pnl = isLong
        ? (positionSize * finalExitPrice) - (positionSize * entryPrice)
        : (positionSize * entryPrice) - (positionSize * finalExitPrice);
      
      if (isLong) cash += (positionSize * finalExitPrice);
      else cash -= (positionSize * finalExitPrice);

      if (pnl > 0) totalWins++; else totalLosses++;
      trades.push({ 
        timestamp: fc.timestamp, 
        price: finalExitPrice, 
        type: isLong ? 'SELL' : 'BUY', 
        size: positionSize, 
        pnl, 
        duration: data.length - entryIndex 
      });
      posType = null;
  }

  // STATS
  const tradePnl = trades.filter(t => t.pnl !== undefined).map(t => t.pnl!);
  const grossProfit = tradePnl.filter(p => p > 0).reduce((s, p) => s + p, 0);
  const grossLoss = Math.abs(tradePnl.filter(p => p <= 0).reduce((s, p) => s + p, 0));
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  const returns = tradePnl.map(p => p / (initialCap / 100));
  const avgRet = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const stdRet = Math.sqrt(returns.map(x => Math.pow(x - avgRet, 2)).reduce((a, b) => a + b, 0) / (returns.length || 1));
  
  // SQN = (Avg Profit / StdDev Profit) * sqrt(N)
  const sqn = stdRet === 0 ? 0 : (avgRet / stdRet) * Math.sqrt(returns.length);

  // MONTE CARLO (Shuffled returns)
  let monteLuck = 0, monteRuin = 0, finalMcEquities: number[] = [];
  if (returns.length > 5) {
     for (let m = 0; m < 500; m++) {
        let mcEquity = initialCap;
        const shuffled = [...returns].sort(() => Math.random() - 0.5);
        shuffled.forEach(r => { mcEquity *= (1 + (r / 100)); });
        if (mcEquity < initialCap * 0.5) monteRuin++;
        finalMcEquities.push(mcEquity);
     }
     finalMcEquities.sort((a,b) => a - b);
     monteLuck = (equity - finalMcEquities[Math.floor(finalMcEquities.length / 2)]) / initialCap;
  }

  return {
    equityCurve, benchmarkCurve, trades, finalEquity: cash,
    totalTrades: tradePnl.length,
    winRate: totalWins / (totalWins + totalLosses || 1),
    mdd: maxDrawdown, profitFactor, sqn,
    sharpeRatio: stdRet === 0 ? 0 : (avgRet / stdRet) * Math.sqrt(252),
    expectancy: tradePnl.length > 0 ? (grossProfit - grossLoss) / tradePnl.length : 0,
    monteCarlo: { luckFactor: monteLuck, ruinProb: monteRuin / 500, medianEquity: finalMcEquities[250] || equity }
  } as any;
}

// ... Portfolio and Walk-Forward ... (rest of the file logic remains same or similar)

export function runPortfolioSimulation(dataMap: Record<string, OHLCV[]>, strategy: StrategyJSON, params: StrategyParameters): BacktestResult {
    const assets = Object.keys(dataMap);
    const results: Record<string, BacktestResult> = {};
    const scaledParams = { ...params, initialCapital: (params.initialCapital ?? 10000) / assets.length };
    assets.forEach(s => results[s] = runSimulation(dataMap[s], strategy, scaledParams));

    const compositeEquity: Record<number, number> = {};
    assets.forEach(s => results[s].equityCurve.forEach(p => compositeEquity[p.timestamp] = (compositeEquity[p.timestamp] || 0) + p.equity));
    const equityCurve = Object.keys(compositeEquity).map(ts => ({ timestamp: parseInt(ts), equity: compositeEquity[parseInt(ts)] })).sort((a, b) => a.timestamp - b.timestamp);

    return {
        equityCurve,
        trades: assets.flatMap(s => results[s].trades.map(t => ({ ...t, symbol: s }))).sort((a,b) => a.timestamp - b.timestamp),
        finalEquity: equityCurve[equityCurve.length - 1]?.equity || 0,
        totalTrades: assets.reduce((sum, s) => sum + results[s].totalTrades, 0),
        winRate: assets.reduce((sum, s) => sum + results[s].winRate, 0) / assets.length,
        mdd: Math.max(...assets.map(s => results[s].mdd))
    } as any;
}

export function runWalkForward(data: OHLCV[], strategy: StrategyJSON, params: StrategyParameters): any {
    const splits = 4;
    const chunkSize = Math.floor(data.length / splits);
    const results = [];
    for (let i = 0; i < splits - 1; i++) {
        results.push({
            period: i + 1,
            train: runSimulation(data.slice(i * chunkSize, (i+1) * chunkSize), strategy, params),
            test: runSimulation(data.slice((i+1) * chunkSize, (i+2) * chunkSize), strategy, params)
        });
    }
    return results;
}

if (typeof self !== 'undefined') {
    self.addEventListener('message', (e) => {
        const { id, type, data, strategy, params, dataMap } = e.data;
        try {
            let res;
            if (type === 'portfolio' && dataMap) res = runPortfolioSimulation(dataMap, strategy, params);
            else if (type === 'walk-forward' && data) res = runWalkForward(data, strategy, params);
            else res = runSimulation(data, strategy, params);
            self.postMessage({ id, status: 'success', results: res });
        } catch(err: any) {
            self.postMessage({ id, status: 'error', error: err.message });
        }
    });
}
