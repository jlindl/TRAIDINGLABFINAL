import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

import { SUPPORTED_INDICATORS, CONTEXT_VARIABLES, RISK_PARAMETERS } from "@/lib/backtest/schema";
import { fetchQuote, fetchSentiment, fetchTechnicalIndicator } from "@/lib/api/alpha_vantage";


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id: sessionId } = await req.json();
  const supabase = await createClient();

  // Dynamically generate engine grammar from centralized schema
  const indicatorList = SUPPORTED_INDICATORS.map(i => `"${i.code}"`).join(", ");
  const contextVars = CONTEXT_VARIABLES.map(v => `\`${v.name}\``).join(", ");
  const riskParams = RISK_PARAMETERS.map(p => `\`${p.name}\`: ${p.label}`).join("\n      - ");

  // Get user for persistence
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user profile and settings
  const { data: profile } = await supabase
    .from("profiles")
    .select("settings, alpha_vantage_key")
    .eq("id", user.id)
    .single();


  const userSettings = profile?.settings || {};
  const personality = userSettings.lab_assistant?.personality || "Analytical";
  const customInstructions = userSettings.lab_assistant?.custom_instructions || "";
  const backtestDefaults = JSON.stringify(userSettings.backtesting_defaults || {});

  // Use convertToModelMessages for this specific SDK version to handle toolCalls, toolResults, and simple text correctly.
  const coreMessages = await convertToModelMessages(messages);

  // Determine which model to use. Default to OpenAI, fallback to Google if key looks problematic 
  // or if we want to be safe.
  let model: any;
  try {
    model = openai("gpt-4o");
  } catch (e) {
    console.warn("OpenAI model init failed, falling back to Gemini:", e);
    model = google("gemini-1.5-pro-latest");
  }

  try {
    const result = streamText({
      model: model,
      messages: coreMessages,
      system: `You are the TRAIDINGLAB Lab Assistant, a world-class Quantitative Researcher and Technical Analyst.
      
    USER PERSONALIZATION:
    - Your Current Personality: ${personality}
    - User Risk Tolerance: ${userSettings.lab_assistant?.risk_tolerance || "Medium"}
    - Custom User Instructions: "${customInstructions}"
    - User Technical Defaults: ${backtestDefaults}
    
    ADAPT YOUR TONE:
    - If Analytical: Be deep, technical, and require multiple confirmations.
    - If Aggressive: Be bold, focus on momentum, breakouts, and fast execution.
    - If Conservative: Prioritize capital preservation, trend stability, and safety.
    
    CORE OPERATIONAL PRINCIPLES:
    1. CONVERSATIONAL ADVISORY: You are a Lead Quantitative Researcher at a high-level Trading SaaS. Act as a natural, conversational partner. DO NOT call tools on every message unless the user asks you to look up data, review a strategy, or finalize a contract.
    2. CLOSED-LOOP RESEARCH: When appropriate, use your tools (get_saved_strategies, get_strategy_details) to review a user's previous work. If a user asks to "improve" something, look at its last performance snapshot and propose specific technical mitigations.
    3. SCIENTIFIC CRITIQUE: Discuss RSI periods, SMA lag, and ATR-based risk management. If a strategy is too simple, suggest adding volume filters or volatility-adjusted stops.
    4. TRANSPARENT EXECUTION: If you do call a tool, never return an empty text response. Always provide a 1-2 sentence technical summary of what you found or what you are doing.
    5. TERMINOLOGY: Use professional terms like "CAGR", "Max Drawdown", "Sharpe Ratio", and "Execution Slippage".
    
    CAPABILITIES:
    - CONVERSATION: Answer trading questions, discuss concepts, and guide the user naturally without tools.
    - VISION: Analyze chart screenshots for S/R and Trend patterns.
      - **Image Analysis**: When a user uploads a chart, identify key Price Levels (Support/Resistance), Trends, and Candlestick Patterns.
      - **Mapping to Logic**: 
        - Horizontal Levels -> Translate to \`close > {price}\` or \`close < {price}\` or \`CROSSOVER(close, {price})\`.
        - Trends -> Identify if bullish/bearish and suggest moving averages (SMA/EMA) or Trendline breaches (\`close > prev_high\`).
        - Candles -> Detect Hammer, Doji, or Engulfing patterns and translate to price-action rules.
    - RECALL: Look up past strategies and their backtest history (ONLY when asked or strictly relevant).
    - FORMALIZATION: Sealed Strategy Contracts for the engine (ONLY when the user explicitly says "go for it" or "build it").
    
    SYSTEM LOOP (IMPORTANT):
    - If you receive the exact message "_INTERNAL_CONTINUE_LOOP_", this means a tool you just called has returned data to your context history.
    - DO NOT acknowledge the internal message. IMMEDIATELY provide your detailed technical summary, advice, or critique based on the data you just received!
    
    ENGINE GRAMMAR:
    When using \`finalize_strategy\`, you MUST obey the Backtesting Engine Parser rules:
    - \`logic\` MUST be a strict mathematical AST expression. NO English text. 
    - SUPPORTED OPERATORS: \`>\`, \`<\`, \`>=\`, \`<=\`, \`==\`, \`!=\`, \`AND\`, \`OR\`, \`NOT\`, and grouping parentheses \`(...)\`.
    - SUPPORTED FUNCTIONS: \`CROSSOVER(A, B)\` (true when A breaks above B), \`CROSSUNDER(A, B)\` (true when A breaks below B).
    - WARNING: Other complex functions like \`RSI_CROSS(30)\` are NOT SUPPORTED. You must use relational operators or the specific \`CROSSOVER/UNDER\` functions.
    - VARIABLES: Use the keys you define in the \`parameters\` object (e.g. \`RSI_14\`) or built-in context variables: ${contextVars}.
    - Example Logic String: \`NOT (RSI_14 < 30 OR RSI_14 > 70)\`
    - Example Time Filtered String: \`close > SMA_50 AND hour >= 13 AND hour <= 19 AND dayOfWeek != 0 AND dayOfWeek != 6\`
      - \`parameters\` MUST strictly define the indicators used in the \`logic\`. 
      - Allowed types: ${indicatorList}.
      - **MULTI-TIMEFRAME (MTF)**: Indicators can have an optional \`timeframe\` property (e.g., "1D", "4H", "1H"). If omitted, it defaults to the chart timeframe. Use this for trend filters (e.g., Daily SMA on a 5m chart).
      - Example Basic: \`{ "SMA_50": { "type": "SMA", "period": 50 } }\`.
      - Example MTF: \`{ "SMA_200_Daily": { "type": "SMA", "period": 200, "timeframe": "1D" } }\`.
      - Example Bands/Channels (BB, KC, DC): Defines \`{name}_UPPER\`, \`{name}_MIDDLE\`, \`{name}_LOWER\`.
      - Example SuperTrend: Defines \`{name}\`, \`{name}_DIRECTION\`.
      - Example Stochastic: Defines \`{name}_K\`, \`{name}_D\`.
      - Example ADX: Defines \`{name}\`, \`{name}_DI_PLUS\`, \`{name}_DI_MINUS\`.
      - Example Vortex: Defines \`{name}_PLUS\`, \`{name}_MINUS\`.
      - Example Pivot Points: Defines \`{name}_P\`, \`{name}_R1\`, \`{name}_S1\`, \`{name}_R2\`, \`{name}_S2\`.
      - Example SMC (FVG/OB): \`{ "FVG": { "type": "FVG" } }\`. Defines \`{name}\` (+1 Bull, -1 Bear).
      - Example SMC (SWING): \`{ "FRACTAL": { "type": "SWING", "left": 3, "right": 3 } }\`. Defines \`{name}_HIGH\`, \`{name}_LOW\`.
    - \`exit\` parameters:
      - ${riskParams}`,
      onFinish: async ({ text, toolCalls, usage }) => {
        if (!user) return;

        let currentSessionId = sessionId;

        try {
          // 1. Ensure session exists
          if (!currentSessionId) {
            // Create new session if none provided
            const firstMessage = messages[0]?.content || "New Strategy Session";
            const title = firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage;
            
            const { data: session, error: sErr } = await supabase
              .from("lab_sessions")
              .insert({ user_id: user.id, title })
              .select()
              .single();
            
            if (sErr) throw sErr;
            currentSessionId = session.id;
          } else {
            // Update timestamp of existing session
            await supabase
              .from("lab_sessions")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", currentSessionId);
          }

          // 2. Save User Message (if it's the latest one not yet saved)
          const lastUserMessage = messages[messages.length - 1];
          if (lastUserMessage && lastUserMessage.role === 'user') {
             await supabase.from("lab_messages").insert({
               session_id: currentSessionId,
               role: 'user',
               content: typeof lastUserMessage.content === 'string' ? lastUserMessage.content : JSON.stringify(lastUserMessage.content),
               attachments: lastUserMessage.experimental_attachments || []
             });
          }

          // 3. Save Assistant Message
          await supabase.from("lab_messages").insert({
            session_id: currentSessionId,
            role: 'assistant',
            content: text,
            attachments: toolCalls ? JSON.stringify(toolCalls) : [] // Optional: handle tool calls as "attachments" or similar
          });

        } catch (err) {
          console.error("Failed to persist chat:", err);
        }
      },
      tools: {
        get_market_data: {
          description: "Fetch real-time market data, technical indicators, and news sentiment for a specific ticker.",
          inputSchema: z.object({
            symbol: z.string().describe("The stock or crypto symbol (e.g. BTC, AAPL)"),
          }),
          execute: async ({ symbol }: { symbol: string }) => {
            const apiKey = profile?.alpha_vantage_key || process.env.ALPHA_VANTAGE_API_KEY;
            
            if (!apiKey) {
               return { error: "No Alpha Vantage API key found. Please add it to your profile settings." };
            }

            // 1. Check Cache
            const { data: cache } = await supabase
              .from("market_data_cache")
              .select("*")
              .eq("symbol", symbol.toUpperCase())
              .single();
            
            const isFresh = cache && (new Date().getTime() - new Date(cache.last_updated).getTime() < 15 * 60 * 1000);
            
            if (isFresh) {
              console.log(`Cache hit for ${symbol}`);
              return cache.data;
            }

            console.log(`Fetching live data for ${symbol}...`);

            try {
              // 2. Fetch Live data (Parallel)
              const [quote, sentiment, rsi, macd] = await Promise.all([
                fetchQuote(symbol, apiKey),
                fetchSentiment(symbol, apiKey),
                fetchTechnicalIndicator(symbol, "RSI", apiKey),
                fetchTechnicalIndicator(symbol, "MACD", apiKey)
              ]);

              const results = {
                price: quote?.price || 0,
                change_24h: quote?.changePercent || "0%",
                sentiment: sentiment?.label || "Neutral",
                sentiment_score: sentiment?.score || 0,
                signals: [
                  { indicator: "RSI(14)", value: rsi?.value?.RSI || "N/A", status: parseFloat(rsi?.value?.RSI) > 70 ? "Overbought" : parseFloat(rsi?.value?.RSI) < 30 ? "Oversold" : "Neutral" },
                  { indicator: "MACD", value: macd?.value?.MACD || "N/A", status: parseFloat(macd?.value?.MACD) > parseFloat(macd?.value?.MACD_Signal) ? "Bullish" : "Bearish" }
                ],
                last_updated: new Date().toISOString()
              };

              // 3. Update Cache
              await supabase.from("market_data_cache").upsert({
                symbol: symbol.toUpperCase(),
                data: results,
                last_updated: new Date().toISOString()
              });

              return results;
            } catch (err: any) {
              console.error("Alpha Vantage fetch error:", err);
              return { error: "Failed to fetch market data from Alpha Vantage." };
            }
          },

        },
        finalize_strategy: {
          description: "Generate the mathematical AST JSON strategy contract for the backtesting engine simulation.",
          inputSchema: z.object({
            name: z.string().describe("A professional name for the strategy"),
            ticker: z.string(),
            timeframe: z.string(),
            entryLogic: z.string().describe("STRICT MATHEMATICAL AST logic for entry (e.g. 'RSI_14 < 30')."),
            exitLogic: z.string().describe("STRICT MATHEMATICAL AST logic for exit (e.g. 'RSI_14 > 70')."),
            indicators: z.record(z.string(), z.any()).describe("JSON definitions of all indicators referenced in the logic."),
            tpPct: z.number().optional().describe("Take Profit % (e.g. 0.05)"),
            slPct: z.number().optional().describe("Stop Loss % (e.g. 0.02)"),
            tslPct: z.number().optional().describe("Trailing Stop Loss % (e.g. 0.01)"),
            bePct: z.number().optional().describe("Break-even trigger % (e.g. 0.02)"),
            partialTpPct: z.number().optional().describe("Partial TP % (e.g. 0.03)"),
            partialTpSize: z.number().optional().describe("Size to close at partial TP (0-1)"),
          }),
          execute: async (strategy: any) => {
            console.log("Strategy Finalized:", strategy);
            return {
              status: "success",
              strategy_id: Math.random().toString(36).substring(7),
              message: "Strategy contract generated successfully. Ready for backtesting."
            };
          },
        },
        get_saved_strategies: {
          description: "Retrieve a list of the user's saved strategies and their last performance metrics.",
          inputSchema: z.object({}),
          execute: async () => {
            const { data, error } = await supabase
              .from("saved_strategies")
              .select("id, name, performance_snapshot, created_at")
              .order("updated_at", { ascending: false });
            
            if (error) return { error: error.message };
            return data;
          },
        },
        get_strategy_details: {
          description: "Get the full technical JSON and performance history of a specific saved strategy.",
          inputSchema: z.object({
            name: z.string().describe("The name of the strategy to retrieve"),
          }),
          execute: async ({ name }: { name: string }) => {
            const { data, error } = await supabase
              .from("saved_strategies")
              .select("*")
              .ilike("name", `%${name}%`)
              .single();
            
            if (error) return { error: error.message };
            return data;
          },
        },
      },
    });

    return (result as any).toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Lab Assistant Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
