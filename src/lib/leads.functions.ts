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
  id: string; name: string; email: string; phone: string | null;
  case_type: string | null; message: string | null; best_time_to_reach: string | null;
}): Promise<boolean> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return false;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: gs } = await supabaseAdmin
      .from("global_schema").select("email, business_name").limit(1).maybeSingle();
    const to = gs?.email;
    if (!to) return false;
    // Best-effort: use Lovable AI Gateway is not an email sender. We treat "no provider configured" as no-op.
    // Reserved hook for future email integration; return false silently.
    void lead; void to;
    return false;
  } catch {
    return false;
  }
}

export const submitConsultationLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
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
        source: "consultation_form",
        status: "new",
        email_sent: false,
      })
      .select("id, name, email, phone, case_type, message, best_time_to_reach")
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
      .from("leads").select("*").order("created_at", { ascending: false });
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
      supabaseAdmin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabaseAdmin.from("leads").select("id", { count: "exact", head: true }).eq("email_sent", true),
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
  .inputValidator((d: unknown) => z.object({
    id: z.string().uuid(),
    status: z.enum(["new", "read", "replied", "archived"]),
  }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
