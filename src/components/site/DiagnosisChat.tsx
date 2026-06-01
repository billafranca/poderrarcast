import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { diagnose } from "@/lib/diagnose.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Minhas vendas caíram, o que pode ser?",
  "Onde posso estar errando no marketing?",
  "Como melhorar minhas decisões usando IA?",
  "O que está travando meu crescimento?",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "👋 Eu sou o **Diagnóstico PodErrar**. Me conte um erro ou problema no seu negócio e eu vou te mostrar exatamente como melhorar e qual módulo do curso te ajuda.",
};

export function DiagnosisChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const ask = useServerFn(diagnose);

  const m = useMutation({
    mutationFn: (msgs: Msg[]) => ask({ data: { messages: msgs.filter((x) => x !== WELCOME) } }),
    onSuccess: (r) => setMessages((prev) => [...prev, { role: "assistant", content: r.content }]),
    onError: (e: Error) =>
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${e.message}` }]),
  });

  const send = (text: string) => {
    const txt = text.trim();
    if (!txt || m.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: txt }];
    setMessages(next);
    setInput("");
    m.mutate(next);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
        >
          <Sparkles className="h-4 w-4" />
          Diagnóstico PodErrar
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[36rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Diagnóstico PodErrar</p>
                <p className="text-[10px] text-muted-foreground">consultor por IA</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_strong]:text-primary [&_ul]:my-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {m.isPending && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  Pensando<span className="animate-pulse">…</span>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="border-t border-border p-2">
              <p className="px-1 pb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Sugestões
              </p>
              <div className="flex flex-wrap gap-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border px-2 py-1 text-[11px] hover:border-primary hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-2 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva um problema no seu negócio…"
              disabled={m.isPending}
              className="h-9"
            />
            <Button type="submit" size="icon" disabled={m.isPending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
