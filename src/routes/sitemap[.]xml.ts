import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { absoluteUrl, ATTORNEYS, PRACTICE_AREAS, PAGE_UPDATED, type PagePath } from "@/site/site";
import { ARTICLES, POSTS } from "@/site/posts";

/**
 * Sitemap on the canonical host, built from the page registry in src/site/site.ts
 * (PAGE_UPDATED, ATTORNEYS, PRACTICE_AREAS) and the posts and articles in src/site/posts.ts.
 * lastmod is each page's content date, so it changes only when content changes.
 * Adding a page: create its route file and add its path and date to PAGE_UPDATED.
 */
type Entry = { path: string; lastmod?: string };

function entries(): Entry[] {
  const page = (path: PagePath): Entry => ({ path, lastmod: PAGE_UPDATED[path] });
  const newestPost = [
    ...POSTS.map((p) => p.dateModified),
    ...ARTICLES.map((a) => PAGE_UPDATED[a.path]),
  ]
    .sort()
    .at(-1);
  const list: Entry[] = [
    page("/"),
    page("/about"),
    page("/team"),
    page("/contact"),
    page("/consultation"),
    { path: "/blog", lastmod: newestPost },
  ];
  for (const a of ATTORNEYS) list.push(page(`/team/${a.slug}` as PagePath));
  for (const area of PRACTICE_AREAS) {
    list.push(page(area.path));
    for (const s of area.services) list.push(page(s.path));
  }
  for (const a of ARTICLES) list.push(page(a.path));
  for (const p of POSTS) list.push({ path: `/blog/${p.slug}`, lastmod: p.dateModified });
  return list;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const body = entries()
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${absoluteUrl(e.path)}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
