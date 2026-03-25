import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's stripe_customer_id
    const { data: profile, error: pError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (pError || !profile?.stripe_customer_id) {
       // Redirect back to dashboard to show upgrade modal instead of a 404 JSON
       return NextResponse.redirect(`${req.headers.get('origin')}/dashboard?showUpgrade=true`);
    }

    // Create a Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${req.headers.get('origin')}/dashboard`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (err: any) {
    console.error("Portal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
