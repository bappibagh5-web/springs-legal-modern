import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertCallerRole(userId: string, allowed: Array<"super_admin" | "admin">) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.status !== "active") throw new Error("Forbidden");
  if (!allowed.includes(data.role as "super_admin" | "admin")) throw new Error("Forbidden");
  return data.role as "super_admin" | "admin";
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertCallerRole(context.userId, ["super_admin", "admin"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const touchLastLogin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", context.userId);
    return { ok: true };
  });

const createSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["super_admin", "admin"]),
});

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data, context }) => {
    const callerRole = await assertCallerRole(context.userId, ["super_admin", "admin"]);
    if (data.role === "super_admin" && callerRole !== "super_admin") {
      throw new Error("Only super admins can create super admin users");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (error) throw new Error(error.message);
    const newId = created.user!.id;
    const { error: profErr } = await supabaseAdmin.from("profiles").upsert({
      id: newId,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      status: "active",
    });
    if (profErr) {
      await supabaseAdmin.auth.admin.deleteUser(newId).catch(() => {});
      throw new Error(profErr.message);
    }
    return { id: newId };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["super_admin", "admin"]),
  status: z.enum(["active", "inactive"]),
  password: z.string().min(8).optional().nullable(),
});

export const updateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const callerRole = await assertCallerRole(context.userId, ["super_admin", "admin"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target, error: tErr } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("id", data.id)
      .maybeSingle();
    if (tErr) throw new Error(tErr.message);
    if (!target) throw new Error("User not found");

    if (callerRole === "admin") {
      if (target.role === "super_admin") throw new Error("Admins cannot modify super admins");
      if (data.role === "super_admin") throw new Error("Admins cannot promote to super admin");
    }

    // Prevent last super_admin from being demoted/deactivated
    if (target.role === "super_admin" && (data.role !== "super_admin" || data.status !== "active")) {
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "super_admin")
        .eq("status", "active");
      if ((count ?? 0) <= 1) {
        throw new Error("Cannot demote or deactivate the last active super admin");
      }
    }

    // Update auth.users if email or password changed
    const authUpdate: { email?: string; password?: string; user_metadata?: Record<string, unknown> } = {
      user_metadata: { full_name: data.full_name },
    };
    if (data.email) authUpdate.email = data.email;
    if (data.password) authUpdate.password = data.password;
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(data.id, authUpdate);
    if (authErr) throw new Error(authErr.message);

    const { error: pErr } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        status: data.status,
      })
      .eq("id", data.id);
    if (pErr) throw new Error(pErr.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const callerRole = await assertCallerRole(context.userId, ["super_admin", "admin"]);
    if (data.id === context.userId) throw new Error("You cannot delete your own account");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!target) throw new Error("User not found");
    if (callerRole === "admin" && target.role === "super_admin") {
      throw new Error("Admins cannot delete super admins");
    }
    if (target.role === "super_admin") {
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "super_admin")
        .eq("status", "active");
      if ((count ?? 0) <= 1) throw new Error("Cannot delete the last active super admin");
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    // profile cascade-deletes via FK
    return { ok: true };
  });
