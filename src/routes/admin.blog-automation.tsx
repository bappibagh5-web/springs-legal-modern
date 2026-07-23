import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/blog-automation")({
  ssr: false,
  component: () => <AdminShell title="Blog Automation"><Placeholder label="Blog Automation" /></AdminShell>,
});
