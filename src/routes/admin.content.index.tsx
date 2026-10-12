import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Globe, Images, Pencil, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CMS_PAGES, GLOBAL_KEY, type PageGroup } from "@/lib/cms/registry";

export const Route = createFileRoute("/admin/content/")({
  ssr: false,
  component: ContentIndex,
});

const GROUPS: PageGroup[] = ["Home", "Practice Areas", "Service Pages", "Company Pages"];

type Status = { published_at?: string; draft_at?: string };

function ContentIndex() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<PageGroup | "All">("All");
  const [status, setStatus] = useState<Record<string, Status>>({});

  useEffect(() => {
    void (async () => {
      const [p, d] = await Promise.all([
        supabase.from("site_content").select("page_key, published_at"),
        supabase.from("site_content_drafts").select("page_key, updated_at"),
      ]);
      const s: Record<string, Status> = {};
      for (const r of p.data ?? []) s[r.page_key] = { ...s[r.page_key], published_at: r.published_at };
      for (const r of d.data ?? []) s[r.page_key] = { ...s[r.page_key], draft_at: r.updated_at };
      setStatus(s);
    })();
  }, []);

  const pages = useMemo(
    () =>
      CMS_PAGES.filter(
        (p) =>
          p.key !== GLOBAL_KEY &&
          (group === "All" || p.group === group) &&
          (p.title + " " + p.path).toLowerCase().includes(q.toLowerCase()),
      ),
    [q, group],
  );

  return (
    <AdminShell title="Content Editor">
      <div className="max-w-6xl">
        <p className="max-w-2xl text-sm text-white/60">
          Manage your website content, images, and search engine information in one place. Preview your changes
          before publishing them live.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/admin/content/$pageKey" params={{ pageKey: "home" }}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[color:var(--gold)] px-5 text-sm font-semibold text-black hover:opacity-90">
            <Pencil className="h-4 w-4" /> Edit Home Page
          </Link>
          <Link to="/admin/content/$pageKey" params={{ pageKey: GLOBAL_KEY }}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-medium hover:bg-white/5">
            <Globe className="h-4 w-4" /> Global Content
          </Link>
          <Link to="/admin/media"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-medium hover:bg-white/5">
            <Images className="h-4 w-4" /> Media Library
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages"
              className="pl-9 bg-[#111a2e] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-[#111a2e] p-1">
            {(["All", ...GROUPS] as const).map((g) => (
              <button key={g} onClick={() => setGroup(g)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${group === g ? "bg-[color:var(--brand)] text-white" : "text-white/60 hover:text-white"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {GROUPS.map((g) => {
          const list = pages.filter((p) => p.group === g);
          if (!list.length) return null;
          return (
            <section key={g} className="mt-10">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{g}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p) => {
                  const st = status[p.key];
                  const badge = st?.draft_at ? "DRAFT" : "LIVE";
                  const updated = st?.draft_at ?? st?.published_at;
                  return (
                    <Link key={p.key} to="/admin/content/$pageKey" params={{ pageKey: p.key }}
                      className="group rounded-2xl border border-white/10 bg-[#111a2e] p-5 transition-colors hover:border-[color:var(--gold)]">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-white">{p.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                          badge === "LIVE" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                          {badge}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-white/40">{p.path}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                        <span className="inline-flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" /> {p.sections.length} editable sections + SEO
                        </span>
                        <span>{updated ? new Date(updated).toLocaleDateString() : "Original"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
