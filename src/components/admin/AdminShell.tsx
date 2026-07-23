import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard, FileText, FolderTree, Hash, Bot, Share2, Code2,
  BarChart3, Inbox, Users, Settings, LogOut, ShieldCheck, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";

export type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "inactive";
};

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/topics", label: "Topics", icon: Hash },
  { to: "/admin/blog-automation", label: "Blog Automation", icon: Bot },
  { to: "/admin/social-automation", label: "Social Automation", icon: Share2 },
  { to: "/admin/seo-schema", label: "SEO Schema", icon: Code2 },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({
  title,
  children,
  onProfile,
}: { title: string; children: ReactNode; onProfile?: (p: AdminProfile) => void }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [ready, setReady] = useState(false);
  const fetchProfile = useServerFn(getMyProfile);

  useEffect(() => {
    let alive = true;
    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const p = (await fetchProfile()) as AdminProfile | null;
        if (!p || p.status !== "active") {
          await supabase.auth.signOut();
          navigate({ to: "/admin/login" });
          return;
        }
        if (!alive) return;
        setProfile(p);
        onProfile?.(p);
        setReady(true);
      } catch {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
      }
    }
    boot();
    return () => { alive = false; };
  }, [fetchProfile, navigate, onProfile]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!ready || !profile) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center text-white/70">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0a1122] flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="h-8 w-8 rounded bg-[color:var(--brand)] flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Kohn Law Firm</div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-[color:var(--brand)] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-[color:var(--gold)] text-[color:var(--ink)] flex items-center justify-center text-sm font-semibold">
              {profile.full_name.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{profile.full_name}</div>
              <div className="text-[10px] uppercase text-white/40 truncate">
                {profile.role === "super_admin" ? "Super Admin" : "Admin"}
              </div>
            </div>
          </div>
          <Button onClick={signOut} variant="ghost" size="sm"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-white/10 flex items-center px-6 bg-[#0a1122]">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
