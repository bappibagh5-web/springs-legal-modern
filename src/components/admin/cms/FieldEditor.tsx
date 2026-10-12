import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronDown, ImageIcon, Library, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { FieldDef, ImageValue } from "@/lib/cms/registry";
import { uploadMedia } from "@/lib/cms/media";
import { MediaPicker } from "./MediaPicker";

const inputCls = "mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30";
const labelCls = "text-white/70 text-xs uppercase tracking-wide";

function emptyFor(f: FieldDef): unknown {
  if (f.type === "image") return { url: "", alt: "" };
  if (f.type === "list") return [];
  if (f.type === "toggle") return false;
  return "";
}

export function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const count = typeof value === "string" ? value.length : 0;
  switch (field.type) {
    case "text":
    case "url":
      return (
        <div>
          <Label className={labelCls}>{field.label}</Label>
          <Input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.type === "url" ? "https://…" : undefined}
            className={inputCls}
          />
          {field.help && <p className="mt-1 text-xs text-white/40">{field.help}</p>}
        </div>
      );
    case "textarea":
      return (
        <div>
          <div className="flex items-center justify-between">
            <Label className={labelCls}>{field.label}</Label>
            <span className="text-[10px] text-white/30">{count} chars</span>
          </div>
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.min(12, Math.max(3, Math.ceil(count / 70)))}
            className={inputCls}
          />
          {field.help && <p className="mt-1 text-xs text-white/40">{field.help}</p>}
        </div>
      );
    case "toggle":
      return (
        <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3">
          <span className="text-sm text-white/80">{field.label}</span>
          <Switch checked={value === true} onCheckedChange={(v) => onChange(v)} />
        </label>
      );
    case "image":
      return <ImageField label={field.label} value={(value as ImageValue) ?? { url: "", alt: "" }} onChange={onChange} />;
    case "list":
      return <ListField field={field} value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} />;
  }
}

function ImageField({ label, value, onChange }: { label: string; value: ImageValue; onChange: (v: ImageValue) => void }) {
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  async function onFile(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    try {
      const a = await uploadMedia(f, null);
      onChange({ url: a.public_url, alt: value.alt });
      toast.success("Image uploaded to Media Library");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <Label className={labelCls}>{label}</Label>
      <div className="mt-1 flex gap-3 rounded-lg border border-white/10 bg-[#0b1220] p-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-white/5 flex items-center justify-center">
          {value.url ? (
            <img src={value.url} alt={value.alt} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-white/30" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPicker(true)}
              className="h-8 border-white/15 bg-transparent text-white hover:bg-white/10">
              <Library className="h-3.5 w-3.5" /> Media Library
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => ref.current?.click()} disabled={busy}
              className="h-8 border-white/15 bg-transparent text-white hover:bg-white/10">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload New
            </Button>
            {value.url && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange({ url: "", alt: "" })}
                className="h-8 text-white/60 hover:bg-white/10 hover:text-white">
                <X className="h-3.5 w-3.5" /> Remove
              </Button>
            )}
          </div>
          <Input
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Alt text (describe the image)"
            className="h-8 bg-[#0b1220] border-white/10 text-white text-xs placeholder:text-white/30"
          />
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      <MediaPicker
        open={picker}
        onOpenChange={setPicker}
        onSelect={(a) => {
          onChange({ url: a.public_url, alt: value.alt || a.alt_text });
          setPicker(false);
        }}
      />
    </div>
  );
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sub = field.itemFields ?? [];
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIdx(j);
  };
  return (
    <div>
      <Label className={labelCls}>{field.label}</Label>
      <div className="mt-1 space-y-2">
        {value.map((item, i) => {
          const title = String(item[field.itemLabelKey ?? sub[0]?.key ?? ""] ?? "") || `Item ${i + 1}`;
          const open = openIdx === i;
          return (
            <div key={i} className="rounded-lg border border-white/10 bg-[#0b1220]">
              <div className="flex items-center gap-1 px-3 py-2">
                <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm">
                  <ChevronDown className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
                  <span className="truncate">{title}</span>
                </button>
                <IconBtn onClick={() => move(i, -1)} label="Move up"><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn onClick={() => move(i, 1)} label="Move down"><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn
                  label="Remove"
                  onClick={() => {
                    if (!confirm("Remove this item?")) return;
                    onChange(value.filter((_, k) => k !== i));
                    setOpenIdx(null);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
              {open && (
                <div className="space-y-3 border-t border-white/10 p-3">
                  {sub.map((sf) => (
                    <FieldEditor
                      key={sf.key}
                      field={sf}
                      value={item[sf.key] ?? emptyFor(sf)}
                      onChange={(v) => onChange(value.map((it, k) => (k === i ? { ...it, [sf.key]: v } : it)))}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onChange([...value, Object.fromEntries(sub.map((sf) => [sf.key, emptyFor(sf)]))]);
            setOpenIdx(value.length);
          }}
          className="border-dashed border-white/20 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4" /> Add item
        </Button>
      </div>
    </div>
  );
}

function IconBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
      {children}
    </button>
  );
}
