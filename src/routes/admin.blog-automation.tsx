import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Bot, Calendar, Hash, Play, ExternalLink, Loader2, CheckCircle2, XCircle,
  TrendingUp, Percent, RefreshCw, Sparkles, ListChecks, Settings as SettingsIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { listAutomationRuns, runAutomationNow, type AutomationRun } from "@/lib/automation.functions";
import { listTopics, type TopicRow } from "@/lib/topics.functions";
import { getScheduleSettings, type ScheduleSettings } from "@/lib/settings.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog-automation")({
  ssr: false,
  component: BlogAutomationPage,
});

const DEFAULT_SETTINGS = {
  frequency: "Daily",
  time: "09:00 MST",
  postsPerRun: 1,
  autoPublish: false,
  model: "google/gemini-3.6-flash",
  hour: 9,
  minute: 0,
};


function fmtDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}
function fmtShortDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function computeNextScheduled(hour: number, minute: number, frequency: string): Date {
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + (frequency === "weekly" ? 7 : 1));
  }
  return next;
}


function StatCard({ icon: Icon, iconBg, label, value, subtext }: {
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

function StatusBadge({ status, detail }: { status: "success" | "failed"; detail?: string }) {
  const isSuccess = status === "success";
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        isSuccess
          ? "bg-green-500/15 text-green-400 border-green-500/30"
          : "bg-[color:var(--crimson)]/15 text-[color:var(--crimson)] border-[color:var(--crimson)]/30"
      }`}>
        {isSuccess ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        {isSuccess ? "Draft" : "Failed"}
      </span>
      {detail && <span className="text-xs text-white/50">{detail}</span>}
    </div>
  );
}

function BlogAutomationPage() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [nextScheduled, setNextScheduled] = useState<Date>(() => computeNextScheduled());

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

  const pendingTopics = useMemo(
    () => topics
      .filter((t) => t.status === "pending")
      .sort((a, b) => {
        const ax = a.scheduled_at ? new Date(a.scheduled_at).getTime() : Infinity;
        const bx = b.scheduled_at ? new Date(b.scheduled_at).getTime() : Infinity;
        return ax - bx;
      }),
    [topics]
  );

  const earliestPending = pendingTopics[0] ?? null;

  const stats = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = runs.filter((r) => now - new Date(r.created_at).getTime() <= weekMs).length;
    const successful = runs.filter((r) => r.status === "success").length;
    const total = runs.length;
    const rate = total > 0 ? Math.round((successful / total) * 100) : 0;
    return { thisWeek, successful, total, rate };
  }, [runs]);

  const nextGenLabel = useMemo(() => {
    if (earliestPending?.scheduled_at) {
      const d = new Date(earliestPending.scheduled_at);
      const diff = d.getTime() - Date.now();
      if (diff <= 24 * 60 * 60 * 1000) return "Imminent";
      return fmtShortDate(d);
    }
    const diff = nextScheduled.getTime() - Date.now();
    if (diff <= 24 * 60 * 60 * 1000) return "Imminent";
    return fmtShortDate(nextScheduled);
  }, [earliestPending, nextScheduled]);

  const nextGenExact = earliestPending?.scheduled_at
    ? fmtDateTime(earliestPending.scheduled_at)
    : fmtDateTime(nextScheduled.toISOString());

  const days = useMemo(() => {
    const arr: Date[] = [];
    const base = new Date(); base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base); d.setDate(base.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const today = new Date();
  const nextScheduledDay = earliestPending?.scheduled_at ? new Date(earliestPending.scheduled_at) : nextScheduled;

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

  function handleRecalculate() {
    const next = computeNextScheduled();
    setNextScheduled(next);
    toast.success(`Next run recalculated: ${fmtDateTime(next.toISOString())}`);
  }

  return (
    <AdminShell title="Blog Automation">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-[color:var(--gold)]" /> Blog Automation
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Monitor automated post generation, review the schedule, and trigger runs on demand.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRecalculate}
          className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Recalculate Schedule
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Calendar} iconBg="bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
          label="Next Generation"
          value={nextGenLabel}
          subtext={nextGenExact}
        />
        <StatCard
          icon={TrendingUp} iconBg="bg-blue-500/15 text-blue-400"
          label="This Week"
          value={loading ? "—" : String(stats.thisWeek)}
          subtext="Generation runs in last 7 days"
        />
        <StatCard
          icon={Hash} iconBg="bg-green-500/15 text-green-400"
          label="Total Generated"
          value={loading ? "—" : String(stats.successful)}
          subtext={`${stats.total} total attempts`}
        />
        <StatCard
          icon={Percent} iconBg="bg-purple-500/15 text-purple-400"
          label="Success Rate"
          value={loading ? "—" : `${stats.rate}%`}
          subtext="Across all attempts"
        />
      </div>

      {/* Main + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 14-day strip */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-base font-semibold text-white">14-Day Schedule</h3>
              <div className="text-xs text-white/50">
                {SETTINGS.frequency.toLowerCase()} · {SETTINGS.time} · {SETTINGS.postsPerRun}/run
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const isToday = isSameDay(d, today);
                const isNext = isSameDay(d, nextScheduledDay);
                return (
                  <div
                    key={d.toISOString()}
                    className={`rounded-lg p-2 text-center border transition-colors ${
                      isToday
                        ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
                        : isNext
                          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10"
                          : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-white/50">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <div className="text-base font-semibold text-white mt-0.5">{d.getDate()}</div>
                    {isToday && <div className="text-[10px] text-[color:var(--gold)] mt-0.5">Today</div>}
                    {!isToday && isNext && <div className="text-[10px] text-blue-400 mt-0.5">Next</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generation logs */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e]">
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">Generation Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50 text-xs uppercase tracking-wider">
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 font-medium">Started</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Trigger</th>
                    <th className="text-left px-4 py-3 font-medium">Topic / Post</th>
                    <th className="text-left px-4 py-3 font-medium">Duration</th>
                    <th className="text-left px-4 py-3 font-medium">Words</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center text-white/50 py-10">Loading…</td></tr>
                  ) : runs.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-white/50 py-14">
                      No automation runs yet. Click 'Run Now' to generate your first post.
                    </td></tr>
                  ) : runs.map((r) => (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 align-top">
                      <td className="px-5 py-3 text-white/80 whitespace-nowrap">{fmtDateTime(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} detail={r.status === "success" ? "Success" : "Failed"} />
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
                          <div className="text-xs text-[color:var(--crimson)] mt-1 max-w-md">{r.error_message}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                        {r.duration_seconds != null ? `${r.duration_seconds}s` : "—"}
                      </td>
                      <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                        {r.word_count != null ? r.word_count.toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.post ? (
                          <Link
                            to="/admin/posts/$id/edit"
                            params={{ id: r.post.id }}
                            className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-[color:var(--gold)]"
                          >
                            View <ExternalLink className="h-3 w-3" />
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Controls */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
            <h3 className="text-base font-semibold text-white mb-4">Quick Controls</h3>
            <div className="space-y-2">
              <Button
                onClick={handleRunNow}
                disabled={running || pendingTopics.length === 0}
                className="w-full bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white disabled:opacity-50"
              >
                {running ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
                ) : pendingTopics.length === 0 ? (
                  "No pending topics"
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Generate Now</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleRecalculate}
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Recalculate Schedule
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/admin/topics">
                  <ListChecks className="h-4 w-4 mr-2" /> Manage Topics
                </Link>
              </Button>
            </div>
          </div>

          {/* Current Settings */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Current Settings</h3>
              <SettingsIcon className="h-4 w-4 text-white/40" />
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["Frequency", SETTINGS.frequency],
                ["Schedule time", SETTINGS.time],
                ["Posts per run", String(SETTINGS.postsPerRun)],
                ["Auto-publish", SETTINGS.autoPublish ? "Yes" : "No"],
                ["AI model", SETTINGS.model],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-white/50">{k}</dt>
                  <dd className="text-white/90 text-right truncate">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
              Placeholder defaults — Settings module not built yet.
            </div>
            <Link
              to="/admin/settings"
              className="mt-3 inline-block text-xs text-[color:var(--gold)] hover:underline"
            >
              Edit settings →
            </Link>
          </div>

          {/* Queue */}
          <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-white">Queue</h3>
              <p className="text-xs text-white/50 mt-0.5">{pendingTopics.length} pending topics</p>
            </div>
            {pendingTopics.length === 0 ? (
              <div className="text-sm text-white/50 py-4 text-center">
                No pending topics.{" "}
                <Link to="/admin/topics" className="text-[color:var(--gold)] hover:underline">Add one →</Link>
              </div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {pendingTopics.map((t) => (
                  <li key={t.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-medium text-white truncate">{t.title}</div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {t.scheduled_at ? fmtDateTime(t.scheduled_at) : "Unscheduled"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Button
          variant="ghost"
          onClick={refresh}
          disabled={loading}
          className="text-white/60 hover:text-white hover:bg-white/5"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>
    </AdminShell>
  );
}
