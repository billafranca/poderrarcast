import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getMe } from "@/lib/auth.functions";
import { listMyAttempts } from "@/lib/quiz.functions";
import { MODULES } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Meu painel — podErrar" }] }),
  component: DashboardPage,
});

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

const moduleTitle = (id: string) =>
  MODULES.find((m) => m.id === id)?.title ?? id.toUpperCase();

function DashboardPage() {
  const { user, signOut } = useAuth();
  const fetchMe = useServerFn(getMe);
  const fetchAttempts = useServerFn(listMyAttempts);

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe(),
  });

  const { data: attemptsData, isLoading: loadingAttempts } = useQuery({
    queryKey: ["my-attempts"],
    queryFn: () => fetchAttempts(),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            podErrar
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Meu painel</h1>

        <Card>
          <CardHeader>
            <CardTitle>Minhas matrículas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
            {data && data.enrollments.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Você ainda não comprou nenhum plano.
                </p>
                <Button asChild>
                  <Link to="/planos">Ver planos</Link>
                </Button>
              </div>
            )}
            {data && data.enrollments.length > 0 && (
              <ul className="space-y-2 text-sm">
                {data.enrollments.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium capitalize">{e.plan_id}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {e.status} · Compra: {fmtDate(e.purchased_at)} · Expira:{" "}
                        {e.expires_at ? fmtDate(e.expires_at) : "vitalício"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Meu desempenho nos quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAttempts && (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            )}
            {attemptsData && attemptsData.summary.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Você ainda não respondeu nenhum quiz.
                </p>
                <Button asChild variant="outline">
                  <Link to="/curso">Ir para o curso</Link>
                </Button>
              </div>
            )}
            {attemptsData && attemptsData.summary.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="text-left py-2 font-medium">Módulo</th>
                      <th className="text-left py-2 font-medium">Melhor nota</th>
                      <th className="text-left py-2 font-medium">Tentativas</th>
                      <th className="text-left py-2 font-medium">Última</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {attemptsData.summary
                      .slice()
                      .sort((a, b) => a.moduleId.localeCompare(b.moduleId))
                      .map((s) => {
                        const pct = Math.round((s.bestScore / s.total) * 100);
                        return (
                          <tr
                            key={s.moduleId}
                            className="border-b border-border/30 last:border-0"
                          >
                            <td className="py-3">
                              <p className="font-medium">{moduleTitle(s.moduleId)}</p>
                              <p className="text-xs text-muted-foreground uppercase">
                                {s.moduleId}
                              </p>
                            </td>
                            <td className="py-3">
                              <span className="font-semibold text-primary">
                                {s.bestScore}/{s.total}
                              </span>{" "}
                              <span className="text-xs text-muted-foreground">({pct}%)</span>
                            </td>
                            <td className="py-3 text-muted-foreground">{s.attempts}</td>
                            <td className="py-3 text-muted-foreground">{fmtDate(s.lastAt)}</td>
                            <td className="py-3 text-right">
                              <Button asChild variant="outline" size="sm">
                                <Link to="/curso" hash={s.moduleId}>
                                  Refazer
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
