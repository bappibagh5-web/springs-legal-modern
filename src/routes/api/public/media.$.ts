import { createFileRoute } from "@tanstack/react-router";

/** Serves Media Library images (public website images) from the private storage bucket. */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..") || !/^[\w\-./]+$/.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("site-media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        const type = data.type || "application/octet-stream";
        if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(type))
          return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
