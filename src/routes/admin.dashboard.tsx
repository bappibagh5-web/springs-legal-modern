import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  FileText, Hash, Eye, FolderTree, Users, Plus, Sparkles,
  Pencil, Trash2, Clock, ArrowRight,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getDashboardStats, type DashboardStats } from "@/lib/admin.functions";
import { listPosts, deletePost, type PostRow } from "@/lib/posts.functions";
import { listTopics, type TopicRow } from "@/lib/topics.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: DashboardPage,
});

const SWATCH: Record<string, string> = {
  purple: "#8b5cf6", blue: "#3b82f6", green: "#22c55e", cyan: "#06b6d4",
  orange: "#f97316", pink: "#ec4899", yellow: "#eab308", violet: "#a855f7",
};
const colorHex = (c?: string | null) => (c && SWATCH[c]) || c || "#64748b";

const PRIORITY: Record<number, { label: string; cls: string }> = {
  1: { label: "P1", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  2: { label: "P2", cls: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  3: { label: "P3", cls: "bg-[color:var(--gold)]/15 text-[color:var(--gold)] border-[color:var(--gold)]/30" },
  4: { label: "P4", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  5: { label: "P5", cls: "bg-white/10 text-white/70 border-white/15" },
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function StatCard({ icon: Icon, iconBg, label, value, subtext }: {
  icon: any; iconBg: string; label: string; value: string | number; subtext: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
      <div className="text-xs text-white/50 mt-1">{subtext}</div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);

  const fetchStats = useServerFn(getDashboardStats);
  const fetchPosts = useServerFn(listPosts);
  const fetchTopics = useServerFn(listTopics);
  const del = useServerFn(deletePost);

  async function refresh() {
    setLoading(true);
    try {
      const [s, p, t] = await Promise.all([fetchStats(), fetchPosts(), fetchTopics()]);
      setStats(s as DashboardStats);
      setPosts(p as PostRow[]);
      setTopics(t as TopicRow[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const recentPosts = useMemo(
    () => [...posts].sort((a, b) => (b.updated_at.localeCompare(a.updated_at))).slice(0, 5),
    [posts],
  );

  const pendingTopics = useMemo(
    () => topics.filter((t) => t.status === "pending").slice(0, 3),
    [topics],
  );

  function generatePostNow() {
    const top = topics
      .filter((t) => t.status === "pending")
      .sort((a, b) => a.priority - b.priority)[0];
    const search = top ? { topic: top.title, categoryId: top.category_id ?? undefined } : undefined;
    navigate({ to: "/admin/posts/new", search: search as any });
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

  return (
    <AdminShell title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-sm text-white/50 mt-1">Overview of your content and team.</p>
        </div>
        <Button
          onClick={() => navigate({ to: "/admin/posts/new" })}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={FileText} iconBg="bg-blue-500/15 text-blue-400"
          label="Total Posts"
          value={loading ? "—" : stats?.posts.total ?? 0}
          subtext={loading ? " " : `${stats?.posts.published ?? 0} published, ${stats?.posts.drafts ?? 0} drafts`}
        />
        <StatCard
          icon={Hash} iconBg="bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
          label="Topics Queue"
          value={loading ? "—" : stats?.topicsPending ?? 0}
          subtext="Ready to generate"
        />
        <StatCard
          icon={Eye} iconBg="bg-green-500/15 text-green-400"
          label="Total Views"
          value={loading ? "—" : (stats?.totalViews ?? 0).toLocaleString()}
          subtext="Across all posts"
        />
        <StatCard
          icon={FolderTree} iconBg="bg-purple-500/15 text-purple-400"
          label="Categories"
          value={loading ? "—" : stats?.categories ?? 0}
          subtext="Active categories"
        />
        <StatCard
          icon={Users} iconBg="bg-[color:var(--crimson)]/15 text-[color:var(--crimson)]"
          label="Team"
          value={loading ? "—" : stats?.team.total ?? 0}
          subtext={loading ? " " : `${stats?.team.admins ?? 0} admins, ${stats?.team.superAdmins ?? 0} super admins`}
        />
      </div>

      {/* Action row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Button
          onClick={generatePostNow}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white h-12"
        >
          <Sparkles className="h-4 w-4 mr-2" /> Generate Post Now
        </Button>
        <Button
          onClick={() => navigate({ to: "/admin/topics" })}
          variant="outline"
          className="h-12 bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Topic
        </Button>
        <Button
          onClick={() => navigate({ to: "/admin/posts/new" })}
          variant="outline"
          className="h-12 bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Bottom two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#111a2e]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Posts</h3>
            <Link to="/admin/posts" className="text-xs text-[color:var(--gold)] hover:underline inline-flex items-center gap-1">
              View all posts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs uppercase tracking-wider">
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Views</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-white/50 py-10">Loading…</td></tr>
                ) : recentPosts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-white/50 py-14">
                    No posts yet. Create one to get started.
                  </td></tr>
                ) : recentPosts.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-5 py-3">
                      <Link to="/admin/posts/$id/edit" params={{ id: p.id }} className="font-medium text-white hover:text-[color:var(--gold)]">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {p.category ? (
                        <span className="inline-flex items-center gap-1.5 text-white/80 text-xs">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorHex(p.category.color) }} />
                          {p.category.name}
                        </span>
                      ) : <span className="text-white/40">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">Published</span>
                      ) : p.status === "scheduled" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/30">Scheduled</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/15">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/70">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/70">{fmtDate(p.published_at ?? p.updated_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
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

        {/* Next in queue */}
        <div className="rounded-xl border border-white/10 bg-[#111a2e]">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">Next in Queue</h3>
          </div>
          <div className="p-5 space-y-3">
            {loading ? (
              <div className="text-center text-white/50 py-6 text-sm">Loading…</div>
            ) : pendingTopics.length === 0 ? (
              <div className="text-center text-white/50 py-8 text-sm">
                No topics in queue. Add one to get started.
              </div>
            ) : pendingTopics.map((t) => {
              const p = PRIORITY[t.priority] ?? PRIORITY[5];
              const imminent = new Date(t.scheduled_at).getTime() - Date.now() < 48 * 3600 * 1000;
              return (
                <div key={t.id} className="rounded-lg border border-white/10 bg-[#0b1220] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${p.cls}`}>
                      {p.label}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/15">
                      Pending
                    </span>
                    <span className={`ml-auto text-[10px] uppercase tracking-wider ${imminent ? "text-[color:var(--crimson)]" : "text-white/40"}`}>
                      {imminent ? "Imminent" : "Upcoming"}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-sm leading-snug">{t.title}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
                    <Clock className="h-3 w-3" />
                    {fmtDateTime(t.scheduled_at)}
                  </div>
                </div>
              );
            })}
            <Link to="/admin/topics" className="block text-xs text-[color:var(--gold)] hover:underline pt-2 text-center">
              Manage topics →
            </Link>
          </div>
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
    </AdminShell>
  );
}
