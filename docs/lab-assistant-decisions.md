# Lab Assistant — Technical Decisions & Requirements

To proceed from a high-level concept to a professional build, we must finalize the following key architectural and operational decisions.

## 1. AI Orchestration & Tooling
- **Decision**: **Vercel AI SDK** with Gemini 2.0 Flash.
    - *Rationale*: Provides seamless streaming, native tool-calling support, and excellent integration with Next.js 16 Server Actions.
- **Requirement**: Implement `useChat` on the frontend and `streamText` on the backend for real-time strategy dialogue.

## 2. Multimodal (Vision) Processing
- **Decision**: How does the user interact with charts?
    - *Flow*: User uploads image -> Gemini 2.0 Flash Vision analyzes -> Insights are injected into the text prompt context.
- **Requirement**: We need a secure `internal/analyze-chart` endpoint to sanitize and process image buffers before sending them to the LLM.

## 3. Alpha Vantage Integration Strategy
- **Decision**: **User-Provided Key**.
    - *Flow*: Users input their Alpha Vantage API key in the Developer Portal / Settings. This key is stored securely in Supabase (encrypted).
- **Requirement**: Implement a **PostgreSQL Caching Layer** in Supabase to store 15-minute snapshots of market data to optimize API credit usage.

## 4. Code Generation & Execution (The Contract)
- **Decision**: **Strict JSON Strategy Schema**.
    - *Rationale*: The AI outputs a structured JSON object representing the strategy (Indicators, Logic, Risk). This is safer than raw code and allows the UI to render an "Edit" view before execution.
- **Requirement**: Define a TypeScript interface for the strategy contract that the Backtesting Engine can consume directly.

## 5. Memory & Context
- **Decision**: **Persistent Per-Session Storage**.
    - *Storage*: Conversation logs are stored in `lab_sessions` and `lab_messages` tables in Supabase.
- **Requirement**: Each chat session is isolated. The agent maintains a context window of the current session to ensure coherent strategy refinement.

## 6. Feedback & Safety
- **Decision**: How does the agent handle "Risky" requests?
    - *Policy*: Implement a **Guardrail Prompt** that prevents the agent from giving direct "Buy/Sell" financial advice, instead focusing on "Technical Hypothesis Testing".

---

## 📈 Next Steps
1. **Choose Orchestration Layer** (Recommended: Vercel AI SDK).
2. **Define JSON Strategy Schema**.
3. **Select Alpha Vantage Tier** (Free vs Premium for dev).
