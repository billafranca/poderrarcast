import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getStripe } from "./stripe.server";

/**
 * Creates a Stripe Checkout Session for a one-time plan purchase.
 * Uses inline price_data so no Stripe product/price setup is required.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ planId: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;

    const { data: plan, error: planErr } = await supabase
      .from("plans")
      .select("id, name, description, price_cents, access_months, active")
      .eq("id", data.planId)
      .maybeSingle();

    if (planErr) throw new Error(planErr.message);
    if (!plan || !plan.active) throw new Error("Plano indisponível.");

    const stripe = getStripe();
    const host = getRequestHost();
    const protocol = host?.startsWith("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: (claims.email as string | undefined) ?? undefined,
      client_reference_id: userId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: plan.price_cents,
            product_data: {
              name: plan.name,
              description: plan.description ?? undefined,
            },
          },
        },
      ],
      metadata: {
        user_id: userId,
        plan_id: plan.id,
        access_months: String(plan.access_months ?? ""),
      },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
    });

    return { url: session.url };
  });
