import { PAGE_UPDATED, PRACTICE_AREAS, type Meta, type Source } from "./site";

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

/**
 * Articles with their own route file (src/routes/blog.<slug>.tsx). They are listed on the
 * blog index and in the sitemap; their dates come from PAGE_UPDATED. Title and excerpt repeat
 * the page H1 and meta description.
 */
export type Article = {
  slug: string;
  path: keyof typeof PAGE_UPDATED;
  title: string;
  excerpt: string;
  /** Practice-area slug from PRACTICE_AREAS in ./site */
  category: string;
  datePublished: string;
  readMinutes: number;
};

export const ARTICLES: Article[] = [
  {
    slug: "domestic-violence-charge-and-custody-colorado",
    path: "/blog/domestic-violence-charge-and-custody-colorado",
    title: "Will a Domestic Violence Charge Affect My Custody Case in Colorado?",
    excerpt:
      "How a Colorado domestic violence charge, its mandatory protection order and the family court's own findings affect parenting time and decision-making.",
    category: "criminal-defense",
    datePublished: "2026-10-16",
    readMinutes: 7,
  },
  {
    slug: "protection-order-against-me-see-my-kids-colorado",
    path: "/blog/protection-order-against-me-see-my-kids-colorado",
    title: "Can I See My Kids If There's a Protection Order Against Me in Colorado?",
    excerpt:
      "When a Colorado protection order lets you see your children, how to ask the court to change it (JDF 397, the two-year rule, background check), and what a violation costs you.",
    category: "family-law",
    datePublished: "2026-10-16",
    readMinutes: 7,
  },
];
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

function articleCard(a: Article): PublicPostCard {
  return {
    id: a.slug,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    featured_image_url: null,
    read_time_minutes: a.readMinutes,
    published_at: a.datePublished,
    category: toCategory(a.category),
  };
}

export function listPublicPosts(): { posts: PublicPostCard[]; categories: PublicCategory[] } {
  const posts = [...POSTS.map(toCard), ...ARTICLES.map(articleCard)].sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );
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
