
-- Extend posts
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
  ADD COLUMN IF NOT EXISTS seo_tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS og_image_url TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS schema_generated BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS schema_jsonld JSONB;

-- Practice area SEO
CREATE TABLE IF NOT EXISTS public.practice_area_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  schema_active BOOLEAN NOT NULL DEFAULT true,
  title_tag TEXT,
  meta_description TEXT,
  og_tags_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_area_seo TO authenticated;
GRANT ALL ON public.practice_area_seo TO service_role;
ALTER TABLE public.practice_area_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage practice_area_seo"
  ON public.practice_area_seo FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_practice_area_seo_updated_at
  BEFORE UPDATE ON public.practice_area_seo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Global schema
CREATE TABLE IF NOT EXISTS public.global_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'The Kohn Law Firm',
  business_type TEXT NOT NULL DEFAULT 'LawFirm',
  address_street TEXT,
  address_city TEXT,
  address_region TEXT,
  address_postal_code TEXT,
  address_country TEXT DEFAULT 'US',
  phone TEXT,
  email TEXT,
  hours JSONB NOT NULL DEFAULT '[]'::jsonb,
  service_area TEXT[] NOT NULL DEFAULT '{}',
  practice_areas TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  organization_description TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.global_schema TO authenticated;
GRANT ALL ON public.global_schema TO service_role;
ALTER TABLE public.global_schema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage global_schema"
  ON public.global_schema FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_global_schema_updated_at
  BEFORE UPDATE ON public.global_schema
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default global_schema row
INSERT INTO public.global_schema (
  business_name, business_type, address_street, address_city, address_region, address_postal_code,
  phone, email, hours, service_area, practice_areas, organization_description, website_url, social_links
)
SELECT
  'The Kohn Law Firm', 'LawFirm',
  '102 S Tejon St, Suite 1100', 'Colorado Springs', 'CO', '80903',
  '719-328-9555', 'contact@kohn.law',
  '[
    {"day":"Monday","opens":"08:30","closes":"17:30"},
    {"day":"Tuesday","opens":"08:30","closes":"17:30"},
    {"day":"Wednesday","opens":"08:30","closes":"17:30"},
    {"day":"Thursday","opens":"08:30","closes":"17:30"},
    {"day":"Friday","opens":"08:30","closes":"17:30"}
  ]'::jsonb,
  ARRAY['Colorado Springs','El Paso County','Teller County','Pueblo County','Fremont County','Douglas County'],
  ARRAY['Criminal Defense','Family Law','Protection Orders','DUI Defense','Domestic Violence Defense'],
  'The Kohn Law Firm provides focused criminal defense and family law representation across Colorado.',
  'https://www.shimonkohn.com',
  '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.global_schema);

-- Seed practice area pages
INSERT INTO public.practice_area_seo (page_name, url_path, title_tag, meta_description, og_tags_complete)
VALUES
  ('Criminal Defense', '/criminal-defense', 'Colorado Springs Criminal Defense Attorney | The Kohn Law Firm', 'Aggressive criminal defense from a former Deputy District Attorney. DUI, felonies, and misdemeanors across El Paso County.', true),
  ('Family Law', '/family-law', 'Colorado Springs Family Law Attorney | The Kohn Law Firm', 'Divorce, child custody, and family law representation focused on your family''s future.', true),
  ('Protection Orders', '/protection-orders', 'Protection Order Attorney Colorado Springs | The Kohn Law Firm', 'Guidance on Temporary (TPO) and Permanent (PPO) Protection Orders in Colorado.', true)
ON CONFLICT (url_path) DO NOTHING;
