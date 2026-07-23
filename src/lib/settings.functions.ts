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

// ============ Types ============
export type ScheduleSettings = {
  frequency: "daily" | "weekly" | "custom";
  time: string; // "HH:MM" 24h
  timezone: string; // e.g. "MST"
  postsPerRun: number;
};

export type EmailProvider = "smtp" | "sendgrid" | "resend" | "mailgun";

export type EmailSettings = {
  provider: EmailProvider;
  smtp: { host: string; port: number; username: string; password: string; useTls: boolean };
  sendgrid: { apiKey: string };
  resend: { apiKey: string };
  mailgun: { apiKey: string; domain: string };
  general: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    adminNotificationEmail: string;
  };
  lastTestedAt: string | null;
  lastTestSuccess: boolean | null;
  lastTestError: string | null;
};

export type CodeSnippet = {
  id: string;
  name: string;
  description: string | null;
  location: "head" | "body_start" | "body_end";
  load_on: string;
  code: string;
  active: boolean;
  priority: number;
  is_system_managed: boolean;
  created_at: string;
  updated_at: string;
};

const DEFAULT_SCHEDULE: ScheduleSettings = {
  frequency: "daily",
  time: "09:00",
  timezone: "MST",
  postsPerRun: 1,
};

const DEFAULT_EMAIL: EmailSettings = {
  provider: "resend",
  smtp: { host: "", port: 587, username: "", password: "", useTls: true },
  sendgrid: { apiKey: "" },
  resend: { apiKey: "" },
  mailgun: { apiKey: "", domain: "" },
  general: {
    fromName: "The Kohn Law Firm",
    fromEmail: "",
    replyTo: "",
    adminNotificationEmail: "",
  },
  lastTestedAt: null,
  lastTestSuccess: null,
  lastTestError: null,
};

// ============ Generic setting helpers ============
async function readSetting<T>(key: string, fallback: T): Promise<T> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (!data) return fallback;
  return { ...fallback, ...(data.value as any) } as T;
}

async function writeSetting(key: string, category: string, value: unknown) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: existing } = await supabaseAdmin.from("site_settings").select("id").eq("key", key).maybeSingle();
  if (existing) {
    const { error } = await supabaseAdmin
      .from("site_settings").update({ value: value as any, category }).eq("id", (existing as any).id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("site_settings").insert({ key, category, value: value as any });
    if (error) throw new Error(error.message);
  }
}

// ============ Schedule ============
export const getScheduleSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ScheduleSettings> => {
    await assertAdmin(context.userId);
    return readSetting("schedule", DEFAULT_SCHEDULE);
  });

// Public read for automation module (no auth) — used to compute schedule
export const getPublicScheduleSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ScheduleSettings> => {
    return readSetting("schedule", DEFAULT_SCHEDULE);
  });

const scheduleSchema = z.object({
  frequency: z.enum(["daily", "weekly", "custom"]),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1).max(20),
  postsPerRun: z.number().int().min(1).max(50),
});

export const updateScheduleSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => scheduleSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await writeSetting("schedule", "schedule", data);
    return { ok: true };
  });

// ============ Email ============
export const getEmailSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailSettings> => {
    await assertAdmin(context.userId);
    return readSetting("email", DEFAULT_EMAIL);
  });

const emailSchema = z.object({
  provider: z.enum(["smtp", "sendgrid", "resend", "mailgun"]),
  smtp: z.object({
    host: z.string().max(200).default(""),
    port: z.number().int().min(1).max(65535).default(587),
    username: z.string().max(200).default(""),
    password: z.string().max(500).default(""),
    useTls: z.boolean().default(true),
  }),
  sendgrid: z.object({ apiKey: z.string().max(500).default("") }),
  resend: z.object({ apiKey: z.string().max(500).default("") }),
  mailgun: z.object({
    apiKey: z.string().max(500).default(""),
    domain: z.string().max(200).default(""),
  }),
  general: z.object({
    fromName: z.string().max(200).default("The Kohn Law Firm"),
    fromEmail: z.string().max(320).default(""),
    replyTo: z.string().max(320).default(""),
    adminNotificationEmail: z.string().max(1000).default(""),
  }),
});

export const updateEmailSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => emailSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const existing = await readSetting("email", DEFAULT_EMAIL);
    const merged = { ...existing, ...data } as EmailSettings;
    await writeSetting("email", "email", merged);
    return { ok: true };
  });

// ============ Send email helper (server-only) ============
export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const settings = await readSetting("email", DEFAULT_EMAIL);
  const from = settings.general.fromEmail
    ? `${settings.general.fromName} <${settings.general.fromEmail}>`
    : settings.general.fromName;
  const toList = Array.isArray(opts.to) ? opts.to : [opts.to];
  if (!toList.length || !toList[0]) return { ok: false, error: "No recipient" };

  try {
    if (settings.provider === "resend") {
      if (!settings.resend.apiKey) return { ok: false, error: "Resend API key not configured" };
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.resend.apiKey}`,
        },
        body: JSON.stringify({
          from, to: toList, subject: opts.subject, html: opts.html,
          text: opts.text, reply_to: settings.general.replyTo || undefined,
        }),
      });
      if (!r.ok) return { ok: false, error: `Resend ${r.status}: ${await r.text()}` };
      return { ok: true };
    }
    if (settings.provider === "sendgrid") {
      if (!settings.sendgrid.apiKey) return { ok: false, error: "SendGrid API key not configured" };
      const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.sendgrid.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: toList.map((email) => ({ email })) }],
          from: settings.general.fromEmail
            ? { email: settings.general.fromEmail, name: settings.general.fromName }
            : { email: "no-reply@example.com", name: settings.general.fromName },
          reply_to: settings.general.replyTo ? { email: settings.general.replyTo } : undefined,
          subject: opts.subject,
          content: [
            ...(opts.text ? [{ type: "text/plain", value: opts.text }] : []),
            { type: "text/html", value: opts.html },
          ],
        }),
      });
      if (!r.ok) return { ok: false, error: `SendGrid ${r.status}: ${await r.text()}` };
      return { ok: true };
    }
    if (settings.provider === "mailgun") {
      if (!settings.mailgun.apiKey || !settings.mailgun.domain) {
        return { ok: false, error: "Mailgun API key or domain not configured" };
      }
      const body = new URLSearchParams();
      body.set("from", from);
      for (const t of toList) body.append("to", t);
      body.set("subject", opts.subject);
      body.set("html", opts.html);
      if (opts.text) body.set("text", opts.text);
      if (settings.general.replyTo) body.set("h:Reply-To", settings.general.replyTo);
      const auth = "Basic " + Buffer.from(`api:${settings.mailgun.apiKey}`).toString("base64");
      const r = await fetch(`https://api.mailgun.net/v3/${settings.mailgun.domain}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: auth },
        body,
      });
      if (!r.ok) return { ok: false, error: `Mailgun ${r.status}: ${await r.text()}` };
      return { ok: true };
    }
    if (settings.provider === "smtp") {
      // SMTP not implemented directly in serverless runtime; require an HTTP-based provider.
      return {
        ok: false,
        error: "SMTP is not yet supported in this environment. Please use Resend, SendGrid, or Mailgun.",
      };
    }
    return { ok: false, error: "Unknown provider" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ to: z.string().email() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const result = await sendEmail({
      to: data.to,
      subject: "Kohn Law Firm — Test Email",
      html: `<div style="font-family:system-ui;padding:24px">
        <h2>✅ Test successful</h2>
        <p>Your email provider is configured correctly.</p>
        <p style="color:#666;font-size:12px">Sent from Kohn Law Firm admin panel.</p>
      </div>`,
      text: "Test successful — your email provider is configured correctly.",
    });
    const existing = await readSetting("email", DEFAULT_EMAIL);
    const updated: EmailSettings = {
      ...existing,
      lastTestedAt: new Date().toISOString(),
      lastTestSuccess: result.ok,
      lastTestError: result.ok ? null : result.error,
    };
    await writeSetting("email", "email", updated);
    return result;
  });

// ============ Code Snippets ============
export const listCodeSnippets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CodeSnippet[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("code_snippets").select("*").order("priority").order("created_at");
    if (error) throw new Error(error.message);
    return (data ?? []) as CodeSnippet[];
  });

const snippetSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  location: z.enum(["head", "body_start", "body_end"]),
  load_on: z.string().min(1).max(100).default("all"),
  code: z.string().max(50000),
  active: z.boolean().default(true),
  priority: z.number().int().min(1).max(100).default(10),
});

export const createCodeSnippet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => snippetSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("code_snippets").insert({
      ...data,
      description: data.description ?? null,
      is_system_managed: false,
    } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateCodeSnippet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => snippetSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...patch } = data;
    const { data: row } = await supabaseAdmin
      .from("code_snippets").select("is_system_managed").eq("id", id).maybeSingle();
    if (!row) throw new Error("Not found");
    if ((row as any).is_system_managed) throw new Error("System-managed snippet is read-only");
    const { error } = await supabaseAdmin.from("code_snippets").update({
      ...patch, description: patch.description ?? null,
    } as any).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCodeSnippet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("code_snippets").select("is_system_managed").eq("id", data.id).maybeSingle();
    if (row && (row as any).is_system_managed) throw new Error("System-managed snippet cannot be deleted");
    const { error } = await supabaseAdmin.from("code_snippets").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Sync SEO Schema JSON-LD as a system-managed snippet (called from SEO Schema save)
export async function syncSeoSchemaSnippet(jsonLd: unknown) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const code = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
  const payload = {
    name: "SEO Schema (auto-managed)",
    description: "Organization / LocalBusiness / WebSite JSON-LD generated by the SEO Schema module.",
    location: "head" as const,
    load_on: "all",
    code,
    active: true,
    priority: 1,
    is_system_managed: true,
  };
  const { data: existing } = await supabaseAdmin
    .from("code_snippets").select("id").eq("is_system_managed", true).eq("name", payload.name).maybeSingle();
  if (existing) {
    await supabaseAdmin.from("code_snippets").update(payload as any).eq("id", (existing as any).id);
  } else {
    await supabaseAdmin.from("code_snippets").insert(payload as any);
  }
}

// Public snippets — anon read, used to inject into public pages
export const getActivePublicSnippets = createServerFn({ method: "GET" })
  .handler(async (): Promise<Pick<CodeSnippet, "id" | "location" | "code" | "priority" | "load_on">[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("code_snippets")
      .select("id, location, code, priority, load_on")
      .eq("active", true)
      .order("priority");
    return (data ?? []) as any;
  });
