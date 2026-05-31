
-- Restrict SECURITY DEFINER functions: revoke from PUBLIC, grant only as needed.

-- handle_new_user is a trigger — no one should call it directly.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is referenced by RLS policies (which run as the policy's role), so
-- authenticated users need EXECUTE. Anon does not.
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- user_active_plan_rank is used by server functions (service_role) and may be
-- read by authenticated users via server fn. Restrict to those.
REVOKE ALL ON FUNCTION public.user_active_plan_rank(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_active_plan_rank(UUID) TO authenticated, service_role;

-- update_updated_at_column is a trigger function — no direct execute.
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- =====================================================================
-- Avatars bucket: drop the broad public SELECT policy that allows listing.
-- Public read still works for direct URLs because the bucket itself is public;
-- removing this policy just prevents `list()` from enumerating all objects.
-- =====================================================================

DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;

-- Replace with a narrower policy: authenticated users can read avatars (used
-- by the app); anonymous direct URL access still works via bucket-public flag.
CREATE POLICY "Authenticated users can read avatars"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');
