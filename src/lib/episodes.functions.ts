import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as anonClient } from "@/integrations/supabase/client";

/** Public — list of published episodes (metadata only, no media URLs). */
export const listEpisodes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await anonClient
    .from("episodes")
    .select("id, slug, title, description, cover_url, duration_seconds, min_plan_id, published_at")
    .not("published_at", "is", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return { episodes: data ?? [] };
});

/**
 * Auth-gated — returns a short-lived signed URL for the episode's media,
 * but only if the user has an active enrollment that covers the episode.
 */
export const getEpisodeStream = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      episodeId: z.string().uuid(),
      kind: z.enum(["audio", "video"]).default("audio"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1) Get the episode + its required plan.
    const { data: episode, error: epErr } = await supabase
      .from("episodes")
      .select("id, audio_path, video_path, min_plan_id, published_at")
      .eq("id", data.episodeId)
      .maybeSingle();

    if (epErr) throw new Error(epErr.message);
    if (!episode || !episode.published_at) {
      throw new Error("Episódio não encontrado.");
    }

    const path = data.kind === "video" ? episode.video_path : episode.audio_path;
    if (!path) throw new Error("Mídia indisponível para este episódio.");

    // 2) If gated, verify user's active plan covers it.
    if (episode.min_plan_id) {
      const [{ data: requiredPlan }, { data: userRank }] = await Promise.all([
        supabase.from("plans").select("sort_order").eq("id", episode.min_plan_id).single(),
        supabase.rpc("user_active_plan_rank", { _user_id: userId }),
      ]);

      const userRankValue = userRank ?? 0;
      const requiredRank = requiredPlan?.sort_order ?? 0;

      if (userRankValue < requiredRank) {
        throw new Error("Seu plano atual não cobre este episódio.");
      }
    }

    // 3) Sign URL (short TTL — 10 min).
    const { data: signed, error: signErr } = await supabase.storage
      .from("episodes-media")
      .createSignedUrl(path, 60 * 10);

    if (signErr || !signed) throw new Error(signErr?.message ?? "Falha ao gerar URL.");
    return { url: signed.signedUrl, expiresIn: 600 };
  });
