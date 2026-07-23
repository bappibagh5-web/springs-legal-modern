import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/categories")({
  ssr: false,
  component: () => <AdminShell title="Categories"><Placeholder label="Categories" /></AdminShell>,
});
