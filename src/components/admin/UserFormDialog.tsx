import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "inactive";
};

export type FormValues = {
  id?: string;
  full_name: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "inactive";
  password: string;
  confirm: string;
};

export function UserFormDialog({
  open, onOpenChange, mode, initial, callerRole, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  initial?: UserRow | null;
  callerRole: "super_admin" | "admin";
  onSubmit: (v: FormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({
    full_name: "", email: "", role: "admin", status: "active", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setShowPw(false); setShowConfirm(false);
      if (mode === "edit" && initial) {
        setValues({
          id: initial.id, full_name: initial.full_name, email: initial.email,
          role: initial.role, status: initial.status, password: "", confirm: "",
        });
      } else {
        setValues({ full_name: "", email: "", role: "admin", status: "active", password: "", confirm: "" });
      }
    }
  }, [open, mode, initial]);

  const canPickSuper = callerRole === "super_admin" &&
    (mode === "create" || (initial && initial.role === "super_admin"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (values.password || mode === "create") {
      if (values.password.length < 8) return setError("Password must be at least 8 characters");
      if (values.password !== values.confirm) return setError("Passwords do not match");
    }
    setBusy(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111a2e] border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create User" : "Edit User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white/80">Full Name</Label>
            <Input required value={values.full_name}
              onChange={e => setValues(v => ({ ...v, full_name: e.target.value }))}
              className="bg-[#0b1220] border-white/10 text-white mt-1" />
          </div>
          <div>
            <Label className="text-white/80">Email</Label>
            <Input required type="email" value={values.email}
              onChange={e => setValues(v => ({ ...v, email: e.target.value }))}
              className="bg-[#0b1220] border-white/10 text-white mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">Role</Label>
              <Select value={values.role} onValueChange={(val) =>
                setValues(v => ({ ...v, role: val as "super_admin" | "admin" }))}>
                <SelectTrigger className="bg-[#0b1220] border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111a2e] border-white/10 text-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  {canPickSuper && <SelectItem value="super_admin">Super Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            {mode === "edit" && (
              <div>
                <Label className="text-white/80">Status</Label>
                <div className="mt-3 flex items-center gap-3">
                  <Switch checked={values.status === "active"}
                    onCheckedChange={(c) => setValues(v => ({ ...v, status: c ? "active" : "inactive" }))} />
                  <span className="text-sm text-white/70">
                    {values.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div>
            <Label className="text-white/80">
              {mode === "edit" ? "New Password (leave blank to keep current)" : "Password"}
            </Label>
            <div className="relative mt-1">
              <Input type={showPw ? "text" : "password"} value={values.password}
                onChange={e => setValues(v => ({ ...v, password: e.target.value }))}
                className="bg-[#0b1220] border-white/10 text-white pr-10" />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label className="text-white/80">Confirm Password</Label>
            <div className="relative mt-1">
              <Input type={showConfirm ? "text" : "password"} value={values.confirm}
                onChange={e => setValues(v => ({ ...v, confirm: e.target.value }))}
                className="bg-[#0b1220] border-white/10 text-white pr-10" />
              <button type="button" onClick={() => setShowConfirm(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-[color:var(--crimson)] bg-[color:var(--crimson)]/10 border border-[color:var(--crimson)]/30 rounded px-3 py-2">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white hover:bg-white/5">Cancel</Button>
            <Button type="submit" disabled={busy}
              className="bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "create" ? "Create User" : "Save Changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
