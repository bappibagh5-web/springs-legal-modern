import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/seo-schema")({
  ssr: false,
  component: () => <AdminShell title="SEO Schema"><Placeholder label="SEO Schema" /></AdminShell>,
});
