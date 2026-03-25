import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { allowed, current, limit } = await checkAndIncrementUsage(user.id, 'backtests');

    if (!allowed) {
      return new Response(JSON.stringify({ 
        error: "QUOTA_EXCEEDED", 
        message: `Backtest runs exhausted (${current}/${limit}). Upgrade to Pro Trader for 500 runs/day.`,
        current,
        limit
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, current, limit }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to check quota" }), { status: 500 });
  }
}
