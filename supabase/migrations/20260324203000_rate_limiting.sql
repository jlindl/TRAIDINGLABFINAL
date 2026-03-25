-- Migration: Add rate limiting and tier support to profiles
-- Date: 2026-03-24

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS daily_chat_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMPTZ DEFAULT now();

-- Create a function to auto-reset usage if older than 24h (optional, logic can also be in API)
COMMENT ON COLUMN public.profiles.tier IS 'Subscription tier: free, pro, or admin.';
COMMENT ON COLUMN public.profiles.daily_chat_count IS 'Number of messages sent in the current 24h window.';
COMMENT ON COLUMN public.profiles.last_reset_at IS 'The last time the daily_chat_count was reset.';
