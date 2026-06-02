import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ListChecks, PlayCircle } from "lucide-react";

import { MODULES } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EpisodeCard } from "@/components/site/EpisodeCard";
import { ModuleQuiz } from "@/components/site/ModuleQuiz";

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Conteúdo do Curso — PodErrar" },
      {
        name: "description",
        content:
          "6 módulos com vídeos, podcasts, livros, exercícios, quiz com IA e checklist de implementação.",
      },
      { property: "og:title", content: "Conteúdo do Curso — PodErrar" },
      { property: "og:description", content: "6 módulos completos com IA aplicada." },
    ],
    links: [
  {
    rel: "icon",
    type: "image/png",
    href: "/logo.png",
  },
]
  }),
  component: CoursePage,
});

function CoursePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          Conteúdo do curso
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          6 módulos. <span className="text-gradient">Aprendizado completo.</span>
        </h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Cada módulo entrega vídeo, leitura, exercícios práticos, quiz interativo e checklist de
          implementação. Você entende, testa, valida e aplica — de verdade.
        </p>
      </div>

      <div className="space-y-6">
        {MODULES.map((mod, idx) => (
          <Card key={mod.id} id={mod.id} className="bg-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible defaultValue={idx === 0 ? mod.id : undefined}>
                <AccordionItem value={mod.id} className="border-0">
                  <AccordionTrigger className="px-0 py-0 hover:no-underline group [&>svg]:mr-6">
                    <div className="flex w-full items-stretch gap-4 text-left">
                      <div className="relative w-32 sm:w-48 shrink-0 overflow-hidden">
                        <img
                          src={mod.cover}
                          alt={mod.title}
                          loading="lazy"
                          width={1280}
                          height={736}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                        <span className="absolute top-2 left-2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          Módulo {mod.number}
                        </span>
                      </div>
                      <div className="flex-1 py-4 pr-2">
                        <h2 className="text-lg md:text-xl font-bold">{mod.title}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {mod.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {mod.episodes.length} episódio{mod.episodes.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-6 pt-4">
                    <p className="text-sm text-muted-foreground">{mod.text}</p>

                    {/* Episódios em grid Netflix */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary" /> Episódios
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {mod.episodes.map((ep, i) => (
                          <EpisodeCard key={`${mod.id}-${i}`} episode={ep} index={i} />
                        ))}
                      </div>
                    </div>

                    {/* Livros */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" /> Livros recomendados
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {mod.books.map((b) => (
                          <li key={b}>📚 {b}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercícios */}
                    <div className="rounded-lg bg-surface/60 p-4">
                      <h3 className="text-sm font-semibold mb-2">Exercícios práticos</h3>
                      <ul className="space-y-1 text-sm">
                        {mod.exercises.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span className="text-primary">→</span> {x}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quiz funcional */}
                    <ModuleQuiz moduleId={mod.id} />

                    {/* Checklist */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" /> Checklist de implementação
                      </h3>
                      <ul className="grid gap-1 sm:grid-cols-2 text-sm">
                        {mod.checklist.map((c) => (
                          <li key={c} className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
        <h2 className="text-2xl md:text-3xl font-bold">Pronto para começar?</h2>
        <p className="text-muted-foreground">Tenha acesso completo aos 6 módulos.</p>
        <Button asChild size="lg" className="shadow-glow">
          <Link to="/checkout">Quero começar agora</Link>
        </Button>
      </div>
    </div>
  );
}
