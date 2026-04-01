import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { fetchMarketData } from "@/lib/api/alpha_vantage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const timeframe = searchParams.get("timeframe") || "1D";
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol parameter" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo";

  try {
    const data = await fetchMarketData(symbol, timeframe, apiKey, startDate, endDate);

    // Save to Cache here asynchronously before returning
    // ...

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
