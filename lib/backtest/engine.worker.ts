import { OHLCV, calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands, calculateATR, calculateVWAP, calculateOBV, calculateStochastic, calculateADX, calculateCCI, calculatePSAR, calculateDonchianChannels, calculateKeltnerChannels, calculateMomentum, calculateROC, calculateWMA, calculateHMA, calculateCMF, calculateSuperTrend, calculateTEMA, calculateAO, calculateWilliamsR, calculateUltimateOscillator, calculateVortex, calculateTSI, calculatePivotPoints, calculateFVG, calculateSwings, calculateOrderBlocks } from "./indicators";
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
  trades: any[];
  finalEquity: number;
  totalTrades: number;
  winRate: number;
  mdd: number;
  benchmarkCurve: { timestamp: number, equity: number }[];
  sharpeRatio?: number;
  profitFactor?: number;
  expectancy?: number;
  recoveryFactor?: number;
}

export interface StrategyJSON {
  setup: {
    indicators: { [key: string]: Record<string, any> };
  };
  entry: {
    logic: string; // e.g., "SMA_50 > SMA_200 and RSI_14 < 30"
  };
  exit: {
    logic: string;
    tpPct?: number;
    slPct?: number;
    tslPct?: number; // Trailing Stop Loss
    bePct?: number; // Break-even trigger (profit %)
    partialTpPct?: number; // Partial Profit target (%)
    partialTpSize?: number; // Portion to close (0-1)
  };
}

/**
 * SIMULATION ENGINE
 * This runs locally (or in a Web Worker) to evaluate a JSON strategy against data.
 */
export function runSimulation(
  data: OHLCV[],
  strategy: StrategyJSON,
  params: StrategyParameters,
  htfData?: Record<string, OHLCV[]>
): BacktestResult {
  const initialCap = params.initialCapital ?? 10000;
  const comms = params.commission ?? 0.001; // default 0.1%

  // 1. Pre-calculate all requested indicators
  const indData: Record<string, number[]> = {};
  
  if (strategy.setup && strategy.setup.indicators) {
    for (const [name, config] of Object.entries(strategy.setup.indicators)) {
      const targetTF = config.timeframe; // e.g., "1D"
      const sourceData = (targetTF && htfData?.[targetTF]) ? htfData[targetTF] : data;
      const prices = sourceData.map(d => d.close);
      
      let results: any = null;
      
      // Calculate on SOURCE timeframe
      if (config.type === 'SMA') {
          results = calculateSMA(prices, config.period);
      } else if (config.type === 'EMA') {
          results = calculateEMA(prices, config.period);
      } else if (config.type === 'RSI') {
          results = calculateRSI(prices, config.period);
      } else if (config.type === 'MACD') {
          results = calculateMACD(prices, config.shortPeriod || 12, config.longPeriod || 26);
      } else if (config.type === 'BB') {
          results = calculateBollingerBands(prices, config.period || 20, config.stdDev || 2);
      } else if (config.type === 'ATR') {
          results = calculateATR(sourceData, config.period || 14);
      } else if (config.type === 'VWAP') {
          results = calculateVWAP(sourceData);
      } else if (config.type === 'OBV') {
          results = calculateOBV(sourceData);
      } else if (config.type === 'STOCH') {
          results = calculateStochastic(sourceData, config.period || 14, config.smoothK || 1, config.smoothD || 3);
      } else if (config.type === 'ADX') {
          results = calculateADX(sourceData, config.period || 14);
      } else if (config.type === 'CCI') {
          results = calculateCCI(sourceData, config.period || 20);
      } else if (config.type === 'PSAR') {
          results = calculatePSAR(sourceData, config.step || 0.02, config.maxStep || 0.2);
      } else if (config.type === 'DC') {
          results = calculateDonchianChannels(sourceData, config.period || 20);
      } else if (config.type === 'KC') {
          results = calculateKeltnerChannels(sourceData, config.period || 20, config.multiplier || 2);
      } else if (config.type === 'MOM') {
          results = calculateMomentum(prices, config.period || 10);
      } else if (config.type === 'ROC') {
          results = calculateROC(prices, config.period || 9);
      } else if (config.type === 'WMA') {
          results = calculateWMA(prices, config.period || 14);
      } else if (config.type === 'HMA') {
          results = calculateHMA(prices, config.period || 20);
      } else if (config.type === 'CMF') {
          results = calculateCMF(sourceData, config.period || 20);
      } else if (config.type === 'SUPERTREND') {
          results = calculateSuperTrend(sourceData, config.period || 10, config.multiplier || 3);
      } else if (config.type === 'TEMA') {
          results = calculateTEMA(prices, config.period || 14);
      } else if (config.type === 'AO') {
          results = calculateAO(sourceData);
      } else if (config.type === 'WILLR') {
          results = calculateWilliamsR(sourceData, config.period || 14);
      } else if (config.type === 'UO') {
          results = calculateUltimateOscillator(sourceData, config.p1 || 7, config.p2 || 14, config.p3 || 28);
      } else if (config.type === 'VORTEX') {
          results = calculateVortex(sourceData, config.period || 14);
      } else if (config.type === 'TSI') {
          results = calculateTSI(prices, config.r || 25, config.s || 13);
      } else if (config.type === 'PIVOT') {
          results = calculatePivotPoints(sourceData);
      } else if (config.type === 'FVG') {
          results = calculateFVG(sourceData);
      } else if (config.type === 'SWING') {
          results = calculateSwings(sourceData, config.left || 3, config.right || 3);
      } else if (config.type === 'OB') {
          results = calculateOrderBlocks(sourceData, config.threshold || 10);
      }

      // 2. ALIGNMTENT: Map results back to the primary "data" series (prevent look-ahead)
      if (results) {
         if (targetTF && htfData?.[targetTF]) {
            // Align HTF results to primary timeframe bars
            const alignedResults: Record<string, number[]> = {};
            const resultKeys = Array.isArray(results) ? [name] : Object.keys(results);
            
            resultKeys.forEach(k => { alignedResults[k] = new Array(data.length).fill(0); });

            let htfIdx = 0;
            for (let i = 0; i < data.length; i++) {
               const ltfBar = data[i];
               // Find latest CLOSED HTF bar
               while (htfIdx + 1 < sourceData.length && sourceData[htfIdx + 1].timestamp <= ltfBar.timestamp) {
                  htfIdx++;
               }
               
               resultKeys.forEach(k => {
                  const rawVal = Array.isArray(results) ? results[htfIdx] : (results as any)[k][htfIdx];
                  alignedResults[k][i] = rawVal;
               });
            }

            Object.assign(indData, alignedResults);
         } else {
            // Standard alignment (primary timeframe)
            if (Array.isArray(results)) {
               indData[name] = results;
            } else {
               for (const [k, v] of Object.entries(results)) {
                  indData[k === '0' ? name : k] = v as number[];
               }
            }
         }
      }
    }
  }

  // State initialization
  let equity = initialCap;
  let cash = initialCap;
  let positionSize = 0; // shares/coins held
  let entryPrice = 0;
  
  const trades: TradeLocation[] = [];
  const equityCurve: { timestamp: number, equity: number }[] = [];
  const benchmarkCurve: { timestamp: number, equity: number }[] = [];
  
  // Benchmark logic
  const initialDataPrice = data.length > 0 ? data[0].open : 1;
  const benchShares = initialCap / initialDataPrice;

  let totalWins = 0;
  let totalLosses = 0;
  let peakEquity = initialCap;
  let maxDrawdown = 0;
  let highestPriceSinceEntry = 0;
  let lowestPriceSinceEntry = 0;
  let entryIndex = 0;
  let partialExitHit = false;
  let stopLossAdjusted = 0;

    // 2. Main Simulation Loop (OHLCV Walk-forward)
  // ... (calculation continues)
  const maxPeriod = Object.values(strategy.setup?.indicators || {}).reduce((max, ind) => Math.max(max, ind.period || 0), 0);
  const startIndex = Math.max(1, maxPeriod);

  for (let i = startIndex; i < data.length; i++) {
    const candle = data[i];
    
    // ... evaluation loop
    const prevCandle = data[i - 1];
    
    // Time derivations
    const candleDate = new Date(candle.timestamp);
    const hour = candleDate.getUTCHours();
    const minute = candleDate.getUTCMinutes();
    const dayOfWeek = candleDate.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayOfMonth = candleDate.getUTCDate();
    const month = candleDate.getUTCMonth() + 1; // 1 = Jan
    
    // Build context object for expression evaluation
    const context: Record<string, number> = {
        close: prevCandle.close,
        open: prevCandle.open,
        high: prevCandle.high,
        low: prevCandle.low,
        volume: prevCandle.volume,
        hour,
        minute,
        dayOfWeek,
        dayOfMonth,
        month
    };
    
    // Inject indicator values for the previous bar
    for (const key in indData) {
        context[key] = indData[key][i - 1];
        // Only inject _prev if we have a bar before the current evaluation point
        if (i > 1 && indData[key][i - 2] !== undefined) {
            context[`${key}_prev`] = indData[key][i - 2];
        } else {
            // High-reliability default: fallback to current if at start of series
            context[`${key}_prev`] = indData[key][i - 1];
        }
    }

    // Evaluate Logic
    const entrySignal = safeEvaluate(strategy.entry.logic, context);
    const exitSignal = safeEvaluate(strategy.exit.logic, context);

    // Order Execution
    if (positionSize === 0 && entrySignal) {
        // EXECUTE BUY at the Open of the current candle
        const execPrice = candle.open;
        const cost = execPrice * comms;
        const totalExecPrice = execPrice + cost + (execPrice * ((params.slippageBps || 0) / 10000));
        
        const alloc = params.positionSizing ?? 1.0;
        const capitalToDeploy = cash * alloc;
        
        positionSize = capitalToDeploy / totalExecPrice;
        cash -= capitalToDeploy;
        entryPrice = totalExecPrice;
        highestPriceSinceEntry = candle.high;
        lowestPriceSinceEntry = candle.low;
        entryIndex = i;
        partialExitHit = false;
        stopLossAdjusted = 0;
        
        trades.push({ timestamp: candle.timestamp, price: totalExecPrice, type: 'BUY', size: positionSize });
    } 
    else if (positionSize > 0) {
        // Update high/low water marks for MAE/MFE and TSL
        if (candle.high > highestPriceSinceEntry) highestPriceSinceEntry = candle.high;
        if (candle.low < lowestPriceSinceEntry) lowestPriceSinceEntry = candle.low;

        // Break-even logic
        if (!stopLossAdjusted && strategy.exit.bePct) {
            const beTrigger = entryPrice * (1 + strategy.exit.bePct);
            if (candle.high >= beTrigger) {
                stopLossAdjusted = entryPrice;
            }
        }

        // Partial Take Profit logic
        if (!partialExitHit && strategy.exit.partialTpPct && strategy.exit.partialTpSize) {
            const ptpPrice = entryPrice * (1 + strategy.exit.partialTpPct);
            if (candle.high >= ptpPrice) {
                partialExitHit = true;
                const sizeToClose = positionSize * strategy.exit.partialTpSize;
                const ptpExecPrice = candle.open > ptpPrice ? candle.open : ptpPrice;
                const cost = ptpExecPrice * comms;
                const totalSellPrice = ptpExecPrice - cost - (ptpExecPrice * ((params.slippageBps || 0) / 10000));
                
                const proceeds = sizeToClose * totalSellPrice;
                cash += proceeds;
                positionSize -= sizeToClose;
                
                trades.push({ 
                    timestamp: candle.timestamp, 
                    price: totalSellPrice, 
                    type: 'PARTIAL_SELL', 
                    size: sizeToClose, 
                    pnl: (totalSellPrice - entryPrice) * sizeToClose 
                });
            }
        }

        // Main Exit checks
        let shouldExit = exitSignal;
        let exitExecPrice = candle.open;

        // Stop Loss check
        const currentSlPrice = stopLossAdjusted || (strategy.exit.slPct ? entryPrice * (1 - strategy.exit.slPct) : 0);
        if (currentSlPrice > 0 && candle.low <= currentSlPrice) {
            shouldExit = true;
            exitExecPrice = candle.open < currentSlPrice ? candle.open : currentSlPrice;
        }
        
        // Trailing Stop check
        if (!shouldExit && strategy.exit.tslPct) {
            const tslPrice = highestPriceSinceEntry * (1 - strategy.exit.tslPct);
            if (candle.low <= tslPrice) {
                shouldExit = true;
                exitExecPrice = candle.open < tslPrice ? candle.open : tslPrice;
            }
        }

        // Static Take Profit check
        if (!shouldExit && strategy.exit.tpPct) {
            const tpPrice = entryPrice * (1 + strategy.exit.tpPct);
            if (candle.high >= tpPrice) {
                shouldExit = true;
                exitExecPrice = candle.open > tpPrice ? candle.open : tpPrice;
            }
        }

        if (shouldExit) {
             // EXECUTE SELL
             const cost = exitExecPrice * comms;
             const totalExecPrice = exitExecPrice - cost - (exitExecPrice * ((params.slippageBps || 0) / 10000));
             
             const grossProceeds = positionSize * totalExecPrice;
             const pnl = grossProceeds - (positionSize * entryPrice);
             
             cash += grossProceeds;
             
              const mfe = (highestPriceSinceEntry - entryPrice) / entryPrice * 100;
              const mae = (lowestPriceSinceEntry - entryPrice) / entryPrice * 100;

              trades.push({ 
                timestamp: candle.timestamp, 
                price: totalExecPrice, 
                type: 'SELL', 
                size: positionSize, 
                pnl,
                mfe,
                mae,
                duration: i - entryIndex
              });
              
              positionSize = 0;
              entryPrice = 0;
        }
    }


    // Mark-to-Market Equity Tracking
    equity = cash + (positionSize * candle.close);
    equityCurve.push({ timestamp: candle.timestamp, equity });
    benchmarkCurve.push({ timestamp: candle.timestamp, equity: benchShares * candle.close });
    
    if (equity > peakEquity) peakEquity = equity;
    const currentDrawdown = (peakEquity - equity) / peakEquity;
    if (currentDrawdown > maxDrawdown) maxDrawdown = currentDrawdown;
  }

  // Force close any open position at the end
  if (positionSize > 0) {
      const finalCandle = data[data.length - 1];
      const exitExecPrice = finalCandle.close;
      const cost = exitExecPrice * comms;
      const totalExecPrice = exitExecPrice - cost;
             
      const grossProceeds = positionSize * totalExecPrice;
      const pnl = grossProceeds - (positionSize * entryPrice);
      cash += grossProceeds;
      
      if (pnl > 0) totalWins++;
      else totalLosses++;

      const mfe = (highestPriceSinceEntry - entryPrice) / entryPrice * 100;
      const mae = (lowestPriceSinceEntry - entryPrice) / entryPrice * 100;
             
      trades.push({ 
        timestamp: finalCandle.timestamp, 
        price: totalExecPrice, 
        type: 'SELL', 
        size: positionSize, 
        pnl,
        mfe,
        mae,
        duration: data.length - entryIndex
      });
  }

  equity = cash;
  const winsList = trades.filter(t => (t.pnl || 0) > 0);
  const lossesList = trades.filter(t => (t.pnl || 0) <= 0 && t.type !== 'BUY');
  const grossProfit = winsList.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(lossesList.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0));
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

  const returns = trades.filter(t => t.pnl !== undefined).map(t => t.pnl! / (initialCap / 100) ); // Normalized % returns
  const avgReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const stdDev = Math.sqrt(returns.map(x => Math.pow(x - avgReturn, 2)).reduce((a, b) => a + b, 0) / (returns.length || 1));
  const sharpeRatio = stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);

  return {
    equityCurve,
    benchmarkCurve,
    trades,
    finalEquity: equity,
    totalTrades: trades.filter(t => t.type === 'SELL' || t.type === 'PARTIAL_SELL').length,
    winRate: totalWins / (totalWins + totalLosses || 1),
    mdd: maxDrawdown,
    sharpeRatio,
    profitFactor,
    expectancy: (totalWins + totalLosses) > 0 ? (grossProfit - grossLoss) / (totalWins + totalLosses) : 0,
    recoveryFactor: maxDrawdown === 0 ? 0 : ((equity - initialCap) / initialCap * 100) / (maxDrawdown * 100)
  };
}

// Web Worker API listener
if (typeof self !== 'undefined') {
    self.addEventListener('message', (e) => {
        const { id, data, strategy, params, htfData } = e.data;
        try {
            const results = runSimulation(data, strategy, params, htfData);
            self.postMessage({ id, status: 'success', results });
        } catch(err: any) {
            self.postMessage({ id, status: 'error', error: err.message });
        }
    });
}
