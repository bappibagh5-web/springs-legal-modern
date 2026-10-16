import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status !== "active") throw new Error("Forbidden");
  if (data.role !== "super_admin" && data.role !== "admin") throw new Error("Forbidden");
}

export type LeadStatus = "new" | "read" | "replied" | "archived";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  case_type: string | null;
  message: string | null;
  best_time_to_reach: string | null;
  source: string;
  status: LeadStatus;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadStats = {
  total: number;
  newCount: number;
  thisWeek: number;
  emailSent: number;
};

const submitSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().nullable(),
  case_type: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  best_time_to_reach: z.string().trim().max(200).optional().nullable(),
  source: z.enum(["consultation_form", "contact_form"]).optional(),
});

async function tryNotifyAdmin(lead: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  case_type: string | null;
  message: string | null;
  best_time_to_reach: string | null;
  source?: string;
}): Promise<boolean> {
  try {
    const { sendEmail } = await import("@/lib/settings.functions");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Prefer admin notification email from settings; fall back to global_schema email.
    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "email")
      .maybeSingle();
    let toList: string[] = [];
    const adminField = (setting?.value as { general?: { adminNotificationEmail?: string } } | null)
      ?.general?.adminNotificationEmail;
    if (adminField)
      toList = adminField
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (toList.length === 0) {
      const { data: gs } = await supabaseAdmin
        .from("global_schema")
        .select("email")
        .limit(1)
        .maybeSingle();
      const fallbackEmail = (gs as { email?: string | null } | null)?.email;
      if (fallbackEmail) toList = [fallbackEmail];
    }
    if (toList.length === 0) return false;

    const html = `<div style="font-family:system-ui;padding:24px;max-width:600px">
      <h2 style="color:#004AAD;margin:0 0 12px">New ${lead.source === "contact_form" ? "Contact" : "Consultation"} Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 8px;color:#666">Name</td><td style="padding:6px 8px"><b>${escapeHtml(lead.name)}</b></td></tr>
        <tr><td style="padding:6px 8px;color:#666">Email</td><td style="padding:6px 8px">${escapeHtml(lead.email)}</td></tr>
        <tr><td style="padding:6px 8px;color:#666">Phone</td><td style="padding:6px 8px">${escapeHtml(lead.phone || "—")}</td></tr>
        <tr><td style="padding:6px 8px;color:#666">Case Type</td><td style="padding:6px 8px">${escapeHtml(lead.case_type || "—")}</td></tr>
        <tr><td style="padding:6px 8px;color:#666">Best Time</td><td style="padding:6px 8px">${escapeHtml(lead.best_time_to_reach || "—")}</td></tr>
      </table>
      <div style="margin-top:16px;padding:12px;background:#f5f7fb;border-radius:8px;white-space:pre-wrap">${escapeHtml(lead.message || "")}</div>
    </div>`;
    const res = await sendEmail({
      to: toList,
      subject: `New ${lead.source === "contact_form" ? "contact" : "consultation"} request — ${lead.name}`,
      html,
      text: `New request from ${lead.name} <${lead.email}>${lead.phone ? " · " + lead.phone : ""}\nCase: ${lead.case_type || "—"}\n\n${lead.message || ""}`,
    });
    return res.ok;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export const submitConsultationLead = createServerFn({ method: "POST" })
  .validator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        case_type: data.case_type || null,
        message: data.message || null,
        best_time_to_reach: data.best_time_to_reach || null,
        source: data.source ?? "consultation_form",
        status: "new",
        email_sent: false,
      })
      .select("id, name, email, phone, case_type, message, best_time_to_reach, source")
      .single();
    if (error) throw new Error(error.message);

    const sent = await tryNotifyAdmin(inserted);
    if (sent) {
      await supabaseAdmin.from("leads").update({ email_sent: true }).eq("id", inserted.id);
    }
    return { ok: true };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LeadRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as LeadRow[];
  });

export const getLeadStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LeadStats> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const [totalR, newR, weekR, emailR] = await Promise.all([
      supabaseAdmin.from("leads").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabaseAdmin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabaseAdmin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("email_sent", true),
    ]);
    return {
      total: totalR.count ?? 0,
      newCount: newR.count ?? 0,
      thisWeek: weekR.count ?? 0,
      emailSent: emailR.count ?? 0,
    };
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
