import type { PublishedMap } from "./published.functions";
import { getPageDef, readValue, type ImageValue } from "./registry";

const SITE_ORIGIN = "https://www.shimonkohn.com";

type AnyMatch = { loaderData?: unknown };

/** Extracts published CMS content from the root route match inside head(). */
export function publishedFromMatches(matches: AnyMatch[] | undefined): PublishedMap {
  const root = matches?.[0]?.loaderData as PublishedMap | undefined;
  return root ?? {};
}

/** Builds head() meta from PUBLISHED SEO values, falling back to the page's existing metadata. */
export function cmsHead(
  matches: AnyMatch[] | undefined,
  pageKey: string,
  fallback: { title: string; description: string; ogTitle?: string; ogDescription?: string },
) {
  const def = getPageDef(pageKey);
  const content = publishedFromMatches(matches)[pageKey];
  const has = (p: string) => !!content && Object.prototype.hasOwnProperty.call(content, p) && content[p] !== "";
  const v = (p: string) => (has(p) ? (readValue<string>(def, content, p) ?? "") : "");
  const title = v("seo.title") || fallback.title;
  const description = v("seo.description") || fallback.description;
  const ogTitle = v("seo.ogTitle") || fallback.ogTitle || title;
  const ogDescription = v("seo.ogDescription") || fallback.ogDescription || description;
  const ogImg = has("seo.ogImage") ? readValue<ImageValue>(def, content, "seo.ogImage")?.url : "";
  const canonical = v("seo.canonical");
  const noindex = has("seo.noindex") && content?.["seo.noindex"] === true;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: ogImg ? "summary_large_image" : "summary" },
  ];
  if (ogImg) {
    const abs = ogImg.startsWith("/") ? SITE_ORIGIN + ogImg : ogImg;
    meta.push({ property: "og:image", content: abs }, { name: "twitter:image", content: abs });
  }
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  const links = canonical ? [{ rel: "canonical", href: canonical }] : [];
  return { meta, links };
}
