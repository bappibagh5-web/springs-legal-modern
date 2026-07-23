import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  component: () => (
    <AdminShell title="Dashboard">
      <div className="rounded-xl border border-white/10 bg-[#111a2e] p-8">
        <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
        <p className="text-white/60 text-sm">
          Dashboard analytics and stats will be built in the next step.
        </p>
      </div>
    </AdminShell>
  ),
});
