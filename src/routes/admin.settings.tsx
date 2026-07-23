import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: () => <AdminShell title="Settings"><Placeholder label="Settings" /></AdminShell>,
});
