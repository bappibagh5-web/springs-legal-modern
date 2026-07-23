import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Search, Trash2, Users as UsersIcon, UserCheck, UserCog, UserX } from "lucide-react";
import { AdminShell, type AdminProfile } from "@/components/admin/AdminShell";
import { UserFormDialog, type UserRow, type FormValues } from "@/components/admin/UserFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listUsers, createUser, updateUser, deleteUser } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: UsersPage,
});

function StatCard({ icon: Icon, label, value, tint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tint: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${tint}`}><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: "super_admin" | "admin" }) {
  return role === "super_admin" ? (
    <span className="inline-flex items-center rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] px-2 py-0.5 text-xs font-medium">Super Admin</span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-[color:var(--brand)]/20 text-[color:var(--brand)] px-2 py-0.5 text-xs font-medium">Admin</span>
  );
}

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return status === "active" ? (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs font-medium">Active</span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-white/10 text-white/60 px-2 py-0.5 text-xs font-medium">Inactive</span>
  );
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function UsersPage() {
  const [me, setMe] = useState<AdminProfile | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "super_admin" | "admin">("all");
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; user: UserRow | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);

  const list = useServerFn(listUsers);
  const create = useServerFn(createUser);
  const update = useServerFn(updateUser);
  const del = useServerFn(deleteUser);

  async function refresh() {
    setLoading(true);
    try {
      const data = (await list()) as UserRow[];
      setUsers(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    editors: users.filter(u => u.role === "admin").length,
    inactive: users.filter(u => u.status === "inactive").length,
  }), [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter(u => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search, roleFilter]);

  const canModify = (row: UserRow) => {
    if (!me) return false;
    if (me.role === "super_admin") return true;
    return row.role !== "super_admin";
  };
  const canDelete = (row: UserRow) => {
    if (!me) return false;
    if (row.id === me.id) return false;
    if (me.role === "super_admin") return true;
    return row.role !== "super_admin";
  };

  async function handleSubmit(v: FormValues) {
    if (dialog?.mode === "create") {
      await create({ data: { full_name: v.full_name, email: v.email, password: v.password, role: v.role } });
      toast.success("User created");
    } else if (dialog?.mode === "edit" && v.id) {
      await update({ data: {
        id: v.id, full_name: v.full_name, email: v.email, role: v.role, status: v.status,
        password: v.password ? v.password : undefined,
      }});
      toast.success("User updated");
    }
    await refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await del({ data: { id: deleteTarget.id } });
      toast.success("User deleted");
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <AdminShell title="Users" onProfile={setMe}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UsersIcon} label="Total Users" value={stats.total} tint="bg-[color:var(--brand)]/20 text-[color:var(--brand)]" />
        <StatCard icon={UserCheck} label="Active Users" value={stats.active} tint="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={UserCog} label="Editors" value={stats.editors} tint="bg-[color:var(--gold)]/20 text-[color:var(--gold)]" />
        <StatCard icon={UserX} label="Inactive Users" value={stats.inactive} tint="bg-white/10 text-white/60" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111a2e]">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3 flex-col sm:flex-row">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="pl-9 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30" />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
              <SelectTrigger className="w-full sm:w-40 bg-[#0b1220] border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {me?.role === "super_admin" && (
            <Button onClick={() => setDialog({ mode: "create", user: null })}
              className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
              <Plus className="h-4 w-4 mr-2" /> Create User
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 font-medium">Name & Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Last Login</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-white/50 py-10">No users found.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[color:var(--brand)]/30 text-white flex items-center justify-center text-sm font-semibold">
                        {u.full_name.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.full_name || "—"}</div>
                        <div className="text-white/50 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-white/70">{formatDate((u as UserRow & { last_login?: string | null }).last_login ?? null)}</td>
                  <td className="px-4 py-3 text-white/70">{formatDate((u as UserRow & { created_at?: string | null }).created_at ?? null)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {canModify(u) && (
                        <button onClick={() => setDialog({ mode: "edit", user: u })}
                          title="Edit"
                          className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete(u) && (
                        <button onClick={() => setDeleteTarget(u)}
                          title="Delete"
                          className="p-2 rounded hover:bg-[color:var(--crimson)]/20 text-white/70 hover:text-[color:var(--crimson)]">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && me && (
        <UserFormDialog
          open
          onOpenChange={(o) => !o && setDialog(null)}
          mode={dialog.mode}
          initial={dialog.user}
          callerRole={me.role}
          onSubmit={handleSubmit}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently remove {deleteTarget?.full_name} ({deleteTarget?.email}) and their sign-in access. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}
              className="bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
