import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  listCategories, createCategory, updateCategory, deleteCategory,
  type CategoryRow,
} from "@/lib/categories.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  ssr: false,
  component: CategoriesPage,
});

const SWATCHES: { key: string; hex: string; label: string }[] = [
  { key: "purple", hex: "#8b5cf6", label: "Purple" },
  { key: "blue",   hex: "#3b82f6", label: "Blue" },
  { key: "green",  hex: "#22c55e", label: "Green" },
  { key: "cyan",   hex: "#06b6d4", label: "Cyan" },
  { key: "orange", hex: "#f97316", label: "Orange" },
  { key: "pink",   hex: "#ec4899", label: "Pink" },
  { key: "yellow", hex: "#eab308", label: "Yellow" },
  { key: "violet", hex: "#a855f7", label: "Violet" },
];

const swatchHex = (key: string) => SWATCHES.find(s => s.key === key)?.hex ?? key;

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/['"]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  id?: string;
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  color: string;
};

const emptyForm: FormState = { name: "", slug: "", slugTouched: false, description: "", color: "purple" };

function CategoryForm({
  value, onChange, onSubmit, onCancel, submitting, editing,
}: {
  value: FormState;
  onChange: (v: FormState) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitting: boolean;
  editing: boolean;
}) {
  const setName = (name: string) => {
    onChange({
      ...value,
      name,
      slug: value.slugTouched ? value.slug : slugify(name),
    });
  };
  const setSlug = (slug: string) => onChange({ ...value, slug, slugTouched: true });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white/70 text-xs uppercase tracking-wide">Name *</Label>
          <Input
            value={value.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Criminal Defense"
            className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <div>
          <Label className="text-white/70 text-xs uppercase tracking-wide">Slug *</Label>
          <Input
            value={value.slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="criminal-defense"
            className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-white/70 text-xs uppercase tracking-wide">Description</Label>
        <Textarea
          rows={2}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Optional short description"
          className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 resize-none"
        />
      </div>

      <div>
        <Label className="text-white/70 text-xs uppercase tracking-wide">Color</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {SWATCHES.map(s => {
            const selected = value.color === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onChange({ ...value, color: s.key })}
                title={s.label}
                aria-label={s.label}
                aria-pressed={selected}
                className={`h-9 w-9 rounded-full transition ring-offset-2 ring-offset-[#111a2e] ${
                  selected ? "ring-2 ring-white scale-110" : "hover:scale-105"
                }`}
                style={{ backgroundColor: s.hex }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          onClick={onSubmit}
          disabled={submitting || !value.name.trim() || !value.slug.trim()}
          className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white"
        >
          {editing ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editing ? "Save Changes" : "Add Category"}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}
            className="text-white/70 hover:text-white hover:bg-white/10">
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function CategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  const list = useServerFn(listCategories);
  const create = useServerFn(createCategory);
  const update = useServerFn(updateCategory);
  const del = useServerFn(deleteCategory);

  async function refresh() {
    setLoading(true);
    try {
      const data = await list();
      setRows(data as CategoryRow[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );

  function resetForm() {
    setForm(emptyForm);
    setEditing(false);
  }

  function startEdit(row: CategoryRow) {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,
      slugTouched: true,
      description: row.description ?? "",
      color: row.color,
    });
    setEditing(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        color: form.color,
      };
      if (editing && form.id) {
        await update({ data: { id: form.id, ...payload } });
        toast.success("Category updated");
      } else {
        await create({ data: payload });
        toast.success("Category created");
      }
      resetForm();
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await del({ data: { id: deleteTarget.id } });
      toast.success("Category deleted");
      if (form.id === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <AdminShell title="Categories">
      <div className="rounded-xl border border-white/10 bg-[#111a2e] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              {editing ? "Update the selected category below." : "Create a new category for organizing posts."}
            </p>
          </div>
        </div>
        <CategoryForm
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={editing ? resetForm : undefined}
          submitting={submitting}
          editing={editing}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111a2e]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            All Categories <span className="text-white/40">({rows.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Posts</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center text-white/50 py-10">Loading…</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-white/50 py-10">No categories yet. Add one above.</td></tr>
              ) : sorted.map(c => (
                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/5 ${form.id === c.id ? "bg-white/5" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
                        style={{ backgroundColor: swatchHex(c.color) }}
                      />
                      <div>
                        <div className="font-medium text-white">{c.name}</div>
                        {c.description && (
                          <div className="text-white/40 text-xs mt-0.5 line-clamp-1 max-w-md">{c.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-white/70">{c.post_count}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => startEdit(c)}
                        title="Edit"
                        className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        title="Delete"
                        className="p-2 rounded hover:bg-[color:var(--crimson)]/20 text-white/70 hover:text-[color:var(--crimson)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111a2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {deleteTarget && deleteTarget.post_count > 0 ? (
                <>This category has {deleteTarget.post_count} post{deleteTarget.post_count === 1 ? "" : "s"} assigned. Deleting it will leave those posts uncategorized.</>
              ) : (
                <>This will permanently remove "{deleteTarget?.name}". This cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[color:var(--crimson)] hover:bg-[color:var(--crimson)]/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
