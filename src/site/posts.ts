import { PRACTICE_AREAS, type Meta, type Source } from "./site";

/**
 * Blog posts, stored in code. The previous seven Supabase posts were "#seed" placeholders
 * and are intentionally not carried over.
 */
export type Post = {
  slug: string;
  title: string;
  meta: Meta;
  excerpt: string;
  /** Practice-area slug from PRACTICE_AREAS in ./site */
  category: string;
  datePublished: string;
  dateModified: string;
  /** Markdown. Use ## and ### headings only. */
  body: string;
  sources?: Source[];
};

export const POSTS: Post[] = [];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const sortedPosts = () =>
  [...POSTS].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

/* ───────────── Card and page shapes used by the blog templates ───────────── */

/**
 * Adapts the posts above to the card/post shape the original
 * blog templates use, so the original markup can stay unchanged.
 * Category colors are the ones the old categories table used.
 */
export type PublicCategory = { id: string; name: string; slug: string; color: string };

export type PublicPostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  read_time_minutes: number;
  published_at: string | null;
  category: PublicCategory | null;
};

export type PublicPostFull = PublicPostCard & {
  body: string;
  tags: string[];
  meta_description: string | null;
};

/** Badge colors per practice area (design tokens; white badge text passes AA on all three). */
const CATEGORY_COLORS: Record<string, string> = {
  "criminal-defense": "var(--ink)",
  "family-law": "var(--brand)",
  "protection-orders": "var(--crimson)",
};

const readTime = (body: string) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

function toCategory(slug: string): PublicCategory | null {
  const c = PRACTICE_AREAS.find((a) => a.slug === slug);
  return c
    ? { id: c.slug, name: c.title, slug: c.slug, color: CATEGORY_COLORS[c.slug] ?? "var(--brand)" }
    : null;
}

function toCard(p: Post): PublicPostCard {
  return {
    id: p.slug,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    featured_image_url: null,
    read_time_minutes: readTime(p.body),
    published_at: p.datePublished,
    category: toCategory(p.category),
  };
}

export function listPublicPosts(): { posts: PublicPostCard[]; categories: PublicCategory[] } {
  const posts = [...POSTS]
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .map(toCard);
  const seen = new Set<string>();
  const categories: PublicCategory[] = [];
  for (const p of posts) {
    if (p.category && !seen.has(p.category.id)) {
      seen.add(p.category.id);
      categories.push(p.category);
    }
  }
  return { posts, categories: categories.sort((a, b) => a.name.localeCompare(b.name)) };
}

export function getPublicPost(
  slug: string,
): { post: PublicPostFull; related: PublicPostCard[] } | null {
  const p = findPost(slug);
  if (!p) return null;
  const card = toCard(p);
  const others = listPublicPosts().posts.filter((x) => x.slug !== slug);
  const sameCat = others.filter((x) => x.category?.slug === p.category);
  return {
    post: { ...card, body: p.body, tags: [], meta_description: p.meta.description },
    related: (sameCat.length ? sameCat : others).slice(0, 3),
  };
}
