import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useBlocker } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ExternalLink, History, Loader2, Undo2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldEditor } from "@/components/admin/cms/FieldEditor";
import { PreviewPane } from "@/components/admin/cms/PreviewPane";
import { supabase } from "@/integrations/supabase/client";
import {
  GLOBAL_KEY,
  SEO_SECTION_KEY,
  getPageDef,
  readValue,
  sectionsFor,
  type PageContent,
  type PageDef,
} from "@/lib/cms/registry";

export const Route = createFileRoute("/admin/content/$pageKey")({
  ssr: false,
  component: EditorRoute,
});

function EditorRoute() {
  const { pageKey } = Route.useParams();
  const def = getPageDef(pageKey);
  if (!def) {
    return (
      <AdminShell title="Content Editor">
        <p className="text-white/60">This page isn't editable.</p>
        <Link to="/admin/content" className="mt-4 inline-block text-[color:var(--gold)]">← Back to pages</Link>
      </AdminShell>
    );
  }
  return <PageEditor key={pageKey} def={def} />;
}

type Version = { id: string; version_number: number; published_by_name: string | null; created_at: string; content: PageContent };

function PageEditor({ def }: { def: PageDef }) {
  const sections = useMemo(() => sectionsFor(def), [def]);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState<PageContent>({});
  const [publishedMeta, setPublishedMeta] = useState<{ at: string; by: string | null } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [working, setWorking] = useState<PageContent>({});
  const [saved, setSaved] = useState<string>("{}");
  const [section, setSection] = useState(sections[0]?.key ?? "");
  const [busy, setBusy] = useState<null | "save" | "publish" | "discard">(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [tab, setTab] = useState<"sections" | "edit" | "preview">("edit");

  const load = useCallback(async () => {
    setLoading(true);
    const [p, d] = await Promise.all([
      supabase.from("site_content").select("*").eq("page_key", def.key).maybeSingle(),
      supabase.from("site_content_drafts").select("*").eq("page_key", def.key).maybeSingle(),
    ]);
    const pub = (p.data?.content ?? {}) as PageContent;
    const draft = d.data?.content as PageContent | undefined;
    setPublished(pub);
    setPublishedMeta(p.data ? { at: p.data.published_at, by: p.data.published_by_name } : null);
    setHasDraft(!!draft);
    const w = draft ?? pub;
    setWorking(w);
    setSaved(JSON.stringify(w));
    setLoading(false);
  }, [def.key]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = JSON.stringify(working) !== saved;
  useBlocker({
    shouldBlockFn: () => dirty && !confirm("You have unsaved changes. Leave without saving?"),
    enableBeforeUnload: dirty,
  });

  const value = (path: string) => readValue(def, working, path);
  const setValue = (path: string, v: unknown) => setWorking((w) => ({ ...w, [path]: v }));

  const previewPages = useMemo(() => ({ [def.key]: working }), [def.key, working]);
  const selectedId = `${def.key}.${section}`;
  const onSectionClick = useCallback(
    (id: string) => {
      const [pk, sk] = id.split(".");
      if (pk === def.key && sk) {
        setSection(sk);
        setTab("edit");
      } else if (pk === GLOBAL_KEY && def.key !== GLOBAL_KEY) {
        toast.info("That area is shared site-wide — edit it under Global Content.");
      }
    },
    [def.key],
  );

  async function saveDraft() {
    setBusy("save");
    const { data: u } = await supabase.auth.getUser();
    const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", u.user?.id ?? "").maybeSingle();
    const { error } = await supabase.from("site_content_drafts").upsert({
      page_key: def.key,
      content: working as never,
      updated_by: u.user?.id ?? null,
      updated_by_name: prof?.full_name ?? null,
      updated_at: new Date().toISOString(),
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    setSaved(JSON.stringify(working));
    setHasDraft(true);
    toast.success("Draft saved — not live yet.");
  }

  async function publish() {
    const msg =
      def.key === GLOBAL_KEY
        ? "Publish Global Content? This changes the header, footer and shared sections on EVERY page."
        : `Publish "${def.title}" to the live website?`;
    if (!confirm(msg)) return;
    setBusy("publish");
    const { data, error } = await supabase.rpc("cms_publish", { _page_key: def.key, _content: working as never });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Published (version ${data}). Live visitors will see it within a minute.`);
    await load();
  }

  async function discard() {
    if (!confirm("Discard all unpublished changes and go back to the live version?")) return;
    setBusy("discard");
    const { error } = await supabase.from("site_content_drafts").delete().eq("page_key", def.key);
    setBusy(null);
    if (error) return toast.error(error.message);
    setWorking(published);
    setSaved(JSON.stringify(published));
    setHasDraft(false);
    toast.success("Changes discarded.");
  }

  async function openHistory() {
    setHistoryOpen(true);
    const { data } = await supabase
      .from("site_content_versions")
      .select("id, version_number, published_by_name, created_at, content")
      .eq("page_key", def.key)
      .order("version_number", { ascending: false })
      .limit(50);
    setVersions((data ?? []) as Version[]);
  }

  const current = sections.find((s) => s.key === section) ?? sections[0];
  const status = dirty ? "Unsaved changes" : hasDraft ? "Draft saved" : publishedMeta ? "Live" : "Original content";

  const actions = (
    <>
      <span className={`mr-1 text-xs ${dirty ? "text-amber-300" : "text-white/40"}`}>{status}</span>
      <a href={def.path} target="_blank" rel="noreferrer"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/15 px-3 text-xs hover:bg-white/5">
        <ExternalLink className="h-3.5 w-3.5" /> View Live
      </a>
      <Button size="sm" variant="outline" onClick={openHistory} className="border-white/15 bg-transparent text-white hover:bg-white/10">
        <History className="h-3.5 w-3.5" /> History
      </Button>
      <Button size="sm" variant="outline" onClick={discard} disabled={!!busy || (!hasDraft && !dirty)}
        className="border-white/15 bg-transparent text-white hover:bg-white/10">
        <Undo2 className="h-3.5 w-3.5" /> Discard
      </Button>
      <Button size="sm" onClick={saveDraft} disabled={!!busy || !dirty} className="bg-white/10 text-white hover:bg-white/20">
        {busy === "save" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Draft
      </Button>
      <Button size="sm" onClick={publish} disabled={!!busy} className="bg-[color:var(--gold)] text-black hover:opacity-90">
        {busy === "publish" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Publish
      </Button>
    </>
  );

  return (
    <AdminShell title={`Editing: ${def.title}`} actions={actions} flush>
      {loading ? (
        <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-white/50" /></div>
      ) : (
        <div className="flex h-full flex-col">
          {/* Mobile / tablet tabs */}
          <div className="flex border-b border-white/10 lg:hidden">
            {(["sections", "edit", "preview"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider ${tab === t ? "border-b-2 border-[color:var(--gold)] text-white" : "text-white/50"}`}>
                {t === "sections" ? "Sections" : t === "edit" ? "Edit Content" : "Preview"}
              </button>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[220px_minmax(340px,1fr)_minmax(0,1.3fr)]">
            {/* Column 1 — sections */}
            <aside className={`${tab === "sections" ? "block" : "hidden"} min-h-0 overflow-y-auto rounded-xl border border-white/10 bg-[#0a1122] p-2 lg:block`}>
              <Link to="/admin/content" className="mb-2 flex items-center gap-1.5 px-2 py-1.5 text-xs text-white/50 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> All pages
              </Link>
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Page sections</p>
              {sections.map((s, i) => (
                <button key={s.key} onClick={() => { setSection(s.key); setTab("edit"); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                    s.key === section ? "bg-[color:var(--brand)] text-white" : "text-white/70 hover:bg-white/5"}`}>
                  <span className="w-5 text-xs text-white/40">{s.key === SEO_SECTION_KEY ? "★" : i + 1}</span>
                  {s.label}
                </button>
              ))}
            </aside>

            {/* Column 2 — fields */}
            <div className={`${tab === "edit" ? "block" : "hidden"} min-h-0 overflow-y-auto rounded-xl border border-white/10 bg-[#111a2e] p-5 lg:block`}>
              {def.key === GLOBAL_KEY && (
                <div className="mb-4 flex gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Changes here appear on every page of the website once published.
                </div>
              )}
              <h2 className="text-base font-semibold">{current?.label}</h2>
              {current?.key === SEO_SECTION_KEY && <SeoHelper def={def} value={value} />}
              <div className="mt-4 space-y-4">
                {current?.fields.map((f) => (
                  <FieldEditor key={`${current.key}.${f.key}`} field={f} value={value(`${current.key}.${f.key}`)}
                    onChange={(v) => setValue(`${current.key}.${f.key}`, v)} />
                ))}
              </div>
            </div>

            {/* Column 3 — preview */}
            <div className={`${tab === "preview" ? "block" : "hidden"} min-h-[60vh] lg:block lg:min-h-0`}>
              <PreviewPane path={def.path} pages={previewPages} selected={selectedId} onSectionClick={onSectionClick} />
            </div>
          </div>
        </div>
      )}

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg bg-[#111a2e] border-white/10 text-white">
          <DialogHeader><DialogTitle>Version history — {def.title}</DialogTitle></DialogHeader>
          {versions.length === 0 ? (
            <p className="py-6 text-sm text-white/50">No published versions yet. The page is showing its original content.</p>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-white/10 overflow-y-auto">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">Version {v.version_number}</p>
                    <p className="text-xs text-white/50">
                      {new Date(v.created_at).toLocaleString()} · {v.published_by_name ?? "Admin"} · Published
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10"
                    onClick={() => {
                      setWorking(v.content);
                      setHistoryOpen(false);
                      toast.info(`Version ${v.version_number} loaded into the editor. Check the preview, then Publish to restore it.`);
                    }}>
                    Preview & restore
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function SeoHelper({ def, value }: { def: PageDef; value: (p: string) => unknown }) {
  const title = (value("seo.title") as string) || def.title;
  const desc = (value("seo.description") as string) || "";
  const tl = title.length;
  const dl = desc.length;
  const hint = (n: number, lo: number, hi: number) =>
    n === 0 ? "text-white/40" : n < lo || n > hi ? "text-amber-300" : "text-emerald-300";
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg bg-white p-4 text-left">
        <p className="text-xs text-[#202124]">shimonkohn.com{def.path === "/" ? "" : def.path.replace(/\//g, " › ")}</p>
        <p className="mt-1 truncate text-lg leading-snug text-[#1a0dab]">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{desc || "Add a meta description to control this text."}</p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <span className={hint(tl, 30, 60)}>Title: {tl} chars (aim for 30–60)</span>
        <span className={hint(dl, 120, 160)}>Description: {dl} chars (aim for 120–160)</span>
      </div>
      <p className="text-xs text-white/40">
        Page address <span className="font-mono text-white/60">{def.path}</span> is locked to protect your search rankings.
      </p>
    </div>
  );
}
