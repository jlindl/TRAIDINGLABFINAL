-- Migration: Add settings JSONB column to profiles
-- Date: 2026-03-24

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "lab_assistant": {
    "personality": "Analytical",
    "risk_tolerance": "Medium",
    "custom_instructions": ""
  },
  "backtesting_defaults": {
    "indicators": {},
    "risk": {
      "tpPct": 0.05,
      "slPct": 0.02
    }
  }
}'::jsonb;

-- Ensure RLS allows users to update their own settings (existing profile policy usually covers this)
-- But we'll add a specific comment for clarity.
COMMENT ON COLUMN public.profiles.settings IS 'Stores user-specific preferences for the Lab Assistant and Backtesting Engine.';
