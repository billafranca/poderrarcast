import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LeadCaptureForm } from "@/components/site/LeadCaptureForm";

export const Route = createFileRoute("/acesso-gratuito")({
  head: () => ({
    meta: [
      { title: "Episódio gratuito — PodErrar" },
      { name: "description", content: "Receba um episódio completo do PodErrar gratuitamente." },
    ],
  }),
  component: LeadPage,
});

function LeadPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
      <Card className="bg-card border-primary/30">
        <CardContent className="p-8 md:p-12 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary mx-auto">
            <Sparkles className="h-3 w-3" /> 100% gratuito
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Receba um episódio gratuito</h1>
          <p className="text-muted-foreground">
            Sem cartão, sem cadastro complicado. Deixe seu nome e email que enviamos um episódio
            completo do PodErrar pra você.
          </p>
          <LeadCaptureForm source="lead-page" />
          <p className="text-xs text-muted-foreground">
            Prometemos não fazer spam. Cancele quando quiser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
