import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "post-images";
const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles").select("role, status").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status !== "active") throw new Error("Forbidden");
  if (data.role !== "super_admin" && data.role !== "admin") throw new Error("Forbidden");
}

export type PostStatus = "draft" | "published" | "scheduled";
export type PostSource = "manual" | "auto_generated";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  featured_image_url: string | null;
  featured_image_signed_url: string | null;
  body: string;
  excerpt: string | null;
  tags: string[];
  featured: boolean;
  meta_description: string | null;
  status: PostStatus;
  source: PostSource;
  views: number;
  read_time_minutes: number;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category: { id: string; name: string; slug: string; color: string } | null;
};

function calcReadTime(body: string): number {
  const text = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

async function signIfStoragePath(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

function mapRow(r: any, signed: string | null): PostRow {
  return {
    ...r,
    tags: Array.isArray(r.tags) ? r.tags : [],
    featured: !!r.featured,
    featured_image_signed_url: signed,
  } as PostRow;
}

export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PostRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*, category:categories(id, name, slug, color)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const signed = await Promise.all(rows.map((r: any) => signIfStoragePath(r.featured_image_url)));
    return rows.map((r: any, i: number) => mapRow(r, signed[i]));
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<PostRow | null> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*, category:categories(id, name, slug, color)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const signed = await signIfStoragePath((row as any).featured_image_url);
    return mapRow(row, signed);
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(320).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphenated"),
  category_id: z.string().uuid(),
  featured_image_url: z.string().nullable().optional(),
  body: z.string().default(""),
  excerpt: z.string().max(1000).nullable().optional(),
  tags: z.array(z.string().min(1).max(60)).max(30).default([]),
  featured: z.boolean().default(false),
  meta_description: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  source: z.enum(["manual", "auto_generated"]).default("manual"),
  scheduled_at: z.string().nullable().optional(),
});

function dupErr(msg: string) {
  return msg.toLowerCase().includes("duplicate") ? "That slug is already used." : msg;
}

function computePublishedAt(status: PostStatus, existing: string | null): string | null {
  if (status === "published") return existing ?? new Date().toISOString();
  return null;
}

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => upsertSchema.omit({ id: true }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("posts").insert({
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      featured_image_url: data.featured_image_url ?? null,
      body: data.body ?? "",
      excerpt: data.excerpt ?? null,
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      meta_description: data.meta_description ?? null,
      status: data.status,
      source: data.source,
      read_time_minutes: calcReadTime(data.body ?? ""),
      scheduled_at: data.scheduled_at ?? null,
      published_at: computePublishedAt(data.status, null),
    }).select("id").maybeSingle();
    if (error) throw new Error(dupErr(error.message));
    return { ok: true, id: row?.id };
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => upsertSchema.required({ id: true }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("posts").select("status, published_at").eq("id", data.id!).maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);
    const { error } = await supabaseAdmin.from("posts").update({
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      featured_image_url: data.featured_image_url ?? null,
      body: data.body ?? "",
      excerpt: data.excerpt ?? null,
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      meta_description: data.meta_description ?? null,
      status: data.status,
      source: data.source,
      read_time_minutes: calcReadTime(data.body ?? ""),
      scheduled_at: data.scheduled_at ?? null,
      published_at: computePublishedAt(data.status, (existing as any)?.published_at ?? null),
    }).eq("id", data.id!);
    if (error) throw new Error(dupErr(error.message));
    return { ok: true, id: data.id! };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const bulkDeletePosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ ids: z.array(z.string().uuid()).min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("posts").delete().in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true, count: data.ids.length };
  });

export const uploadPostImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    filename: z.string().min(1).max(200),
    contentType: z.string().min(1).max(100),
    dataBase64: z.string().min(1),
  }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clean = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${context.userId}/${Date.now()}-${clean}`;
    const bytes = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
    return { path, signedUrl: signed?.signedUrl ?? null };
  });

// ============ AI: generate content ============

export const generatePostContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    topic: z.string().min(3).max(300),
    categoryName: z.string().min(1).max(120),
    wordCount: z.number().int().min(300).max(4000),
  }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Write a professional, SEO-friendly blog post for Kohn Law Firm, a criminal defense and family law firm in Colorado Springs, Colorado.

Topic: ${data.topic}
Category: ${data.categoryName}
Target length: approximately ${data.wordCount} words.

Guidelines:
- Authoritative, empathetic, plain-language tone. No legal advice disclaimers wrapping — factual guidance only.
- Use markdown with H2 (##) and H3 (###) subheadings, bullet lists where useful, and short paragraphs.
- Reference Colorado / Colorado Springs law where relevant.
- Do NOT include the title as an H1 inside the body.
- Meta description ~150 characters, compelling and search-friendly.
- Excerpt: 1-2 sentence teaser (~200 characters).

Return the fields exactly as specified.`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({
          schema: z.object({
            title: z.string(),
            excerpt: z.string(),
            meta_description: z.string(),
            body: z.string(),
          }),
        }),
        prompt,
      });
      return output;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`AI generation failed: ${msg}`);
    }
  });

// ============ AI: generate cover image ============

export const generateCoverImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    prompt: z.string().min(3).max(500),
  }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const styledPrompt = `Editorial blog cover image for a Colorado law firm blog post. Subject: ${data.prompt}. Style: clean, professional, cinematic photography, muted navy and gold accents, no text overlays, no watermarks. 16:9 composition.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-image-2",
        prompt: styledPrompt,
        quality: "low",
        size: "1536x1024",
        n: 1,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Image generation failed [${res.status}]: ${t}`);
    }
    const json = await res.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) throw new Error("Image generation returned no data");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${context.userId}/ai-${Date.now()}.png`;
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
      contentType: "image/png",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
    return { path, signedUrl: signed?.signedUrl ?? null };
  });
