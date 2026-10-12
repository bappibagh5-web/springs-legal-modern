import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, FolderPlus, Grid3x3, List, Loader2, Pencil, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  MEDIA_BUCKET,
  findMediaUsage,
  formatBytes,
  replaceMediaFile,
  uploadMedia,
  type MediaAsset,
  type MediaFolder,
} from "@/lib/cms/media";

export const Route = createFileRoute("/admin/media")({
  ssr: false,
  component: MediaLibrary,
});

const inputCls = "bg-[#0b1220] border-white/10 text-white placeholder:text-white/30";

function MediaLibrary() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folder, setFolder] = useState("all");
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"date" | "name">("date");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [active, setActive] = useState<MediaAsset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [a, f] = await Promise.all([
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
      supabase.from("media_folders").select("id, name").order("name"),
    ]);
    setItems((a.data ?? []) as MediaAsset[]);
    setFolders((f.data ?? []) as MediaFolder[]);
    setLoading(false);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function upload(files: FileList | File[] | null) {
    if (!files || !files.length) return;
    setUploading(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      try {
        await uploadMedia(f, folder === "all" ? null : folder);
        ok++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setUploading(false);
    if (ok) toast.success(`${ok} image${ok > 1 ? "s" : ""} uploaded`);
    await load();
  }

  async function createFolder() {
    const name = prompt("Folder name")?.trim();
    if (!name) return;
    const { error } = await supabase.from("media_folders").insert({ name });
    if (error) return toast.error(error.message);
    await load();
  }

  const shown = items
    .filter((i) => folder === "all" || i.folder_id === folder)
    .filter((i) => type === "all" || i.mime_type === type)
    .filter((i) => (i.file_name + " " + i.alt_text).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "name" ? a.file_name.localeCompare(b.file_name) : b.created_at.localeCompare(a.created_at)));

  return (
    <AdminShell title="Media Library">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void upload(e.dataTransfer.files); }}
        className={`min-h-[70vh] rounded-xl ${drag ? "outline-2 outline-dashed outline-[color:var(--gold)]" : ""}`}
      >
        <p className="text-sm text-white/60">Upload, organize, and manage all your website images and media assets.</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple hidden
            onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-[color:var(--gold)] text-black hover:opacity-90">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload Images
          </Button>
          <Button variant="outline" onClick={createFolder} className="border-white/15 bg-transparent text-white hover:bg-white/10">
            <FolderPlus className="h-4 w-4" /> Create Folder
          </Button>
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search images" className={`pl-9 ${inputCls}`} />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-md border border-white/10 bg-[#0b1220] px-3 text-sm">
            <option value="all">All types</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
            <option value="image/avif">AVIF</option>
            <option value="image/gif">GIF</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as "date" | "name")} className="h-10 rounded-md border border-white/10 bg-[#0b1220] px-3 text-sm">
            <option value="date">Newest first</option>
            <option value="name">Name A–Z</option>
          </select>
          <div className="flex rounded-md border border-white/10">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-white/10" : ""}`} title="Grid"><Grid3x3 className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-white/10" : ""}`} title="List"><List className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {[{ id: "all", name: "All images" }, ...folders].map((f) => (
            <button key={f.id} onClick={() => setFolder(f.id)}
              className={`rounded-full px-3 py-1 text-xs ${folder === f.id ? "bg-[color:var(--brand)] text-white" : "bg-white/5 text-white/60 hover:text-white"}`}>
              {f.name} {f.id !== "all" && <span className="text-white/40">({items.filter((i) => i.folder_id === f.id).length})</span>}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-white/50" /></div>
          ) : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 py-20 text-center text-sm text-white/50">
              Drag & drop images here, or click Upload Images.
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shown.map((a) => (
                <button key={a.id} onClick={() => setActive(a)}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#111a2e] text-left hover:border-[color:var(--gold)]">
                  <img src={a.public_url} alt={a.alt_text} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium">{a.file_name}</p>
                    <p className="text-[10px] text-white/40">{a.width && a.height ? `${a.width}×${a.height} · ` : ""}{formatBytes(a.file_size)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase text-white/50">
                  <tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Size</th><th className="p-3">Uploaded</th></tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {shown.map((a) => (
                    <tr key={a.id} onClick={() => setActive(a)} className="cursor-pointer hover:bg-white/5">
                      <td className="p-2"><img src={a.public_url} alt="" className="h-10 w-14 rounded object-cover" /></td>
                      <td className="p-3">{a.file_name}</td>
                      <td className="p-3 text-white/60">{a.mime_type.replace("image/", "").toUpperCase()}</td>
                      <td className="p-3 text-white/60">{formatBytes(a.file_size)}</td>
                      <td className="p-3 text-white/60">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {active && (
        <AssetDialog asset={active} folders={folders} onClose={() => setActive(null)}
          onChanged={async () => { await load(); setActive(null); }} />
      )}
    </AdminShell>
  );
}

function AssetDialog({ asset, folders, onClose, onChanged }: {
  asset: MediaAsset; folders: MediaFolder[]; onClose: () => void; onChanged: () => Promise<void>;
}) {
  const [name, setName] = useState(asset.file_name);
  const [alt, setAlt] = useState(asset.alt_text);
  const [folderId, setFolderId] = useState(asset.folder_id ?? "");
  const [busy, setBusy] = useState(false);
  const replaceRef = useRef<HTMLInputElement>(null);
  const fullUrl = typeof window !== "undefined" ? window.location.origin + asset.public_url : asset.public_url;

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("media_assets")
      .update({ file_name: name.trim() || asset.file_name, alt_text: alt, folder_id: folderId || null })
      .eq("id", asset.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    await onChanged();
  }

  async function replace(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    try {
      await replaceMediaFile(asset, f);
      toast.success("Image replaced — every page using it now shows the new file.");
      await onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Replace failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    const used = await findMediaUsage(asset.public_url);
    const msg = used.length
      ? `This image is used on: ${used.join(", ")}. Deleting it will leave a broken image there. Delete anyway?`
      : "Delete this image permanently?";
    if (!confirm(msg)) return setBusy(false);
    await supabase.storage.from(MEDIA_BUCKET).remove([asset.storage_path]);
    const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await onChanged();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl bg-[#111a2e] border-white/10 text-white">
        <DialogHeader><DialogTitle className="truncate pr-6">{asset.file_name}</DialogTitle></DialogHeader>
        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
          <div className="flex items-center justify-center rounded-lg bg-black/40 p-2">
            <img src={asset.public_url} alt={asset.alt_text} className="max-h-[50vh] w-auto rounded object-contain" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              <span>Type: {asset.mime_type.replace("image/", "").toUpperCase()}</span>
              <span>Size: {formatBytes(asset.file_size)}</span>
              <span>Dimensions: {asset.width ? `${asset.width}×${asset.height}` : "—"}</span>
              <span>Uploaded: {new Date(asset.created_at).toLocaleDateString()}</span>
            </div>
            <label className="block text-xs text-white/60">File name
              <Input value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block text-xs text-white/60">Alt text
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block text-xs text-white/60">Folder
              <select value={folderId} onChange={(e) => setFolderId(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-[#0b1220] px-3 text-sm text-white">
                <option value="">No folder</option>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <Input readOnly value={fullUrl} className={`h-9 text-xs ${inputCls}`} />
              <Button size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => { void navigator.clipboard.writeText(fullUrl); toast.success("URL copied"); }}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <input ref={replaceRef} type="file" accept="image/*" hidden onChange={(e) => replace(e.target.files?.[0])} />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" onClick={save} disabled={busy} className="bg-[color:var(--gold)] text-black hover:opacity-90">
                <Pencil className="h-3.5 w-3.5" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => replaceRef.current?.click()} disabled={busy}
                className="border-white/15 bg-transparent text-white hover:bg-white/10">
                <RefreshCw className="h-3.5 w-3.5" /> Replace
              </Button>
              <Button size="sm" variant="outline" onClick={remove} disabled={busy}
                className="border-red-400/30 bg-transparent text-red-300 hover:bg-red-500/10">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="text-white/60 hover:bg-white/10">
                <X className="h-3.5 w-3.5" /> Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
