import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft, Bold, Code2, Italic, Link2, List, ListOrdered, Loader2, Quote,
  Save, Send, Sparkles, Trash2, Wand2, X, Heading2, Heading3, Image as ImageIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { listCategories, type CategoryRow } from "@/lib/categories.functions";
import {
  getPost, createPost, updatePost,
  generatePostContent, generateCoverImage,
  type PostRow, type PostStatus,
} from "@/lib/posts.functions";
import { toast } from "sonner";

function slugify(v: string) {
  return v
    .toLowerCase().trim()
    .replace(/['"]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function calcReadTime(body: string): number {
  const text = body.replace(/[#*_>`\-\[\]()!]/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

type FormState = {
  title: string;
  slug: string;
  slugTouched: boolean;
  category_id: string;
  featured_image_url: string | null;
  featured_image_preview: string | null;
  body: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  meta_description: string;
  status: PostStatus;
  source: "manual" | "auto_generated";
  scheduled_at: string;
};

const emptyForm: FormState = {
  title: "", slug: "", slugTouched: false,
  category_id: "",
  featured_image_url: null, featured_image_preview: null,
  body: "", excerpt: "", tags: [], featured: false,
  meta_description: "",
  status: "draft", source: "manual",
  scheduled_at: "",
};

export function PostEditor({ postId }: { postId?: string }) {
  const navigate = useNavigate();
  const editing = !!postId;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [cats, setCats] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiWords, setAiWords] = useState(1500);
  const [aiCategory, setAiCategory] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const load = useServerFn(getPost);
  const loadCats = useServerFn(listCategories);
  const create = useServerFn(createPost);
  const update = useServerFn(updatePost);
  const aiGen = useServerFn(generatePostContent);
  const aiImg = useServerFn(generateCoverImage);

  useEffect(() => {
    (async () => {
      try {
        const c = await loadCats();
        setCats(c as CategoryRow[]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load categories");
      }
    })();
  }, []);

  useEffect(() => {
    if (!editing || !postId) return;
    (async () => {
      try {
        const p = (await load({ data: { id: postId } })) as PostRow | null;
        if (!p) { toast.error("Post not found"); navigate({ to: "/admin/posts" }); return; }
        setForm({
          title: p.title,
          slug: p.slug,
          slugTouched: true,
          category_id: p.category_id ?? "",
          featured_image_url: p.featured_image_url,
          featured_image_preview: p.featured_image_signed_url,
          body: p.body ?? "",
          excerpt: p.excerpt ?? "",
          tags: p.tags ?? [],
          featured: !!p.featured,
          meta_description: p.meta_description ?? "",
          status: p.status,
          source: p.source,
          scheduled_at: p.scheduled_at ? p.scheduled_at.slice(0, 16) : "",
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  function setName(title: string) {
    setForm((f) => ({ ...f, title, slug: f.slugTouched ? f.slug : slugify(title) }));
  }

  function insertAtCursor(before: string, after = "", placeholder = "") {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end) || placeholder;
    const next = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    setForm((f) => ({ ...f, body: next }));
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + before.length + selected.length;
      ta.setSelectionRange(cursor, cursor);
    });
  }

  const toolbar: { icon: any; label: string; run: () => void }[] = [
    { icon: Heading2, label: "H2", run: () => insertAtCursor("\n## ", "\n", "Heading") },
    { icon: Heading3, label: "H3", run: () => insertAtCursor("\n### ", "\n", "Heading") },
    { icon: Bold, label: "Bold", run: () => insertAtCursor("**", "**", "bold text") },
    { icon: Italic, label: "Italic", run: () => insertAtCursor("*", "*", "italic") },
    { icon: Quote, label: "Quote", run: () => insertAtCursor("\n> ", "\n", "Quote") },
    { icon: Link2, label: "Link", run: () => insertAtCursor("[", "](https://)", "link text") },
    { icon: List, label: "Bullet List", run: () => insertAtCursor("\n- ", "\n", "item") },
    { icon: ListOrdered, label: "Numbered List", run: () => insertAtCursor("\n1. ", "\n", "item") },
    { icon: Code2, label: "Code", run: () => insertAtCursor("`", "`", "code") },
  ];

  const metaLen = form.meta_description.length;
  const readMin = useMemo(() => calcReadTime(form.body), [form.body]);

  async function runAiGenerate() {
    if (!aiTopic.trim()) { toast.error("Enter a topic"); return; }
    const catId = aiCategory || form.category_id;
    if (!catId) { toast.error("Choose a category"); return; }
    const cat = cats.find((c) => c.id === catId);
    if (!cat) { toast.error("Category not found"); return; }
    setAiBusy(true);
    try {
      const out = (await aiGen({
        data: { topic: aiTopic.trim(), categoryName: cat.name, wordCount: aiWords },
      })) as { title: string; excerpt: string; meta_description: string; body: string };
      setForm((f) => ({
        ...f,
        title: out.title,
        slug: f.slugTouched ? f.slug : slugify(out.title),
        excerpt: out.excerpt,
        meta_description: out.meta_description,
        body: out.body,
        category_id: catId,
        source: "auto_generated",
      }));
      toast.success("AI content generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setAiBusy(false);
    }
  }

  async function runAiImage() {
    const promptText = form.title.trim() || aiTopic.trim();
    if (!promptText) { toast.error("Add a title or topic first"); return; }
    setImgBusy(true);
    try {
      const res = (await aiImg({ data: { prompt: promptText } })) as { path: string; signedUrl: string | null };
      setForm((f) => ({ ...f, featured_image_url: res.path, featured_image_preview: res.signedUrl }));
      toast.success("Cover image generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Image generation failed");
    } finally {
      setImgBusy(false);
    }
  }

  function addTag(raw: string) {
    const t = raw.trim().replace(/,+$/, "").toLowerCase();
    if (!t) return;
    setForm((f) => (f.tags.includes(t) ? f : { ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  function onTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && form.tags.length) {
      setForm((f) => ({ ...f, tags: f.tags.slice(0, -1) }));
    }
  }

  async function save(action: "draft" | "publish") {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    if (!form.category_id) { toast.error("Category is required"); return; }

    let status: PostStatus = "draft";
    let scheduled_at: string | null = null;
    if (action === "publish") {
      if (form.status === "scheduled") {
        if (!form.scheduled_at) { toast.error("Pick a scheduled date/time"); return; }
        status = "scheduled";
        scheduled_at = new Date(form.scheduled_at).toISOString();
      } else {
        status = "published";
      }
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category_id: form.category_id,
        featured_image_url: form.featured_image_url,
        body: form.body,
        excerpt: form.excerpt.trim() || null,
        tags: form.tags,
        featured: form.featured,
        meta_description: form.meta_description.trim() || null,
        status,
        source: form.source,
        scheduled_at,
      };
      if (editing && postId) {
        await update({ data: { id: postId, ...payload } });
        toast.success(
          status === "published" ? "Post published"
          : status === "scheduled" ? "Post scheduled"
          : "Draft saved",
        );
        setForm((f) => ({ ...f, status }));
      } else {
        const res = (await create({ data: payload })) as { id?: string };
        toast.success(
          status === "published" ? "Post published"
          : status === "scheduled" ? "Post scheduled"
          : "Draft saved",
        );
        if (res.id) navigate({ to: "/admin/posts/$id/edit", params: { id: res.id } });
        else navigate({ to: "/admin/posts" });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const cardCls = "rounded-xl border border-white/10 bg-[#111a2e] p-4";
  const inputCls = "bg-[#0b1220] border-white/10 text-white placeholder:text-white/30";

  return (
    <AdminShell title={editing ? "Edit Post" : "New Post"}>
      <div className="mb-4">
        <button
          onClick={() => navigate({ to: "/admin/posts" })}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Posts
        </button>
      </div>

      {loading ? (
        <div className="text-center text-white/50 py-20">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading post…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ============= MAIN COLUMN ============= */}
          <div className="space-y-5 min-w-0">
            {/* AI Generate Card */}
            <div className={`${cardCls} space-y-3`}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">AI Generate Content</h3>
              </div>
              <div>
                <Label className="text-white/70 text-xs">What should this post be about?</Label>
                <Input
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder='e.g. "Understanding DUI penalties in Colorado Springs"'
                  className={`mt-1 ${inputCls}`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/70 text-xs">Category</Label>
                  <Select value={aiCategory || form.category_id} onValueChange={(v) => setAiCategory(v)}>
                    <SelectTrigger className={`mt-1 ${inputCls}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                      {cats.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs">Target word count: <span className="text-white">{aiWords}</span></Label>
                  <input
                    type="range"
                    min={500}
                    max={3000}
                    step={100}
                    value={aiWords}
                    onChange={(e) => setAiWords(parseInt(e.target.value, 10))}
                    className="mt-3 w-full accent-[color:var(--brand)]"
                  />
                </div>
              </div>
              <Button
                onClick={runAiGenerate}
                disabled={aiBusy}
                className="w-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--gold)] text-white hover:opacity-90"
              >
                {aiBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Generate with AI →
              </Button>
            </div>

            {/* Title */}
            <div>
              <input
                value={form.title}
                onChange={(e) => setName(e.target.value)}
                placeholder="Post title"
                className="w-full bg-transparent border-0 border-b border-transparent focus:border-white/20 focus:outline-none text-white text-3xl font-bold placeholder:text-white/25 px-0 py-2"
              />
              <div className="mt-1 flex items-center gap-1 text-xs text-white/40 font-mono">
                <span className="text-white/50">shimonkohn.com/blog/</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value), slugTouched: true }))}
                  className="bg-transparent border-0 focus:outline-none text-[color:var(--gold)] flex-1"
                  placeholder="url-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short description used for post previews."
                className={`mt-1 resize-none ${inputCls}`}
              />
            </div>

            {/* Meta */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-white/70 text-xs uppercase tracking-wide">Meta Description</Label>
                <span className={`text-xs ${metaLen > 160 ? "text-[color:var(--crimson)]" : "text-white/40"}`}>
                  ({metaLen}/160)
                </span>
              </div>
              <Textarea
                rows={2}
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                placeholder="Short summary shown in search results."
                className={`mt-1 resize-none ${inputCls}`}
              />
            </div>

            {/* Body + toolbar */}
            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Body</Label>
              <div className="mt-1 rounded-lg border border-white/10 bg-[#0b1220] overflow-hidden">
                <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#111a2e] px-2 py-1.5">
                  {toolbar.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      title={b.label}
                      onClick={b.run}
                      className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
                    >
                      <b.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <Textarea
                  ref={bodyRef}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Write your post in markdown..."
                  className="min-h-[420px] bg-transparent border-0 rounded-none text-white placeholder:text-white/30 font-mono text-sm leading-relaxed focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* ============= SIDEBAR ============= */}
          <aside className="space-y-5">
            {/* Publish */}
            <div className={`${cardCls} space-y-3`}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Publish</h3>
              <div>
                <Label className="text-white/70 text-xs">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as PostStatus }))}
                >
                  <SelectTrigger className={`mt-1 ${inputCls}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.status === "scheduled" && (
                <div>
                  <Label className="text-white/70 text-xs">Publish date & time</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                    className={`mt-1 ${inputCls}`}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  onClick={() => save("draft")}
                  disabled={saving}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/5"
                >
                  <Save className="h-4 w-4 mr-1" /> Save Draft
                </Button>
                <Button
                  onClick={() => save("publish")}
                  disabled={saving}
                  className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  {form.status === "scheduled" ? "Schedule" : "Publish Now"}
                </Button>
              </div>
            </div>

            {/* Post Details */}
            <div className={`${cardCls} space-y-3`}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Post Details</h3>
              <div>
                <Label className="text-white/70 text-xs">Category *</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(v) => { setForm((f) => ({ ...f, category_id: v })); setAiCategory(v); }}
                >
                  <SelectTrigger className={`mt-1 ${inputCls}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                    {cats.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-xs">Tags</Label>
                <div className="mt-1 rounded-md border border-white/10 bg-[#0b1220] px-2 py-1.5 flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand)]/20 border border-[color:var(--brand)]/40 text-white/90 text-xs px-2 py-0.5"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}
                        className="hover:text-[color:var(--crimson)]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={onTagKey}
                    onBlur={() => tagInput && addTag(tagInput)}
                    placeholder={form.tags.length ? "" : "Add tag and press Enter"}
                    className="flex-1 min-w-[120px] bg-transparent border-0 text-white placeholder:text-white/30 text-sm focus:outline-none py-0.5"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                <Checkbox
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: !!v }))}
                  className="border-white/30"
                />
                Feature this post on blog homepage
              </label>
              <div className="text-xs text-white/50 pt-1 border-t border-white/10">
                ~{readMin} min read
              </div>
            </div>

            {/* Cover Image */}
            <div className={`${cardCls} space-y-3`}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Cover Image</h3>
              <Input
                value={form.featured_image_preview ?? ""}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  featured_image_preview: e.target.value || null,
                  featured_image_url: e.target.value || null,
                }))}
                placeholder="https://..."
                className={inputCls}
              />
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0b1220] aspect-video flex items-center justify-center">
                {form.featured_image_preview ? (
                  <img src={form.featured_image_preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/40 text-xs flex flex-col items-center gap-1">
                    <ImageIcon className="h-6 w-6" />
                    No image
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={runAiImage}
                  disabled={imgBusy}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5"
                >
                  {imgBusy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                  Regenerate with AI
                </Button>
                {form.featured_image_preview && (
                  <Button
                    onClick={() => setForm((f) => ({ ...f, featured_image_url: null, featured_image_preview: null }))}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/20 text-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-white/40">Image will be saved when you save the post.</p>
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  );
}
