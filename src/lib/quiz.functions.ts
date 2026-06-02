import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as anonClient } from "@/integrations/supabase/client";

/** Public — list questions of a module without revealing the correct index. */
export const listQuizQuestions = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ moduleId: z.string().min(1).max(10) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await anonClient
      .from("quiz_questions")
      .select("id, module_id, position, question, options")
      .eq("module_id", data.moduleId)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return { questions: rows ?? [] };
  });

/** Protected — submit answers, score on server, persist attempt. */
export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        moduleId: z.string().min(1).max(10),
        answers: z
          .array(
            z.object({
              questionId: z.string().uuid(),
              chosenIndex: z.number().int().min(0).max(10),
            }),
          )
          .min(1)
          .max(50),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: questions, error: qErr } = await supabase
      .from("quiz_questions")
      .select("id, position, question, options, correct_index, explanation")
      .eq("module_id", data.moduleId);

    if (qErr) throw new Error(qErr.message);
    if (!questions || questions.length === 0) {
      throw new Error("Quiz não encontrado para este módulo.");
    }

    const qById = new Map(questions.map((q) => [q.id, q]));
    const details = data.answers.map((a) => {
      const q = qById.get(a.questionId);
      if (!q) {
        return {
          questionId: a.questionId,
          question: "",
          chosenIndex: a.chosenIndex,
          correctIndex: -1,
          correct: false,
          explanation: "",
        };
      }
      const correct = a.chosenIndex === q.correct_index;
      return {
        questionId: q.id,
        question: q.question,
        chosenIndex: a.chosenIndex,
        correctIndex: q.correct_index,
        correct,
        explanation: q.explanation ?? "",
      };
    });

    const score = details.filter((d) => d.correct).length;
    const total = questions.length;

    const { error: insErr } = await supabase.from("quiz_attempts").insert({
      user_id: userId,
      module_id: data.moduleId,
      score,
      total,
      answers: details,
    });
    if (insErr) throw new Error(insErr.message);

    return { score, total, details };
  });

/** Protected — list current user's attempts grouped by module. */
export const listMyAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("id, module_id, score, total, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const byModule = new Map<
      string,
      { moduleId: string; bestScore: number; total: number; lastAt: string; attempts: number }
    >();
    for (const a of data ?? []) {
      const cur = byModule.get(a.module_id);
      if (!cur) {
        byModule.set(a.module_id, {
          moduleId: a.module_id,
          bestScore: a.score,
          total: a.total,
          lastAt: a.created_at,
          attempts: 1,
        });
      } else {
        cur.attempts += 1;
        if (a.score > cur.bestScore) cur.bestScore = a.score;
      }
    }

    return { summary: Array.from(byModule.values()) };
  });
