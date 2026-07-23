import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/posts")({
  ssr: false,
  component: () => <Outlet />,
});
