import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { useAuth } from "@/hooks/use-auth";
import { getMe } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Meu painel — podErrar" }] }),
  component: DashboardPage,
});

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

function DashboardPage() {
  const { user, signOut } = useAuth();
  const fetchMe = useServerFn(getMe);
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe(),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">podErrar</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Meu painel</h1>

        <Card>
          <CardHeader><CardTitle>Minhas matrículas</CardTitle></CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
            {data && data.enrollments.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Você ainda não comprou nenhum plano.</p>
                <Button asChild><Link to="/">Ver planos</Link></Button>
              </div>
            )}
            {data && data.enrollments.length > 0 && (
              <ul className="space-y-2 text-sm">
                {data.enrollments.map((e) => (
                  <li key={e.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium capitalize">{e.plan_id}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {e.status} · Compra: {fmtDate(e.purchased_at)} ·{" "}
                        Expira: {e.expires_at ? fmtDate(e.expires_at) : "vitalício"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
