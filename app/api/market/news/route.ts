import { NextResponse } from "next/server";
import { fetchSentiment } from "@/lib/api/alpha_vantage";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "BTC";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get API Key from profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("alpha_vantage_key")
        .eq("id", user.id)
        .single();

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || profile?.alpha_vantage_key;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key missing" }, { status: 400 });
    }

    try {
        const newsData = await fetchSentiment(symbol, apiKey);
        if (!newsData) {
            return NextResponse.json({ error: "No news found" }, { status: 404 });
        }

        return NextResponse.json(newsData);
    } catch (err: any) {
        console.error("News API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
