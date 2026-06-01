import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, Clock, CreditCard, Lock, Shield } from "lucide-react";

import { listPlans } from "@/lib/plans.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const search = z.object({ plan: z.string().optional() });

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Finalizar inscrição — PodErrar" },
      { name: "description", content: "Inscreva-se no PodErrar e comece a aprender hoje." },
    ],
  }),
  component: CheckoutPage,
});

const fmt = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

function CheckoutPage() {
  const { plan: planParam } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchPlans = useServerFn(listPlans);
  const startCheckout = useServerFn(createCheckoutSession);
  const { data } = useQuery({ queryKey: ["plans"], queryFn: () => fetchPlans() });

  const plans = data?.plans ?? [];
  const selectedPlan =
    plans.find((p) => p.id === planParam) ??
    plans[1] ??
    plans[0];

  const [name, setName] = useState(user?.user_metadata?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [cpf, setCpf] = useState("");

  const checkout = useMutation({
    mutationFn: () => {
      if (!selectedPlan) throw new Error("Plano não encontrado");
      return startCheckout({ data: { planId: selectedPlan.id } });
    },
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (e: Error) => toast.error(e.message ?? "Falha ao iniciar pagamento"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Preencha nome e email");
      return;
    }
    if (!user) {
      toast.message("Crie sua conta para continuar", { description: "Você voltará ao checkout depois." });
      navigate({ to: "/signup" });
      return;
    }
    checkout.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 max-w-6xl">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-widest text-primary">Checkout seguro</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Finalizar inscrição</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* FORM */}
        <div className="space-y-6">
          <Card className="bg-card">
            <CardContent className="p-6 space-y-5">
              <h2 className="font-semibold text-lg">Seus dados</h2>
              <form onSubmit={handleSubmit} className="space-y-4" id="checkout-form">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF (opcional)</Label>
                  <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6 space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Forma de pagamento
              </h2>
              <p className="text-sm text-muted-foreground">
                Cartão de crédito, Pix ou Boleto — selecione na próxima etapa.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Cartão", "Pix", "Boleto"].map((m) => (
                  <span key={m} className="rounded-full border border-border px-3 py-1">{m}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { i: Shield, t: "Ambiente 100% seguro" },
              { i: Lock, t: "Seus dados protegidos" },
              { i: Clock, t: "Garantia de 7 dias" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50 text-sm">
                <x.i className="h-4 w-4 text-primary" />
                {x.t}
              </div>
            ))}
          </div>
        </div>

        {/* RESUMO */}
        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          <Card className="bg-card border-primary/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>Seu pedido</span>
                <span className="text-primary">Vagas limitadas</span>
              </div>

              {selectedPlan ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold">PodErrar — {selectedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPlan.description}</p>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {(selectedPlan.features as string[]).map((f) => (
                      <li key={f} className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-border pt-4 flex items-end justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-3xl font-display font-bold">{fmt(selectedPlan.price_cents)}</span>
                  </div>

                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full shadow-glow"
                    size="lg"
                    disabled={checkout.isPending}
                  >
                    {checkout.isPending ? "Redirecionando…" : "Finalizar inscrição"}
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground">
                    Ao continuar você concorda com nossos termos. Pagamento processado pela Stripe.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Carregando plano…</p>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <Link to="/planos" className="underline hover:text-foreground">Trocar plano</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
