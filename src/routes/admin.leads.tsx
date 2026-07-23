import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Inbox, MailCheck, Clock3, Sparkles, Search, Eye, Mail, Archive, Trash2, X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  listLeads, getLeadStats, updateLeadStatus, deleteLead,
  type LeadRow, type LeadStats, type LeadStatus,
} from "@/lib/leads.functions";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  component: LeadsPage,
});

const TABS: Array<{ key: "all" | LeadStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  read: "bg-white/10 text-white/70 border-white/15",
  replied: "bg-green-500/15 text-green-400 border-green-500/30",
  archived: "bg-white/5 text-white/40 border-white/10",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function StatCard({ icon: Icon, iconBg, label, value }: {
  icon: any; iconBg: string; label: string; value: number | string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}

function LeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<LeadRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadRow | null>(null);

  const fetchLeads = useServerFn(listLeads);
  const fetchStats = useServerFn(getLeadStats);
  const setStatus = useServerFn(updateLeadStatus);
  const del = useServerFn(deleteLead);

  async function refresh() {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([fetchLeads(), fetchStats()]);
      setLeads(l as LeadRow[]);
      setStats(s as LeadStats);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== "all" && l.status !== tab) return false;
      if (!ql) return true;
      return (
        l.name.toLowerCase().includes(ql) ||
        l.email.toLowerCase().includes(ql) ||
        (l.case_type ?? "").toLowerCase().includes(ql)
      );
    });
  }, [leads, tab, q]);

  async function changeStatus(id: string, status: LeadStatus, silent = false) {
    try {
      await setStatus({ data: { id, status } });
      if (!silent) toast.success(`Marked as ${status}`);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      setDetail((d) => (d && d.id === id ? { ...d, status } : d));
      // refresh stats
      const s = await fetchStats();
      setStats(s as LeadStats);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await del({ data: { id: deleteTarget.id } });
      toast.success("Contact deleted");
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDetail(null);
      const s = await fetchStats();
      setStats(s as LeadStats);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function openDetail(l: LeadRow) {
    setDetail(l);
    if (l.status === "new") changeStatus(l.id, "read", true);
  }

  function replyMailto(l: LeadRow) {
    const subject = encodeURIComponent(`Re: Consultation request — ${l.case_type ?? "The Kohn Law Firm"}`);
    const body = encodeURIComponent(`Hello ${l.name},\n\nThank you for reaching out to The Kohn Law Firm.\n\n`);
    window.location.href = `mailto:${l.email}?subject=${subject}&body=${body}`;
    changeStatus(l.id, "replied", true);
  }

  return (
    <AdminShell title="Contacts">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Contacts</h2>
        <p className="text-sm text-white/50 mt-1">Consultation requests submitted from the public website.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Inbox} iconBg="bg-blue-500/15 text-blue-400"
          label="Total Submissions" value={loading ? "—" : stats?.total ?? 0} />
        <StatCard icon={Sparkles} iconBg="bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
          label="New (Unread)" value={loading ? "—" : stats?.newCount ?? 0} />
        <StatCard icon={Clock3} iconBg="bg-purple-500/15 text-purple-400"
          label="This Week" value={loading ? "—" : stats?.thisWeek ?? 0} />
        <StatCard icon={MailCheck} iconBg="bg-green-500/15 text-green-400"
          label="Email Sent" value={loading ? "—" : stats?.emailSent ?? 0} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-[#111a2e] p-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === t.key ? "bg-[color:var(--brand)] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, case type…"
            className="pl-9 bg-[#111a2e] border-white/10 text-white placeholder:text-white/40" />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111a2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Case Type</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-white/50 py-14">
                  No contacts match your filters.
                </td></tr>
              ) : filtered.map((l) => (
                <tr key={l.id}
                  onClick={() => openDetail(l)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                  <td className="px-5 py-3 text-white/70 whitespace-nowrap">{fmt(l.created_at)}</td>
                  <td className="px-4 py-3 text-white font-medium">{l.name}</td>
                  <td className="px-4 py-3 text-white/70">{l.case_type ?? "—"}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()}
                      className="text-[color:var(--gold)] hover:underline">{l.email}</a>
                  </td>
                  <td className="px-4 py-3">
                    {l.phone
                      ? <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()}
                          className="text-white/80 hover:text-[color:var(--gold)]">{l.phone}</a>
                      : <span className="text-white/40">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_BADGE[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {l.email_sent ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">Sent</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10">Not sent</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex gap-1">
                      <button title="View" onClick={() => openDetail(l)}
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button title="Reply" onClick={() => replyMailto(l)}
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-[color:var(--gold)]">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button title="Archive" onClick={() => changeStatus(l.id, "archived")}
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button title="Delete" onClick={() => setDeleteTarget(l)}
                        className="p-2 rounded hover:bg-[color:var(--crimson)]/20 text-white/70 hover:text-[color:var(--crimson)]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="bg-[#111a2e] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between gap-4">
              <span>{detail?.name}</span>
              {detail && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_BADGE[detail.status]}`}>
                  {detail.status}
                </span>
              )}
            </DialogTitle>
            <p className="text-xs text-white/50">{detail && fmt(detail.created_at)}</p>
          </DialogHeader>

          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Case Type" value={detail.case_type ?? "—"} />
                <Field label="Source" value={detail.source} />
                <Field label="Email" value={
                  <a href={`mailto:${detail.email}`} className="text-[color:var(--gold)] hover:underline">{detail.email}</a>
                } />
                <Field label="Phone" value={
                  detail.phone
                    ? <a href={`tel:${detail.phone}`} className="text-white hover:text-[color:var(--gold)]">{detail.phone}</a>
                    : <span className="text-white/40">—</span>
                } />
                <Field label="Best Time to Reach" value={detail.best_time_to_reach ?? "—"} />
                <Field label="Notification Email" value={detail.email_sent ? "Sent" : "Not sent"} />
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0b1220] p-4">
                <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Brief description</div>
                <p className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">
                  {detail.message?.trim() ? detail.message : "No message provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => replyMailto(detail)}
                  className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white">
                  <Mail className="h-4 w-4 mr-2" /> Reply via Email
                </Button>
                <Button variant="outline" onClick={() => changeStatus(detail.id, "read")}
                  className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white">
                  Mark as Read
                </Button>
                <Button variant="outline" onClick={() => changeStatus(detail.id, "replied")}
                  className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white">
                  Mark as Replied
                </Button>
                <Button variant="outline" onClick={() => changeStatus(detail.id, "archived")}
                  className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white">
                  <Archive className="h-4 w-4 mr-2" /> Archive
                </Button>
                <Button onClick={() => setDeleteTarget(detail)}
                  className="ml-auto bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90 text-white">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently remove the submission from "{deleteTarget?.name}". This cannot be undone.
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-sm text-white mt-1">{value}</div>
    </div>
  );
}
