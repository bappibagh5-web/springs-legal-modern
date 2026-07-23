
-- Helper: check current user is admin/super_admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'active'
      AND role IN ('super_admin','admin')
  )
$$;

-- site_settings: key/value
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  category text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- code_snippets
CREATE TYPE public.snippet_location AS ENUM ('head','body_start','body_end');

CREATE TABLE public.code_snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location public.snippet_location NOT NULL DEFAULT 'head',
  load_on text NOT NULL DEFAULT 'all',
  code text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 10,
  is_system_managed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.code_snippets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_snippets TO authenticated;
GRANT ALL ON public.code_snippets TO service_role;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors read only active snippets (needed to inject on public pages via publishable key)
CREATE POLICY "public read active snippets" ON public.code_snippets
  FOR SELECT TO anon USING (active = true);

CREATE POLICY "admins read snippets" ON public.code_snippets
  FOR SELECT TO authenticated USING (public.is_admin_user());

CREATE POLICY "admins insert snippets" ON public.code_snippets
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user() AND is_system_managed = false);

CREATE POLICY "admins update user snippets" ON public.code_snippets
  FOR UPDATE TO authenticated
  USING (public.is_admin_user() AND is_system_managed = false)
  WITH CHECK (public.is_admin_user() AND is_system_managed = false);

CREATE POLICY "admins delete user snippets" ON public.code_snippets
  FOR DELETE TO authenticated
  USING (public.is_admin_user() AND is_system_managed = false);

CREATE TRIGGER trg_code_snippets_updated
  BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
