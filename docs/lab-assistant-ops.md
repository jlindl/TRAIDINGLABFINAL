# Lab Assistant — Professional Operational Guide

The **Lab Assistant** is a high-level, multimodal AI agent specialized in strategy creation, market research, and automated code generation. It serves as the primary bridge between a trader's intuition and the **Backtesting Engine**.

## 🎯 Primary Objectives
- **Strategy Dialogue**: Refine abstract trading ideas into executable logic via natural language.
- **Multimodal Chart Interpretation**: Analyze user-uploaded chart screenshots (Gemini 2.0 Vision) to detect price levels and patterns.
- **Contextual Synthesis**: Enrich strategy suggestions using real-world fundamental and technical data via **Alpha Vantage**.
- **The Contract**: Generate a structured JSON-based strategy schema that ensures 100% compatibility with the TRAIDINGLAB engine.

---

## 🛠 High-Level Architecture

### AI Intelligence (Vercel AI SDK)
- **Engine**: Powered by `gemini-2.0-flash` for high-speed streaming and multimodal vision.
- **Orchestration**: Built on the **Vercel AI SDK**, enabling real-time `useChat` streaming and native tool-calling.
- **Tools**: The agent has access to `get_market_data` (Alpha Vantage) and `finalize_strategy` (JSON generation).

### Data & Context (Alpha Vantage)
- **Integration**: Uses user-provided API keys (stored securely in `profiles`).
- **Data Layers**: `GLOBAL_QUOTE`, `NEWS_SENTIMENT`, and `TECHNICAL_INDICATORS`.
- **Optimization**: Implements a 15-minute PostgreSQL caching layer in Supabase to minimize API credit usage.

### Memory & Persistence
- **Storage**: Sessions are stored in `lab_sessions` and `lab_messages` in Supabase.
- **Contextual Awareness**: The agent maintains persistent memory of the current chat session to ensure iterative strategy refinement.

---

## 🔄 The Strategy Creation Loop

1. **Initiation**: User describes a strategy or uploads a chart screenshot.
2. **Analysis**:
    - **Visual**: Agent identifies support/resistance, trends, and patterns from the image.
    - **Fundamental**: Agent fetches live ticker context and news sentiment from Alpha Vantage.
3. **Refinement**: Agent suggests improvements (e.g., "Given the current high volatility in BTC, should we increase our stop-loss buffer?").
4. **Finalization (The CTA)**: 
    - Once the strategy is defined, the agent triggers the `finalize_strategy` tool.
    - A **JSON Strategy Contract** is generated.
    - A clear **"Run Backtest"** button appears in the UI.
5. **Execution**: The JSON contract is passed to the Backtesting Engine for historical validation.

---

## 🛡 Security & Guardrails
- **Financial Advice**: The agent is programmed to avoid providing direct financial advice, focusing instead on **hypothetical technical testing**.
- **Data Privacy**: User API keys are restricted via RLS (Row Level Security) and never exposed to other users.
- **Logic Validation**: Every generated JSON schema undergoes a pre-flight validation check against the Engine's technical specifications.
