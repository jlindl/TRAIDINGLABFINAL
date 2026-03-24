import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { STRATEGY_SCHEMA_PROMPT } from "@/lib/backtest/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { code, language } = await req.json();

  const systemPrompt = `You are a Technical Trading Strategy Compiler.
Your task is to translate trading strategy code from ${language || "another language"} into the TRAIDINGLAB Strategy JSON format.

RULES:
1. Output ONLY the raw JSON. No markdown, no triple backticks, no explanation.
2. If an indicator is not supported, map it to the closest supported alternative or use a custom formula if possible.
3. Maintain the integrity of the original logic (Entry, Exit, Stop Loss, Take Profit).
4. Use the following schema definition as your absolute guide:
${STRATEGY_SCHEMA_PROMPT}

If the code is invalid or cannot be translated, output an empty JSON object {} and nothing else.`;

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: `Translate the following ${language || ""} code into TRAIDINGLAB Strategy JSON:\n\n${code}`,
  });

  return result.toTextStreamResponse();
}
