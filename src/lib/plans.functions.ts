import { createServerFn } from "@tanstack/react-start";
import { supabase as anonClient } from "@/integrations/supabase/client";

/** Public — lists active plans for the pricing page. */
export const listPlans = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await anonClient
    .from("plans")
    .select("id, name, description, price_cents, access_months, sort_order, features")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return { plans: data ?? [] };
});
