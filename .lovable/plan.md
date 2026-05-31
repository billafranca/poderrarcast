
# Backend do podErrar

Stack: **Lovable Cloud** (Postgres + Auth + Storage + RLS) + **TanStack Start server functions** + **Stripe payments** (built-in, sem conta própria).

---

## 1. Lovable Cloud + Auth

Habilitar Cloud e configurar autenticação:

- **Email + senha** com verificação de email obrigatória (link enviado no signup, usuário não loga até confirmar).
- **Google** via broker do Lovable.
- **Apple** via broker do Lovable.
- **Recuperação de senha** com email + página `/reset-password` dedicada.
- **HIBP** ligado (bloqueia senhas vazadas).

Páginas/rotas:
- `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email` (tela "confirme seu email").
- Layout `_authenticated` que protege todas as áreas logadas.

## 2. Esquema do banco

```text
profiles                   user_roles                  plans
- id (= auth.users.id)     - user_id                   - id (basico|intermediario|premium)
- full_name                - role (admin|user)         - name
- cpf                                                  - price_cents (97 | 197 | 397)
- avatar_url               enrollments                 - access_months (6 | 12 | null=vitalício)
                           - id                        - stripe_price_id
episodes                   - user_id                   - features (jsonb)
- id                       - plan_id                   - active
- title, slug              - status (active|expired|canceled)
- description              - purchased_at              payment_events (idempotência webhook)
- audio_url, video_url     - expires_at (null=vitalício)  - stripe_event_id (unique)
- min_plan_id (gating)     - stripe_session_id         - type, payload
- order, published_at      - amount_cents              - processed_at
```

**RLS** em tudo. Roles em tabela separada (`user_roles`) com função `has_role()` SECURITY DEFINER — nunca no profile.

Regras-chave:
- Usuário lê só o próprio profile/enrollments.
- `episodes` visíveis publicamente (metadata), mas `audio_url`/`video_url` só via server function que valida enrollment ativo.
- `admin` pode CRUD plans e episodes.

## 3. Pagamento (Stripe one-time)

Fluxo:

```text
[Usuário escolhe plano]
        │
        ▼
createCheckoutSession  ──►  Stripe Checkout (cartão / Pix / Boleto)
   (server fn)                          │
                                        ▼
                          /api/public/webhooks/stripe
                                        │
                                        ▼
                          - valida assinatura HMAC
                          - dedup via payment_events
                          - cria enrollment com expires_at = now + access_months
                                        │
                                        ▼
                              usuário redirecionado para /sucesso
```

- Server function `createCheckoutSession({ planId })` protegida por `requireSupabaseAuth` — cria sessão Stripe com `mode: 'payment'` (não subscription), `customer_email`, `metadata: { user_id, plan_id }`.
- Webhook em `src/routes/api/public/webhooks/stripe.ts`:
  - Verifica assinatura Stripe.
  - Idempotência por `stripe_event_id`.
  - Em `checkout.session.completed`: cria `enrollment` ativa. Vitalício = `expires_at NULL`.
  - Em `charge.refunded`: marca enrollment como `canceled`.
- Cron (pg_cron) diário marca enrollments com `expires_at < now()` como `expired`.

## 4. Acesso ao conteúdo

Server function `getEpisodeStream({ episodeId })`:
1. `requireSupabaseAuth` → pega userId.
2. Busca enrollment ativo do user.
3. Confere se o plano dele cobre o `min_plan_id` do episódio.
4. Retorna URL assinada (signed URL do Storage com TTL curto).

UI bloqueia botão de play se sem acesso e mostra CTA pro plano.

## 5. Detalhes técnicos

- **JWT**: o Supabase Auth já emite JWT em todo login (email/senha, Google, Apple). É o que você pediu — não precisa implementar nada extra. Middleware `requireSupabaseAuth` valida em toda server fn.
- **OAuth 2.0**: Google e Apple usam OAuth 2.0 nativamente via o broker do Lovable.
- **Validação**: todos os inputs com Zod (signup, checkout, admin CRUD).
- **CPF**: validação de formato no client + server, sem usar como identificador único (usuário pode ter sem CPF).
- **Webhooks**: rota pública `/api/public/webhooks/stripe` com verificação HMAC antes de qualquer leitura do body.
- **Segredos**: `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` adicionados via secrets (server-only).
- **Admin**: rota `/admin` (gated por role) pra cadastrar episódios, ver enrollments, ver pagamentos.

## 6. Ordem de execução

1. Habilitar Lovable Cloud.
2. Migrations: criar todas as tabelas + RLS + trigger de profile no signup.
3. Configurar Google + Apple no broker.
4. Páginas de auth (signup com verificação, login, forgot/reset).
5. Habilitar Stripe payments built-in + criar produtos/preços via `batch_create_product`.
6. Server fn de checkout + página `/sucesso` + página `/cancelado`.
7. Webhook Stripe + idempotência + cron de expiração.
8. Gating de episódios + signed URLs.
9. Painel admin.

---

**Confirme antes de eu começar:**

- (a) Os planos são realmente **compras únicas com expiração**, certo? (não cobrança recorrente)
- (b) Quer que eu mantenha a UI atual da landing/checkout que você já tem e só ligue o backend, ou também ajusto telas?
- (c) Onde os áudios/vídeos vão morar? **Lovable Storage** (recomendo pra MVP, com signed URL) ou serviço externo (Mux, Bunny, Vimeo)?
