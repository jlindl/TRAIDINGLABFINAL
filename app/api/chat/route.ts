import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

import { SUPPORTED_INDICATORS, CONTEXT_VARIABLES, RISK_PARAMETERS } from "@/lib/backtest/schema";
import { fetchQuote, fetchSentiment, fetchTechnicalIndicator } from "@/lib/api/alpha_vantage";
import { checkAndIncrementUsage } from "@/lib/usage";
import { lintStrategy } from "@/lib/backtest/linter";


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

  // --- RATE LIMITING & USAGE GUARD ---
  const { allowed, current, limit } = await checkAndIncrementUsage(user.id);
  
  if (!allowed) {
    return new Response(JSON.stringify({ 
      error: "RATE_LIMIT_EXCEEDED", 
      message: `Daily research quota exceeded (${current}/${limit}). Please upgrade to a Pro Trader plan for 40+ daily sessions.`,
      current,
      limit
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // -----------------------------------

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

  // Determine the active session ID early.
  const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let activeSessionId = isUUID(sessionId) ? sessionId : null;
  
  if (activeSessionId) {
    // Check if session actually exists in DB
    const { data: existing } = await supabase
      .from("lab_sessions")
      .select("id")
      .eq("id", activeSessionId)
      .single();
    
    if (!existing) {
      // If client provided a UUID that doesn't exist, create it
      const firstMessage = messages[0]?.content || "New Strategy Session";
      const title = typeof firstMessage === 'string' 
          ? (firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage)
          : "New Strategy Session";
          
      await supabase
        .from("lab_sessions")
        .insert({ id: activeSessionId, user_id: user.id, title });
    } else {
      // Update timestamp of existing session
      await supabase
        .from("lab_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeSessionId);
    }
  } else {
    // No ID provided, create new one
    const firstMessage = messages[0]?.content || "New Strategy Session";
    const title = typeof firstMessage === 'string' 
        ? (firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage)
        : "New Strategy Session";
    
    const { data: session, error: sErr } = await supabase
      .from("lab_sessions")
      .insert({ user_id: user.id, title })
      .select()
      .single();
    
    if (sErr) throw sErr;
    activeSessionId = session.id;
  }

  // Use convertToModelMessages for this specific SDK version to handle toolCalls, toolResults, and simple text correctly.
  const coreMessages = await convertToModelMessages(messages);

  // Determine which model to use.
  let model: any;
  try {
    model = openai("gpt-5.4-mini");
  } catch (e) {
    console.warn("OpenAI model init failed, falling back to Gemini:", e);
    model = google("gemini-1.5-pro-latest");
  }

  try {
    const result = streamText({
      model: model,
      messages: coreMessages,
      system: `You are the TRADINGLAB AI, an elite Quantitative Research Architect and Algorithmic Trading Strategist. 
Your goal is to help users engineer high-alpha, risk-adjusted trading strategies with institutional-grade precision.

    USER CONTEXT & PERSONALIZATION:
    - Your Current Personality: ${personality}
    - User Risk Tolerance: ${userSettings.lab_assistant?.risk_tolerance || "Medium"}
    - Custom User Instructions: "${customInstructions}"
    - User Technical Defaults: ${backtestDefaults}
    
    STRATEGY ARCHITECT GUIDELINES:
    1. PROACTIVE ADVISORY: You don't just follow orders; you guide the user. If they suggest a weak strategy (e.g., "Buy when RSI is low"), challenge it. Suggest adding trend filters (SMA/EMA), volatility adjustments (ATR), or volume confirmation.
    2. QUANTITATIVE RIGOR: Speak in terms of expectancy, Sharpe ratio, drawdown profiles, and edge. Explain *why* a certain technical setup might be robust or prone to curve-fitting.
    3. MULTI-TIMEFRAME ANALYSIS: Encourage users to use higher timeframe filters (MTF) to align with the primary trend, which significantly improves win rates.
    4. SYSTEMATIC APPROACH: Follow a structured workflow: 
       a) Concept validation (Is the logic sound?)
       b) Parameter optimization (Are the inputs reasonable?)
       c) Risk Architecture (Stop losses, Take profits, Position sizing).
    5. DATA-DRIVEN FEEDBACK: When analyzing backtest results via \`analyze_backtest_results\`, be brutal but constructive. Identify "leakage" (e.g., losing on Fridays, losing during low-volatility periods) and suggest tangible fixes.

    OPERATIONAL PROTOCOLS:
    - CONVERSATIONAL: Remain professional yet accessible. Do not use tools unless necessary for data retrieval or finalizing a contract.
    - VISION AI: When analyzing charts, look for liquidity zones, fair value gaps, and market structure shifts (MS/MSS).
    - FINALIZATION: Only use \`finalize_strategy\` when a strategy is fully defined and the user is ready to test. Ensure the \`logic\` is pure mathematical syntax.
    
    ENGINE GRAMMAR & CONSTRAINTS:
    When using \`finalize_strategy\`, you MUST obey these rules:
    - \`logic\` MUST be a strict mathematical AST expression. NO English. 
    - OPERATORS: \`>\`, \`<\`, \`>=\`, \`<=\`, \`==\`, \`!=\`, \`AND\`, \`OR\`, \`NOT\`, \`(...)\`.
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
      - **SHORTING SUPPORT**: The engine now natively supports Shorting. 
        - To go Long: Use \`entryLogic\`.
        - To go Short: Use \`entryShortLogic\`.
        - Exits: You can provide separate \`exitLogic\` (for long) and \`exitShortLogic\` (for short). If \`exitShortLogic\` is omitted, it defaults to the same as \`exitLogic\`.
        - Risk: SL/TP and TSL are automatically inverted for Shorts (e.g., a 2% SL for a Short is placed 2% *above* the entry).
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
      - ${riskParams}
    
    SYSTEM LOOP:
    - If you see "_INTERNAL_CONTINUE_LOOP_", a tool just provided data. Immediately analyze it and provide your expert feedback.`,
      onFinish: async ({ text, toolCalls, usage }) => {
        if (!user) return;

        try {
          // 2. Save User Message (if it's the latest one not yet saved)
          const lastUserMessage = messages[messages.length - 1];
          if (lastUserMessage && lastUserMessage.role === 'user') {
             // Deriving content carefully for DB persistence (must be non-empty string)
             let dbContent = typeof lastUserMessage.content === 'string' ? lastUserMessage.content : "";
             
             if (!dbContent && lastUserMessage.parts && Array.isArray(lastUserMessage.parts)) {
               dbContent = lastUserMessage.parts
                 .filter((p: any) => p.type === 'text')
                 .map((p: any) => p.text)
                 .join('\n');
             }

             if (dbContent) {
               await supabase.from("lab_messages").insert({
                 session_id: activeSessionId,
                 role: 'user',
                 content: dbContent,
                 attachments: lastUserMessage.experimental_attachments || []
               });
             }
          }

          // 3. Save Assistant Message
          await supabase.from("lab_messages").insert({
            session_id: activeSessionId,
            role: 'assistant',
            content: text,
            attachments: toolCalls ? JSON.stringify(toolCalls) : [] 
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
            const apiKey = process.env.ALPHA_VANTAGE_API_KEY || profile?.alpha_vantage_key;
            
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
            entryLogic: z.string().describe("STRICT MATHEMATICAL AST logic for Long entry (e.g. 'RSI_14 < 30')."),
            entryShortLogic: z.string().optional().describe("STRICT MATHEMATICAL AST logic for Short entry (e.g. 'RSI_14 > 70')."),
            exitLogic: z.string().describe("STRICT MATHEMATICAL AST logic for Long exit (e.g. 'RSI_14 > 70')."),
            exitShortLogic: z.string().optional().describe("STRICT MATHEMATICAL AST logic for Short exit (e.g. 'RSI_14 < 30')."),
            indicators: z.record(z.string(), z.any()).describe("JSON definitions of all indicators referenced in the logic."),
            startDate: z.string().optional().describe("ISO Date string for backtest start (e.g. '2024-01-01')"),
            endDate: z.string().optional().describe("ISO Date string for backtest end (e.g. '2024-03-31')"),
            tpPct: z.number().optional().describe("Take Profit % (e.g. 0.05)"),
            slPct: z.number().optional().describe("Stop Loss % (e.g. 0.02)"),
            tslPct: z.number().optional().describe("Trailing Stop Loss % (e.g. 0.01)"),
            bePct: z.number().optional().describe("Break-even trigger % (e.g. 0.02)"),
            partialTpPct: z.number().optional().describe("Partial TP % (e.g. 0.03)"),
            partialTpSize: z.number().optional().describe("Size to close at partial TP (0-1)"),
          }),
          execute: async (strategy: any) => {
            console.log("Strategy Finalized (Raw):", strategy);
            
            const { valid, fixedStrategy, fixes, errors } = lintStrategy(strategy);
            
            console.log("Strategy Linter Result:", { valid, fixes, errors });

            return {
              status: valid ? "success" : "warning",
              strategy: fixedStrategy,
              fixes: fixes,
              errors: errors,
              strategy_id: Math.random().toString(36).substring(7),
              message: valid 
                ? "Strategy contract generated and validated successfully." 
                : "Strategy contract generated with some auto-corrections. Please review the fixes."
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
        analyze_backtest_results: {
          description: "Perform a deep-dive post-mortem on backtest data to identify performance leaks and optimization opportunities.",
          inputSchema: z.object({
            summary: z.object({
              win_rate: z.number(),
              total_return: z.number(),
              max_drawdown: z.number(),
              trade_count: z.number(),
              sharpe_ratio: z.number().optional(),
              profit_factor: z.number().optional(),
              expectancy: z.number().optional()
            }),
            trades: z.array(z.object({
              entry_time: z.string(),
              exit_time: z.string(),
              profit: z.number(),
              side: z.string(),
              mfe: z.number().optional(),
              mae: z.number().optional(),
              duration: z.number().optional()
            })).describe("Recent trade history for pattern detection.")
          }),
          execute: async ({ summary, trades }: { summary: any, trades: any[] }) => {
            console.log(`Analyzing ${trades.length} trades for post-mortem...`);
            // This tool is primarily for the Assistant to "see" the data.
            // Returning the data back to the assistant acts as its "eyes".
            return {
              status: "Data ingested. You can now perform the analysis.",
              insights_hint: "Look for clusters of losses or specific hours/days where performance drops."
            };
          }
        },
        compare_asset_performance: {
          description: "Analyze a multi-asset (portfolio) backtest to find correlations and suggest basket optimizations.",
          inputSchema: z.object({
            correlation_matrix: z.record(z.string(), z.record(z.string(), z.number())).describe("The cross-asset correlation matrix from the engine."),
            individual_metrics: z.record(z.string(), z.object({
              sharpe: z.number().optional(),
              win_rate: z.number().optional(),
              mdd: z.number().optional()
            })).describe("Performance stats broken down by symbol.")
          }),
          execute: async ({ correlation_matrix, individual_metrics }: { correlation_matrix: any, individual_metrics: any }) => {
            console.log("Analyzing Portfolio Correlation...");
            return {
              status: "Correlation data ingested.",
              insights_hint: "Check for correlation values > 0.8 which indicate redundant risk."
            };
          }
        }
      },
    });

    const response = (result as any).toUIMessageStreamResponse();
    response.headers.set('X-Lab-Session-Id', activeSessionId);
    return response;
  } catch (error: any) {
    console.error("Lab Assistant Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
