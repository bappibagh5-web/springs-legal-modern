import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles").select("role, status").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status !== "active") throw new Error("Forbidden");
  if (data.role !== "super_admin" && data.role !== "admin") throw new Error("Forbidden");
}

const SITE_URL = "https://www.shimonkohn.com";
const BUCKET = "post-images";
const SIGNED_TTL = 60 * 60 * 24 * 7;

export type SeoPostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured_image_url: string | null;
  featured_image_signed_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  seo_tags: string[];
  tags: string[];
  og_image_url: string | null;
  canonical_url: string | null;
  schema_generated: boolean;
  seo_score: number;
  published_at: string | null;
};

export type SeoOverview = {
  totalPublished: number;
  withSchema: number;
  missingSchema: number;
  metaComplete: number;
  activeSchemaTypes: string[];
};

async function signIfPath(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

export function computeSeoScore(input: {
  seo_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  featured_image_url?: string | null;
  tags?: string[] | null;
  seo_tags?: string[] | null;
  schema_generated?: boolean | null;
  title?: string | null;
}): { score: number; checks: { key: string; label: string; pts: number; pass: boolean }[] } {
  const title = input.seo_title || input.title || "";
  const desc = input.meta_description || "";
  const kw = (input.focus_keyword || "").trim().toLowerCase();
  const allTags = [...(input.tags ?? []), ...(input.seo_tags ?? [])];
  const checks = [
    { key: "title-len", label: "Title under 60 chars", pts: 15, pass: title.length > 0 && title.length <= 60 },
    { key: "desc-len", label: "Meta description 120–160 chars", pts: 20, pass: desc.length >= 120 && desc.length <= 160 },
    { key: "kw", label: "Has focus keyword", pts: 15, pass: kw.length > 0 },
    { key: "img", label: "Has cover image", pts: 15, pass: !!input.featured_image_url },
    { key: "tags", label: "Has 3+ tags", pts: 10, pass: allTags.length >= 3 },
    { key: "schema", label: "Schema markup exists", pts: 15, pass: !!input.schema_generated },
    { key: "kw-title", label: "Focus keyword in title", pts: 10, pass: kw.length > 0 && title.toLowerCase().includes(kw) },
  ];
  const score = checks.reduce((s, c) => s + (c.pass ? c.pts : 0), 0);
  return { score, checks };
}

function buildBlogPostingSchema(p: any, business: any): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${p.slug}`;
  const image = p.og_image_url || (p.featured_image_url && /^https?:/i.test(p.featured_image_url) ? p.featured_image_url : null);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.seo_title || p.title,
    description: p.meta_description || p.excerpt || "",
    image: image ? [image] : undefined,
    datePublished: p.published_at,
    dateModified: p.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@type": "Organization", name: business?.business_name || "The Kohn Law Firm" },
    publisher: {
      "@type": business?.business_type || "LawFirm",
      name: business?.business_name || "The Kohn Law Firm",
      logo: business?.logo_url ? { "@type": "ImageObject", url: business.logo_url } : undefined,
    },
    keywords: [p.focus_keyword, ...(p.seo_tags ?? []), ...(p.tags ?? [])].filter(Boolean).join(", "),
  };
}

export const getSeoOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SeoOverview> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("id, status, schema_generated, meta_description, og_image_url")
      .eq("status", "published");
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const totalPublished = rows.length;
    const withSchema = rows.filter((r: any) => r.schema_generated).length;
    const metaComplete = rows.filter((r: any) => (r.meta_description?.length ?? 0) >= 120).length;
    const activeSchemaTypes = ["LawFirm", "Organization", "WebSite", "BlogPosting", "LegalService", "BreadcrumbList"];
    return { totalPublished, withSchema, missingSchema: totalPublished - withSchema, metaComplete, activeSchemaTypes };
  });

export const listPostsSeo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SeoPostRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("id, title, slug, status, featured_image_url, seo_title, meta_description, focus_keyword, seo_tags, tags, og_image_url, canonical_url, schema_generated, seo_score, published_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const signed = await Promise.all(rows.map((r: any) => signIfPath(r.featured_image_url)));
    return rows.map((r: any, i: number) => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : [],
      seo_tags: Array.isArray(r.seo_tags) ? r.seo_tags : [],
      featured_image_signed_url: signed[i],
    })) as SeoPostRow[];
  });

const updatePostSeoSchema = z.object({
  id: z.string().uuid(),
  seo_title: z.string().max(200).nullable().optional(),
  meta_description: z.string().max(500).nullable().optional(),
  focus_keyword: z.string().max(120).nullable().optional(),
  seo_tags: z.array(z.string()).max(30).default([]),
  og_image_url: z.string().max(1000).nullable().optional(),
  canonical_url: z.string().max(1000).nullable().optional(),
});

export const updatePostSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updatePostSeoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.from("posts").select("*").eq("id", data.id).maybeSingle();
    if (!existing) throw new Error("Not found");
    const merged = { ...existing, ...data };
    const { score } = computeSeoScore(merged);
    const { error } = await supabaseAdmin.from("posts").update({
      seo_title: data.seo_title ?? null,
      meta_description: data.meta_description ?? null,
      focus_keyword: data.focus_keyword ?? null,
      seo_tags: data.seo_tags ?? [],
      og_image_url: data.og_image_url ?? null,
      canonical_url: data.canonical_url ?? null,
      seo_score: score,
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, score };
  });

export const generatePostSchema = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post, error } = await supabaseAdmin.from("posts").select("*").eq("id", data.id).maybeSingle();
    if (error || !post) throw new Error(error?.message || "Not found");
    const { data: biz } = await supabaseAdmin.from("global_schema").select("*").limit(1).maybeSingle();
    const schema = buildBlogPostingSchema(post, biz);
    const { score } = computeSeoScore({ ...post, schema_generated: true });
    const { error: upErr } = await supabaseAdmin.from("posts").update({
      schema_jsonld: schema, schema_generated: true, seo_score: score,
    }).eq("id", data.id);
    if (upErr) throw new Error(upErr.message);
    return { ok: true, schema };
  });

export const regenerateAllSchema = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ onlyMissing: z.boolean().default(false) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin.from("posts").select("*");
    if (data.onlyMissing) q = q.eq("schema_generated", false);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const { data: biz } = await supabaseAdmin.from("global_schema").select("*").limit(1).maybeSingle();
    let updated = 0;
    for (const post of rows ?? []) {
      const schema = buildBlogPostingSchema(post, biz);
      const { score } = computeSeoScore({ ...post, schema_generated: true });
      const { error: e } = await supabaseAdmin.from("posts").update({
        schema_jsonld: schema, schema_generated: true, seo_score: score,
      }).eq("id", (post as any).id);
      if (!e) updated++;
    }
    return { ok: true, updated };
  });

// ============ Practice areas ============

export type PracticeAreaRow = {
  id: string;
  page_name: string;
  url_path: string;
  schema_active: boolean;
  title_tag: string | null;
  meta_description: string | null;
  og_tags_complete: boolean;
  created_at: string;
  updated_at: string;
};

export const listPracticeAreas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PracticeAreaRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("practice_area_seo").select("*").order("page_name");
    if (error) throw new Error(error.message);
    return (data ?? []) as PracticeAreaRow[];
  });

const practiceAreaSchema = z.object({
  id: z.string().uuid().optional(),
  page_name: z.string().min(1).max(200),
  url_path: z.string().min(1).max(300),
  schema_active: z.boolean().default(true),
  title_tag: z.string().max(500).nullable().optional(),
  meta_description: z.string().max(1000).nullable().optional(),
  og_tags_complete: z.boolean().default(false),
});

export const upsertPracticeArea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => practiceAreaSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("practice_area_seo").update({
        page_name: data.page_name, url_path: data.url_path, schema_active: data.schema_active,
        title_tag: data.title_tag ?? null, meta_description: data.meta_description ?? null,
        og_tags_complete: data.og_tags_complete,
      }).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("practice_area_seo").insert({
        page_name: data.page_name, url_path: data.url_path, schema_active: data.schema_active,
        title_tag: data.title_tag ?? null, meta_description: data.meta_description ?? null,
        og_tags_complete: data.og_tags_complete,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============ Global schema ============

export type GlobalSchemaRow = {
  id: string;
  business_name: string;
  business_type: string;
  address_street: string | null;
  address_city: string | null;
  address_region: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  phone: string | null;
  email: string | null;
  hours: { day: string; opens: string; closes: string }[];
  service_area: string[];
  practice_areas: string[];
  logo_url: string | null;
  social_links: string[];
  organization_description: string | null;
  website_url: string | null;
  updated_at: string;
};

export const getGlobalSchema = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GlobalSchemaRow | null> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("global_schema").select("*").limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      ...(data as any),
      hours: Array.isArray((data as any).hours) ? (data as any).hours : [],
      social_links: Array.isArray((data as any).social_links) ? (data as any).social_links : [],
    } as GlobalSchemaRow;
  });

const globalSchemaInput = z.object({
  business_name: z.string().min(1).max(300),
  business_type: z.string().min(1).max(100),
  address_street: z.string().max(300).nullable().optional(),
  address_city: z.string().max(120).nullable().optional(),
  address_region: z.string().max(120).nullable().optional(),
  address_postal_code: z.string().max(40).nullable().optional(),
  address_country: z.string().max(10).nullable().optional(),
  phone: z.string().max(60).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
  hours: z.array(z.object({ day: z.string(), opens: z.string(), closes: z.string() })).default([]),
  service_area: z.array(z.string()).default([]),
  practice_areas: z.array(z.string()).default([]),
  logo_url: z.string().max(1000).nullable().optional(),
  social_links: z.array(z.string()).default([]),
  organization_description: z.string().max(2000).nullable().optional(),
  website_url: z.string().max(500).nullable().optional(),
});

export const updateGlobalSchema = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => globalSchemaInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.from("global_schema").select("id").limit(1).maybeSingle();
    if (existing) {
      const { error } = await supabaseAdmin.from("global_schema").update(data as any).eq("id", (existing as any).id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("global_schema").insert(data as any);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const runSchemaAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: posts } = await supabaseAdmin.from("posts").select("id, title, slug, status, schema_generated, meta_description").eq("status", "published");
    const { data: pages } = await supabaseAdmin.from("practice_area_seo").select("*");
    const issues: { kind: string; label: string; problem: string }[] = [];
    for (const p of posts ?? []) {
      if (!(p as any).schema_generated) issues.push({ kind: "post", label: (p as any).title, problem: "Missing BlogPosting schema" });
      if (!((p as any).meta_description) || (p as any).meta_description.length < 120) {
        issues.push({ kind: "post", label: (p as any).title, problem: "Meta description too short" });
      }
    }
    for (const pg of pages ?? []) {
      if (!(pg as any).schema_active) issues.push({ kind: "page", label: (pg as any).page_name, problem: "Schema disabled" });
      if (!(pg as any).title_tag) issues.push({ kind: "page", label: (pg as any).page_name, problem: "Missing title tag" });
    }
    return { ok: true, issues, checkedAt: new Date().toISOString() };
  });
