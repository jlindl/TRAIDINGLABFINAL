# Strategy Marketplace Listing Workflow

This document defines the process of publishing a private strategy to the public TRAIDINGLAB Marketplace.

## Workflow Steps

1. **Selection**: User Identifies a high-performing strategy in `Saved Strategies`.
2. **Listing Initiation**: Click "List on Marketplace".
3. **Information Gathering**:
   - **Name**: Defaults to strategy name.
   - **Description**: User provides marketing copy and implementation details.
   - **Price**: Set as a one-time purchase or monthly subscription ($USD).
   - **Metrics Snapshot**: Total Return, Max Drawdown, and Win Rate are automatically pulled from the last successful backtest.
4. **Verification**:
   - System validates that the strategy has at least one valid backtest run.
   - (Optional) Admin vetting status is set to `pending`.
5. **Publication**:
   - Record created in `marketplace_listings`.
   - `saved_strategies.is_public` set to `true`.
6. **Discovery**:
   - Strategy appears in `MarketplaceView` for other users.
   - Users can "Deploy" (copy JSON to their own `saved_strategies`).

## Data Schema
- `marketplace_listings`:
  - `strategy_id` (Link to source)
  - `performance_snapshot` (Immutable results at time of listing)
  - `status` ('published', 'draft', 'vetted')
