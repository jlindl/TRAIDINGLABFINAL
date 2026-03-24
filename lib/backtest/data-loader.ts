import { OHLCV } from "./indicators";
import Papa from "papaparse";

/**
 * Parses a standard OHLCV CSV file (e.g., exported from TradingView or Yahoo Finance)
 * Expected columns: Date/Time, Open, High, Low, Close, Volume
 */
export async function parseCSVData(file: File): Promise<OHLCV[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: OHLCV[] = results.data.map((row: any) => {
             // Try to find the date column
             const dateKey = Object.keys(row).find(k => k.toLowerCase().includes('date') || k.toLowerCase().includes('time'));
             const openKey = Object.keys(row).find(k => k.toLowerCase().includes('open'));
             const highKey = Object.keys(row).find(k => k.toLowerCase().includes('high'));
             const lowKey = Object.keys(row).find(k => k.toLowerCase().includes('low'));
             const closeKey = Object.keys(row).find(k => k.toLowerCase().includes('close'));
             const volKey = Object.keys(row).find(k => k.toLowerCase().includes('vol'));

             if (!dateKey || !openKey || !highKey || !lowKey || !closeKey) {
                throw new Error("CSV missing required OHLCV columns.");
             }

             return {
                timestamp: new Date(row[dateKey]).getTime(),
                open: parseFloat(row[openKey]),
                high: parseFloat(row[highKey]),
                low: parseFloat(row[lowKey]),
                close: parseFloat(row[closeKey]),
                volume: volKey ? parseFloat(row[volKey]) : 0
             };
          });

          // Sort chronologically ascending
          data.sort((a, b) => a.timestamp - b.timestamp);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Fetches real market data from Alpha Vantage via Supabase Proxy (or direct Edge Function in prod)
 */
export async function fetchAlphaVantageData(symbol: string, timeframe: string): Promise<OHLCV[]> {
  try {
     const res = await fetch(`/api/market/history?symbol=${symbol}&timeframe=${timeframe}`);
     const json = await res.json();

     if (!res.ok) {
        throw new Error(json.error || "Failed to fetch market data");
     }
     
     return json.data as OHLCV[];
  } catch (err: any) {
     console.error("Alpha Vantage Fetch Error:", err);
     throw err; // Re-throw to be caught by the UI handler
  }
}
/**
 * Fetches and aligns multiple timeframes into a single series
 */
export async function fetchMultiTimeframeData(
  symbol: string, 
  primaryTimeframe: string, 
  additionalTimeframes: string[]
): Promise<OHLCV[]> {
  // Fetch all timeframes in parallel
  const fetchPromises = [
    fetchAlphaVantageData(symbol, primaryTimeframe),
    ...additionalTimeframes.map(tf => fetchAlphaVantageData(symbol, tf))
  ];

  const results = await Promise.all(fetchPromises);
  let alignedData = results[0]; // Start with primary

  // Align each additional HTF to the primary series
  additionalTimeframes.forEach((tf, i) => {
    const htfData = results[i + 1];
    alignedData = alignHTFData(alignedData, htfData, tf);
  });

  return alignedData;
}

/**
 * Maps Higher Timeframe (HTF) data to Lower Timeframe (LTF) bars.
 * Ensures NO LOOK-AHEAD BIAS: An LTF bar at T will only see the HTF bar that CLOSED at or before T.
 */
function alignHTFData(ltfData: OHLCV[], htfData: OHLCV[], tfName: string): OHLCV[] {
  let htfIndex = 0;
  
  return ltfData.map(ltfBar => {
    // Find the latest HTF bar that CLOSED before or at the start of this LTF bar
    // In our engine, bars are timestamped at their OPEN.
    // So if LTF is 1H (Open at 10:00) and HTF is 1D, we want the 1D bar that closed at 00:00.
    while (htfIndex + 1 < htfData.length && htfData[htfIndex + 1].timestamp <= ltfBar.timestamp) {
      htfIndex++;
    }

    const currentHTF = htfData[htfIndex];
    const prefix = `htf_${tfName}_`.toLowerCase();

    return {
      ...ltfBar,
      [`${prefix}open`]: currentHTF.open,
      [`${prefix}high`]: currentHTF.high,
      [`${prefix}low`]: currentHTF.low,
      [`${prefix}close`]: currentHTF.close,
      [`${prefix}volume`]: currentHTF.volume,
    } as any;
  });
}

function generateMockData(symbol: string): OHLCV[] {
    const data: OHLCV[] = [];
    let price = 100;
    const now = Date.now();
    for(let i=1000; i >= 0; i--) {
        const volatility = price * 0.02; // 2% daily vol
        const open = price;
        const high = open + (Math.random() * volatility);
        const low = open - (Math.random() * volatility);
        const close = low + (Math.random() * (high - low));
        price = close; // set next open

        data.push({
            timestamp: now - (i * 24 * 60 * 60 * 1000), // Daily bars back
            open,
            high,
            low,
            close,
            volume: Math.floor(Math.random() * 1000000)
        });
    }
    return data;
}
