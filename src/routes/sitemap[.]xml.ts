import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CATEGORIES } from "@/lib/site";

const BASE_URL = "https://www.shimonkohn.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/team", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.8" },
          { path: "/consultation", changefreq: "monthly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
        ];

        for (const cat of CATEGORIES) {
          entries.push({ path: `/${cat.slug}`, changefreq: "monthly", priority: "0.9" });
          for (const item of cat.items) {
            entries.push({ path: `/${cat.slug}/${item.slug}`, changefreq: "monthly", priority: "0.7" });
          }
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("posts")
            .select("slug, updated_at")
            .eq("status", "published");
          for (const post of data ?? []) {
            const slug = (post as { slug?: string | null }).slug;
            if (!slug) continue;
            const updated = (post as { updated_at?: string | null }).updated_at;
            entries.push({
              path: `/blog/${slug}`,
              lastmod: updated ? new Date(updated).toISOString() : undefined,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        } catch {
          /* posts are optional in the sitemap */
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
