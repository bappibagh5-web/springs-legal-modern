// Client-side analytics tracker. Runs only in the browser.
// Never imported from server code paths.
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "klf_visitor_id";
const SESSION_KEY = "klf_session";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min inactivity

type SessionData = { id: string; lastActive: number };

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function getSessionId(): string {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionData;
      if (parsed?.id && now - parsed.lastActive < SESSION_TIMEOUT_MS) {
        parsed.lastActive = now;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        return parsed.id;
      }
    }
    const fresh: SessionData = { id: uuid(), lastActive: now };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
    return fresh.id;
  } catch {
    return "no-session";
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  return "Other";
}

function classifyTrafficSource(referrer: string, utmSource: string | null): string {
  if (utmSource) {
    const s = utmSource.toLowerCase();
    if (/(facebook|twitter|instagram|linkedin|tiktok|youtube|x\.com|social)/.test(s)) return "Social Media";
    if (/(google|bing|yahoo|duckduckgo|organic)/.test(s)) return "Organic Search";
    return "Referral";
  }
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host === window.location.hostname) return "Direct";
    if (/(google\.|bing\.|yahoo\.|duckduckgo\.|baidu\.|yandex\.)/.test(host)) return "Organic Search";
    if (/(facebook\.|twitter\.|x\.com|instagram\.|linkedin\.|t\.co|tiktok\.|youtube\.|pinterest\.|reddit\.)/.test(host))
      return "Social Media";
    return "Referral";
  } catch {
    return "Direct";
  }
}

type BaseCtx = {
  session_id: string;
  visitor_id: string;
  device_type: string;
  browser: string;
  page_path: string;
  referrer: string | null;
  traffic_source: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
};

function buildContext(): BaseCtx {
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get("utm_source");
  const utm_medium = params.get("utm_medium");
  const utm_campaign = params.get("utm_campaign");
  const referrer = document.referrer || null;
  return {
    session_id: getSessionId(),
    visitor_id: getVisitorId(),
    device_type: getDeviceType(),
    browser: getBrowser(),
    page_path: window.location.pathname,
    referrer,
    traffic_source: classifyTrafficSource(referrer ?? "", utm_source),
    utm_campaign,
    utm_source,
    utm_medium,
  };
}

async function insertEvent(row: Record<string, unknown>) {
  try {
    await supabase.from("analytics_events").insert(row as never);
  } catch (err) {
    // Silent — analytics must never break the site
    console.debug("[analytics] insert failed", err);
  }
}

let currentPagePath: string | null = null;
let pageStartTime = 0;

async function flushPageDuration() {
  if (!currentPagePath || !pageStartTime) return;
  const duration = Math.round((Date.now() - pageStartTime) / 1000);
  if (duration < 1) return;
  const ctx = buildContext();
  const body = JSON.stringify({
    event_type: "page_duration",
    page_path: currentPagePath,
    session_id: ctx.session_id,
    visitor_id: ctx.visitor_id,
    device_type: ctx.device_type,
    browser: ctx.browser,
    duration_seconds: duration,
  });
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/analytics_events`;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      // sendBeacon can't set headers; fall back to fetch keepalive with headers
      void blob;
    }
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        Prefer: "return=minimal",
      },
      body,
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

export function trackPageview() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  // Flush previous page duration on client-side navigation
  if (currentPagePath && currentPagePath !== window.location.pathname) {
    void flushPageDuration();
  }
  currentPagePath = window.location.pathname;
  pageStartTime = Date.now();

  const ctx = buildContext();
  void insertEvent({
    event_type: "pageview",
    category: null,
    label: null,
    ...ctx,
  });
}

export function trackEvent(eventName: string, category?: string, label?: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  const ctx = buildContext();
  void insertEvent({
    event_type: eventName,
    category: category ?? null,
    label: label ?? null,
    ...ctx,
  });
}

let installed = false;
export function installAnalytics() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  (window as unknown as { trackEvent: typeof trackEvent }).trackEvent = trackEvent;
  window.addEventListener("beforeunload", () => {
    void flushPageDuration();
  });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flushPageDuration();
  });
}

declare global {
  interface Window {
    trackEvent?: (name: string, category?: string, label?: string) => void;
  }
}
