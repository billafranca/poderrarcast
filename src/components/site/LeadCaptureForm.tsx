import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { z } from "zod";

import { submitLead } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("Email inválido"),
});

export function LeadCaptureForm({ source = "landing" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const send = useServerFn(submitLead);

  const m = useMutation({
    mutationFn: (d: { name: string; email: string }) =>
      send({ data: { ...d, source } }),
    onSuccess: () => {
      setDone(true);
      toast.success("Pronto! Vamos te enviar o episódio em alguns minutos.");
    },
    onError: (e: Error) => toast.error(e.message ?? "Falha ao enviar"),
  });

  if (done) {
    return (
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center">
        <p className="font-semibold">✅ Inscrição confirmada</p>
        <p className="text-sm text-muted-foreground mt-1">Verifique seu email em breve.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = schema.safeParse({ name, email });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        m.mutate(parsed.data);
      }}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
    >
      <Input
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={m.isPending} className="shadow-glow">
        {m.isPending ? "Enviando…" : "Quero acessar"}
      </Button>
    </form>
  );
}
