import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/social-automation")({
  ssr: false,
  component: () => <AdminShell title="Social Automation"><Placeholder label="Social Automation" /></AdminShell>,
});
