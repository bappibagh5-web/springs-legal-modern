-- Add new post fields and scheduled status
ALTER TYPE public.post_status ADD VALUE IF NOT EXISTS 'scheduled';

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS posts_featured_idx ON public.posts (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS posts_tags_gin_idx ON public.posts USING GIN (tags);