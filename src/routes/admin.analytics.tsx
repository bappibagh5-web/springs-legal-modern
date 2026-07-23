import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/analytics")({
  ssr: false,
  component: () => <AdminShell title="Analytics"><Placeholder label="Analytics" /></AdminShell>,
});
