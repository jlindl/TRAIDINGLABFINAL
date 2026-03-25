-- STRIPE SYNC MIGRATION
-- Date: 2026-03-25
-- Adds Stripe-specific columns to the profiles table for subscription synchronization.

DO $$ 
BEGIN
    -- 1. Add Stripe Customer ID
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_customer_id') THEN
        ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT;
    END IF;

    -- 2. Add Stripe Subscription ID
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_subscription_id') THEN
        ALTER TABLE public.profiles ADD COLUMN stripe_subscription_id TEXT;
    END IF;

    -- 3. Add Subscription Status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_status') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT;
    END IF;
END $$;

-- 4. Atomic Usage Increment Function
CREATE OR REPLACE FUNCTION public.increment_usage(user_id UUID, usage_type TEXT)
RETURNS void AS $$
BEGIN
    IF usage_type = 'ai_messages' THEN
        UPDATE public.profiles 
        SET daily_chat_count = daily_chat_count + 1 
        WHERE id = user_id;
    ELSIF usage_type = 'backtests' THEN
        UPDATE public.profiles 
        SET daily_backtest_count = daily_backtest_count + 1 
        WHERE id = user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an index on stripe_customer_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
