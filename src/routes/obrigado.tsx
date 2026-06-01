import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/obrigado")({
  head: () => ({ meta: [{ title: "Inscrição confirmada — PodErrar" }] }),
  component: ThanksPage,
});

function ThanksPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-6">
      <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
        <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold">Inscrição confirmada!</h1>
      <p className="text-lg text-muted-foreground">
        Parabéns! Sua inscrição no <strong>PodErrar</strong> foi realizada com sucesso.
      </p>

      <div className="text-left bg-card border border-border/50 rounded-xl p-6 space-y-3">
        <h2 className="font-semibold">Próximos passos</h2>
        <ol className="space-y-2 text-sm">
          {["Acesse seu email — enviamos o acesso", "Entre na plataforma", "Comece pelo primeiro episódio"].map(
            (s, i) => (
              <li key={s} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {i + 1}
                </span>
                {s}
              </li>
            ),
          )}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg" className="shadow-glow">
          <Link to="/curso">Ir para o curso</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/dashboard">Meu painel</Link>
        </Button>
      </div>
    </div>
  );
}
