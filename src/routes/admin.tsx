import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Kohn Law Firm" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
