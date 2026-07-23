import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Image as ImageIcon, Loader2, Save, Send, Trash2, Upload } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { listCategories, type CategoryRow } from "@/lib/categories.functions";
import {
  getPost, createPost, updatePost, uploadPostImage, type PostRow,
} from "@/lib/posts.functions";
import { toast } from "sonner";

function slugify(v: string) {
  return v
    .toLowerCase().trim()
    .replace(/['"]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileToBase64(file: File): Promise<{ dataBase64: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const b64 = result.split(",")[1] ?? "";
      resolve({ dataBase64: b64, contentType: file.type || "application/octet-stream" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type FormState = {
  title: string;
  slug: string;
  slugTouched: boolean;
  category_id: string;
  featured_image_url: string | null;
  featured_image_preview: string | null;
  body: string;
  meta_description: string;
  status: "draft" | "published";
  source: "manual" | "auto_generated";
  scheduled_at: string;
};

const emptyForm: FormState = {
  title: "", slug: "", slugTouched: false,
  category_id: "",
  featured_image_url: null, featured_image_preview: null,
  body: "", meta_description: "",
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
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useServerFn(getPost);
  const loadCats = useServerFn(listCategories);
  const create = useServerFn(createPost);
  const update = useServerFn(updatePost);
  const upload = useServerFn(uploadPostImage);

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

  async function handleUpload(file: File): Promise<string | null> {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB");
      return null;
    }
    setUploading(true);
    try {
      const { dataBase64, contentType } = await fileToBase64(file);
      const res = (await upload({ data: { filename: file.name, contentType, dataBase64 } })) as { path: string; signedUrl: string | null };
      return res.signedUrl ? JSON.stringify({ path: res.path, url: res.signedUrl }) : null;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function onFeaturedFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const payload = await handleUpload(file);
    if (!payload) return;
    const { path, url } = JSON.parse(payload);
    setForm((f) => ({ ...f, featured_image_url: path, featured_image_preview: url }));
  }

  async function onEmbedImage(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const payload = await handleUpload(file);
        if (!payload) return resolve(null);
        const { url } = JSON.parse(payload);
        resolve(url);
      };
      input.click();
    });
  }

  const metaLen = form.meta_description.length;

  async function save(nextStatus: "draft" | "published") {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    if (!form.category_id) { toast.error("Category is required"); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category_id: form.category_id,
        featured_image_url: form.featured_image_url,
        body: form.body,
        meta_description: form.meta_description.trim() || null,
        status: nextStatus,
        source: form.source,
        scheduled_at: nextStatus === "published" && form.scheduled_at
          ? new Date(form.scheduled_at).toISOString()
          : null,
      };
      if (editing && postId) {
        await update({ data: { id: postId, ...payload } });
        toast.success(nextStatus === "published" ? "Post published" : "Draft saved");
        setForm((f) => ({ ...f, status: nextStatus }));
      } else {
        const res = (await create({ data: payload })) as { id?: string };
        toast.success(nextStatus === "published" ? "Post published" : "Draft saved");
        if (res.id) navigate({ to: "/admin/posts/$id/edit", params: { id: res.id } });
        else navigate({ to: "/admin/posts" });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setName(e.target.value)}
                placeholder="Post title"
                className="mt-1 text-lg font-semibold bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 h-12"
              />
            </div>

            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, slugTouched: true }))}
                placeholder="my-post-slug"
                className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 font-mono text-sm"
              />
            </div>

            <div>
              <Label className="text-white/70 text-xs uppercase tracking-wide">Body *</Label>
              <div className="mt-1">
                <RichTextEditor
                  value={form.body}
                  onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                  onEmbedImage={onEmbedImage}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-white/70 text-xs uppercase tracking-wide">Meta Description</Label>
                <span className={`text-xs ${metaLen > 160 ? "text-[color:var(--crimson)]" : "text-white/40"}`}>
                  {metaLen}/160
                </span>
              </div>
              <Textarea
                rows={3}
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                placeholder="Short summary shown in search results (~150–160 characters)."
                className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 resize-none"
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-xl border border-white/10 bg-[#111a2e] p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Publish</h3>
              <div>
                <Label className="text-white/70 text-xs uppercase tracking-wide">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}>
                  <SelectTrigger className="mt-1 bg-[#0b1220] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.status === "published" && (
                <div>
                  <Label className="text-white/70 text-xs uppercase tracking-wide">Scheduled Publish</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                    className="mt-1 bg-[#0b1220] border-white/10 text-white"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => save("published")}
                  disabled={saving}
                  className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Publish
                </Button>
                <Button
                  onClick={() => save("draft")}
                  disabled={saving}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/5"
                >
                  <Save className="h-4 w-4 mr-2" /> Save Draft
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111a2e] p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Category *</h3>
              <Select value={form.category_id} onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}>
                <SelectTrigger className="bg-[#0b1220] border-white/10 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                  {cats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111a2e] p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Featured Image</h3>
              {form.featured_image_preview ? (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0b1220]">
                    <img src={form.featured_image_preview} alt="" className="w-full h-40 object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInput.current?.click()}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5"
                    >
                      <Upload className="h-4 w-4 mr-1" /> Replace
                    </Button>
                    <Button
                      onClick={() => setForm((f) => ({ ...f, featured_image_url: null, featured_image_preview: null }))}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white/20 text-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="w-full py-8 rounded-lg border-2 border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 transition text-center text-white/60"
                >
                  {uploading ? (
                    <><Loader2 className="h-5 w-5 mx-auto mb-1 animate-spin" /> Uploading…</>
                  ) : (
                    <><ImageIcon className="h-5 w-5 mx-auto mb-1" /> Upload image</>
                  )}
                </button>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFeaturedFile}
              />
            </div>

            <input type="hidden" name="source" value={form.source} />
          </aside>
        </div>
      )}
    </AdminShell>
  );
}
