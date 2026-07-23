import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/posts")({
  ssr: false,
  component: () => <AdminShell title="Posts"><Placeholder label="Posts" /></AdminShell>,
});
