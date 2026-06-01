
# Plano de implementação — PodErrar UI completa

Vou montar a UI inteira do PodErrar sobre o backend já existente (auth Supabase, `listPlans`, `createCheckoutSession`, webhook Stripe, `enrollments`). Nada de backend novo é necessário para a parte visual — só algumas extensões pontuais para o chat IA e captura de lead.

## Decisões importantes (preciso confirmar antes de começar)

1. **Checkout**: você já tem Stripe configurado e funcionando. O JSON pede uma página `/checkout` "fake" estilo Hotmart. Tenho duas opções:
   - **(A) Manter Stripe real** — botão "Começar agora" leva direto pro Stripe Checkout (como já está). Pula a tela `/checkout` fake.
   - **(B) Tela `/checkout` própria** — formulário de nome/email/CPF, e ao clicar "Finalizar inscrição" dispara o Stripe Checkout real (preenchendo email/CPF no perfil). Mais parecido com Hotmart.
   - **(C) Checkout 100% fake** (como o JSON literalmente pede) e ignora o Stripe nesta tela — usado só pra prototipar visual.

   👉 Recomendo **B**. Confirma?

2. **Chat IA "Diagnóstico PodErrar"**: vou usar o **Lovable AI Gateway** (gemini-2.5-flash, sem custo de API key pra você) com streaming. Widget fixo bottom-right em todas as páginas. OK?

3. **Conteúdo dos módulos (M1–M6)**: vídeos, livros, quiz, checklist. Duas opções:
   - **(A) Estático** — hardcoded no front a partir do JSON que você mandou (rápido, fácil de iterar visual).
   - **(B) No banco** — tabelas `modules`, `module_resources`, `quiz_questions`, etc.
   
   👉 Recomendo **A** por enquanto — depois migramos pro banco quando o conteúdo estiver definido. OK?

4. **Logo**: você quer que eu **gere** uma logo (microfone + onda + gráfico, verde #22C55E sobre #0B0F19) ou você vai enviar uma?

## Escopo da implementação (assumindo B/A/A acima)

### 1. Design system (`src/styles.css`)
- Trocar tokens pro tema PodErrar dark: bg `#0B0F19`, primary `#22C55E`, secondary `#1E293B`, text `#E2E8F0`, em oklch.
- Fontes sans modernas (Inter + display sutil).
- Gradientes verde→escuro, sombras "glow" no primary, animações suaves.

### 2. Layout compartilhado (`__root.tsx` + novo `components/site/`)
- `Navbar` sticky com logo à esquerda, links (Início, Curso, Planos), botões Entrar/Criar conta (ou Painel).
- `Footer` com logo reduzida, links, copyright.
- Scroll suave global.

### 3. Rotas (criar/atualizar)
- `/` — **Landing** (reescreve `index.tsx`):
  - Hero com headline, subhead, CTAs (Começar agora→`/checkout`, Assistir trailer→scroll).
  - Highlights "Por que é diferente".
  - Carrossel "Episódios em destaque" estilo Netflix (scroll horizontal).
  - "Como funciona a experiência" (4 passos).
  - "Quem está por trás" (cards Caio, Pedro, Heitor, Luis).
  - Preview de planos (3 cards).
  - Depoimentos.
  - Captura de lead.
  - CTA final.
- `/curso` — **Página do curso**:
  - Lista os 6 módulos como linhas estilo Netflix.
  - Cada módulo expansível mostrando: vídeo (placeholder), texto, livros, exercícios, quiz IA, checklist.
- `/planos` — **Pricing**: 3 cards (Básico/Intermediário/Premium), usa `listPlans` do banco; botão "Assinar" dispara `createCheckoutSession`.
- `/acesso-gratuito` — **Lead capture**: formulário nome+email, salva em tabela `leads` (nova).
- `/checkout` — **Checkout estilo Hotmart**: split layout, form (nome/email/CPF) + resumo do produto + selos de garantia/segurança/social proof; submit chama `createCheckoutSession` (atualiza profile com CPF antes) e redireciona pro Stripe. Recebe `?plan=intermediario` via query.
- `/obrigado` — **Confirmação**: pós-Stripe success; mensagem + próximos passos + CTA "Ir para o curso".
- `/_authenticated/dashboard` — atualizar visual pro tema novo (já existe).

### 4. Chat IA "Diagnóstico PodErrar"
- Widget flutuante bottom-right (componente `<DiagnosisChat />` no root).
- Server function `diagnose.functions.ts` chamando Lovable AI Gateway (`google/gemini-2.5-flash`) com system prompt seguindo o spec: classificar área, diagnóstico, causa, impacto, melhoria, próxima ação, módulo recomendado, trilha, progresso, recomendações.
- Streaming de respostas, multi-turn.
- Quick actions com os prompts sugeridos.
- CTA dinâmico no fim de cada resposta linkando pro módulo recomendado em `/curso#m2`.

### 5. Backend mínimo adicional
- **Migration**: criar tabela `leads` (id, name, email, created_at) com RLS bloqueando leitura pública, insert público; coluna `cpf` em `profiles` já existe ✅.
- **Server functions novas**:
  - `leads.functions.ts` → `submitLead({ name, email })`.
  - `diagnose.functions.ts` → `diagnose({ messages })` usando `LOVABLE_API_KEY` (já está nos secrets ✅).
  - Pequeno ajuste em `checkout.functions.ts` para aceitar e gravar `cpf` no perfil antes de criar a sessão.

### 6. Logo
- (se eu gerar) `imagegen` premium: microfone estilizado + onda sonora + seta de crescimento, verde #22C55E sobre fundo escuro, flat/minimal.
- Aplicar na navbar, hero (sutil), footer (opacidade 0.8), favicon.

## Detalhes técnicos
- Stack: TanStack Start + Tailwind v4 + shadcn (já configurado).
- Animações: framer-motion (instalar `motion`).
- Carrossel Netflix: scroll-snap CSS nativo (sem libs extras).
- Todos os tokens via `src/styles.css` — zero cores hardcoded.
- Mobile-first, responsivo.

## O que NÃO vou mexer
- `src/integrations/supabase/*` (auto-gerados).
- `src/lib/stripe.server.ts`, `src/routes/api/public/stripe-webhook.ts` (já funcionam).
- `src/lib/plans.functions.ts`, `auth.functions.ts` (já funcionam).

---

**Responde 3 coisas pra eu começar:**
1. Checkout: A, B ou C?
2. Conteúdo dos módulos: estático (A) ou banco (B)?
3. Logo: eu gero ou você envia?
