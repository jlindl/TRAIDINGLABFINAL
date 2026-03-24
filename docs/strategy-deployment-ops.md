# Strategy Deployment Workflow (Affiliate & Export)

This document defines the process of moving a strategy from a backtesting environment to live execution by generating executable code for users to run on their own machines, gated by an affiliate broker signup.

## Workflow Steps

1. **Broker Affiliation (The Gate)**:
   - User navigates to the "Deployments" tab.
   - We present a list of supported affiliate brokers (e.g., Bybit, Binance, Alpaca) with unique referral links.
   - To unlock live execution, the user must click the link and sign up.

2. **Verification**:
   - The user returns and provides their Broker UID (User ID) or confirms signup.
   - We record this in the `deployments` table with a status of `pending_verification` or `verified`.
   - (Optional) We can verify via broker API or manual process. For now, we assume self-attestation or webhook verification on our backend.

3. **Strategy Selection & Code Generation**:
   - Once verified, the user selects a strategy from their `saved_strategies`.
   - Our backend parses their `strategy_json` and translates it into an **executable Python script** utilizing community standard SDKs (e.g., `ccxt` for Crypto, `alpaca-trade-api` for equities).
   - The Python script includes the event loop, logic, indicators setup, and placeholder slots for their API keys.

4. **Export & Local Execution**:
   - The user downloads the generated `.py` script (or `.zip` with a `requirements.txt`).
   - We DO NOT host their trading engine or touch their live credentials, eliminating massive scalability, latency, and liability risks.
   - User runs the script on their own local machine or VPS.

## Data Schema Need
**Table: `deployments`**
- `id` (UUID)
- `user_id` (UUID) - User who requested deployment.
- `strategy_id` (UUID) - The strategy being exported.
- `broker` (Text) - Chosen broker (e.g., 'Bybit').
- `broker_uid` (Text) - User's ID on the broker platform for affiliate tracking.
- `status` (Text) - 'pending_signup', 'verified', 'script_downloaded'.
- `created_at` (Timestamp)
