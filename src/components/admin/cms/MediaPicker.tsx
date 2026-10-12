import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, type MediaAsset, type MediaFolder } from "@/lib/cms/media";

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (a: MediaAsset) => void;
}) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folder, setFolder] = useState<string>("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const [a, f] = await Promise.all([
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
      supabase.from("media_folders").select("id, name").order("name"),
    ]);
    setItems((a.data ?? []) as MediaAsset[]);
    setFolders((f.data ?? []) as MediaFolder[]);
    setLoading(false);
  }
  useEffect(() => {
    if (open) void load();
  }, [open]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      let last: MediaAsset | null = null;
      for (const f of Array.from(files)) last = await uploadMedia(f, folder === "all" ? null : folder);
      toast.success("Uploaded");
      await load();
      if (last && files.length === 1) onSelect(last);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const shown = items.filter(
    (i) => (folder === "all" || i.folder_id === folder) && i.file_name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#111a2e] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Choose from Media Library</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search images"
              className="pl-9 bg-[#0b1220] border-white/10 text-white"
            />
          </div>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="h-10 rounded-md border border-white/10 bg-[#0b1220] px-3 text-sm"
          >
            <option value="all">All folders</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-[color:var(--gold)] text-black hover:opacity-90">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload New
          </Button>
        </div>
        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-white/60" />
            </div>
          ) : shown.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/50">No images yet — upload one to get started.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {shown.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onSelect(a)}
                  className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0b1220] text-left hover:border-[color:var(--gold)]"
                >
                  <img src={a.public_url} alt={a.alt_text} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="truncate px-2 py-1.5 text-xs text-white/70">{a.file_name}</div>
                  <span className="absolute right-2 top-2 hidden rounded-full bg-[color:var(--gold)] p-1 text-black group-hover:block">
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
