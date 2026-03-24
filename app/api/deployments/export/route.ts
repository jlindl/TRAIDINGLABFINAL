import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generatePythonScript } from "@/lib/backtest/exporter";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { strategy_id, broker } = await req.json();

    // 1. Verify deployment status/eligibility
    const { data: deployment, error: depError } = await supabase
      .from("deployments")
      .select("*, saved_strategies(*)")
      .eq("strategy_id", strategy_id)
      .eq("user_id", user.id)
      .single();

    if (depError || !deployment) {
      return NextResponse.json({ error: "No active deployment request found for this strategy." }, { status: 404 });
    }

    // 2. Generate Script
    const script = generatePythonScript(deployment.saved_strategies.strategy_json, broker);

    // 3. Update status to 'exported'
    await supabase
      .from("deployments")
      .update({ status: 'exported' })
      .eq("id", deployment.id);

    return NextResponse.json({ script, filename: `${deployment.saved_strategies.name.replace(/\s+/g, '_')}_bot.py` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
