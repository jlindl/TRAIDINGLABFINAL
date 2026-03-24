export interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export async function fetchMarketData(symbol: string, timeframe: string, apiKey: string): Promise<OHLCV[]> {
    if (!apiKey || apiKey === 'demo') {
        throw new Error("Alpha Vantage API Key is missing. Please add it to your profile or .env.local as ALPHA_VANTAGE_API_KEY.");
    }

    const isCrypto = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE'].includes(symbol.toUpperCase()) || symbol.length > 5;
    
    let url = "";
    if (isCrypto) {
        url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${apiKey}`;
    } else {
        const functionType = timeframe.toUpperCase() === '1D' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_DAILY';
        url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Alpha Vantage HTTP error: ${res.status}`);
    }

    const data = await res.json();

    if (data["Error Message"]) {
        throw new Error(`Alpha Vantage Error: ${data["Error Message"]}`);
    }
    if (data["Information"] && data["Information"].includes("rate limit")) {
         throw new Error("Alpha Vantage Rate Limit Exceeded");
    }

    const timeSeriesKey = Object.keys(data).find(key => key.includes("Time Series"));
    if (!timeSeriesKey) {
        throw new Error(`Invalid response format from Alpha Vantage. (Symbol: ${symbol})`);
    }

    const timeSeries = data[timeSeriesKey];
    const ohlcvData: OHLCV[] = [];

    for (const [dateStr, values] of Object.entries(timeSeries)) {
        // Crypto JSON uses different keys than Equities
        if (isCrypto) {
            ohlcvData.push({
                timestamp: new Date(dateStr).getTime(),
                open: parseFloat((values as any)["1a. open (USD)"]),
                high: parseFloat((values as any)["2a. high (USD)"]),
                low: parseFloat((values as any)["3a. low (USD)"]),
                close: parseFloat((values as any)["4a. close (USD)"]),
                volume: parseFloat((values as any)["5. volume"])
            });
        } else {
            ohlcvData.push({
                timestamp: new Date(dateStr).getTime(),
                open: parseFloat((values as any)["1. open"]),
                high: parseFloat((values as any)["2. high"]),
                low: parseFloat((values as any)["3. low"]),
                close: parseFloat((values as any)["4. close"]),
                volume: parseFloat((values as any)["5. volume"])
            });
        }
    }

    return ohlcvData.sort((a, b) => a.timestamp - b.timestamp);
}
