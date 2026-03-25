-- UNIFIED MIGRATION: Hardened Usage Quotas & Pricing Tiers
-- Date: 2026-03-24
-- This script safely adds all columns for the Paper/Pro Trader pricing model.

DO $$ 
BEGIN
    -- 1. Add Tier column (Default to Paper Trader)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='tier') THEN
        ALTER TABLE public.profiles ADD COLUMN tier TEXT DEFAULT 'paper_trader';
    END IF;

    -- 2. Add AI Message counter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='daily_chat_count') THEN
        ALTER TABLE public.profiles ADD COLUMN daily_chat_count INTEGER DEFAULT 0;
    END IF;

    -- 3. Add Backtest counter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='daily_backtest_count') THEN
        ALTER TABLE public.profiles ADD COLUMN daily_backtest_count INTEGER DEFAULT 0;
    END IF;

    -- 4. Add Reset Timestamp
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_reset_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_reset_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- Update existing trial users to the new tier nomenclature
UPDATE public.profiles SET tier = 'paper_trader' WHERE tier IS NULL OR tier = 'free';
UPDATE public.profiles SET tier = 'pro_trader' WHERE tier = 'pro';

-- Reset counters for clean launch state
UPDATE public.profiles SET daily_chat_count = 0, daily_backtest_count = 0;

COMMENT ON TABLE public.profiles IS 'User profiles with hardened profit-margin usage quotas (Paper vs Pro).';
