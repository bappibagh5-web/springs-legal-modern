/**
 * Server-rendered <head> + JSON-LD helpers for public routes.
 * Every public route's head() goes through pageHead() so canonical, OG/Twitter and
 * structured data are always present in the initial HTML.
 */
import { SITE, absoluteUrl, ATTORNEYS, type Attorney, type QA } from "@/site/site";
import type { Post } from "@/site/posts";

export const FIRM_ID = `${SITE.origin}/#firm`;
export const WEBSITE_ID = `${SITE.origin}/#website`;
export const personId = (slug: string) => `${SITE.origin}/team/${slug}#person`;
export const personUrl = (slug: string) => `${SITE.origin}/team/${slug}`;

type JsonLd = Record<string, unknown>;
type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

export type HeadInput = {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
  image?: string;
  imageAlt?: string;
  jsonLd?: JsonLd[];
  noindex?: boolean;
  article?: { published: string; modified: string };
};

export function pageHead(input: HeadInput) {
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? SITE.ogImage);
  const meta: MetaTag[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: input.imageAlt ?? SITE.ogImageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];
  if (input.image === undefined) {
    meta.push(
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    );
  }
  if (input.article) {
    meta.push(
      { property: "article:published_time", content: input.article.published },
      { property: "article:modified_time", content: input.article.modified },
    );
  }
  if (input.noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return {
    meta,
    links: input.noindex ? [] : [{ rel: "canonical", href: url }],
    scripts: (input.jsonLd ?? []).map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  };
}

/** Head for a dynamic route whose content was not found (the response is a 404). */
export function notFoundHead() {
  return {
    meta: [
      { title: `Page not found | ${SITE.name}` },
      { name: "robots", content: "noindex, follow" },
    ],
  };
}

/* ───────────── Schema builders ───────────── */

const ctx = "https://schema.org";

export function personNode(a: Attorney): JsonLd {
  return {
    "@type": "Person",
    "@id": personId(a.slug),
    name: a.name,
    givenName: a.givenName,
    familyName: a.familyName,
    jobTitle: a.role,
    url: personUrl(a.slug),
    image: absoluteUrl(a.image.srcLarge),
    worksFor: { "@id": FIRM_ID },
    knowsAbout: a.practiceAreas,
    ...(a.education.length
      ? {
          alumniOf: a.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
        }
      : {}),
    ...(a.credentials.length
      ? {
          hasCredential: a.credentials.map((c) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: c.year ? `${c.label} (${c.year})` : c.label,
          })),
        }
      : {}),
    ...(a.sameAs.length ? { sameAs: a.sameAs } : {}),
  };
}

export function firmNode(): JsonLd {
  return {
    "@type": "LegalService",
    "@id": FIRM_ID,
    name: SITE.name,
    url: `${SITE.origin}/`,
    logo: absoluteUrl(SITE.logo),
    image: absoluteUrl(SITE.ogImage),
    telephone: `+1-${SITE.phone}`,
    email: SITE.email,
    foundingDate: "2003",
    founder: { "@id": personId("shimon-kohn") },
    employee: ATTORNEYS.map((a) => ({ "@id": personId(a.slug) })),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: [
      "Criminal defense",
      "Family law",
      "Divorce",
      "Child custody",
      "Child support",
      "Protection orders",
    ],
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function websiteNode(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE.origin}/`,
    name: SITE.name,
    publisher: { "@id": FIRM_ID },
  };
}

/** Site-wide graph rendered by the root route on every page. */
export function siteGraph(): JsonLd {
  return { "@context": ctx, "@graph": [firmNode(), websiteNode(), ...ATTORNEYS.map(personNode)] };
}

export function breadcrumbs(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": ctx,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqPage(faqs: QA[]): JsonLd {
  return {
    "@context": ctx,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
    })),
  };
}

export function webPage(opts: {
  path: string;
  name: string;
  description: string;
  type?: string;
  modified?: string;
  about?: JsonLd;
}): JsonLd {
  const url = absoluteUrl(opts.path);
  return {
    "@context": ctx,
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": FIRM_ID },
    inLanguage: "en-US",
    ...(opts.modified ? { dateModified: opts.modified } : {}),
    ...(opts.about ? { about: opts.about } : {}),
  };
}

/** Service node for a practice-area page (name = area title) or a service page. */
export function serviceNode({
  path,
  name,
  serviceType,
}: {
  path: string;
  name: string;
  serviceType: string;
}): JsonLd {
  return {
    "@context": ctx,
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@id": FIRM_ID },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
  };
}

export function blogPosting(post: Post): JsonLd {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": ctx,
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.meta.description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@id": FIRM_ID },
    publisher: { "@id": FIRM_ID },
    image: absoluteUrl(SITE.ogImage),
    inLanguage: "en-US",
  };
}

/** ProfilePage for an attorney bio, with the full Person as mainEntity. */
export function profilePage(a: Attorney, description: string): JsonLd {
  const url = personUrl(a.slug);
  return {
    "@context": ctx,
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    url,
    name: `${a.name}, ${a.role}`,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { ...personNode(a), description: a.bio.join(" ") },
  };
}
