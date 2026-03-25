import { z } from "zod";

const alphaVantageTSRecord = z.record(z.string(), z.string());

export async function fetchMarketData(symbol: string, timeframe: string = "1D", apiKey: string) {
    let func = "TIME_SERIES_DAILY";
    let dataKey = "Time Series (Daily)";

    switch (timeframe.toUpperCase()) {
        case "1H":
        case "15M":
        case "5M":
        case "1M":
            func = "TIME_SERIES_INTRADAY";
            dataKey = `Time Series (${timeframe})`;
            break;
        case "1W":
            func = "TIME_SERIES_WEEKLY";
            dataKey = "Weekly Time Series";
            break;
        case "1M_TF": // 1M as timeframe to distinguish from monthly
            func = "TIME_SERIES_MONTHLY";
            dataKey = "Monthly Time Series";
            break;
        default:
            func = "TIME_SERIES_DAILY";
            dataKey = "Time Series (Daily)";
    }

    const intervalParam = func === "TIME_SERIES_INTRADAY" ? `&interval=${timeframe.toLowerCase()}` : "";
    const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}${intervalParam}&apikey=${apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data[dataKey]) {
        console.error("AlphaVantage Error:", data);
        return null;
    }

    return data[dataKey];
}

export async function fetchQuote(symbol: string, apiKey: string) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const quote = data["Global Quote"];

    if (!quote) return null;

    return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: quote["10. change percent"]
    };
}

export async function fetchTechnicalIndicator(symbol: string, func: string, apiKey: string) {
    const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    const key = Object.keys(data).find(k => k.includes("Technical Analysis"));
    if (!key) return null;

    const latestDate = Object.keys(data[key])[0];
    return {
        date: latestDate,
        value: data[key][latestDate]
    };
}

export async function fetchSentiment(symbol: string, apiKey: string) {
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Note) {
        throw new Error("ALPHA_VANTAGE_RATE_LIMIT");
    }

    if (data["Error Message"]) {
        throw new Error("ALPHA_VANTAGE_INVALID_KEY");
    }

    if (!data.feed) {
        return {
            score: 0,
            label: "No Data",
            count: 0,
            feed: []
        };
    }

    // Simplified sentiment: average score of top 5 news items
    const relevantFeed = data.feed.slice(0, 5);
    const scores = relevantFeed.map((item: any) => {
        const relevantTicker = item.ticker_sentiment.find((t: any) => t.ticker === symbol);
        return relevantTicker ? parseFloat(relevantTicker.ticker_sentiment_score) : 0;
    });

    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1);
    
    // Convert score (-1 to 1) to label
    let label = "Neutral";
    if (avgScore > 0.35) label = "Very Bullish";
    else if (avgScore > 0.15) label = "Bullish";
    else if (avgScore < -0.35) label = "Very Bearish";
    else if (avgScore < -0.15) label = "Bearish";

    return {
        score: avgScore,
        label: label,
        count: data.feed.length,
        feed: relevantFeed
    };
}
