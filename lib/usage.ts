import { createClient } from "./supabase/server";

/**
 * PROFIT MARGIN CALCULATION (Target AI Spend: £10/mo per user)
 * -----------------------------------------------------------
 * Assume Avg. Cost per Message (Input + Output + Tools): $0.008 (£0.0065)
 * £10 / £0.0065 = ~1,538 messages per month
 * 1,538 / 30 days = ~51 messages per day
 * 
 * Safety Buffer (20%): 40 messages per day.
 */
export const USAGE_LIMITS = {
  paper_trader: {
    ai_messages: 5,        // Minimal trial usage
    backtests: 3           // 3 runs to get a taste
  },
  pro_trader: {
    ai_messages: 40,       // Hard cap for £10 spend efficiency
    backtests: 100         // Backtesting is cheap (runs locally)
  },
  admin: {
    ai_messages: 9999,
    backtests: 9999
  }
};

export async function checkAndIncrementUsage(userId: string, type: 'ai_messages' | 'backtests' = 'ai_messages') {
  const supabase = await createClient();

  // 1. Fetch current usage and status
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("tier, subscription_status, daily_chat_count, daily_backtest_count, last_reset_at")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error("Usage check failed:", error);
    return { allowed: true, current: 0, limit: USAGE_LIMITS.paper_trader.ai_messages };
  }

  // 2. Logic: If subscription is not active/trialing, treat as paper_trader even if tier says pro
  let tier = (profile.tier as keyof typeof USAGE_LIMITS) || 'paper_trader';
  const status = profile.subscription_status;
  
  if (tier === 'pro_trader' && status !== 'active' && status !== 'trialing') {
    tier = 'paper_trader'; // Downgrade effective limits if payment failed/canceled
  }

  const limits = USAGE_LIMITS[tier] || USAGE_LIMITS.paper_trader;
  const limit = type === 'ai_messages' ? limits.ai_messages : limits.backtests;
  
  const lastReset = new Date(profile.last_reset_at || Date.now());
  const now = new Date();

  // 3. Check if we need to reset (older than 24h)
  const isExpired = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60) >= 24;
  
  if (isExpired) {
    const updateData = {
      last_reset_at: now.toISOString(),
      daily_chat_count: type === 'ai_messages' ? 1 : 0,
      daily_backtest_count: type === 'backtests' ? 1 : 0
    };

    await supabase.from("profiles").update(updateData).eq("id", userId);
    return { allowed: true, current: 1, limit };
  }

  // 4. Check against specific limit
  const currentCount = type === 'ai_messages' ? profile.daily_chat_count : profile.daily_backtest_count;
  if (currentCount >= limit) {
    return { allowed: false, current: currentCount, limit };
  }

  // 5. Increment usage
  const { error: upError } = await supabase.rpc('increment_usage', { 
    user_id: userId, 
    usage_type: type 
  });

  // Fallback if RPC isn't available yet
  if (upError) {
    const updateData: any = {};
    if (type === 'ai_messages') updateData.daily_chat_count = currentCount + 1;
    else updateData.daily_backtest_count = currentCount + 1;
    await supabase.from("profiles").update(updateData).eq("id", userId);
  }

  return { allowed: true, current: currentCount + 1, limit };
}
