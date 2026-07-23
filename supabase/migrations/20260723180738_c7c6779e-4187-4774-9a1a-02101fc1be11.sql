
-- 1) Move SECURITY DEFINER helpers to a non-API schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
ALTER FUNCTION public.is_admin_user() SET SCHEMA private;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin_user() TO authenticated, service_role;

-- Refresh search_path so the functions still resolve public.profiles
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role AND status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION private.is_admin_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'active'
      AND role IN ('super_admin','admin')
  )
$$;

-- 2) Prevent self role/status escalation via trigger
DROP POLICY IF EXISTS "Users can update own name" ON public.profiles;

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public, private AS $$
BEGIN
  -- Only enforce for self-updates by an authenticated end user.
  IF auth.uid() IS NOT NULL AND NEW.id = auth.uid() THEN
    IF NEW.role IS DISTINCT FROM OLD.role
       AND NOT private.has_role(auth.uid(), 'super_admin') THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status
       AND NOT private.has_role(auth.uid(), 'super_admin') THEN
      RAISE EXCEPTION 'Users cannot change their own status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_profile_privilege_escalation() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3) storage.objects policies for post-images (admin-only)
DROP POLICY IF EXISTS "Admins read post-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload post-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update post-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete post-images" ON storage.objects;

CREATE POLICY "Admins read post-images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'post-images' AND private.is_admin_user());

CREATE POLICY "Admins upload post-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-images' AND private.is_admin_user());

CREATE POLICY "Admins update post-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'post-images' AND private.is_admin_user())
  WITH CHECK (bucket_id = 'post-images' AND private.is_admin_user());

CREATE POLICY "Admins delete post-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-images' AND private.is_admin_user());

-- 4) Replace always-true analytics insert policy with a shape check
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Public can insert well-formed analytics events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IS NOT NULL
    AND length(event_type) BETWEEN 1 AND 100
    AND (page_path IS NULL OR length(page_path) <= 2048)
    AND (session_id IS NULL OR length(session_id) <= 100)
    AND (visitor_id IS NULL OR length(visitor_id) <= 100)
  );

-- 5) Defense-in-depth: explicit denial of anon access on automation_runs
DROP POLICY IF EXISTS "Deny anonymous access to automation_runs" ON public.automation_runs;
CREATE POLICY "Deny anonymous access to automation_runs"
  ON public.automation_runs AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
