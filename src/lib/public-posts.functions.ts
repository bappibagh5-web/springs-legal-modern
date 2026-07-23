import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BUCKET = "post-images";
const SIGNED_TTL = 60 * 60 * 24 * 7;

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

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
  views: number;
  schema_jsonld: any | null;
};

async function signIfPath(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

function mapCard(r: any, signed: string | null): PublicPostCard {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    featured_image_url: signed,
    read_time_minutes: r.read_time_minutes ?? 1,
    published_at: r.published_at,
    category: r.category
      ? { id: r.category.id, name: r.category.name, slug: r.category.slug, color: r.category.color }
      : null,
  };
}

export const listPublicPosts = createServerFn({ method: "GET" }).handler(async (): Promise<{
  posts: PublicPostCard[];
  categories: PublicCategory[];
}> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id, slug, title, excerpt, featured_image_url, read_time_minutes, published_at, category_id, category:categories(id, name, slug, color)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const signed = await Promise.all(rows.map((r: any) => signIfPath(r.featured_image_url)));
  const posts = rows.map((r: any, i: number) => mapCard(r, signed[i]));
  const seen = new Set<string>();
  const categories: PublicCategory[] = [];
  for (const p of posts) {
    if (p.category && !seen.has(p.category.id)) {
      seen.add(p.category.id);
      categories.push(p.category);
    }
  }
  categories.sort((a, b) => a.name.localeCompare(b.name));
  return { posts, categories };
});

export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ post: PublicPostFull; related: PublicPostCard[] } | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*, category:categories(id, name, slug, color)")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const signed = await signIfPath((row as any).featured_image_url);
    const post: PublicPostFull = {
      ...mapCard(row, signed),
      body: (row as any).body ?? "",
      tags: Array.isArray((row as any).tags) ? (row as any).tags : [],
      meta_description: (row as any).meta_description ?? null,
      views: (row as any).views ?? 0,
      schema_jsonld: (row as any).schema_jsonld ?? null,
    };

    // Fire-and-forget view increment (server-side, bypassing RLS via admin).
    supabaseAdmin
      .from("posts")
      .update({ views: (post.views ?? 0) + 1 })
      .eq("id", post.id)
      .then(() => {});

    // Related: same category, otherwise recent
    let relatedQ = supabaseAdmin
      .from("posts")
      .select("id, slug, title, excerpt, featured_image_url, read_time_minutes, published_at, category:categories(id, name, slug, color)")
      .eq("status", "published")
      .neq("id", post.id)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3);
    if (post.category) relatedQ = relatedQ.eq("category_id", post.category.id);
    let { data: rel } = await relatedQ;
    if (!rel || rel.length === 0) {
      const fallback = await supabaseAdmin
        .from("posts")
        .select("id, slug, title, excerpt, featured_image_url, read_time_minutes, published_at, category:categories(id, name, slug, color)")
        .eq("status", "published")
        .neq("id", post.id)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(3);
      rel = fallback.data ?? [];
    }
    const relSigned = await Promise.all((rel ?? []).map((r: any) => signIfPath(r.featured_image_url)));
    const related = (rel ?? []).map((r: any, i: number) => mapCard(r, relSigned[i]));

    return { post, related };
  });
