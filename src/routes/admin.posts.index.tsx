import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Pencil, Plus, Trash2, Search, FileText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listPosts, deletePost, bulkDeletePosts, type PostRow } from "@/lib/posts.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/")({
  ssr: false,
  component: PostsListPage,
});

const SWATCH: Record<string, string> = {
  purple: "#8b5cf6", blue: "#3b82f6", green: "#22c55e", cyan: "#06b6d4",
  orange: "#f97316", pink: "#ec4899", yellow: "#eab308", violet: "#a855f7",
};
const colorHex = (c?: string | null) => (c && SWATCH[c]) || c || "#64748b";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function PostsListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published" | "scheduled">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const list = useServerFn(listPosts);
  const del = useServerFn(deletePost);
  const bulkDel = useServerFn(bulkDeletePosts);

  async function refresh() {
    setLoading(true);
    try {
      const data = await list();
      setRows(data as PostRow[]);
      setSelected(new Set());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.category?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, query, status]);

  const allChecked = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someChecked = filtered.some((r) => selected.has(r.id));

  function toggleAll() {
    const next = new Set(selected);
    if (allChecked) filtered.forEach((r) => next.delete(r.id));
    else filtered.forEach((r) => next.add(r.id));
    setSelected(next);
  }
  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await del({ data: { id: deleteTarget.id } });
      toast.success("Post deleted");
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function confirmBulk() {
    const ids = Array.from(selected);
    if (!ids.length) return;
    try {
      const res = await bulkDel({ data: { ids } });
      toast.success(`Deleted ${(res as any).count} post${ids.length === 1 ? "" : "s"}`);
      setBulkOpen(false);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk delete failed");
    }
  }

  return (
    <AdminShell title="Posts">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Posts</h2>
          <p className="text-sm text-white/50 mt-1">Create, edit, and manage all blog posts.</p>
        </div>
        <Button
          onClick={() => navigate({ to: "/admin/posts/new" })}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, slug, or category…"
            className="pl-9 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#0b1220] border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#111a2e] border-white/10 text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {someChecked && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-[#111a2e] px-4 py-2">
          <div className="text-sm text-white/70">
            {Array.from(selected).length} selected
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkOpen(true)}
            className="bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#111a2e]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    className="border-white/30"
                  />
                </th>
                <th className="text-left px-2 py-3 font-medium w-16">Image</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Views</th>
                <th className="text-left px-4 py-3 font-medium">Read</th>
                <th className="text-left px-4 py-3 font-medium">Published</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-white/50 py-14">
                  {rows.length === 0 ? "No posts yet. Create one above." : "No posts match your filters."}
                </td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selected.has(p.id)}
                      onCheckedChange={() => toggleOne(p.id)}
                      className="border-white/30"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="h-10 w-10 rounded overflow-hidden bg-[#0b1220] border border-white/10 flex items-center justify-center">
                      {p.featured_image_signed_url ? (
                        <img src={p.featured_image_signed_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="h-4 w-4 text-white/30" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/posts/$id/edit"
                      params={{ id: p.id }}
                      className="font-medium text-white hover:text-[color:var(--gold)]"
                    >
                      {p.title}
                    </Link>
                    <div className="text-white/40 text-xs mt-0.5 font-mono">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {p.category ? (
                      <span className="inline-flex items-center gap-1.5 text-white/80 text-xs">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: colorHex(p.category.color) }}
                        />
                        {p.category.name}
                      </span>
                    ) : <span className="text-white/40">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "published" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                        Published
                      </span>
                    ) : p.status === "scheduled" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">
                        Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/15">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white/70">{p.read_time_minutes}m</td>
                  <td className="px-4 py-3 text-white/70">{formatDate(p.published_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {p.status === "published" && (
                        <a
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Preview"
                          className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white inline-flex"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        to="/admin/posts/$id/edit"
                        params={{ id: p.id }}
                        title="Edit"
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white inline-flex"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        title="Delete"
                        className="p-2 rounded hover:bg-[color:var(--crimson)]/20 text-white/70 hover:text-[color:var(--crimson)]"
                      >
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
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

      <AlertDialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} post{selected.size === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently remove the selected posts. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulk}
              className="bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90 text-white"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
