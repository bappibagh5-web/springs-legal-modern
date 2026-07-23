import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/topics")({
  ssr: false,
  component: () => <AdminShell title="Topics"><Placeholder label="Topics" /></AdminShell>,
});
