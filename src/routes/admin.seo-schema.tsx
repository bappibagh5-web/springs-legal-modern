import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  RefreshCw, Sparkles, Eye, Pencil, ExternalLink, Check, X,
  ShieldCheck, Search, AlertTriangle, Save, Loader2, Code2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getSeoOverview, listPostsSeo, updatePostSeo, generatePostSchema, regenerateAllSchema,
  listPracticeAreas, upsertPracticeArea, getGlobalSchema, updateGlobalSchema, runSchemaAudit,
  computeSeoScore,
  type SeoPostRow, type SeoOverview, type PracticeAreaRow, type GlobalSchemaRow,
} from "@/lib/seo.functions";

export const Route = createFileRoute("/admin/seo-schema")({
  ssr: false,
  component: SeoSchemaPage,
});

const SITE_URL = "https://shimonkohn.com";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-white/10 bg-[#0a1122] p-5 ${className}`}>{children}</div>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full bg-[color:var(--brand)]" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "green" | "red" | "amber" | "blue" }) {
  const toneMap: Record<string, string> = {
    muted: "bg-white/10 text-white/70",
    green: "bg-emerald-500/15 text-emerald-300",
    red: "bg-rose-500/15 text-rose-300",
    amber: "bg-amber-500/15 text-amber-300",
    blue: "bg-sky-500/15 text-sky-300",
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${toneMap[tone]}`}>{children}</span>;
}

function SeoSchemaPage() {
  const [overview, setOverview] = useState<SeoOverview | null>(null);
  const [posts, setPosts] = useState<SeoPostRow[]>([]);
  const [pages, setPages] = useState<PracticeAreaRow[]>([]);
  const [biz, setBiz] = useState<GlobalSchemaRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SeoPostRow | null>(null);
  const [previewJson, setPreviewJson] = useState<{ title: string; json: any } | null>(null);
  const [busy, setBusy] = useState(false);
  const [audit, setAudit] = useState<{ issues: any[]; checkedAt: string } | null>(null);

  const fOverview = useServerFn(getSeoOverview);
  const fList = useServerFn(listPostsSeo);
  const fPages = useServerFn(listPracticeAreas);
  const fBiz = useServerFn(getGlobalSchema);
  const fGen = useServerFn(generatePostSchema);
  const fRegen = useServerFn(regenerateAllSchema);
  const fAudit = useServerFn(runSchemaAudit);

  async function refresh() {
    setLoading(true);
    try {
      const [o, p, pa, b] = await Promise.all([fOverview(), fList(), fPages(), fBiz()]);
      setOverview(o as SeoOverview);
      setPosts(p as SeoPostRow[]);
      setPages(pa as PracticeAreaRow[]);
      setBiz(b as GlobalSchemaRow);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  async function handleGenerate(id: string) {
    setBusy(true);
    try {
      await fGen({ data: { id } });
      toast.success("Schema generated");
      await refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }
  async function handleRegenAll(onlyMissing: boolean) {
    setBusy(true);
    try {
      const r = await fRegen({ data: { onlyMissing } });
      toast.success(`Updated ${(r as any).updated} posts`);
      await refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }
  async function handleAudit() {
    setBusy(true);
    try {
      const r = await fAudit();
      setAudit(r as any);
      toast.success(`Audit complete — ${(r as any).issues.length} issues`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  }

  return (
    <AdminShell title="SEO & Schema">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="text-xs uppercase tracking-wider text-white/50">Posts with Schema</div>
          <div className="mt-2 text-3xl font-semibold text-white">
            {overview ? `${overview.withSchema}/${overview.totalPublished}` : "—"}
          </div>
          <ProgressBar value={overview?.withSchema ?? 0} max={overview?.totalPublished || 1} />
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-white/50">Missing Schema</div>
          <div className="mt-2 text-3xl font-semibold text-amber-300">{overview?.missingSchema ?? 0}</div>
          <div className="mt-2 text-xs text-white/50">Need attention</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-white/50">Meta Tags Coverage</div>
          <div className="mt-2 text-3xl font-semibold text-white">
            {overview ? `${overview.metaComplete}/${overview.totalPublished}` : "—"}
          </div>
          <ProgressBar value={overview?.metaComplete ?? 0} max={overview?.totalPublished || 1} />
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-white/50">Schema Types Active</div>
          <div className="mt-2 text-3xl font-semibold text-white">{overview?.activeSchemaTypes.length ?? 0} types</div>
          <div className="mt-2 text-xs text-white/50">{overview?.activeSchemaTypes.join(", ")}</div>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="posts">
          <TabsList className="bg-[#0a1122] border border-white/10">
            <TabsTrigger value="posts">Blog Posts SEO</TabsTrigger>
            <TabsTrigger value="areas">Practice Area Pages SEO</TabsTrigger>
            <TabsTrigger value="global">Global Schema</TabsTrigger>
          </TabsList>

          {/* --- Tab 1: Posts --- */}
          <TabsContent value="posts" className="mt-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <Button onClick={() => handleRegenAll(true)} disabled={busy} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
                <Sparkles className="h-4 w-4 mr-2" /> Generate All Missing Schema
              </Button>
              <Button onClick={() => handleRegenAll(false)} disabled={busy} variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5">
                <RefreshCw className="h-4 w-4 mr-2" /> Regenerate All Schema
              </Button>
            </div>
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-white/50">
                    <tr>
                      <th className="px-4 py-3">Cover</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Schema</th>
                      <th className="px-4 py-3">Meta Desc</th>
                      <th className="px-4 py-3">OG</th>
                      <th className="px-4 py-3">Keywords</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading && <tr><td colSpan={7} className="p-6 text-center text-white/50">Loading…</td></tr>}
                    {!loading && posts.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-white/50">No posts yet</td></tr>}
                    {posts.map((p) => {
                      const descLen = p.meta_description?.length ?? 0;
                      const descOk = descLen >= 120 && descLen <= 160;
                      const ogOk = !!p.og_image_url;
                      const kwCount = (p.seo_tags?.length ?? 0) + (p.tags?.length ?? 0);
                      return (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            {p.featured_image_signed_url ? (
                              <img src={p.featured_image_signed_url} alt="" className="h-10 w-14 rounded object-cover" />
                            ) : <div className="h-10 w-14 rounded bg-white/5" />}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{p.title}</div>
                            <div className="text-xs text-white/40">/blog/{p.slug} · Score {p.seo_score}</div>
                          </td>
                          <td className="px-4 py-3">
                            {p.schema_generated ? <Badge tone="green"><Check className="h-3 w-3"/>Generated</Badge> : <Badge tone="red"><X className="h-3 w-3"/>Missing</Badge>}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone={descOk ? "green" : descLen === 0 ? "red" : "amber"}>{descLen} chars</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {ogOk ? <Badge tone="green">Complete</Badge> : <Badge tone="amber">Incomplete</Badge>}
                          </td>
                          <td className="px-4 py-3"><Badge tone="blue">{kwCount} tags</Badge></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button title="Preview schema" onClick={() => setPreviewJson({ title: p.title, json: p })} className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><Eye className="h-4 w-4"/></button>
                              <button title="Regenerate schema" onClick={() => handleGenerate(p.id)} disabled={busy} className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><RefreshCw className="h-4 w-4"/></button>
                              <button title="Edit SEO" onClick={() => setEditing(p)} className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><Pencil className="h-4 w-4"/></button>
                              <a title="View live" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4 w-4"/></a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* --- Tab 2: Practice Areas --- */}
          <TabsContent value="areas" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pages.map((pg) => (
                <PracticeAreaCard key={pg.id} row={pg} onSaved={refresh} onView={(j) => setPreviewJson({ title: pg.page_name, json: j })} />
              ))}
              {pages.length === 0 && !loading && (
                <div className="col-span-full text-center text-white/50 py-10">No practice area pages configured</div>
              )}
            </div>
          </TabsContent>

          {/* --- Tab 3: Global Schema --- */}
          <TabsContent value="global" className="mt-4 space-y-4">
            <GlobalSchemaTab biz={biz} onSaved={refresh} onView={(j, t) => setPreviewJson({ title: t, json: j })} />
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]"/><span className="font-medium">Schema Health Check</span></div>
                  <div className="text-xs text-white/50 mt-1">Scan all posts and practice pages for missing or malformed schema.</div>
                </div>
                <Button onClick={handleAudit} disabled={busy} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
                  {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Search className="h-4 w-4 mr-2"/>} Run Full Schema Audit
                </Button>
              </div>
              {audit && (
                <div className="mt-4">
                  <div className="text-xs text-white/50 mb-2">Checked {new Date(audit.checkedAt).toLocaleString()} · {audit.issues.length} issues</div>
                  {audit.issues.length === 0 ? (
                    <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300">All schemas look healthy.</div>
                  ) : (
                    <ul className="space-y-1.5">
                      {audit.issues.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2 rounded-lg bg-white/[0.03] p-2.5 text-sm text-white/80">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-300"/>
                          <span><span className="text-white/50 mr-2">[{i.kind}]</span>{i.label} — {i.problem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {editing && (
        <EditSeoDialog post={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await refresh(); }} />
      )}
      {previewJson && (
        <Dialog open onOpenChange={() => setPreviewJson(null)}>
          <DialogContent className="max-w-2xl bg-[#0a1122] border-white/10 text-white">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Code2 className="h-4 w-4"/>{previewJson.title}</DialogTitle></DialogHeader>
            <pre className="max-h-[60vh] overflow-auto rounded-lg bg-black/40 p-4 text-xs text-emerald-200">
{JSON.stringify(previewJson.json, null, 2)}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </AdminShell>
  );
}

// ============ Edit SEO Dialog ============

function EditSeoDialog({ post, onClose, onSaved }: { post: SeoPostRow; onClose: () => void; onSaved: () => void }) {
  const [seoTitle, setSeoTitle] = useState(post.seo_title ?? post.title);
  const [metaDesc, setMetaDesc] = useState(post.meta_description ?? "");
  const [kw, setKw] = useState(post.focus_keyword ?? "");
  const [tagsStr, setTagsStr] = useState((post.seo_tags?.length ? post.seo_tags : post.tags).join(", "));
  const [ogImg, setOgImg] = useState(post.og_image_url ?? "");
  const [canonical, setCanonical] = useState(post.canonical_url ?? `${SITE_URL}/blog/${post.slug}`);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(updatePostSeo);

  const seoTags = tagsStr.split(",").map((s) => s.trim()).filter(Boolean);
  const { score, checks } = useMemo(() => computeSeoScore({
    seo_title: seoTitle, meta_description: metaDesc, focus_keyword: kw,
    featured_image_url: post.featured_image_url, tags: post.tags, seo_tags: seoTags,
    schema_generated: post.schema_generated, title: post.title,
  }), [seoTitle, metaDesc, kw, tagsStr, post]);

  const titleLen = seoTitle.length;
  const descLen = metaDesc.length;
  const titleOk = titleLen > 0 && titleLen <= 60;
  const descOk = descLen >= 120 && descLen <= 160;

  async function handleSave() {
    setSaving(true);
    try {
      await save({ data: {
        id: post.id, seo_title: seoTitle, meta_description: metaDesc, focus_keyword: kw,
        seo_tags: seoTags, og_image_url: ogImg || null, canonical_url: canonical || null,
      }});
      toast.success("SEO settings saved");
      onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0a1122] border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit SEO — {post.title}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between"><Label>SEO Title</Label><span className={`text-xs ${titleOk ? "text-emerald-300" : "text-amber-300"}`}>{titleLen}/60</span></div>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
            </div>
            <div>
              <div className="flex items-center justify-between"><Label>Meta Description</Label><span className={`text-xs ${descOk ? "text-emerald-300" : "text-amber-300"}`}>{descLen}/160</span></div>
              <Textarea rows={4} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
            </div>
            <div>
              <Label>Focus Keyword</Label>
              <Input value={kw} onChange={(e) => setKw(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input value={ogImg} onChange={(e) => setOgImg(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
              {ogImg && <img src={ogImg} alt="og preview" className="mt-2 max-h-32 rounded border border-white/10"/>}
            </div>
            <div>
              <Label>Canonical URL</Label>
              <Input value={canonical} onChange={(e) => setCanonical(e.target.value)} className="bg-white/5 border-white/10 text-white"/>
            </div>
          </div>
          <div>
            <Card className="bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50">SEO Score</div>
                  <div className="text-3xl font-semibold mt-1">{score}<span className="text-base text-white/40">/100</span></div>
                </div>
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-sm font-semibold ${score >= 80 ? "bg-emerald-500/20 text-emerald-300" : score >= 50 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>{score}</div>
              </div>
              <ProgressBar value={score} max={100}/>
              <ul className="mt-4 space-y-2">
                {checks.map((c) => (
                  <li key={c.key} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {c.pass ? <Check className="h-4 w-4 text-emerald-300"/> : <X className="h-4 w-4 text-rose-300"/>}
                      <span className={c.pass ? "text-white/90" : "text-white/60"}>{c.label}</span>
                    </span>
                    <span className="text-xs text-white/40">+{c.pts}pts</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-white/70 hover:bg-white/5">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>} Save SEO Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ Practice Area Card ============

function PracticeAreaCard({ row, onSaved, onView }: { row: PracticeAreaRow; onSaved: () => void; onView: (json: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.page_name);
  const [path, setPath] = useState(row.url_path);
  const [title, setTitle] = useState(row.title_tag ?? "");
  const [desc, setDesc] = useState(row.meta_description ?? "");
  const [ogOk, setOgOk] = useState(row.og_tags_complete);
  const [active, setActive] = useState(row.schema_active);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(upsertPracticeArea);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: row.page_name,
    url: `${SITE_URL}${row.url_path}`,
    provider: { "@type": "LawFirm", name: "The Kohn Law Firm" },
    areaServed: "Colorado Springs, CO",
  };
  const breadcrumb = ["Kohn Law Firm", "Practice Areas", row.page_name].join(" › ");

  async function handleSave() {
    setSaving(true);
    try {
      await save({ data: {
        id: row.id, page_name: name, url_path: path, title_tag: title || null,
        meta_description: desc || null, og_tags_complete: ogOk, schema_active: active,
      }});
      toast.success("Saved");
      setEditing(false); onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold text-white">{row.page_name}</div>
          <div className="text-xs text-white/40">{row.url_path}</div>
        </div>
        <Badge tone={active ? "green" : "amber"}>{active ? "Active" : "Off"}</Badge>
      </div>
      <div className="mt-3 text-xs text-white/50">{breadcrumb}</div>
      <ul className="mt-4 space-y-1.5 text-sm">
        {[
          { label: "LegalService schema", ok: active },
          { label: "LocalBusiness schema", ok: true },
          { label: "BreadcrumbList", ok: true },
          { label: "Title tag set", ok: !!row.title_tag },
          { label: "Meta description set", ok: !!row.meta_description },
          { label: "OG tags set", ok: row.og_tags_complete },
        ].map((c, i) => (
          <li key={i} className="flex items-center gap-2 text-white/80">
            {c.ok ? <Check className="h-4 w-4 text-emerald-300"/> : <X className="h-4 w-4 text-rose-300"/>}
            {c.label}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5" onClick={() => onView(schema)}>View Schema</Button>
        <a href={row.url_path} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5"><ExternalLink className="h-3 w-3 mr-1"/>Test Page</Button>
        </a>
        <Button size="sm" variant="ghost" className="text-white/70 hover:bg-white/5" onClick={() => setEditing((v) => !v)}>{editing ? "Cancel" : "Edit"}</Button>
      </div>
      {editing && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} className="bg-white/5 border-white/10 text-white"/></div>
            <div><Label>URL Path</Label><Input value={path} onChange={(e)=>setPath(e.target.value)} className="bg-white/5 border-white/10 text-white"/></div>
          </div>
          <div><Label>Title Tag</Label><Input value={title} onChange={(e)=>setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white"/></div>
          <div><Label>Meta Description</Label><Textarea rows={3} value={desc} onChange={(e)=>setDesc(e.target.value)} className="bg-white/5 border-white/10 text-white"/></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={active} onChange={(e)=>setActive(e.target.checked)}/> Schema active</label>
            <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={ogOk} onChange={(e)=>setOgOk(e.target.checked)}/> OG tags complete</label>
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}Save
          </Button>
        </div>
      )}
    </Card>
  );
}

// ============ Global Schema Tab ============

function GlobalSchemaTab({ biz, onSaved, onView }: { biz: GlobalSchemaRow | null; onSaved: () => void; onView: (json: any, title: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<GlobalSchemaRow | null>(biz);
  const save = useServerFn(updateGlobalSchema);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(biz), [biz]);
  if (!biz || !form) return <Card><div className="text-white/50 text-sm">Loading business details…</div></Card>;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": biz.business_type || "LawFirm",
    name: biz.business_name,
    url: biz.website_url,
    telephone: biz.phone,
    email: biz.email,
    image: biz.logo_url,
    address: {
      "@type": "PostalAddress",
      streetAddress: biz.address_street,
      addressLocality: biz.address_city,
      addressRegion: biz.address_region,
      postalCode: biz.address_postal_code,
      addressCountry: biz.address_country,
    },
    areaServed: biz.service_area,
    knowsAbout: biz.practice_areas,
    openingHoursSpecification: (biz.hours ?? []).map((h) => ({
      "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.opens, closes: h.closes,
    })),
    sameAs: biz.social_links,
  };
  const organization = {
    "@context": "https://schema.org", "@type": "Organization",
    name: biz.business_name, url: biz.website_url, logo: biz.logo_url,
    description: biz.organization_description, sameAs: biz.social_links,
  };
  const website = {
    "@context": "https://schema.org", "@type": "WebSite",
    name: biz.business_name, url: biz.website_url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${biz.website_url}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = form as any;
      await save({ data: rest });
      toast.success("Business details saved");
      setEditing(false); onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-white font-semibold">LocalBusiness Schema</div>
            <Badge tone="green">Active · {biz.business_type}</Badge>
          </div>
          <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5" onClick={() => onView(localBusiness, "LocalBusiness Schema")}>View JSON-LD</Button>
        </div>
        <div className="mt-2 text-xs text-white/50">{biz.business_name} · {biz.website_url} · {biz.practice_areas.length} practice areas</div>
        <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-black/40 p-3 text-[11px] text-emerald-200">{JSON.stringify(localBusiness, null, 2)}</pre>
        <div className="mt-3">
          <Button size="sm" onClick={() => setEditing((v) => !v)} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">{editing ? "Close" : "Edit Business Details"}</Button>
        </div>
        {editing && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Business Name</Label><Input value={form.business_name} onChange={(e)=>setForm({...form, business_name: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Business Type</Label><Input value={form.business_type} onChange={(e)=>setForm({...form, business_type: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e)=>setForm({...form, phone: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Email</Label><Input value={form.email ?? ""} onChange={(e)=>setForm({...form, email: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Street</Label><Input value={form.address_street ?? ""} onChange={(e)=>setForm({...form, address_street: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>City</Label><Input value={form.address_city ?? ""} onChange={(e)=>setForm({...form, address_city: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Region</Label><Input value={form.address_region ?? ""} onChange={(e)=>setForm({...form, address_region: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Postal Code</Label><Input value={form.address_postal_code ?? ""} onChange={(e)=>setForm({...form, address_postal_code: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Website URL</Label><Input value={form.website_url ?? ""} onChange={(e)=>setForm({...form, website_url: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label>Logo URL</Label><Input value={form.logo_url ?? ""} onChange={(e)=>setForm({...form, logo_url: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
            </div>
            <div><Label>Description</Label><Textarea rows={2} value={form.organization_description ?? ""} onChange={(e)=>setForm({...form, organization_description: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
            <div><Label>Service Area (comma-separated)</Label><Input value={form.service_area.join(", ")} onChange={(e)=>setForm({...form, service_area: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="bg-white/5 border-white/10 text-white"/></div>
            <div><Label>Practice Areas (comma-separated)</Label><Input value={form.practice_areas.join(", ")} onChange={(e)=>setForm({...form, practice_areas: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="bg-white/5 border-white/10 text-white"/></div>
            <div><Label>Social Links (comma-separated URLs)</Label><Input value={form.social_links.join(", ")} onChange={(e)=>setForm({...form, social_links: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="bg-white/5 border-white/10 text-white"/></div>
            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}Save
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="text-white font-semibold">Organization Schema</div><Badge tone="green">Active</Badge></div>
          <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5" onClick={() => onView(organization, "Organization Schema")}>View JSON-LD</Button>
        </div>
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-black/40 p-3 text-[11px] text-emerald-200">{JSON.stringify(organization, null, 2)}</pre>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="text-white font-semibold">WebSite Schema</div><Badge tone="green">Active · Sitelinks Search</Badge></div>
          <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5" onClick={() => onView(website, "WebSite Schema")}>View JSON-LD</Button>
        </div>
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-black/40 p-3 text-[11px] text-emerald-200">{JSON.stringify(website, null, 2)}</pre>
      </Card>
    </div>
  );
}
