import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { touchLastLogin } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — Kohn Law Firm" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const touch = useServerFn(touchLastLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    try { await touch(); } catch { /* non-fatal */ }
    navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111a2e] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-[color:var(--brand)] flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Sign In</h1>
            <p className="text-sm text-white/60 mt-1">Kohn Law Firm control panel</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 bg-[#0b1220] border-white/10 text-white placeholder:text-white/30" placeholder="you@firm.com" />
          </div>
          <div>
            <Label htmlFor="password" className="text-white/80">Password</Label>
            <div className="relative mt-1">
              <Input id="password" type={show ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-[#0b1220] border-white/10 text-white placeholder:text-white/30 pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-[color:var(--crimson)] bg-[color:var(--crimson)]/10 border border-[color:var(--crimson)]/30 rounded px-3 py-2">{error}</div>}
          <Button type="submit" disabled={loading}
            className="w-full bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
        <p className="text-xs text-white/40 text-center mt-6">Restricted access. Contact your administrator for credentials.</p>
      </div>
    </div>
  );
}
