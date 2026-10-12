/**
 * CMS registry — describes every editable page, its sections and fields,
 * and the CURRENT site content as defaults. Public pages read
 * published overrides merged on top of these defaults, so an empty
 * database renders the site exactly as before.
 */
import { CATEGORIES, SITE } from "@/lib/site";
import heroAsset from "@/assets/colorado-springs-pioneers-museum.avif.asset.json";
import shimonAsset from "@/assets/shimon-kohn-v3.jpg.asset.json";
import ericaAsset from "@/assets/erica-bertini.jpg.asset.json";
import maceyAsset from "@/assets/macey-jardee.jpg.asset.json";
import aboutFirmImg from "@/assets/courthouse-modern.webp.asset.json";
import courthouseImg from "@/assets/courthouse.jpg";
import { TESTIMONIALS } from "@/lib/cms/testimonials-data";

export type ImageValue = { url: string; alt: string };
export type FieldType = "text" | "textarea" | "image" | "url" | "list" | "toggle";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  default?: unknown;
  help?: string;
  itemFields?: FieldDef[];
  itemLabelKey?: string;
};

export type SectionDef = { key: string; label: string; fields: FieldDef[] };

export type PageGroup = "Home" | "Practice Areas" | "Service Pages" | "Company Pages" | "Global";

export type PageDef = {
  key: string;
  title: string;
  path: string;
  group: PageGroup;
  sections: SectionDef[];
  seo?: { title: string; description: string };
};

export type PageContent = Record<string, unknown>;

const t = (key: string, label: string, def: string, help?: string): FieldDef => ({ key, label, type: "text", default: def, help });
const ta = (key: string, label: string, def: string, help?: string): FieldDef => ({ key, label, type: "textarea", default: def, help });
const img = (key: string, label: string, url: string, alt: string): FieldDef => ({ key, label, type: "image", default: { url, alt } });

const heroSection = (eyebrow: string, title: string, subtitle: string, image?: string): SectionDef => ({
  key: "hero",
  label: "Hero Banner",
  fields: [
    t("eyebrow", "Small label above headline", eyebrow),
    t("title", "Main headline (H1)", title),
    ta("subtitle", "Subheadline", subtitle),
    img("image", "Background image", image ?? courthouseImg, ""),
  ],
});

export const SEO_SECTION_KEY = "seo";

function seoSection(def: PageDef): SectionDef {
  return {
    key: SEO_SECTION_KEY,
    label: "SEO Settings",
    fields: [
      t("title", "SEO page title", def.seo?.title ?? def.title),
      ta("description", "Meta description", def.seo?.description ?? ""),
      t("ogTitle", "Social share title", ""),
      ta("ogDescription", "Social share description", ""),
      img("ogImage", "Social sharing image", "", ""),
      { key: "canonical", label: "Canonical URL", type: "url", default: "", help: "Leave blank to use the page's own address." },
      { key: "noindex", label: "Hide this page from search engines (noindex)", type: "toggle", default: false },
    ],
  };
}

/* ───────────────────────── Pages ───────────────────────── */

const HOME: PageDef = {
  key: "home",
  title: "Home",
  path: "/",
  group: "Home",
  seo: {
    title: "The Kohn Law Firm — Colorado Springs Criminal Defense Attorney",
    description:
      "Colorado Springs criminal defense, family law, and protection-order representation. Schedule a confidential consultation with attorney Shimon Kohn.",
  },
  sections: [
    {
      key: "hero",
      label: "Hero Banner",
      fields: [
        t("badge", "Badge text", "Colorado Springs · Trusted Trial Counsel"),
        t("titleLine1", "Headline – line 1", "We Help You Solve"),
        t("titleLine2", "Headline – line 2", "Your Legal"),
        t("titleHighlight", "Headline – gold word", "Challenges"),
        ta(
          "subtitle",
          "Subheadline",
          "Kohn Law Firm provides focused and aggressive legal representation in criminal defense and family law cases. With decades of combined experience, our attorneys protect your rights and guide you through the legal process with clarity and care.",
        ),
        t("ctaLabel", "Button text", "Schedule a Consultation"),
        img("image", "Hero image", heroAsset.url, "Downtown Colorado Springs with the Rocky Mountains"),
        t("ratingValue", "Image badge – value", "A+"),
        t("ratingLabel", "Image badge – label", "Client rated"),
        {
          key: "stats",
          label: "Stats",
          type: "list",
          itemLabelKey: "label",
          itemFields: [t("n", "Number", ""), t("label", "Label", "")],
          default: [
            { n: "25+", label: "Years experience" },
            { n: "150+", label: "Jury trials" },
            { n: "24/7", label: "Case response" },
          ],
        },
      ],
    },
    {
      key: "services",
      label: "Services Overview",
      fields: [
        t("eyebrow", "Small label", "Practice Areas"),
        t("heading", "Heading (H2)", "Focused, full-service representation"),
        ta("intro", "Intro text", "Three core practice areas, one standard of preparation."),
      ],
    },
    {
      key: "about",
      label: "About the Firm",
      fields: [
        img("image", "Image", aboutFirmImg.url, "Modern courthouse exterior in Colorado"),
        t("badgeNumber", "Image badge – number", "25+"),
        t("badgeLabel", "Image badge – label", "Years of Trial Experience"),
        t("eyebrow", "Small label", "About the Firm"),
        t("heading", "Heading (H2)", "A boutique practice built around the client."),
        ta(
          "body",
          "Paragraph",
          "The Kohn Law Firm was founded on a simple idea: people facing serious legal trouble deserve direct access to their attorney. Not an associate, not a paralegal — the lawyer handling their case.",
        ),
        {
          key: "bullets",
          label: "Bullet points",
          type: "list",
          itemLabelKey: "text",
          itemFields: [t("text", "Bullet", "")],
          default: [
            { text: "Direct, attorney-led communication on every case" },
            { text: "Trial-ready preparation from day one" },
            { text: "Strategic, candid counsel — not false promises" },
            { text: "Decades of combined courtroom experience" },
          ],
        },
        t("linkLabel", "Link text", "More about the firm →"),
      ],
    },
    {
      key: "team",
      label: "Our Legal Team",
      fields: [
        t("eyebrow", "Small label", "Our Legal Team"),
        t("heading", "Heading (H2)", "Counsel you can call by name."),
        t("linkLabel", "Link text", "Meet the team →"),
        {
          key: "members",
          label: "Team members",
          type: "list",
          itemLabelKey: "name",
          itemFields: [
            t("name", "Name", ""),
            t("title", "Title", ""),
            ta("bio", "Short bio", ""),
            img("image", "Photo", "", ""),
          ],
          default: [
            {
              name: "Shimon Kohn",
              title: "Founding Attorney",
              bio: "Over 25 years fighting for clients' rights — former Deputy District Attorney in Teller and El Paso Counties, now leading the firm's criminal defense practice.",
              image: { url: shimonAsset.url, alt: "Shimon Kohn" },
            },
            {
              name: "Erica Bertini",
              title: "Managing Attorney – Family Law",
              bio: "15+ years guiding clients through family law matters that intersect with criminal court, with a background as a Deputy District Attorney in Colorado and Illinois.",
              image: { url: ericaAsset.url, alt: "Erica Bertini" },
            },
            {
              name: "Macey",
              title: "Family Law Paralegal",
              bio: "Supports clients at every stage of their case — assisting our family law attorneys with case preparation, file management, deadlines, and the litigation process.",
              image: { url: maceyAsset.url, alt: "Macey" },
            },
          ],
        },
      ],
    },
    {
      key: "faq",
      label: "FAQs",
      fields: [
        t("eyebrow", "Small label", "Frequently Asked"),
        t("heading", "Heading (H2)", "Questions we hear most often."),
        ta("intro", "Intro text", "Don't see your question? Reach out — most calls are answered the same day."),
        {
          key: "items",
          label: "Questions",
          type: "list",
          itemLabelKey: "q",
          itemFields: [t("q", "Question", ""), ta("a", "Answer", "")],
          default: [
            {
              q: "What should I do if I've been arrested in Colorado Springs?",
              a: "Invoke your right to remain silent and ask for an attorney. Do not discuss the facts of the case with officers, cellmates, or over recorded jail calls. Call our office as soon as you can safely do so.",
            },
            {
              q: "How quickly can I speak with an attorney?",
              a: "We answer the phone around the clock for criminal matters. For non-emergency family-law questions, we typically schedule a consultation within one to three business days.",
            },
            {
              q: "Do you handle cases outside El Paso County?",
              a: "Yes. We regularly appear in Pueblo, Teller, Fremont, and Douglas counties, and we accept select matters elsewhere in Colorado.",
            },
            {
              q: "How much will my case cost?",
              a: "Fees depend on the charge, court, and projected work. We discuss fee structure openly during the initial consultation so you can make an informed decision.",
            },
          ],
        },
      ],
    },
    {
      key: "whoWeAre",
      label: "Who We Are",
      fields: [
        t("eyebrow", "Small label", "Who We Are"),
        t(
          "heading",
          "Heading (H2)",
          "Lawyers who treat their clients like neighbors — because in Colorado Springs, they are.",
        ),
        ta(
          "body",
          "Paragraphs",
          "The Kohn Law Firm is a Colorado Springs practice rooted in this community. We know the courts, the prosecutors, and the judges. More importantly, we know the people who walk through our doors are usually facing the worst week of their lives.\n\nOur standard is simple: answer the phone, prepare the case, and tell the truth — even when the truth is hard.",
          "Leave a blank line between paragraphs.",
        ),
      ],
    },
  ],
};

const ABOUT: PageDef = {
  key: "about",
  title: "About Us",
  path: "/about",
  group: "Company Pages",
  seo: { title: "About — The Kohn Law Firm", description: "" },
  sections: [
    heroSection(
      "About Us",
      "Providing top-notch legal representation.",
      "Kohn Law Firm is dedicated to protecting your rights with ethical and aggressive legal representation. We guide clients through criminal defense and family law matters with clarity, care, and decades of combined experience.",
    ),
  ],
};

const TEAM: PageDef = {
  key: "team",
  title: "Our Team",
  path: "/team",
  group: "Company Pages",
  seo: { title: "Our Team — The Kohn Law Firm", description: "" },
  sections: [
    heroSection(
      "Our Legal Team",
      "The attorneys behind every case.",
      "At Kohn Law Firm, our attorneys and staff combine proven legal experience with detailed case preparation and ethical advocacy. We approach every case with professionalism, focus, and a commitment to delivering results our clients can trust.",
    ),
  ],
};

const CONTACT: PageDef = {
  key: "contact",
  title: "Contact",
  path: "/contact",
  group: "Company Pages",
  seo: { title: "Contact — The Kohn Law Firm", description: "" },
  sections: [
    heroSection(
      "Contact",
      "Reach the firm directly.",
      "Calls are answered around the clock for criminal matters. For all other inquiries, we respond within one business day.",
    ),
    {
      key: "info",
      label: "Contact Details",
      fields: [t("availability", "Availability text", "24/7 for active criminal matters")],
    },
  ],
};

const CONSULTATION: PageDef = {
  key: "consultation",
  title: "Schedule a Consultation",
  path: "/consultation",
  group: "Company Pages",
  seo: { title: "Schedule a Consultation — The Kohn Law Firm", description: "" },
  sections: [
    heroSection(
      "Confidential Intake",
      "Schedule a consultation.",
      "Tell us a little about your situation. We will reach out promptly to set a time.",
    ),
  ],
};

export const GLOBAL_KEY = "global";

const GLOBAL: PageDef = {
  key: GLOBAL_KEY,
  title: "Global Content",
  path: "/",
  group: "Global",
  sections: [
    {
      key: "contact",
      label: "Contact Info (used site-wide)",
      fields: [
        t("phone", "Phone number", SITE.phone),
        t("email", "Email address", SITE.email),
        t("city", "City / service area", SITE.city),
      ],
    },
    {
      key: "header",
      label: "Header",
      fields: [
        t("tagline", "Top bar text", "Colorado Springs · Trusted Defense Counsel"),
        t("ctaLabel", "Header button text", "Schedule Consultation"),
      ],
    },
    {
      key: "cta",
      label: "Call-to-Action Band",
      fields: [
        t("title", "Heading", "Your defense starts with a conversation."),
        ta(
          "body",
          "Text",
          "Speak directly with attorney Shimon Kohn about your case. Consultations are confidential and judgment-free.",
        ),
        t("buttonLabel", "Button text", "Schedule a Consultation"),
      ],
    },
    {
      key: "testimonials",
      label: "Testimonials",
      fields: [
        t("eyebrow", "Small label", "Testimonials"),
        t("heading", "Heading", "What our clients are saying."),
        t("rating", "Rating line", "Excellent · 139+ Google reviews"),
        {
          key: "items",
          label: "Testimonials",
          type: "list",
          itemLabelKey: "author",
          itemFields: [ta("quote", "Quote", ""), t("author", "Name", ""), t("context", "Case type", "")],
          default: TESTIMONIALS,
        },
      ],
    },
    {
      key: "footer",
      label: "Footer",
      fields: [
        ta(
          "description",
          "Firm description",
          "Trusted criminal defense and family law representation serving Colorado Springs and the surrounding communities.",
        ),
        t("disclaimer", "Disclaimer", "Attorney advertising. Prior results do not guarantee a similar outcome."),
      ],
    },
  ],
};

const CATEGORY_PAGES: PageDef[] = CATEGORIES.map((c) => ({
  key: `cat-${c.slug}`,
  title: c.title,
  path: `/${c.slug}`,
  group: "Practice Areas" as const,
  seo: { title: `${c.title} — The Kohn Law Firm`, description: c.short },
  sections: [
    heroSection("Practice Area", c.title, c.short),
    { key: "overview", label: "Overview", fields: [ta("intro", "Overview text", c.intro)] },
  ],
}));

const SERVICE_PAGES: PageDef[] = CATEGORIES.flatMap((c) =>
  c.items.map((it) => ({
    key: `svc-${c.slug}--${it.slug}`,
    title: it.title,
    path: `/${c.slug}/${it.slug}`,
    group: "Service Pages" as const,
    seo: { title: `${it.title} — ${c.title} | The Kohn Law Firm`, description: it.blurb },
    sections: [
      heroSection(c.title, it.title, it.blurb),
      {
        key: "overview",
        label: "Overview Content",
        fields: [
          t("heading", "Heading (H2)", `${it.title} in Colorado Springs`),
          ta("body", "Paragraphs", it.body.join("\n\n"), "Leave a blank line between paragraphs."),
        ],
      },
      {
        key: "expect",
        label: "What to Expect",
        fields: [
          {
            key: "items",
            label: "Points",
            type: "list",
            itemLabelKey: "text",
            itemFields: [t("text", "Point", "")],
            default: (it.whatToExpect ?? []).map((text) => ({ text })),
          },
        ],
      },
    ],
  })),
);

export const CMS_PAGES: PageDef[] = [HOME, ...CATEGORY_PAGES, ...SERVICE_PAGES, ABOUT, TEAM, CONTACT, CONSULTATION, GLOBAL];

export function getPageDef(key: string): PageDef | undefined {
  return CMS_PAGES.find((p) => p.key === key);
}

/** All sections including the auto-generated SEO section (not for Global). */
export function sectionsFor(def: PageDef): SectionDef[] {
  return def.group === "Global" ? def.sections : [...def.sections, seoSection(def)];
}

export function fieldDef(def: PageDef, path: string): FieldDef | undefined {
  const [s, f] = path.split(".");
  return sectionsFor(def).find((x) => x.key === s)?.fields.find((x) => x.key === f);
}

/** Read a value: override if present, otherwise the registry default. */
export function readValue<T = unknown>(def: PageDef | undefined, content: PageContent | undefined, path: string): T {
  if (content && Object.prototype.hasOwnProperty.call(content, path)) return content[path] as T;
  return (def ? fieldDef(def, path)?.default : undefined) as T;
}

export const serviceKey = (cat: string, svc: string) => `svc-${cat}--${svc}`;
export const categoryKey = (cat: string) => `cat-${cat}`;

export function paragraphs(text: string | undefined): string[] {
  return (text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
