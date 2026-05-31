import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getStripe } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!signature || !webhookSecret) {
          return new Response("Missing signature/secret", { status: 400 });
        }

        const body = await request.text();
        const stripe = getStripe();

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret,
          );
        } catch (err) {
          console.error("[stripe-webhook] invalid signature", err);
          return new Response("Invalid signature", { status: 400 });
        }

        // Idempotency: log first; if duplicate event_id, abort.
        const { error: logErr } = await supabaseAdmin
          .from("payment_events")
          .insert({
            stripe_event_id: event.id,
            event_type: event.type,
            payload: JSON.parse(JSON.stringify(event)),
          });

        if (logErr) {
          // Duplicate -> already processed.
          if (logErr.code === "23505") return new Response("ok", { status: 200 });
          console.error("[stripe-webhook] log error", logErr);
          return new Response("Log error", { status: 500 });
        }

        try {
          if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id;
            const planId = session.metadata?.plan_id;
            const accessMonthsRaw = session.metadata?.access_months;

            if (!userId || !planId) {
              throw new Error("Missing user_id or plan_id in session metadata");
            }

            const accessMonths = accessMonthsRaw
              ? parseInt(accessMonthsRaw, 10)
              : null;
            const now = new Date();
            const expiresAt = accessMonths && accessMonths > 0
              ? new Date(now.getTime() + accessMonths * 30 * 24 * 60 * 60 * 1000)
              : null;

            const { error: enrErr } = await supabaseAdmin
              .from("enrollments")
              .insert({
                user_id: userId,
                plan_id: planId,
                status: "active",
                amount_cents: session.amount_total ?? 0,
                currency: session.currency ?? "brl",
                stripe_session_id: session.id,
                stripe_payment_intent_id:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.id ?? null,
                purchased_at: now.toISOString(),
                expires_at: expiresAt?.toISOString() ?? null,
              });

            if (enrErr) throw new Error(enrErr.message);
          }

          await supabaseAdmin
            .from("payment_events")
            .update({ processed_at: new Date().toISOString() })
            .eq("stripe_event_id", event.id);

          return new Response("ok", { status: 200 });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("[stripe-webhook] handler error", message);
          await supabaseAdmin
            .from("payment_events")
            .update({ error: message })
            .eq("stripe_event_id", event.id);
          return new Response("Handler error", { status: 500 });
        }
      },
    },
  },
});
