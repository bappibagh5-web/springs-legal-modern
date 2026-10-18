/**
 * Permanent (301) redirects for old URLs, applied in the worker (src/server.ts) before any page renders,
 * so crawlers get a real 301 in the raw HTTP response. The full mapping, with reasons, is in
 * audit/redirect-map.csv.
 *
 * Keys are lowercase paths with no trailing slash. Targets are current site paths.
 */
export const REDIRECTS: Record<string, string> = {
  // Old seed blog posts from the original export (removed from the posts table).
  "/blog/child-custody-basics-what-colorado-courts-consider":
    "/family-law/allocation-of-parental-responsibilities",
  "/blog/what-to-do-if-pulled-over-for-dui-colorado-springs":
    "/criminal-defense/misdemeanor-crimes",
  "/blog/your-rights-during-a-police-interrogation": "/criminal-defense",
  "/blog/common-mistakes-during-divorce-proceedings": "/family-law/divorce-separation",
  "/blog/understanding-protective-orders-guide-for-families":
    "/family-law/protection-orders-and-custody",
  "/blog/the-kohn-law-firm-welcomes-new-team-members": "/team",
  "/blog/when-should-you-hire-a-criminal-defense-attorney": "/criminal-defense",
};

const CANONICAL_ORIGIN = "https://shimonkohn.com";

/**
 * The 301 for an old URL, or undefined. www requests go straight to the apex target in one hop.
 * The query string is kept.
 */
export function redirectFor(url: URL): Response | undefined {
  const path = url.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const target = REDIRECTS[path];
  if (!target) return undefined;
  const host = url.hostname.toLowerCase();
  const origin =
    host === "shimonkohn.com" || host === "www.shimonkohn.com" ? CANONICAL_ORIGIN : url.origin;
  return new Response(null, {
    status: 301,
    headers: {
      location: `${origin}${target}${url.search}`,
      "cache-control": "public, max-age=86400",
    },
  });
}
