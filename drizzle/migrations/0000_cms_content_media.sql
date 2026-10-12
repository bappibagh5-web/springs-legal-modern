CREATE TABLE public.site_content (
  page_key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  version_number integer NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid,
  published_by_name text
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert published content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (private.is_admin_user());
CREATE POLICY "Admins update published content" ON public.site_content FOR UPDATE TO authenticated USING (private.is_admin_user()) WITH CHECK (private.is_admin_user());
CREATE POLICY "Admins delete published content" ON public.site_content FOR DELETE TO authenticated USING (private.is_admin_user());

CREATE TABLE public.site_content_drafts (
  page_key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  updated_by_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content_drafts TO authenticated;
GRANT ALL ON public.site_content_drafts TO service_role;
ALTER TABLE public.site_content_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage drafts" ON public.site_content_drafts FOR ALL TO authenticated USING (private.is_admin_user()) WITH CHECK (private.is_admin_user());

CREATE TABLE public.site_content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  published_by uuid,
  published_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_content_versions_page_idx ON public.site_content_versions(page_key, version_number DESC);
GRANT SELECT, INSERT ON public.site_content_versions TO authenticated;
GRANT ALL ON public.site_content_versions TO service_role;
ALTER TABLE public.site_content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read versions" ON public.site_content_versions FOR SELECT TO authenticated USING (private.is_admin_user());
CREATE POLICY "Admins add versions" ON public.site_content_versions FOR INSERT TO authenticated WITH CHECK (private.is_admin_user());

CREATE OR REPLACE FUNCTION public.cms_publish(_page_key text, _content jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _v integer;
  _name text;
BEGIN
  IF NOT private.is_admin_user() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT full_name INTO _name FROM public.profiles WHERE id = auth.uid();
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO _v FROM public.site_content_versions WHERE page_key = _page_key;
  INSERT INTO public.site_content (page_key, content, version_number, published_at, published_by, published_by_name)
  VALUES (_page_key, _content, _v, now(), auth.uid(), _name)
  ON CONFLICT (page_key) DO UPDATE SET content = EXCLUDED.content, version_number = EXCLUDED.version_number,
    published_at = EXCLUDED.published_at, published_by = EXCLUDED.published_by, published_by_name = EXCLUDED.published_by_name;
  INSERT INTO public.site_content_versions (page_key, version_number, content, published_by, published_by_name)
  VALUES (_page_key, _v, _content, auth.uid(), _name);
  DELETE FROM public.site_content_drafts WHERE page_key = _page_key;
  RETURN _v;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.cms_publish(text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cms_publish(text, jsonb) TO authenticated;

CREATE TABLE public.media_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_folders TO authenticated;
GRANT ALL ON public.media_folders TO service_role;
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage folders" ON public.media_folders FOR ALL TO authenticated USING (private.is_admin_user()) WITH CHECK (private.is_admin_user());
INSERT INTO public.media_folders (name) VALUES ('Homepage'),('Services'),('Team'),('Blog'),('Logos'),('Testimonials'),('Gallery');

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  folder_id uuid REFERENCES public.media_folders(id) ON DELETE SET NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  file_size bigint NOT NULL DEFAULT 0,
  alt_text text NOT NULL DEFAULT '',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage media" ON public.media_assets FOR ALL TO authenticated USING (private.is_admin_user()) WITH CHECK (private.is_admin_user());