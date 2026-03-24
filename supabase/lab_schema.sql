-- 1. Extend Profiles with Alpha Vantage Key
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS alpha_vantage_key TEXT;

-- 2. Create Lab Sessions Table
CREATE TABLE IF NOT EXISTS public.lab_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Strategy Session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Lab Messages Table
CREATE TABLE IF NOT EXISTS public.lab_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.lab_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb, -- For image data/metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Market Data Cache Table
CREATE TABLE IF NOT EXISTS public.market_data_cache (
  symbol TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
CREATE POLICY "Users can manage their own sessions"
ON public.lab_sessions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their sessions"
ON public.lab_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.lab_sessions 
    WHERE public.lab_sessions.id = public.lab_messages.session_id 
    AND public.lab_sessions.user_id = auth.uid()
  )
);

-- 7. Saved Strategies Table
CREATE TABLE IF NOT EXISTS public.saved_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strategy_json JSONB NOT NULL,
  performance_snapshot JSONB DEFAULT '{}'::jsonb, -- Optional: store last backtest results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.saved_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved strategies"
ON public.saved_strategies FOR ALL
USING (auth.uid() = user_id);

-- 8. Marketplace Listings Table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID NOT NULL REFERENCES public.saved_strategies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'published', -- 'published', 'draft', 'vetted'
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published listings"
ON public.marketplace_listings FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can manage their own listings"
ON public.marketplace_listings FOR ALL
USING (auth.uid() = user_id);

-- 9. Deployments (Affiliate Tracking & Exports)
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID NOT NULL REFERENCES public.saved_strategies(id) ON DELETE CASCADE,
  broker TEXT NOT NULL,
  broker_uid TEXT,
  status TEXT DEFAULT 'pending_signup', -- 'pending_signup', 'verified', 'exported'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own deployments"
ON public.deployments FOR ALL
USING (auth.uid() = user_id);

