
-- Allow anonymous + authenticated to read published posts only
CREATE POLICY "Public can view published posts"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

GRANT SELECT ON public.posts TO anon;

-- Allow anonymous + authenticated to read categories that have published posts
CREATE POLICY "Public can view categories with published posts"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.category_id = categories.id AND p.status = 'published'));

GRANT SELECT ON public.categories TO anon;

-- Safe atomic view-count increment
CREATE OR REPLACE FUNCTION public.increment_post_views(_post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.posts SET views = COALESCE(views, 0) + 1 WHERE id = _post_id AND status = 'published';
$$;

REVOKE ALL ON FUNCTION public.increment_post_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_views(uuid) TO anon, authenticated;
