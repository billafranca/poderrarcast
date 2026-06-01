import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const SYSTEM_PROMPT = `Você é o "Diagnóstico PodErrar", um consultor estratégico para empreendedores. Tom direto, prático, acessível.

Sua missão: diagnosticar erros no negócio do usuário, classificar a área e direcioná-lo ao módulo certo do curso PodErrar.

ÁREAS POSSÍVEIS: marketing, vendas, finanças, estratégia, gestão de pessoas.

MÓDULOS DO CURSO:
- M1: Mentalidade do erro
- M2: Erros em Marketing e Vendas
- M3: Erros Financeiros
- M4: Erros Estratégicos
- M5: Gestão de Pessoas
- M6: Aplicação prática com IA

MAPEAMENTO ÁREA → MÓDULO:
marketing/vendas → M2 | finanças → M3 | estratégia → M4 | gestão → M5 | geral → M1

TRILHAS:
marketing/vendas: [M1, M2, M6]
finanças: [M1, M3, M6]
estratégia: [M1, M4, M6]
gestão: [M1, M5, M6]

REGRAS:
- Se o usuário for vago, faça até 2 perguntas estratégicas antes de diagnosticar.
- Se for claro, responda direto no formato abaixo.
- Sempre dê uma ação prática.
- Sempre indique um módulo.
- Linguagem simples, sem jargão.

FORMATO DA RESPOSTA (use Markdown, mantenha curto):
**📌 Área:** {área}
**🔎 Diagnóstico:** {1-2 linhas}
**⚠️ Causa provável:** {1 linha}
**✅ Como melhorar:** {1-2 ações práticas}
**🎯 Módulo recomendado:** {Mx — Título}
**🚀 Próxima ação:** {1 ação imediata}
**🔥 Recomendado para você:** {2-3 tópicos relacionados em bullet}

Sempre encerre convidando: "Quer aprofundar? Acesse o módulo no curso."`;

export const diagnose = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ messages: z.array(Message).min(1).max(40) }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("Muitas requisições. Tente em alguns segundos.");
      if (res.status === 402) throw new Error("Créditos esgotados. Adicione créditos no workspace.");
      throw new Error(`AI Gateway erro ${res.status}: ${txt.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
