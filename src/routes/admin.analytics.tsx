import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Download, Lock, TrendingUp, TrendingDown, Eye, Users, MousePointerClick,
  Activity, Timer, Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/lib/analytics.functions";

export const Route = createFileRoute("/admin/analytics")({
  ssr: false,
  component: AnalyticsPage,
});

const RANGES = [
  { days: 7, label: "Last 7 Days" },
  { days: 30, label: "Last 30 Days" },
  { days: 90, label: "Last 90 Days" },
];

const SOURCE_COLORS: Record<string, string> = {
  "Direct": "#004AAD",
  "Organic Search": "#FDBA34",
  "Referral": "#9F2828",
  "Social Media": "#22c55e",
};

function formatDuration(secs: number): string {
  if (!secs) return "0s";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function ChangeBadge({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  const cls = value === 0 ? "text-white/50" : positive ? "text-emerald-400" : negative ? "text-red-400" : "text-white/50";
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cls}`}>
      <Icon className="h-3 w-3" />
      {value > 0 ? "+" : ""}{value}%
    </span>
  );
}

function StatCard({ icon: Icon, label, value, change, invert }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: number;
  invert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
        <Icon className="h-4 w-4 text-[color:var(--gold)]" />
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        <ChangeBadge value={change} invert={invert} />
        <span className="text-[10px] uppercase tracking-wider text-white/40">vs prev</span>
      </div>
    </div>
  );
}

function toCSV(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

function AnalyticsPage() {
  const fetchSummary = useServerFn(getAnalyticsSummary);
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState({ pageviews: true, uniqueVisitors: true, sessions: true });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchSummary({ data: { days } })
      .then((res) => { if (alive) setData(res as AnalyticsSummary); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [days, fetchSummary]);

  // Auto-refresh live number every 30s
  useEffect(() => {
    const id = setInterval(() => {
      fetchSummary({ data: { days } }).then((res) => setData(res as AnalyticsSummary)).catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, [days, fetchSummary]);

  const totalSources = useMemo(
    () => data?.trafficSources.reduce((a, s) => a + s.count, 0) ?? 0,
    [data],
  );
  const totalDevices = useMemo(
    () => data?.devices.reduce((a, d) => a + d.count, 0) ?? 0,
    [data],
  );

  function exportCsv() {
    if (!data) return;
    const rows = data.timeSeries.map((r) => ({
      date: r.date,
      pageviews: r.pageviews,
      unique_visitors: r.uniqueVisitors,
      sessions: r.sessions,
    }));
    const blob = new Blob([toCSV(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell title="Analytics">
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-white/60">Self-hosted site analytics</div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-md border border-white/10 bg-[#0a1122] px-3 py-2 text-sm text-white"
            >
              {RANGES.map((r) => <option key={r.days} value={r.days}>{r.label}</option>)}
            </select>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0a1122] px-3 py-2 text-sm text-white hover:bg-white/5"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-white/60" /></div>
        ) : !data ? (
          <div className="text-white/60">No data.</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <StatCard icon={Eye} label="Total Pageviews" value={data.stats.pageviews.toLocaleString()} change={data.stats.pageviewsChange} />
              <StatCard icon={Users} label="Unique Visitors" value={data.stats.uniqueVisitors.toLocaleString()} change={data.stats.uniqueVisitorsChange} />
              <StatCard icon={MousePointerClick} label="Sessions" value={data.stats.sessions.toLocaleString()} change={data.stats.sessionsChange} />
              <StatCard icon={Activity} label="Bounce Rate" value={`${data.stats.bounceRate}%`} change={data.stats.bounceRateChange} invert />
              <StatCard icon={Timer} label="Avg. Session" value={formatDuration(data.stats.avgSessionSeconds)} change={data.stats.avgSessionSecondsChange} />
            </div>

            {/* Visitors over time */}
            <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Visitors Over Time</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeSeries}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#004AAD" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#004AAD" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FDBA34" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#FDBA34" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9F2828" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#9F2828" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#0a1122", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                    {series.pageviews && <Area type="monotone" dataKey="pageviews" stroke="#004AAD" fill="url(#g1)" strokeWidth={2} />}
                    {series.uniqueVisitors && <Area type="monotone" dataKey="uniqueVisitors" stroke="#FDBA34" fill="url(#g2)" strokeWidth={2} />}
                    {series.sessions && <Area type="monotone" dataKey="sessions" stroke="#9F2828" fill="url(#g3)" strokeWidth={2} />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
                {([
                  ["pageviews", "Pageviews", "#004AAD"],
                  ["uniqueVisitors", "Unique Visitors", "#FDBA34"],
                  ["sessions", "Sessions", "#9F2828"],
                ] as const).map(([key, lbl, color]) => (
                  <button
                    key={key}
                    onClick={() => setSeries((s) => ({ ...s, [key]: !s[key] }))}
                    className={`inline-flex items-center gap-2 rounded px-2 py-1 transition ${
                      series[key] ? "text-white" : "text-white/40 line-through"
                    }`}
                  >
                    <span className="h-2 w-3 rounded-sm" style={{ background: color }} />
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Top pages + traffic sources */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
                <h3 className="mb-3 text-sm font-semibold text-white">Top Pages</h3>
                {data.topPages.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase text-white/40">
                        <tr>
                          <th className="pb-2 text-left">Page</th>
                          <th className="pb-2 text-right">Views</th>
                          <th className="pb-2 text-right">Unique</th>
                          <th className="pb-2 text-right">Avg Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {data.topPages.map((p) => (
                          <tr key={p.page_path} className="border-t border-white/5">
                            <td className="py-2 pr-2 font-mono text-xs">{p.page_path}</td>
                            <td className="py-2 text-right">{p.views}</td>
                            <td className="py-2 text-right">{p.unique}</td>
                            <td className="py-2 text-right">{formatDuration(p.avgSeconds)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-sm text-white/40">No data yet</p>}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
                <h3 className="mb-3 text-sm font-semibold text-white">Traffic Sources</h3>
                {data.trafficSources.length ? (
                  <div className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="h-56 w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.trafficSources}
                            dataKey="count"
                            nameKey="source"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {data.trafficSources.map((s) => (
                              <Cell key={s.source} fill={SOURCE_COLORS[s.source] ?? "#64748b"} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#0a1122", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="flex-1 space-y-2 text-sm">
                      {data.trafficSources.map((s) => {
                        const pct = totalSources ? Math.round((s.count / totalSources) * 100) : 0;
                        return (
                          <li key={s.source} className="flex items-center justify-between text-white/80">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-3 rounded-sm" style={{ background: SOURCE_COLORS[s.source] ?? "#64748b" }} />
                              {s.source}
                            </span>
                            <span className="text-xs text-white/60">{s.count} ({pct}%)</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : <p className="text-sm text-white/40">No data yet</p>}
              </div>
            </div>

            {/* 3-col: blog / devices / live */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
                <h3 className="mb-3 text-sm font-semibold text-white">Top Blog Posts</h3>
                {data.topBlogPosts.length ? (
                  <ul className="space-y-2 text-sm">
                    {data.topBlogPosts.map((p) => (
                      <li key={p.label} className="flex items-start justify-between gap-3 border-t border-white/5 py-2 text-white/80">
                        <span className="line-clamp-2">{p.label}</span>
                        <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 text-xs">{p.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-white/40">No blog views yet</p>}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
                <h3 className="mb-3 text-sm font-semibold text-white">Devices</h3>
                {data.devices.length ? (
                  <div className="space-y-2">
                    {data.devices.map((d) => {
                      const pct = totalDevices ? Math.round((d.count / totalDevices) * 100) : 0;
                      return (
                        <div key={d.device}>
                          <div className="flex justify-between text-xs text-white/60">
                            <span className="capitalize">{d.device}</span>
                            <span>{d.count} ({pct}%)</span>
                          </div>
                          <div className="mt-1 h-2 rounded bg-white/5">
                            <div className="h-full rounded bg-[color:var(--brand)]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-sm text-white/40">No data yet</p>}
                {data.browsers.length ? (
                  <div className="mt-5">
                    <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Browsers</div>
                    <ul className="space-y-1 text-sm text-white/80">
                      {data.browsers.map((b) => (
                        <li key={b.browser} className="flex justify-between border-t border-white/5 py-1">
                          <span>{b.browser}</span>
                          <span className="text-xs text-white/60">{b.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live & Recent
                </h3>
                <div className="text-3xl font-semibold text-white">{data.liveVisitors}</div>
                <div className="text-xs text-white/50">on site right now</div>
                <div className="mt-4">
                  {data.recentVisits.length ? (
                    <ul className="space-y-2 text-xs text-white/70">
                      {data.recentVisits.map((v, i) => (
                        <li key={i} className="flex items-center justify-between border-t border-white/5 py-1.5">
                          <span className="truncate font-mono">{v.page_path}</span>
                          <span className="shrink-0 text-white/40">{relTime(v.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-white/40">No recent visits</p>}
                </div>
              </div>
            </div>

            {/* Event Tracking */}
            <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">Event Tracking</h3>
              {data.events.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-white/40">
                      <tr>
                        <th className="pb-2 text-left">Event</th>
                        <th className="pb-2 text-left">Category</th>
                        <th className="pb-2 text-left">Label</th>
                        <th className="pb-2 text-right">Count</th>
                        <th className="pb-2 text-right">Last</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      {data.events.map((e, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="py-2 font-mono text-xs">{e.event_type}</td>
                          <td className="py-2 text-xs">{e.category ?? "—"}</td>
                          <td className="py-2 text-xs">{e.label ?? "—"}</td>
                          <td className="py-2 text-right">{e.count}</td>
                          <td className="py-2 text-right text-xs text-white/50">{relTime(e.lastAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-sm text-white/40">No events tracked yet</p>}
            </div>

            {/* Campaigns */}
            <div className="rounded-xl border border-white/10 bg-[#0a1122] p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">Campaign Performance</h3>
              {data.campaigns.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-white/40">
                      <tr>
                        <th className="pb-2 text-left">Campaign</th>
                        <th className="pb-2 text-left">Source</th>
                        <th className="pb-2 text-left">Medium</th>
                        <th className="pb-2 text-right">Sessions</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      {data.campaigns.map((c, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="py-2">{c.campaign}</td>
                          <td className="py-2 text-xs">{c.source || "—"}</td>
                          <td className="py-2 text-xs">{c.medium || "—"}</td>
                          <td className="py-2 text-right">{c.sessions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-sm text-white/40">No campaign traffic yet</p>}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-white/40">
              <Lock className="h-3 w-3" />
              Analytics data stored in your own Supabase database. No third parties.
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
