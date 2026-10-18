import logoAsset from "@/assets/klf-logo-color.png.asset.json";
import shimonAsset from "@/assets/shimon-kohn-v3.jpg.asset.json";
import ericaAsset from "@/assets/erica-bertini.jpg.asset.json";
import maceyAsset from "@/assets/macey-jardee.jpg.asset.json";

/**
 * Site-wide data: firm facts, shared strings, navigation, the practice-area registry
 * (menu labels, card blurbs, CTAs), page dates for the sitemap, team and reviews.
 * Page-specific text lives in each page's route file under src/routes/.
 */

/* ───────────── Types ───────────── */

export type Meta = { title: string; description: string };

export type Source = { label: string; url: string };

export type QA = {
  q: string;
  /** Paragraphs. The first one answers the question directly. */
  a: string[];
};

export type Section = {
  /** Question-style heading. */
  heading: string;
  /** Paragraphs. The first one answers the heading directly. */
  body: string[];
};

export type Review = { quote: string; name: string; practice: string };

/**
 * Body text of a service page (see src/routes/<area>.<service>.tsx).
 * The page name and short blurb come from PRACTICE_AREAS.
 */
export type ServiceContent = {
  intro: string[];
  sections: Section[];
  /** "What to expect" checklist in the sidebar. */
  expect: string[];
  image: { url: string; alt: string };
  /** Optional closing paragraphs, each linking to a related guide. */
  seeAlso?: SeeAlso[];
};

/** A short paragraph that ends with a link to a related page. */
export type SeeAlso = { heading?: string; text: string; label: string; to: string };

/* ───────────── Firm facts ───────────── */

/**
 * Firm-wide facts. Everything public about the firm's identity lives here.
 * Do not add facts the firm has not confirmed (see audit/client-needs.md).
 */
export const SITE = {
  name: "The Kohn Law Firm",
  origin: "https://shimonkohn.com",
  phone: "719-328-9555",
  phoneHref: "tel:+17193289555",
  email: "contact@kohn.law",
  emailHref: "mailto:contact@kohn.law",
  city: "Colorado Springs",
  region: "CO",
  regionName: "Colorado",
  country: "US",
  /** Counties the site already says the firm appears in (home FAQ, criminal pages). */
  areaServed: [
    "El Paso County, Colorado",
    "Teller County, Colorado",
    "Pueblo County, Colorado",
    "Fremont County, Colorado",
    "Douglas County, Colorado",
  ],
  /** Firm-level profiles confirmed to exist. Add the Google Business Profile URL when supplied. */
  sameAs: [] as string[],
  /** Original logo asset (served from the Lovable asset CDN on the live site). */
  logo: logoAsset.url,
  ogImage: "/og-default.png",
  ogImageAlt: "The Kohn Law Firm, criminal defense and family law, Colorado Springs",
  disclaimer: "Attorney advertising. Prior results do not guarantee a similar outcome.",
  /** Street address intentionally omitted until the client confirms it. */
  streetAddress: null as string | null,
} as const;

export const absoluteUrl = (path: string) =>
  `${SITE.origin}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

/* ───────────── Site-wide strings ───────────── */

/**
 * Site-wide strings for the header, footer, CTA band and testimonials.
 * Values match the original CMS defaults (src/lib/cms/registry.ts, Global Content),
 * except the CTA, which no longer names one attorney on every page (F-05).
 */
export const GLOBAL = {
  header: {
    tagline: "Colorado Springs · Trusted Defense Counsel",
    ctaLabel: "Schedule Consultation",
  },
  /** Default CTA for pages not tied to one practice area. Practice pages pass their own. */
  cta: {
    title: "Talk to an attorney about your case.",
    body: "Call or request a consultation. Criminal and protection order matters go to Shimon Kohn. Family law matters go to Erica Bertini. The conversation is confidential.",
    buttonLabel: "Schedule a Consultation",
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "What our clients are saying.",
    // Was "Excellent · 139+ Google reviews"; the count had no source on the page.
    // TODO(firm): link this text to the Google Business Profile once its URL is supplied.
    rating: "Google reviews",
  },
  footer: {
    description:
      "Trusted criminal defense and family law representation serving Colorado Springs and the surrounding communities.",
    disclaimer: "Attorney advertising. Prior results do not guarantee a similar outcome.",
  },
};

/* ───────────── Navigation ───────────── */

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
] as const;

/* ───────────── Practice areas ───────────── */

/**
 * How each practice area and service appears in menus, cards and CTAs.
 * Page text (H1, intro, sections) lives in the page's own route file.
 */
export const PRACTICE_AREAS = [
  {
    slug: "criminal-defense",
    path: "/criminal-defense",
    title: "Criminal Defense",
    short: "Defense for misdemeanor and felony charges across El Paso County.",
    lead: "shimon-kohn",
    cta: {
      title: "Talk to Shimon Kohn about your charge.",
      body: "Call or request a consultation. You will speak with Shimon Kohn, who has handled criminal cases in Colorado Springs since 2003. The conversation is confidential.",
    },
    services: [
      {
        slug: "misdemeanor-crimes",
        path: "/criminal-defense/misdemeanor-crimes",
        title: "Misdemeanor Crimes",
        summary: "Defense for DUI, assault, theft, and other misdemeanor charges.",
      },
      {
        slug: "financial-crimes",
        path: "/criminal-defense/financial-crimes",
        title: "Financial Crimes",
        summary: "Defense for fraud, embezzlement, and white-collar allegations.",
      },
      {
        slug: "sexual-assault",
        path: "/criminal-defense/sexual-assault",
        title: "Sexual Assault",
        summary: "Discreet defense for the most sensitive allegations.",
      },
      {
        slug: "burglary",
        path: "/criminal-defense/burglary",
        title: "Burglary",
        summary: "Felony exposure calls for a felony-level defense.",
      },
      {
        slug: "domestic-violence",
        path: "/criminal-defense/domestic-violence",
        title: "Domestic Violence",
        summary: "Mandatory arrest does not have to mean a conviction.",
      },
      {
        slug: "felony-crimes",
        path: "/criminal-defense/felony-crimes",
        title: "Felony Crimes",
        summary: "Class 1 through Class 6 felony defense across Colorado.",
      },
      {
        slug: "theft",
        path: "/criminal-defense/theft",
        title: "Theft",
        summary: "Theft charges, from shoplifting to large employer cases.",
      },
      {
        slug: "sexual-offenses",
        path: "/criminal-defense/sexual-offenses",
        title: "Sexual Offenses",
        summary: "Defense across the full range of sex-offense charges.",
      },
      {
        slug: "crimes-against-a-person",
        path: "/criminal-defense/crimes-against-a-person",
        title: "Crimes Against a Person",
        summary: "Assault, menacing, kidnapping, and related charges.",
      },
      {
        slug: "murder-attempted-murder",
        path: "/criminal-defense/murder-attempted-murder",
        title: "Murder / Attempted Murder",
        summary: "The highest-stakes defense work we do.",
      },
      {
        slug: "sexual-assault-on-a-child",
        path: "/criminal-defense/sexual-assault-on-a-child",
        title: "Sexual Assault on a Child",
        summary: "Careful defense when the stakes could not be higher.",
      },
      {
        slug: "sexual-exploitation-of-a-child",
        path: "/criminal-defense/sexual-exploitation-of-a-child",
        title: "Sexual Exploitation of a Child",
        summary: "Defense for exploitation charges in state and federal court.",
      },
    ],
  },
  {
    slug: "family-law",
    path: "/family-law",
    title: "Family Law",
    short: "Counsel for divorce, custody, and family transitions.",
    lead: "erica-bertini",
    cta: {
      title: "Talk to Erica Bertini about your family law case.",
      body: "Call or request a consultation. You will speak with Erica Bertini, who leads our family law practice, about your divorce, custody, support, or adoption matter. The conversation is confidential.",
    },
    services: [
      {
        slug: "divorce-separation",
        path: "/family-law/divorce-separation",
        title: "Divorce & Child Custody",
        summary: "Dissolution, parenting time, and decision-making in Colorado.",
      },
      {
        slug: "adoption",
        path: "/family-law/adoption",
        title: "Adoption",
        summary: "Step-parent and kinship adoption matters.",
      },
      {
        slug: "child-support",
        path: "/family-law/child-support",
        title: "Child Support",
        summary: "Establishing, enforcing, and modifying support orders.",
      },
      {
        slug: "allocation-of-parental-responsibilities",
        path: "/family-law/allocation-of-parental-responsibilities",
        title: "Allocation of Parental Responsibilities",
        summary: "Decision-making and parenting time, with or without a divorce.",
      },
      {
        slug: "protection-orders-and-custody",
        path: "/family-law/protection-orders-and-custody",
        title: "Protection Orders & Custody",
        summary: "How protection orders affect parenting time and decision-making.",
      },
      {
        slug: "el-paso-county-family-court-guide",
        path: "/family-law/el-paso-county-family-court-guide",
        title: "El Paso County Court Guide",
        summary: "Where to file, the parenting class, mediation and timing in Colorado Springs.",
      },
    ],
  },
  {
    slug: "protection-orders",
    path: "/protection-orders",
    title: "Protection Orders",
    short: "Petition for or defend against TPOs and PPOs in Colorado courts.",
    lead: "shimon-kohn",
    cta: {
      title: "Talk to Shimon Kohn before your hearing.",
      body: "Protection order hearings move fast. Call or request a consultation and speak with Shimon Kohn about seeking or contesting an order. The conversation is confidential.",
    },
    services: [
      {
        slug: "permanent-protection-order",
        path: "/protection-orders/permanent-protection-order",
        title: "Permanent Protection Order (PPO)",
        summary: "Final hearings that set lasting restrictions.",
      },
      {
        slug: "temporary-protection-order",
        path: "/protection-orders/temporary-protection-order",
        title: "Temporary Protection Order (TPO)",
        summary: "Emergency relief, or an emergency defense.",
      },
    ],
  },
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];
export type PracticeSlug = PracticeArea["slug"];
export type PracticeService = PracticeArea["services"][number];
export type ServicePath = PracticeService["path"];

export const practiceService = (path: ServicePath): PracticeService =>
  PRACTICE_AREAS.flatMap((a): readonly PracticeService[] => a.services).find(
    (s) => s.path === path,
  ) as PracticeService;

export const practiceArea = (slug: PracticeSlug): PracticeArea =>
  PRACTICE_AREAS.find((a) => a.slug === slug) as PracticeArea;

/* ───────────── Page dates ───────────── */

/** Date each page's content last changed: "Updated" bylines, dateModified and sitemap lastmod. */
const UPDATED = "2026-10-15";

export const PAGE_UPDATED = {
  "/": "2026-10-18",
  "/about": UPDATED,
  "/team": UPDATED,
  "/contact": UPDATED,
  "/consultation": UPDATED,
  "/team/shimon-kohn": UPDATED,
  "/team/erica-bertini": UPDATED,
  "/criminal-defense": UPDATED,
  "/criminal-defense/misdemeanor-crimes": UPDATED,
  "/criminal-defense/financial-crimes": UPDATED,
  "/criminal-defense/sexual-assault": UPDATED,
  "/criminal-defense/burglary": UPDATED,
  "/criminal-defense/domestic-violence": UPDATED,
  "/criminal-defense/felony-crimes": UPDATED,
  "/criminal-defense/theft": UPDATED,
  "/criminal-defense/sexual-offenses": UPDATED,
  "/criminal-defense/crimes-against-a-person": UPDATED,
  "/criminal-defense/murder-attempted-murder": UPDATED,
  "/criminal-defense/sexual-assault-on-a-child": UPDATED,
  "/criminal-defense/sexual-exploitation-of-a-child": UPDATED,
  "/family-law": UPDATED,
  "/family-law/divorce-separation": UPDATED,
  "/family-law/adoption": UPDATED,
  "/family-law/child-support": UPDATED,
  "/family-law/allocation-of-parental-responsibilities": UPDATED,
  "/family-law/protection-orders-and-custody": "2026-10-18",
  "/family-law/el-paso-county-family-court-guide": "2026-10-18",
  "/protection-orders": UPDATED,
  "/protection-orders/permanent-protection-order": UPDATED,
  "/protection-orders/temporary-protection-order": UPDATED,
  "/blog/domestic-violence-charge-and-custody-colorado": "2026-10-18",
  "/blog/protection-order-against-me-see-my-kids-colorado": "2026-10-18",
} as const;

export type PagePath = keyof typeof PAGE_UPDATED;
export const updatedFor = (path: PagePath) => PAGE_UPDATED[path];

/* ───────────── Team ───────────── */

/**
 * Attorney and staff profiles. Only facts already stated on the original site are used,
 * minus claims removed in the copy rewrite (see audit/client-needs.md §4).
 */
export type Credential = { label: string; year?: string };

export type Attorney = {
  slug: string;
  name: string;
  givenName: string;
  familyName: string;
  role: string;
  /** Short line used on cards and in the bio page hero. */
  summary: string;
  bio: string[];
  image: { src: string; srcLarge: string; alt: string; width: number; height: number };
  practiceAreas: string[];
  credentials: Credential[];
  education: { school: string; degree: string; year?: string }[];
  priorRoles: string[];
  sameAs: string[];
};

export const ATTORNEYS: Attorney[] = [
  {
    slug: "shimon-kohn",
    name: "Shimon Kohn",
    givenName: "Shimon",
    familyName: "Kohn",
    role: "Founding Attorney",
    summary:
      "Former Deputy District Attorney in Teller and El Paso Counties, now leading the firm's criminal defense practice.",
    bio: [
      "Shimon has been fighting for clients' rights for over 25 years. As a Deputy District Attorney in Teller and El Paso Counties, he prosecuted felony, misdemeanor, and traffic cases. He has been admitted to the Colorado Bar since 2000 and the Federal Bar since 2003, and he earned his law degree from Cleveland-Marshall College of Law in 1999.",
      "Shimon founded The Kohn Law Firm to represent people charged with crimes such as first degree assault, murder, financial crimes, and domestic violence. He knows that a criminal charge brings personal consequences as well as legal ones, and he walks clients through each step of the case with straight answers and support.",
      "He served as defense counsel on the last death penalty case in Colorado after the moratorium was passed.",
    ],
    image: {
      src: shimonAsset.url,
      srcLarge: shimonAsset.url,
      alt: "Shimon Kohn, founding attorney of The Kohn Law Firm",
      width: 680,
      height: 850,
    },
    practiceAreas: ["Criminal defense", "Protection orders"],
    credentials: [
      { label: "Admitted to the Colorado Bar", year: "2000" },
      { label: "Admitted to the Federal Bar", year: "2003" },
    ],
    education: [
      { school: "Cleveland-Marshall College of Law", degree: "Juris Doctor", year: "1999" },
    ],
    priorRoles: ["Deputy District Attorney, Teller and El Paso Counties"],
    sameAs: [],
  },
  {
    slug: "erica-bertini",
    name: "Erica Bertini",
    givenName: "Erica",
    familyName: "Bertini",
    role: "Managing Attorney – Family Law",
    summary:
      "Leads the firm's family law practice. Former Deputy District Attorney in Colorado and Illinois.",
    bio: [
      "Erica L. Bertini guides clients through family law cases during what can be one of the hardest periods of their lives. Her practice focuses on family law cases that intersect with criminal court, and she advocates for her clients both in the courtroom and at the negotiation table.",
      "As a former Deputy District Attorney in Colorado and Illinois, Erica brings a working knowledge of criminal law, from felonies and misdemeanors to juvenile delinquency and abuse and neglect cases. Her courtroom experience shapes how she presents a case.",
      "Erica also has a background in accounting and finance, which she draws on for the financial issues that often come up in family law cases. She keeps clients informed so they are never left guessing about what is happening in their case.",
    ],
    image: {
      src: ericaAsset.url,
      srcLarge: ericaAsset.url,
      alt: "Erica Bertini, managing attorney for family law at The Kohn Law Firm",
      width: 680,
      height: 850,
    },
    practiceAreas: ["Family law"],
    credentials: [],
    education: [],
    priorRoles: ["Deputy District Attorney in Colorado", "Deputy District Attorney in Illinois"],
    sameAs: [],
  },
];

export type StaffMember = {
  name: string;
  role: string;
  bio: string[];
  image?: { src: string; alt: string };
};

export const STAFF: StaffMember[] = [
  {
    name: "Mia",
    role: "Office Manager & Criminal Defense Paralegal",
    bio: [
      "Mia started in criminal defense at the Colorado Springs Public Defender's office in 2012. That is where she came to care about helping people through the hardest moments of their lives and about protecting everyone's constitutional rights in court.",
      "Mia joined The Kohn Law Firm in 2013. The team still works with the same shared values, helping every client who walks through the door get a fair hearing.",
      "Mia is a self-proclaimed foodie who loves to cook for the people closest to her. She also enjoys traveling to taste new cuisines, with a good book always close at hand.",
    ],
  },
  {
    name: "Victoria",
    role: "Senior Family Law Paralegal",
    bio: [
      "Victoria is a Colorado Springs native and a 2012 graduate of Widefield High School. She spent four years in administration at a large Colorado law firm, helping clients through the legal process and supporting attorneys day to day, before becoming a family law paralegal in 2023.",
      "Victoria drafts complex legal documents, researches family law issues such as military divorce and grandparents' rights, and keeps clients' cases moving. Whether you are ending a marriage or seeking more time with your child, she is here to help you through it.",
      "Victoria enjoys spending time with her family in her spare time.",
    ],
  },
  {
    name: "Macey",
    role: "Family Law Paralegal",
    bio: [
      "Macey supports clients at every stage of their case. She assists our family law attorneys with case preparation, file management, calendaring case deadlines, and every part of the litigation process.",
      "Before joining The Kohn Law Firm, Macey worked as a judicial clerk at the El Paso County Combined Courts, where she gained experience in both criminal and family law. She attended Arizona State University and Colorado Technical University and continues her legal education.",
      "Outside of work, Macey enjoys reading, spending time with her dogs, and camping.",
    ],
    image: { src: maceyAsset.url, alt: "Macey, family law paralegal at The Kohn Law Firm" },
  },
  {
    name: "Ali",
    role: "Paralegal",
    bio: [
      "Ali is a paralegal who helps clients through the legal process with professionalism and compassion. She assists with case preparation and client communication, and she gives responsive, detail-oriented support from start to finish.",
      "Outside of work, Ali enjoys reading and spending time outside.",
    ],
  },
];

export const attorneyBySlug = (slug: string) => ATTORNEYS.find((a) => a.slug === slug);

/* ───────────── Reviews ───────────── */

/**
 * Client reviews as previously published on the site.
 * The source (Google reviews or otherwise) must be confirmed by the firm; see audit/client-needs.md.
 */
export const REVIEWS: Review[] = [
  {
    quote:
      "Erica was exactly what I needed at one of the most difficult times in my life. As a divorce attorney, she was always prepared, provided invaluable expertise in all the legal grey areas I never knew existed, and made sure to communicate both with me and on my behalf.",
    name: "Former Client",
    practice: "Family law",
  },
  {
    quote:
      "This law firm was there for me through my worst of times. I was diagnosed with cancer and going through divorce. Erica and the team were every step ahead. I am grateful they represented me.",
    name: "Jesse",
    practice: "Family law",
  },
  {
    quote:
      "It is no exaggeration to say that Mr. Kohn saved my life. There were several setbacks and it took over a year but he was able to make sure that I was a free man. I could not recommend him more.",
    name: "Adian",
    practice: "Criminal defense",
  },
  {
    quote:
      "Shimon is a no BS, no nonsense attorney who has earned the respect of everyone in his profession. He outlined what my expectations should be, then exceeded them. Case dismissed.",
    name: "Matt",
    practice: "Criminal defense",
  },
  {
    quote:
      "When I needed legal representation during one of the most difficult times in my life, Kohn Law Firm exceeded every expectation. Their team remained responsive, professional, and truly committed to my case.",
    name: "Sean H.",
    practice: "Criminal defense",
  },
  {
    quote:
      "I highly recommend the Kohn Law Firm. Shimon is an amazing attorney and guided me through every step of my case. He was extremely professional, knowledgeable, and continuously put my mind at ease.",
    name: "Shari",
    practice: "Protection orders",
  },
];

const PRACTICE_BY_CATEGORY: Record<string, string> = {
  "criminal-defense": "Criminal defense",
  "family-law": "Family law",
  "protection-orders": "Protection orders",
};

/** Reviews relevant to a practice area first, padded with the rest so the grid stays full. */
export function reviewsFor(categorySlug?: string, limit = 3): Review[] {
  const practice = categorySlug ? PRACTICE_BY_CATEGORY[categorySlug] : undefined;
  if (!practice) return REVIEWS.slice(0, limit);
  const matching = REVIEWS.filter((r) => r.practice === practice);
  const rest = REVIEWS.filter((r) => r.practice !== practice);
  return [...matching, ...rest].slice(0, limit);
}
