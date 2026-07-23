import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  component: () => <AdminShell title="Leads"><Placeholder label="Leads" /></AdminShell>,
});
