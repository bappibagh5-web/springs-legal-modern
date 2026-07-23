import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2, X, Check, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listCategories } from "@/lib/categories.functions";
import { listTopics, createTopic, updateTopic, deleteTopic, type TopicRow } from "@/lib/topics.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/topics")({
  ssr: false,
  component: TopicsPage,
});

const SWATCHES: Record<string, string> = {
  purple: "#8b5cf6", blue: "#3b82f6", green: "#22c55e", cyan: "#06b6d4",
  orange: "#f97316", pink: "#ec4899", yellow: "#eab308", violet: "#a855f7",
};
const swatchHex = (key: string) => SWATCHES[key] ?? key ?? "#64748b";

const PRIORITIES = [
  { value: 1, label: "P1 — Urgent",  cls: "bg-red-500/20 text-red-400 ring-red-500/30" },
  { value: 2, label: "P2 — High",    cls: "bg-orange-500/20 text-orange-400 ring-orange-500/30" },
  { value: 3, label: "P3 — Medium",  cls: "bg-[color:var(--gold)]/20 text-[color:var(--gold)] ring-[color:var(--gold)]/30" },
  { value: 4, label: "P4 — Low",     cls: "bg-[color:var(--brand)]/20 text-[color:var(--brand)] ring-[color:var(--brand)]/30" },
  { value: 5, label: "P5 — Backlog", cls: "bg-white/10 text-white/60 ring-white/15" },
];
const priorityMeta = (p: number) => PRIORITIES.find(x => x.value === p) ?? PRIORITIES[2];

type CategoryOption = { id: string; name: string; slug: string; color: string };

type FormState = {
  id?: string;
  title: string;
  category_id: string;
  priority: number;
  scheduled_at: string; // datetime-local value
  notes: string;
};
const emptyForm: FormState = {
  title: "", category_id: "", priority: 3, scheduled_at: "", notes: "",
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string): string {
  return new Date(v).toISOString();
}
function formatDT(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function TopicsPage() {
  const [rows, setRows] = useState<TopicRow[]>([]);
  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TopicRow | null>(null);

  const list = useServerFn(listTopics);
  const listCats = useServerFn(listCategories);
  const create = useServerFn(createTopic);
  const update = useServerFn(updateTopic);
  const del = useServerFn(deleteTopic);

  async function refresh() {
    setLoading(true);
    try {
      const [tData, cData] = await Promise.all([list(), listCats()]);
      setRows(tData as TopicRow[]);
      setCats((cData as CategoryOption[]).map(c => ({
        id: c.id, name: c.name, slug: c.slug, color: c.color,
      })));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
    [rows],
  );

  function resetForm() { setForm(emptyForm); setEditing(false); }

  function startEdit(row: TopicRow) {
    setForm({
      id: row.id,
      title: row.title,
      category_id: row.category_id ?? "",
      priority: row.priority,
      scheduled_at: toLocalInput(row.scheduled_at),
      notes: row.notes ?? "",
    });
    setEditing(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canSubmit =
    form.title.trim().length > 0 &&
    form.category_id.length > 0 &&
    form.scheduled_at.length > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category_id: form.category_id,
        priority: form.priority,
        scheduled_at: fromLocalInput(form.scheduled_at),
        notes: form.notes.trim() ? form.notes.trim() : null,
      };
      if (editing && form.id) {
        await update({ data: { id: form.id, ...payload } });
        toast.success("Topic updated");
      } else {
        await create({ data: payload });
        toast.success("Topic created");
      }
      resetForm();
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await del({ data: { id: deleteTarget.id } });
      toast.success("Topic deleted");
      if (form.id === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <AdminShell title="Topics">
      <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            {editing ? "Edit Topic" : "Add Topic"}
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            {editing ? "Update the selected topic below." : "Queue a blog topic for auto-generation."}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white/70 text-xs uppercase tracking-wide">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Understanding DUI Penalties in Colorado Springs"
              className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Category *</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="mt-1 bg-[#0b1220] border-white/10 text-white">
                  <SelectValue placeholder={cats.length ? "Select a category" : "No categories — add one first"} />
                </SelectTrigger>
                <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                  {cats.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: swatchHex(c.color) }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Priority *</Label>
              <Select
                value={String(form.priority)}
                onValueChange={(v) => setForm({ ...form, priority: Number(v) })}
              >
                <SelectTrigger className="mt-1 bg-[#0b1220] border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                  {PRIORITIES.map(p => (
                    <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Scheduled Date *</Label>
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="mt-1 bg-[#0b1220] border-white/10 text-white [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <Label className="text-white/70 text-xs uppercase tracking-wide">Notes</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder='Optional angle for the AI, e.g. "focus on DUI penalties in Colorado Springs"'
              className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
            >
              {editing ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editing ? "Save Changes" : "Add Topic"}
            </Button>
            {editing && (
              <Button variant="ghost" onClick={resetForm}
                className="text-white/70 hover:text-white hover:bg-white/10">
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111a2e]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            All Topics <span className="text-white/40">({rows.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Scheduled Date</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-white/50 py-10">No topics yet. Add one above.</td></tr>
              ) : sorted.map(t => {
                const pri = priorityMeta(t.priority);
                return (
                  <tr key={t.id} className={`border-b border-white/5 hover:bg-white/5 ${form.id === t.id ? "bg-white/5" : ""}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${pri.cls}`}>
                        P{t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{t.title}</div>
                      {t.notes && (
                        <div className="text-white/40 text-xs mt-0.5 line-clamp-1 max-w-md">{t.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {t.category ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/80 ring-1 ring-white/10">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: swatchHex(t.category.color) }} />
                          {t.category.name}
                        </span>
                      ) : (
                        <span className="text-white/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {t.status === "generated" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs font-medium">
                          Generated
                          <button
                            type="button"
                            disabled
                            title="Post module coming soon"
                            className="opacity-60 cursor-not-allowed"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold)] px-2 py-0.5 text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/70">{formatDT(t.scheduled_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => startEdit(t)}
                          title="Edit"
                          className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(t)}
                          title="Delete"
                          className="p-2 rounded hover:bg-[color:var(--crimson)]/20 text-white/70 hover:text-[color:var(--crimson)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete topic?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently remove "{deleteTarget?.title}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
