import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { listPlans } from "@/lib/plans.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — PodErrar" },
      { name: "description", content: "Escolha o plano que faz sentido para você." },
      { property: "og:title", content: "Planos — PodErrar" },
      { property: "og:description", content: "Básico, Intermediário ou Premium. Você escolhe." },
    ],
    links: [
  {
    rel: "icon",
    type: "image/png",
    href: "/logo.png",
  },
]
  }),
  component: PlansPage,
});

const fmt = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

function PlansPage() {
  const fetchPlans = useServerFn(listPlans);
  const { data, isLoading } = useQuery({ queryKey: ["plans"], queryFn: () => fetchPlans() });

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <p className="text-sm uppercase tracking-widest text-primary">Planos</p>
        <h1 className="text-4xl md:text-5xl font-bold">Escolha como quer aprender</h1>
        <p className="text-muted-foreground">Pague uma vez. Acesso completo aos episódios.</p>
      </div>

      {isLoading && <p className="text-center text-muted-foreground">Carregando planos…</p>}

      <div className="grid gap-6 md:grid-cols-3">
        {data?.plans.map((plan, idx) => {
          const featured = idx === 1;
          return (
            <Card
              key={plan.id}
              className={
                featured
                  ? "relative bg-card border-primary/60 shadow-glow md:scale-105"
                  : "bg-card hover:border-primary/40 transition-colors"
              }
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Mais escolhido
                </div>
              )}
              <CardContent className="p-8 space-y-5 flex flex-col h-full">
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <p className="text-5xl font-display font-bold">{fmt(plan.price_cents)}</p>
                <ul className="space-y-2 text-sm flex-1">
                  {(plan.features as string[]).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={featured ? "default" : "outline"}>
                  <Link to="/checkout" search={{ plan: plan.id }}>Assinar {plan.name}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-10">
        Garantia incondicional de 7 dias. Pagamento seguro processado pela Stripe.
      </p>
    </div>
  );
}
