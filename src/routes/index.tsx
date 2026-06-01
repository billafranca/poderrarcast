import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Brain, Headphones, PlayCircle, Sparkles, Target, Zap, Shield, Clock, Users } from "lucide-react";

import { listPlans } from "@/lib/plans.functions";
import { FEATURED_EPISODES, INSTRUCTORS, TESTIMONIALS } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadCaptureForm } from "@/components/site/LeadCaptureForm";
import { Play, Info } from "lucide-react";
import heroImg from "@/assets/hero-poderrar.jpg";
import logoMark from "@/assets/poderrar-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PodErrar — Aprenda com erros reais. Evolua com inteligência." },
      {
        name: "description",
        content:
          "Curso em formato de podcast e vídeo que transforma falhas em decisões melhores usando IA. Comece agora.",
      },
      { property: "og:title", content: "PodErrar — Aprenda com erros reais" },
      {
        property: "og:description",
        content: "Streaming de podcasts e vídeos sobre erros reais no empreendedorismo, com diagnóstico por IA.",
      },
    ],
  }),
  component: HomePage,
});

const HIGHLIGHTS = [
  { icon: Brain, title: "Não ensina fórmula de sucesso", desc: "Mostra o que ninguém quer mostrar: o erro." },
  { icon: Target, title: "Erros reais de empreendedores", desc: "Casos verdadeiros, com nomes e números." },
  { icon: Sparkles, title: "IA para corrigir decisões", desc: "Aprenda a usar IA como consultor estratégico." },
  { icon: Headphones, title: "Assista ou ouça quando quiser", desc: "Formato leve, dentro da sua rotina." },
];

const STEPS = [
  { n: "01", title: "Assista ou ouça os episódios", desc: "No seu ritmo, no formato que preferir." },
  { n: "02", title: "Analise erros reais", desc: "Casos detalhados de empreendedores como você." },
  { n: "03", title: "Use IA para entender o problema", desc: "Nossa IA Diagnóstico pode te ajudar agora mesmo." },
  { n: "04", title: "Aplique no seu negócio", desc: "Checklist, plano de ação e prompts prontos." },
];

const fmtPrice = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

function HomePage() {
  const fetchPlans = useServerFn(listPlans);
  const { data } = useQuery({ queryKey: ["plans"], queryFn: () => fetchPlans() });

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section id="inicio" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Episódio em destaque - PodErrar"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center scale-105 animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-primary-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-primary-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container relative z-10 flex min-h-[100svh] items-center pt-24 pb-32">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src={logoMark}
              alt="PodErrar"
              width={96}
              height={96}
              className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
            />
            <div className="h-10 w-px bg-border" />
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Novo curso · Estreia agora
          </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            Aprenda com <span className="text-gradient-primary">erros reais</span>.
            <br />
            Evolua com <span className="text-gradient-primary">inteligência</span>.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Um curso em formato de streaming que transforma falhas em decisões melhores
            usando IA. Assista, ouça e aplique no seu negócio.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow animate-pulse-glow h-12 px-7"
            >
              <Link to="/checkout">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Começar agora
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-secondary/80 backdrop-blur hover:bg-secondary border border-border font-semibold h-12 px-7"
            >
              <a href="#destaques">
                <Info className="mr-2 h-5 w-5" />
                Assistir trailer
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 text-sm text-muted-foreground">
            <div><span className="text-foreground font-bold">6</span> módulos</div>
            <div className="h-4 w-px bg-border" />
            <div><span className="text-foreground font-bold">18+</span> episódios</div>
            <div className="h-4 w-px bg-border" />
            <div>Vídeo + Podcast</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-primary-to-t from-background to-transparent z-[5]" />
    </section>

      {/* HIGHLIGHTS */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Por que este curso é diferente?</h2>
          <p className="mt-3 text-muted-foreground">
           Outros cursos ensinam a acertar. Aqui você aprende a evoluir.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="bg-card border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <h.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EPISÓDIOS — carrossel Netflix */}
      <section id="episodios" className="py-20 bg-surface/40">
        <div className="container mx-auto px-4 mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Episódios em destaque</h2>
            <p className="mt-2 text-muted-foreground">Casos reais. Lições reais.</p>
          </div>
          <Button asChild variant="ghost"><Link to="/curso">Ver curso →</Link></Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 pb-4 container mx-auto">
            {FEATURED_EPISODES.map((ep, i) => (
              <Card
                key={ep.title}
                className="group min-w-[280px] max-w-[280px] overflow-hidden bg-card hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-video bg-gradient-primary-to-br from-secondary to-background flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-primary-to-t from-background/80 to-transparent" />
                  <PlayCircle className="h-14 w-14 text-primary/70 group-hover:scale-110 group-hover:text-primary transition" />
                  <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-mono">
                    EP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-primary font-mono">{ep.module} • {ep.duration}</p>
                  <h3 className="font-semibold leading-tight">{ep.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Como funciona a experiência</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative p-6 rounded-xl bg-card border border-border/50">
              <div className="text-5xl font-display font-bold text-gradient-primary-primary opacity-80">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUTORES */}
      <section className="py-20 bg-surface/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Quem está por trás</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {INSTRUCTORS.map((i) => (
              <Card key={i.name} className="bg-card text-center hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary-primary flex items-center justify-center text-gradient-primary font-bold text-xl">
                    {i.initials}
                  </div>
                  <h3 className="font-semibold">{i.name}</h3>
                  <p className="text-sm text-muted-foreground">{i.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Escolha seu plano</h2>
          <p className="mt-3 text-muted-foreground">Comece pelo que faz sentido pra você agora.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {data?.plans.map((plan, idx) => {
            const featured = idx === 1;
            return (
              <Card
                key={plan.id}
                className={
                  featured
                    ? "relative bg-card border-primary/60 shadow-glow scale-105"
                    : "bg-card hover:border-primary/40 transition-colors"
                }
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary-primary px-3 py-1 text-xs font-semibold text-gradient-primary">
                    Mais escolhido
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <p className="text-4xl font-display font-bold">{fmtPrice(plan.price_cents)}</p>
                  <ul className="space-y-2 text-sm">
                    {(plan.features as string[]).map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-primary">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={featured ? "default" : "outline"}>
                    <Link to="/checkout" search={{ plan: plan.id }}>
                      Assinar {plan.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-surface/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">O que os ouvintes <span className="text-gradient-primary">dizem.</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <Card key={t.author} className="bg-card">
                <CardContent className="p-6 space-y-3">
                  <p className="text-lg italic">"{t.text}"</p>
                  <p className="text-sm text-gradient-primary">— {t.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto bg-card border-primary/30">
          <CardContent className="p-8 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Receba um episódio gratuito</h2>
              <p className="text-muted-foreground">Sem compromisso. Direto no seu email.</p>
            </div>
            <LeadCaptureForm />
          </CardContent>
        </Card>
      </section>

      {/* TRUST */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto text-sm">
          {[
            { icon: Shield, t: "Ambiente seguro", d: "Pagamento processado pela Stripe" },
            { icon: Clock, t: "Garantia de 7 dias", d: "100% do seu dinheiro de volta" },
            { icon: Users, t: "+500 alunos", d: "Empreendedores reais aprendendo" },
          ].map((i) => (
            <div key={i.t} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border/50">
              <i.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{i.t}</p>
                <p className="text-xs text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary-to-br from-primary/20 via-card to-card border border-primary/30 p-12 md:p-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto">
            Você não precisa parar de errar. <span className="text-gradient-primary-primary">Precisa aprender melhor.</span>
          </h2>
          <Button asChild size="lg" className="mt-8 shadow-glow text-base px-10">
            <Link to="/checkout">Começar agora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
