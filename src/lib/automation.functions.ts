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

export type AutomationRun = {
  id: string;
  topic_id: string | null;
  post_id: string | null;
  topic_title: string | null;
  status: "success" | "failed";
  trigger_type: "manual" | "scheduled";
  error_message: string | null;
  created_at: string;
  post: { id: string; title: string; slug: string; status: string } | null;
};

export const listAutomationRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AutomationRun[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("automation_runs")
      .select("*, post:posts(id, title, slug, status)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AutomationRun[];
  });

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200) || `post-${Date.now()}`;
}

function calcReadTime(body: string): number {
  const words = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const runAutomationNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({}).parse(d ?? {}))
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Pick highest-priority (lowest P), earliest-scheduled pending topic
    const { data: topics, error: tErr } = await supabaseAdmin
      .from("topics")
      .select("*, category:categories(id, name)")
      .eq("status", "pending")
      .order("priority", { ascending: true })
      .order("scheduled_at", { ascending: true })
      .limit(1);
    if (tErr) throw new Error(tErr.message);
    const topic = (topics ?? [])[0] as any;
    if (!topic) throw new Error("No pending topics available");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    let generated: { title: string; excerpt: string; meta_description: string; body: string };
    try {
      const { generateText, Output } = await import("ai");
      const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
      const gateway = createLovableAiGatewayProvider(key);
      const prompt = `Write a professional, SEO-friendly blog post for Kohn Law Firm, a criminal defense and family law firm in Colorado Springs, Colorado.

Topic: ${topic.title}
Category: ${topic.category?.name ?? "General"}
${topic.notes ? `Additional notes: ${topic.notes}` : ""}

Guidelines:
- Authoritative, empathetic, plain-language tone.
- Use markdown with H2 (##) and H3 (###) subheadings, bullet lists where useful, and short paragraphs.
- Reference Colorado / Colorado Springs law where relevant.
- Do NOT include the title as an H1 inside the body.
- Meta description ~150 characters.
- Excerpt: 1-2 sentence teaser (~200 characters).
- Target ~1500 words.`;
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
      generated = output;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabaseAdmin.from("automation_runs").insert({
        topic_id: topic.id,
        topic_title: topic.title,
        status: "failed",
        trigger_type: "manual",
        error_message: msg,
      });
      throw new Error(`AI generation failed: ${msg}`);
    }

    // Create post as draft with unique slug
    let slug = slugify(generated.title);
    let attempt = 0;
    let postId: string | null = null;
    let insertErr: string | null = null;
    while (attempt < 4) {
      const trySlug = attempt === 0 ? slug : `${slug}-${Date.now().toString(36).slice(-4)}${attempt}`;
      const { data: row, error } = await supabaseAdmin.from("posts").insert({
        title: generated.title,
        slug: trySlug,
        category_id: topic.category_id,
        body: generated.body,
        excerpt: generated.excerpt,
        meta_description: generated.meta_description,
        status: "draft",
        source: "auto_generated",
        read_time_minutes: calcReadTime(generated.body),
      }).select("id").maybeSingle();
      if (!error) { postId = (row as any)?.id ?? null; slug = trySlug; break; }
      insertErr = error.message;
      if (!error.message.toLowerCase().includes("duplicate")) break;
      attempt++;
    }
    if (!postId) {
      const msg = insertErr ?? "Failed to create post";
      await supabaseAdmin.from("automation_runs").insert({
        topic_id: topic.id,
        topic_title: topic.title,
        status: "failed",
        trigger_type: "manual",
        error_message: msg,
      });
      throw new Error(msg);
    }

    // Update topic
    await supabaseAdmin.from("topics").update({
      status: "generated",
      generated_post_id: postId,
    }).eq("id", topic.id);

    // Log run
    await supabaseAdmin.from("automation_runs").insert({
      topic_id: topic.id,
      post_id: postId,
      topic_title: topic.title,
      status: "success",
      trigger_type: "manual",
    });

    return { ok: true, postId, title: generated.title };
  });
