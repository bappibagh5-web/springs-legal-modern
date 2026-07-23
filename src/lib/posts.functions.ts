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

export type PostStatus = "draft" | "published";
export type PostSource = "manual" | "auto_generated";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  featured_image_url: string | null;
  featured_image_signed_url: string | null;
  body: string;
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
  // Full URLs pass through untouched.
  if (/^https?:\/\//i.test(path)) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

function mapRow(r: any, signed: string | null): PostRow {
  return { ...r, featured_image_signed_url: signed } as PostRow;
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
  meta_description: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published"]),
  source: z.enum(["manual", "auto_generated"]).default("manual"),
  scheduled_at: z.string().nullable().optional(),
});

function dupErr(msg: string) {
  return msg.toLowerCase().includes("duplicate") ? "That slug is already used." : msg;
}

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => upsertSchema.omit({ id: true }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const publishing = data.status === "published";
    const { data: row, error } = await supabaseAdmin.from("posts").insert({
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      featured_image_url: data.featured_image_url ?? null,
      body: data.body ?? "",
      meta_description: data.meta_description ?? null,
      status: data.status,
      source: data.source,
      read_time_minutes: calcReadTime(data.body ?? ""),
      scheduled_at: data.scheduled_at ?? null,
      published_at: publishing ? new Date().toISOString() : null,
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
    let published_at = (existing as any)?.published_at ?? null;
    if (data.status === "published" && !published_at) published_at = new Date().toISOString();
    if (data.status === "draft") published_at = null;
    const { error } = await supabaseAdmin.from("posts").update({
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      featured_image_url: data.featured_image_url ?? null,
      body: data.body ?? "",
      meta_description: data.meta_description ?? null,
      status: data.status,
      source: data.source,
      read_time_minutes: calcReadTime(data.body ?? ""),
      scheduled_at: data.scheduled_at ?? null,
      published_at,
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
