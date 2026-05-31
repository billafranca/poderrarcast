import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { listPlans } from "@/lib/plans.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "podErrar — Aprenda com erros reais" },
      { name: "description", content: "Curso em formato de streaming que transforma falhas em decisões melhores usando IA." },
    ],
  }),
  component: Index,
});

const fmtPrice = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchPlans = useServerFn(listPlans);
  const startCheckout = useServerFn(createCheckoutSession);
  const { data } = useQuery({ queryKey: ["plans"], queryFn: () => fetchPlans() });

  const checkout = useMutation({
    mutationFn: (planId: string) => startCheckout({ data: { planId } }),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (err: Error) => toast.error(err.message ?? "Falha ao iniciar checkout"),
  });

  const handleSubscribe = (planId: string) => {
    if (!user) {
      navigate({ to: "/signup" });
      return;
    }
    checkout.mutate(planId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">podErrar</Link>
          <div className="flex gap-2">
            {user ? (
              <Button asChild size="sm"><Link to="/dashboard">Meu painel</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/login">Entrar</Link></Button>
                <Button asChild size="sm"><Link to="/signup">Criar conta</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-16 text-center max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Aprenda com erros reais, evolua com inteligência
          </h1>
          <p className="text-muted-foreground text-lg">
            Curso em formato podcast + vídeo que transforma falhas em decisões melhores usando IA.
          </p>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Escolha seu plano</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {data?.plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <p className="text-3xl font-bold">{fmtPrice(plan.price_cents)}</p>
                  <ul className="text-sm space-y-1 flex-1">
                    {(plan.features as string[]).map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={checkout.isPending}
                  >
                    {checkout.isPending && checkout.variables === plan.id
                      ? "Redirecionando…"
                      : `Assinar ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
