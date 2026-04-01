import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { STRATEGY_SCHEMA_PROMPT } from "@/lib/backtest/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { code, language } = await req.json();

  const systemPrompt = `You are a Technical Trading Strategy Compiler.
Your task is to translate trading strategy code (PineScript, Python, MQL) into the TRAIDINGLAB Strategy JSON format.

SCHEMA STRUCTURE:
{
  "setup": { "indicators": { "NAME": { "type": "CODE", "param": value } } },
  "entry": { "logic": "INDICATOR > VALUE" },
  "exit": { "logic": "INDICATOR < VALUE", "tpPct": 0.05, "slPct": 0.02 }
}

CRITICAL RULES:
1. Output ONLY RAW JSON. No markdown tags (No \`\`\`json).
2. Indicators MUST be defined in "setup.indicators" before being used in logic.
3. Use only supported indicator codes: RSI, SMA, EMA, MACD, BB, ATR, etc.
4. For crossovers, translate to (CLOSE > SMA AND CLOSE_PREV <= SMA_PREV).
5. If the source has a specific Stop Loss or Take Profit, map them to "exit.slPct" and "exit.tpPct".
6. If the code is untranslatable, return {}.

REFERENCE SCHEMA:
${STRATEGY_SCHEMA_PROMPT}`;

  const result = await streamText({
    model: openai("gpt-5.4-mini"),
    system: systemPrompt,
    prompt: `Translate the following ${language || ""} code into TRADINGLAB Strategy JSON:\n\n${code}`,
  });

  return result.toTextStreamResponse();
}
