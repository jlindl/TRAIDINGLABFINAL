-- Migration: Refine usage quotas for profit optimization
-- Date: 2026-03-24
-- Goal: Limit AI spend to ~£10/month for Pro users

-- No structural changes needed, but resetting counters for anyone who went over the new limits
UPDATE public.profiles SET daily_chat_count = 0, daily_backtest_count = 0;

-- Optional: Add a 'monthly_spend_estimate' column if the user wants to track actual costs later
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_ai_cost NUMERIC DEFAULT 0;

COMMENT ON TABLE public.profiles IS 'User profiles with hardened profit-margin usage quotas.';
