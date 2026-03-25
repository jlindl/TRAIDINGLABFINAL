-- Migration: Adjust usage tiers and add backtest tracking
-- Date: 2026-03-24

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_backtest_count INTEGER DEFAULT 0;

-- Adjust existing tier naming convention to match launch plans
UPDATE public.profiles SET tier = 'paper_trader' WHERE tier = 'free';
UPDATE public.profiles SET tier = 'pro_trader' WHERE tier = 'pro';

ALTER TABLE public.profiles 
ALTER COLUMN tier SET DEFAULT 'paper_trader';

COMMENT ON COLUMN public.profiles.daily_backtest_count IS 'Number of backtests run in the current 24h window.';
