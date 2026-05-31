import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns the current user's profile + active plan info. */
export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [profileRes, rolesRes, enrollmentsRes, planRankRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase
        .from("enrollments")
        .select("id, plan_id, status, purchased_at, expires_at, amount_cents")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.rpc("user_active_plan_rank", { _user_id: userId }),
    ]);

    return {
      profile: profileRes.data,
      roles: (rolesRes.data ?? []).map((r) => r.role),
      enrollments: enrollmentsRes.data ?? [],
      activePlanRank: planRankRes.data ?? 0,
    };
  });
