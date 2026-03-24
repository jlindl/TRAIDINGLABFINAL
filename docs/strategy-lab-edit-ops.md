# Strategy Lab Edit Workflow

This document defines the process of reloading a saved strategy into the Lab Assistant for AI-driven refinement.

## Workflow Steps

1. **Trigger**: User selects "Edit with Lab Assistant" from the `SavedStrategiesView`.
2. **Context Injection**:
   - The system initiates a new chat session in the Lab Assistant.
   - A hidden system message (or a pre-filled user message) is sent containing the `strategy_json`.
   - The message context includes: "I want to refine the following strategy: [JSON]. Please analyze its performance and suggest improvements."
3. **AI Analysis**:
   - The Lab Assistant parses the JSON.
   - It performs market research (using `get_market_data`) to see how the logic fits current conditions.
   - It suggests modifications to indicators or entry/exit logic.
4. **Iterative Refinement**:
   - User discusses changes with the AI.
   - AI generates new `strategy_json` versions.
5. **Re-Export**:
   - Once refined, the user can click "Run Backtest" or "Save as New Version" to persist the changes back to `saved_strategies`.

## Data Mapping
- **Input**: `saved_strategies.strategy_json`
- **Output**: `lab_messages.content` (containing new JSON) -> `saved_strategies` (update or new entry).
