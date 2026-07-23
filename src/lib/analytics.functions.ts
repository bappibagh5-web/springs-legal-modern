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

export type AnalyticsRow = {
  id: string;
  event_type: string;
  category: string | null;
  label: string | null;
  page_path: string | null;
  referrer: string | null;
  traffic_source: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  session_id: string | null;
  visitor_id: string | null;
  device_type: string | null;
  browser: string | null;
  duration_seconds: number | null;
  created_at: string;
};

export type AnalyticsSummary = {
  range: { from: string; to: string; days: number };
  stats: {
    pageviews: number;
    uniqueVisitors: number;
    sessions: number;
    bounceRate: number; // 0-100
    avgSessionSeconds: number;
    // vs previous
    pageviewsChange: number;
    uniqueVisitorsChange: number;
    sessionsChange: number;
    bounceRateChange: number;
    avgSessionSecondsChange: number;
  };
  timeSeries: Array<{ date: string; pageviews: number; uniqueVisitors: number; sessions: number }>;
  topPages: Array<{ page_path: string; views: number; unique: number; avgSeconds: number }>;
  trafficSources: Array<{ source: string; count: number }>;
  topBlogPosts: Array<{ label: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  liveVisitors: number;
  recentVisits: Array<{ page_path: string; created_at: string; device: string | null; source: string | null }>;
  events: Array<{ event_type: string; category: string | null; label: string | null; count: number; lastAt: string }>;
  campaigns: Array<{ campaign: string; source: string; medium: string; sessions: number }>;
};

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

export const getAnalyticsSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ days: z.number().int().min(1).max(365).default(7) }).parse(d))
  .handler(async ({ data, context }): Promise<AnalyticsSummary> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const days = data.days;
    const now = Date.now();
    const from = new Date(now - days * 86400_000);
    const prevFrom = new Date(now - 2 * days * 86400_000);
    const toIso = new Date(now).toISOString();
    const fromIso = from.toISOString();
    const prevFromIso = prevFrom.toISOString();

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("*")
      .gte("created_at", prevFromIso)
      .order("created_at", { ascending: false })
      .limit(50000);
    if (error) throw new Error(error.message);
    const all = (rows ?? []) as AnalyticsRow[];

    const current = all.filter((r) => r.created_at >= fromIso);
    const previous = all.filter((r) => r.created_at < fromIso);

    function computeStats(list: AnalyticsRow[]) {
      const pageviews = list.filter((r) => r.event_type === "pageview");
      const uniqueVisitors = new Set(pageviews.map((r) => r.visitor_id).filter(Boolean)).size;
      const sessionsMap = new Map<string, AnalyticsRow[]>();
      for (const r of pageviews) {
        if (!r.session_id) continue;
        const arr = sessionsMap.get(r.session_id) ?? [];
        arr.push(r);
        sessionsMap.set(r.session_id, arr);
      }
      const sessions = sessionsMap.size;
      let bounced = 0;
      for (const arr of sessionsMap.values()) if (arr.length === 1) bounced++;
      const bounceRate = sessions ? Math.round((bounced / sessions) * 100) : 0;

      // Session duration: sum of page_duration events grouped by session
      const durations = list.filter((r) => r.event_type === "page_duration" && r.duration_seconds);
      const durBySession = new Map<string, number>();
      for (const d of durations) {
        if (!d.session_id) continue;
        durBySession.set(d.session_id, (durBySession.get(d.session_id) ?? 0) + (d.duration_seconds ?? 0));
      }
      const avgSessionSeconds = durBySession.size
        ? Math.round([...durBySession.values()].reduce((a, b) => a + b, 0) / durBySession.size)
        : 0;

      return { pageviews: pageviews.length, uniqueVisitors, sessions, bounceRate, avgSessionSeconds };
    }

    const cur = computeStats(current);
    const prev = computeStats(previous);

    // Time series (per day)
    const buckets = new Map<string, { pageviews: number; visitors: Set<string>; sessions: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400_000).toISOString().slice(0, 10);
      buckets.set(d, { pageviews: 0, visitors: new Set(), sessions: new Set() });
    }
    for (const r of current.filter((r) => r.event_type === "pageview")) {
      const day = r.created_at.slice(0, 10);
      const b = buckets.get(day);
      if (!b) continue;
      b.pageviews++;
      if (r.visitor_id) b.visitors.add(r.visitor_id);
      if (r.session_id) b.sessions.add(r.session_id);
    }
    const timeSeries = [...buckets.entries()].map(([date, b]) => ({
      date,
      pageviews: b.pageviews,
      uniqueVisitors: b.visitors.size,
      sessions: b.sessions.size,
    }));

    // Top pages
    const pageMap = new Map<string, { views: number; visitors: Set<string>; totalSecs: number; durSessions: number }>();
    for (const r of current.filter((r) => r.event_type === "pageview" && r.page_path)) {
      const p = r.page_path!;
      const e = pageMap.get(p) ?? { views: 0, visitors: new Set(), totalSecs: 0, durSessions: 0 };
      e.views++;
      if (r.visitor_id) e.visitors.add(r.visitor_id);
      pageMap.set(p, e);
    }
    for (const r of current.filter((r) => r.event_type === "page_duration" && r.page_path && r.duration_seconds)) {
      const e = pageMap.get(r.page_path!);
      if (!e) continue;
      e.totalSecs += r.duration_seconds ?? 0;
      e.durSessions++;
    }
    const topPages = [...pageMap.entries()]
      .map(([page_path, e]) => ({
        page_path,
        views: e.views,
        unique: e.visitors.size,
        avgSeconds: e.durSessions ? Math.round(e.totalSecs / e.durSessions) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Traffic sources (pageviews only, one entry per session)
    const sourceBySession = new Map<string, string>();
    for (const r of current.filter((r) => r.event_type === "pageview" && r.session_id)) {
      if (!sourceBySession.has(r.session_id!)) sourceBySession.set(r.session_id!, r.traffic_source || "Direct");
    }
    const sourceCounts = new Map<string, number>();
    for (const s of sourceBySession.values()) sourceCounts.set(s, (sourceCounts.get(s) ?? 0) + 1);
    const trafficSources = [...sourceCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Top blog posts
    const blogMap = new Map<string, number>();
    for (const r of current.filter((r) => r.event_type === "blog_post_read" && r.label)) {
      blogMap.set(r.label!, (blogMap.get(r.label!) ?? 0) + 1);
    }
    const topBlogPosts = [...blogMap.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Devices & browsers
    const devMap = new Map<string, number>();
    const brMap = new Map<string, number>();
    for (const r of current.filter((r) => r.event_type === "pageview")) {
      if (r.device_type) devMap.set(r.device_type, (devMap.get(r.device_type) ?? 0) + 1);
      if (r.browser) brMap.set(r.browser, (brMap.get(r.browser) ?? 0) + 1);
    }
    const devices = [...devMap.entries()].map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);
    const browsers = [...brMap.entries()].map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    // Live visitors — last 5 min
    const fiveMinAgo = new Date(now - 5 * 60_000).toISOString();
    const liveVisitors = new Set(
      current.filter((r) => r.event_type === "pageview" && r.created_at >= fiveMinAgo).map((r) => r.visitor_id).filter(Boolean),
    ).size;
    const recentVisits = current
      .filter((r) => r.event_type === "pageview" && r.page_path)
      .slice(0, 10)
      .map((r) => ({
        page_path: r.page_path!,
        created_at: r.created_at,
        device: r.device_type,
        source: r.traffic_source,
      }));

    // Event tracking (excluding pageview & page_duration)
    const evMap = new Map<string, { category: string | null; label: string | null; count: number; lastAt: string }>();
    for (const r of current) {
      if (r.event_type === "pageview" || r.event_type === "page_duration") continue;
      const key = `${r.event_type}|${r.category ?? ""}|${r.label ?? ""}`;
      const e = evMap.get(key);
      if (e) {
        e.count++;
        if (r.created_at > e.lastAt) e.lastAt = r.created_at;
      } else {
        evMap.set(key, { category: r.category, label: r.label, count: 1, lastAt: r.created_at });
      }
    }
    const events = [...evMap.entries()]
      .map(([key, e]) => ({ event_type: key.split("|")[0], ...e }))
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));

    // Campaigns
    const camps = new Map<string, { campaign: string; source: string; medium: string; sessions: Set<string> }>();
    for (const r of current.filter((r) => r.event_type === "pageview" && r.utm_campaign)) {
      const key = `${r.utm_campaign}|${r.utm_source ?? ""}|${r.utm_medium ?? ""}`;
      const e = camps.get(key) ?? {
        campaign: r.utm_campaign!,
        source: r.utm_source ?? "",
        medium: r.utm_medium ?? "",
        sessions: new Set<string>(),
      };
      if (r.session_id) e.sessions.add(r.session_id);
      camps.set(key, e);
    }
    const campaigns = [...camps.values()]
      .map((c) => ({ campaign: c.campaign, source: c.source, medium: c.medium, sessions: c.sessions.size }))
      .sort((a, b) => b.sessions - a.sessions);

    return {
      range: { from: fromIso, to: toIso, days },
      stats: {
        pageviews: cur.pageviews,
        uniqueVisitors: cur.uniqueVisitors,
        sessions: cur.sessions,
        bounceRate: cur.bounceRate,
        avgSessionSeconds: cur.avgSessionSeconds,
        pageviewsChange: percentChange(cur.pageviews, prev.pageviews),
        uniqueVisitorsChange: percentChange(cur.uniqueVisitors, prev.uniqueVisitors),
        sessionsChange: percentChange(cur.sessions, prev.sessions),
        bounceRateChange: percentChange(cur.bounceRate, prev.bounceRate),
        avgSessionSecondsChange: percentChange(cur.avgSessionSeconds, prev.avgSessionSeconds),
      },
      timeSeries,
      topPages,
      trafficSources,
      topBlogPosts,
      devices,
      browsers,
      liveVisitors,
      recentVisits,
      events,
      campaigns,
    };
  });
