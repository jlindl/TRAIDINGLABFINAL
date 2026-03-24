-- Migration Script: Fix Deployment Schema
-- Run this to clear out the old broker_connections table and update the deployments table
-- to the new Affiliate & Export model.

-- 1. Drop the old tables
DROP TABLE IF EXISTS public.deployments CASCADE;
DROP TABLE IF EXISTS public.broker_connections CASCADE;

-- 2. Create the new simplified deployments table
CREATE TABLE public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID NOT NULL REFERENCES public.saved_strategies(id) ON DELETE CASCADE,
  broker TEXT NOT NULL,
  broker_uid TEXT,
  status TEXT DEFAULT 'pending_signup', -- 'pending_signup', 'verified', 'exported'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- 4. Set Policies
CREATE POLICY "Users can manage their own deployments"
ON public.deployments FOR ALL
USING (auth.uid() = user_id);
