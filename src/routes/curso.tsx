import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ListChecks, PlayCircle, Sparkles } from "lucide-react";

import { MODULES } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Conteúdo do Curso — PodErrar" },
      {
        name: "description",
        content: "6 módulos com vídeos, podcasts, livros, exercícios, quiz com IA e checklist de implementação.",
      },
      { property: "og:title", content: "Conteúdo do Curso — PodErrar" },
      { property: "og:description", content: "6 módulos completos com IA aplicada." },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <p className="text-sm uppercase tracking-widest text-primary">Conteúdo</p>
        <h1 className="text-4xl md:text-5xl font-bold">6 módulos para aprender com erros</h1>
        <p className="text-muted-foreground">
          Cada módulo combina teoria, prática, validação com IA e checklist de aplicação.
        </p>
      </div>

      <div className="space-y-4">
        {MODULES.map((mod, idx) => (
          <Card key={mod.id} id={mod.id} className="bg-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible defaultValue={idx === 0 ? mod.id : undefined}>
                <AccordionItem value={mod.id} className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground font-display font-bold">
                        M{mod.number}
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold">{mod.title}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-6">
                    {/* Vídeo placeholder */}
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-secondary to-background border border-border/50 flex flex-col items-center justify-center gap-2">
                      <PlayCircle className="h-12 w-12 text-primary" />
                      <p className="text-sm font-medium">{mod.episodes[0]}</p>
                      <p className="text-xs text-muted-foreground">Vídeo + podcast disponível</p>
                    </div>

                    <p className="text-sm text-muted-foreground">{mod.text}</p>

                    {/* Episódios */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary" /> Episódios
                      </h3>
                      <ul className="space-y-1 text-sm">
                        {mod.episodes.map((e) => (
                          <li key={e} className="flex gap-2">
                            <span className="text-primary">•</span> {e}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Livros */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" /> Livros recomendados
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {mod.books.map((b) => <li key={b}>📚 {b}</li>)}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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

                      {/* Quiz IA */}
                      <div className="rounded-lg bg-primary/5 border border-primary/30 p-4">
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" /> Quiz com IA
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {mod.quiz.map((q) => (
                            <li key={q} className="flex gap-2">
                              <span className="text-primary">?</span> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

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
