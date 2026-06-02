
# Plano — Thumbs, vídeos e quiz funcional

Vou continuar o que ficou pendente sem tocar em `src/routes/index.tsx`. Tudo acontece em `/curso`, `/_authenticated/dashboard` e novo backend de quiz.

## 1. Thumbs de módulos e episódios

- Gero **6 imagens de módulo** (16:9, tema visual de cada módulo, paleta dark + verde #22C55E) via `imagegen` em `src/assets/modules/m1.jpg … m6.jpg`.
- Gero **thumbs por episódio** reaproveitando a arte do módulo com variação sutil (sobreposição numerada) — uma imagem por episódio listado em `MODULES`.
- Atualizo `src/data/modules.ts`:
  - novo campo `cover` no `Module`
  - `episodes` vira `{ title: string; thumb: string; videoUrl: string; durationLabel?: string }[]`
- Em `/curso`:
  - cada Accordion mostra a **cover do módulo** no header (substituindo o quadrado "M1")
  - lista de episódios vira **grid de cards estilo Netflix** com thumb 16:9 + título + duração + botão "Assistir"

## 2. Links de vídeo por tema

- Para cada episódio, adiciono `videoUrl` (YouTube embed) com vídeo público real alinhado ao tema do módulo (curadoria de palestras/TED/entrevistas em PT-BR sobre mentalidade do erro, marketing, finanças, estratégia, gestão e IA).
- Clicar em "Assistir" abre um `<Dialog>` com `<iframe>` do YouTube embed responsivo (aspect-video).
- Marco claramente como "Conteúdo curado externo" para diferenciar dos vídeos próprios futuros.

## 3. Quiz funcional registrado no banco

### Backend (migration)

Duas novas tabelas:

```text
quiz_questions
  id uuid pk
  module_id text         -- "m1".."m6"
  position int
  question text
  options jsonb          -- ["Sim, sempre", "Às vezes", "Nunca"]
  correct_index int
  explanation text

quiz_attempts
  id uuid pk
  user_id uuid           -- auth.uid()
  module_id text
  score int              -- acertos
  total int
  answers jsonb          -- [{question_id, chosen_index, correct}]
  created_at timestamptz
```

GRANTs + RLS:
- `quiz_questions`: SELECT público (anon+authenticated); admin manage.
- `quiz_attempts`: usuário só vê/insere os seus (`auth.uid() = user_id`); admin vê tudo.

Seed inicial das perguntas a partir do array `quiz` que já existe em `src/data/modules.ts` (3 perguntas/módulo, com `correct_index` e `explanation` definidos de forma coerente com o conteúdo).

### Server functions (`src/lib/quiz.functions.ts`)

- `listQuizQuestions({ moduleId })` — público, retorna perguntas sem `correct_index`.
- `submitQuizAttempt({ moduleId, answers })` — protegido com `requireSupabaseAuth`; corrige no servidor, grava em `quiz_attempts`, retorna `{ score, total, details }`.
- `listMyAttempts()` — protegido; retorna histórico do usuário agrupado por módulo (melhor nota + última tentativa).

### UI do quiz (`src/components/site/ModuleQuiz.tsx`)

- Substitui a seção estática "Quiz com IA" em cada módulo de `/curso`.
- Estados: carregando perguntas → responder (radio por pergunta) → submeter → tela de resultado com:
  - score (ex: "2/3 acertos"),
  - pergunta a pergunta com ✓/✗ e a explicação,
  - botão "Refazer".
- Se o usuário **não estiver logado**, mostra CTA "Entrar para responder" linkando para `/login?next=/curso#m2`.

### Dashboard — "Meus acertos"

Novo Card em `/_authenticated/dashboard` (acima/abaixo de "Minhas matrículas"):
- Tabela "Meu desempenho nos quizzes":
  - Módulo · Melhor nota · Última tentativa · Botão "Refazer" (link `/curso#mX`).
- Vazio: "Você ainda não respondeu nenhum quiz." + link para `/curso`.

## 4. O que NÃO mexe

- `src/routes/index.tsx` (landing — congelada).
- Backend Stripe / auth / planos / `__root.tsx` / Navbar / DiagnosisChat.
- Tema, fontes, tokens em `src/styles.css`.

## Arquivos afetados

- **novos**: `src/assets/modules/m{1-6}.jpg`, `src/assets/episodes/*.jpg`, `src/components/site/ModuleQuiz.tsx`, `src/components/site/EpisodeCard.tsx`, `src/lib/quiz.functions.ts`, migration `quiz_questions` + `quiz_attempts` + seed.
- **editados**: `src/data/modules.ts` (cover + episodes object + videoUrl), `src/routes/curso.tsx` (header com cover, grid de episódios com modal de vídeo, ModuleQuiz no lugar do quiz estático), `src/routes/_authenticated.dashboard.tsx` (card de desempenho).

## Confirmações rápidas

1. **Vídeos**: OK usar YouTube embed curado (gratuito, rápido) até você ter conteúdo próprio? Alternativa é deixar placeholder "em breve".
2. **Thumbs**: posso gerar via IA (estilo dark + verde, consistente)? Alternativa: você manda.
3. **Quiz**: 3 perguntas/módulo (como já está no `modules.ts`) com 3 opções cada e 1 correta — OK?
