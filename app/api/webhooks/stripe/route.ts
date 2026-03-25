import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a service-role client to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object;

  // Handle specific events
  switch (event.type) {
    case "checkout.session.completed": {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const customerId = session.customer;
      const userId = session.metadata.userId;

      // Update the profile with Stripe details and Pro tier
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          tier: "pro_trader", // Set to pro upon successful checkout
        })
        .eq("id", userId);

      if (error) console.error("Error updating profile on checkout.completed:", error);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          tier: subscription.status === "active" ? "pro_trader" : "paper_trader",
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) console.error("Error updating profile on subscription.updated:", error);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "canceled",
          tier: "paper_trader", // Downgrade to paper trader
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) console.error("Error updating profile on subscription.deleted:", error);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
