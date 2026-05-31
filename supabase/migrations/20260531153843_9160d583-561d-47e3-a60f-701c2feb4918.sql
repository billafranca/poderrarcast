
-- =====================================================================
-- 1. Helper functions
-- =====================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================================
-- 2. Roles (separate table + has_role() to avoid RLS recursion)
-- =====================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- 3. Profiles
-- =====================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  cpf TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 4. Plans
-- =====================================================================

CREATE TABLE public.plans (
  id TEXT PRIMARY KEY, -- 'basico' | 'intermediario' | 'premium'
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  access_months INTEGER, -- NULL = vitalício
  sort_order INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.plans TO anon, authenticated;
GRANT ALL ON public.plans TO service_role;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are publicly readable when active"
  ON public.plans FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage plans"
  ON public.plans FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed
INSERT INTO public.plans (id, name, description, price_cents, access_months, sort_order, features) VALUES
  ('basico',         'Básico',        'Para quem quer começar a aprender com erros reais.', 9700,  6,    1, '["Acesso aos episódios", "Podcast + vídeo", "Acesso por 6 meses"]'::jsonb),
  ('intermediario',  'Intermediário', 'Tudo do básico + ferramentas práticas com IA.',      19700, 12,   2, '["Tudo do Básico", "Banco de prompts de IA", "Checklist de erros", "Acesso por 12 meses"]'::jsonb),
  ('premium',        'Premium',       'Experiência completa para evoluir o seu negócio.',   39700, NULL, 3, '["Tudo incluso", "Plano de ação personalizado", "Materiais exclusivos", "Acesso vitalício"]'::jsonb);

-- =====================================================================
-- 5. Enrollments (purchases)
-- =====================================================================

CREATE TYPE public.enrollment_status AS ENUM ('active', 'expired', 'canceled', 'pending');

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES public.plans(id) NOT NULL,
  status public.enrollment_status NOT NULL DEFAULT 'pending',
  purchased_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- NULL = lifetime
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_enrollments_user_status ON public.enrollments(user_id, status);
CREATE INDEX idx_enrollments_expires ON public.enrollments(expires_at) WHERE status = 'active';

GRANT SELECT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper: best active enrollment for a user (highest sort_order wins)
CREATE OR REPLACE FUNCTION public.user_active_plan_rank(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(p.sort_order), 0)
  FROM public.enrollments e
  JOIN public.plans p ON p.id = e.plan_id
  WHERE e.user_id = _user_id
    AND e.status = 'active'
    AND (e.expires_at IS NULL OR e.expires_at > now())
$$;

-- =====================================================================
-- 6. Payment events (webhook idempotency)
-- =====================================================================

CREATE TABLE public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_events_processed ON public.payment_events(processed_at);

GRANT ALL ON public.payment_events TO service_role;
-- No anon/authenticated grants: only the webhook (service role) touches this.

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment events"
  ON public.payment_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- 7. Episodes
-- =====================================================================

CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  audio_path TEXT, -- path within episodes-media bucket
  video_path TEXT, -- path within episodes-media bucket
  duration_seconds INTEGER,
  min_plan_id TEXT REFERENCES public.plans(id), -- NULL = free preview
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_episodes_published ON public.episodes(published_at DESC) WHERE published_at IS NOT NULL;

GRANT SELECT ON public.episodes TO anon, authenticated;
GRANT ALL ON public.episodes TO service_role;

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Public can read metadata (title, cover, description) of published episodes.
-- The audio_path / video_path columns are only useful to the server function
-- that creates signed URLs (service role), so exposure here is intentional metadata.
CREATE POLICY "Published episodes are publicly readable"
  ON public.episodes FOR SELECT TO anon, authenticated
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Admins can manage episodes"
  ON public.episodes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 8. Storage bucket for episode media (private)
-- =====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('episodes-media', 'episodes-media', false)
ON CONFLICT (id) DO NOTHING;

-- Only admins can upload/manage media; users read via signed URLs from server fn.
CREATE POLICY "Admins can upload episode media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'episodes-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update episode media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'episodes-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete episode media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'episodes-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read episode media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'episodes-media' AND public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- 9. Public avatars bucket
-- =====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
