import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, strategy_json, performance_snapshot } = await req.json();

    if (!name || !strategy_json) {
      return NextResponse.json({ error: "Missing name or strategy data" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("saved_strategies")
      .insert({
        user_id: user.id,
        name,
        strategy_json,
        performance_snapshot: performance_snapshot || {}
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Save Strategy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("saved_strategies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Strategies Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
