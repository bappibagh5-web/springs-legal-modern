import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Clock, Calendar, Hash, Play, ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { listAutomationRuns, runAutomationNow, type AutomationRun } from "@/lib/automation.functions";
import { listTopics, type TopicRow } from "@/lib/topics.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog-automation")({
  ssr: false,
  component: BlogAutomationPage,
});

function fmtDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function StatusCard({ icon: Icon, iconBg, label, value, subtext }: {
  icon: any; iconBg: string; label: string; value: string; subtext: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-xl font-semibold text-white mt-1">{value}</div>
      <div className="text-xs text-white/50 mt-1">{subtext}</div>
    </div>
  );
}

function BlogAutomationPage() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchRuns = useServerFn(listAutomationRuns);
  const fetchTopics = useServerFn(listTopics);
  const runNow = useServerFn(runAutomationNow);

  async function refresh() {
    setLoading(true);
    try {
      const [r, t] = await Promise.all([fetchRuns(), fetchTopics()]);
      setRuns(r as AutomationRun[]);
      setTopics(t as TopicRow[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load automation data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const lastRun = runs[0] ?? null;
  const pendingCount = useMemo(() => topics.filter((t) => t.status === "pending").length, [topics]);

  async function handleRunNow() {
    setRunning(true);
    try {
      const res = (await runNow({ data: {} })) as { postId: string; title: string };
      toast.success(`Generated "${res.title}"`, {
        action: {
          label: "Open post",
          onClick: () => navigate({ to: "/admin/posts/$id/edit", params: { id: res.postId } }),
        },
      });
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Automation failed");
      await refresh();
    } finally {
      setRunning(false);
    }
  }

  return (
    <AdminShell title="Blog Automation">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-[color:var(--gold)]" /> Blog Automation
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Monitor automated post generation and trigger runs on demand.
          </p>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard
          icon={Clock} iconBg="bg-blue-500/15 text-blue-400"
          label="Last Run"
          value={lastRun ? fmtDateTime(lastRun.created_at) : "Never run"}
          subtext={
            lastRun
              ? lastRun.status === "success" ? "Succeeded" : `Failed${lastRun.error_message ? `: ${lastRun.error_message.slice(0, 60)}` : ""}`
              : "No runs yet"
          }
        />
        <StatusCard
          icon={Calendar} iconBg="bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
          label="Next Scheduled Run"
          value="Not scheduled"
          subtext="Configure in Settings"
        />
        <StatusCard
          icon={Hash} iconBg="bg-green-500/15 text-green-400"
          label="Pending Topics"
          value={loading ? "—" : String(pendingCount)}
          subtext="Ready to generate"
        />
      </div>

      {/* Manual trigger */}
      <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm font-semibold text-white">Manual Trigger</div>
          <div className="text-xs text-white/50 mt-0.5">
            Picks the highest-priority pending topic and generates a draft post.
          </div>
        </div>
        <Button
          onClick={handleRunNow}
          disabled={running || pendingCount === 0}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white disabled:opacity-50"
        >
          {running ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
          ) : pendingCount === 0 ? (
            "No pending topics"
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Run Now</>
          )}
        </Button>
      </div>

      {/* Run history */}
      <div className="rounded-xl border border-white/10 bg-[#111a2e]">
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="text-base font-semibold text-white">Run History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 font-medium">Date / Time</th>
                <th className="text-left px-4 py-3 font-medium">Topic Generated</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Trigger</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : runs.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-white/50 py-14">
                  No automation runs yet. Click 'Run Now' to generate your first post.
                </td></tr>
              ) : runs.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 text-white/80">{fmtDateTime(r.created_at)}</td>
                  <td className="px-4 py-3">
                    {r.post ? (
                      <Link
                        to="/admin/posts/$id/edit"
                        params={{ id: r.post.id }}
                        className="font-medium text-white hover:text-[color:var(--gold)]"
                      >
                        {r.post.title}
                      </Link>
                    ) : (
                      <span className="text-white/70">{r.topic_title ?? "—"}</span>
                    )}
                    {r.status === "failed" && r.error_message && (
                      <div className="text-xs text-[color:var(--crimson)] mt-1 truncate max-w-md">{r.error_message}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "success" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                        <CheckCircle2 className="h-3 w-3" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--crimson)]/15 text-[color:var(--crimson)] border border-[color:var(--crimson)]/30">
                        <XCircle className="h-3 w-3" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      r.trigger_type === "manual"
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                    }`}>
                      {r.trigger_type === "manual" ? "Manual" : "Scheduled"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {r.post ? (
                      <Link
                        to="/admin/posts/$id/edit"
                        params={{ id: r.post.id }}
                        title="View post"
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white inline-flex"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
