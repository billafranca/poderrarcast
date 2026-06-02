import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { listQuizQuestions, submitQuizAttempt } from "@/lib/quiz.functions";

type Props = { moduleId: string };

type AttemptDetail = {
  questionId: string;
  question: string;
  chosenIndex: number;
  correctIndex: number;
  correct: boolean;
  explanation: string;
};

export function ModuleQuiz({ moduleId }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchQuestions = useServerFn(listQuizQuestions);
  const submitAttempt = useServerFn(submitQuizAttempt);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; details: AttemptDetail[] } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["quiz", moduleId],
    queryFn: () => fetchQuestions({ data: { moduleId } }),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = Object.entries(answers).map(([questionId, chosenIndex]) => ({
        questionId,
        chosenIndex,
      }));
      return submitAttempt({ data: { moduleId, answers: payload } });
    },
    onSuccess: (res) => {
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ["my-attempts"] });
      toast.success(`Você acertou ${res.score} de ${res.total}!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-primary/5 border border-primary/30 p-6 flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando quiz…
      </div>
    );
  }

  const questions = data?.questions ?? [];
  if (questions.length === 0) {
    return (
      <div className="rounded-lg bg-secondary/40 border border-border/50 p-4 text-sm text-muted-foreground">
        Quiz em breve.
      </div>
    );
  }

  // Result view
  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="rounded-lg bg-primary/5 border border-primary/30 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-lg">
              {result.score}/{result.total} acertos ({pct}%)
            </h3>
            <p className="text-xs text-muted-foreground">Tentativa registrada no seu painel.</p>
          </div>
        </div>

        <ul className="space-y-3">
          {result.details.map((d, i) => {
            const q = questions.find((x) => x.id === d.questionId);
            const opts = (q?.options as string[]) ?? [];
            return (
              <li key={d.questionId} className="rounded-md bg-surface/50 p-3 text-sm space-y-1">
                <div className="flex items-start gap-2 font-medium">
                  {d.correct ? (
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <span>
                    {i + 1}. {d.question}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Sua resposta: <span className="text-foreground">{opts[d.chosenIndex] ?? "—"}</span>
                  {!d.correct && (
                    <>
                      <br />
                      Correta: <span className="text-primary">{opts[d.correctIndex]}</span>
                    </>
                  )}
                </p>
                {d.explanation && (
                  <p className="text-xs text-muted-foreground pl-6 italic">{d.explanation}</p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
          >
            Refazer
          </Button>
          <Button asChild>
            <Link to="/_authenticated/dashboard">Ver meu desempenho</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Login wall
  if (!user) {
    return (
      <div className="rounded-lg bg-primary/5 border border-primary/30 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Quiz interativo — Módulo {moduleId.toUpperCase().replace("M", "")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Entre na sua conta para responder o quiz e acompanhar seus acertos no painel.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/signup">Criar conta grátis</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Answer view
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="rounded-lg bg-primary/5 border border-primary/30 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-bold">Quiz interativo</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        {questions.length} pergunta{questions.length > 1 ? "s" : ""} · suas respostas ficam salvas no
        painel.
      </p>

      <div className="space-y-5">
        {questions.map((q, i) => {
          const opts = (q.options as string[]) ?? [];
          return (
            <div key={q.id} className="space-y-2">
              <p className="font-medium text-sm">
                {i + 1}. {q.question}
              </p>
              <RadioGroup
                value={answers[q.id]?.toString() ?? ""}
                onValueChange={(v) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: Number(v) }))
                }
              >
                {opts.map((opt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <RadioGroupItem value={idx.toString()} id={`${q.id}-${idx}`} className="mt-0.5" />
                    <Label htmlFor={`${q.id}-${idx}`} className="text-sm font-normal cursor-pointer">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={!allAnswered || mutation.isPending}
        className="shadow-glow"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Enviando…
          </>
        ) : (
          "Enviar respostas"
        )}
      </Button>
    </div>
  );
}
