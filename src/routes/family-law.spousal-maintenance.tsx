import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { TestimonialsSection } from "@/site/blocks";
import { SITE, practiceArea, practiceService, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, serviceNode, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/spousal-maintenance
 * Guide + calculator: "colorado spousal maintenance calculator" (590/mo), "spousal maintenance colorado",
 * guidelines / formula / duration variants, and "spousal maintenance lawyer colorado".
 * Formula and term table: C.R.S. 14-10-114(3)(b). The term table below reproduces (3)(b)(II)(B) for 36 to 240 months.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/family-law/spousal-maintenance";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const UPDATED = updatedFor(PATH);
const FCF400 = "https://www.coloradojudicial.gov/es/media/11126";

type Law = { cite: string; text: string; plain: string; url: string };
type Block =
  | { p: string }
  | { law: Law }
  | { steps: string[] }
  | { bullets: string[] }
  | { termTable: true };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

/* Guideline term in months for 36 to 150 months of marriage, from the table in C.R.S. 14-10-114(3)(b)(II)(B).
 * From 151 to 240 months the percentage is 50%, so the term is half the months of marriage, rounded up. */
const TERMS_36_TO_150 = [
  11, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15, 16, 16, 17, 17, 18, 18, 18, 19, 19, 20, 20, 21,
  21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32,
  33, 33, 34, 34, 35, 35, 36, 37, 37, 38, 38, 39, 39, 40, 41, 41, 42, 42, 43, 43, 44, 45, 45, 46,
  46, 47, 48, 48, 49, 50, 50, 51, 51, 52, 53, 53, 54, 55, 55, 56, 57, 57, 58, 59, 59, 60, 61, 61,
  62, 63, 63, 64, 65, 66, 66, 67, 68, 68, 69, 70, 71, 71, 72, 73, 74, 74, 75,
];

function guidelineTerm(monthsMarried: number): number | null {
  if (monthsMarried < 36 || monthsMarried > 240) return null;
  if (monthsMarried <= 150) return TERMS_36_TO_150[monthsMarried - 36];
  return Math.ceil(monthsMarried / 2);
}

function guidelinePercent(monthsMarried: number): number {
  return Math.min(50, 31 + (monthsMarried - 36) / 6);
}

const content = {
  meta: {
    title: "Colorado Spousal Maintenance Calculator | The Kohn Law Firm",
    description:
      "Free Colorado spousal maintenance calculator using the C.R.S. 14-10-114 guideline formula and term table, plus how long maintenance lasts, the tax adjustment and how it affects child support.",
  },
  eyebrow: "Family Law · Colorado",
  h1: "Colorado Spousal Maintenance Calculator",
  answer:
    "Colorado's advisory guideline sets spousal maintenance at 40% of the spouses' combined monthly adjusted gross income minus the lower earner's income, then reduces it to 80% or 75% because maintenance is no longer tax-deductible. It applies to marriages of 3 to 20 years with combined income up to $240,000 a year. Use the calculator for an estimate, then read how Colorado courts apply it.",
  keyFacts: [
    "Guideline amount: 40% of combined monthly income minus the lower earner's income, then 80% of that when combined income is $10,000 a month or less, or 75% up to $20,000 a month (C.R.S. 14-10-114(3)(b)(I)).",
    "The guideline applies only to marriages of at least 3 years where combined income is $240,000 a year or less.",
    "The guideline term runs from 11 months for a 3-year marriage to 120 months for a 20-year marriage. After 20 years, the court can order maintenance for a set term or indefinitely.",
    "The guidelines are advisory. The court first decides whether maintenance is appropriate at all.",
    "Maintenance ends when either spouse dies or the receiving spouse remarries or enters a civil union, unless the agreement or decree says otherwise (C.R.S. 14-10-122(2)(a)).",
  ],
  sections: [
    {
      id: "how-calculated",
      q: "How is spousal maintenance calculated in Colorado?",
      answer:
        "Take 40% of the spouses' combined monthly adjusted gross income and subtract the lower earner's monthly adjusted gross income. If combined income is $10,000 a month or less, multiply the result by 80%. If it is between $10,000 and $20,000, multiply by 75%. The higher earner pays.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-114(3)(b)(I)(A)",
            text: "...forty percent of the parties' combined monthly adjusted gross income minus the lower income party's monthly adjusted gross income.",
            plain:
              "If the result is zero or negative, the guideline amount is zero. That happens when the spouses earn about the same.",
            url: "https://law.justia.com/codes/colorado/title-14/dissolution-of-marriage-parental-responsibilities/article-10/section-14-10-114/",
          },
        },
        {
          steps: [
            "One spouse earns $6,000 a month and the other earns $2,000. Combined income is $8,000.",
            "40% of $8,000 is $3,200.",
            "Subtract the lower earner's $2,000. That leaves $1,200.",
            "Combined income is under $10,000, so multiply by 80%. The guideline amount is $960 a month.",
            "A 10-year (120-month) marriage has a guideline term of 54 months, or 4 years and 6 months.",
          ],
        },
        {
          p: "Adjusted gross income means gross income minus court-ordered child support or maintenance a spouse already pays for a prior relationship (C.R.S. 14-10-114(8)(a)). Salary, bonuses, self-employment income and most other income count.",
        },
      ],
    },
    {
      id: "tax-adjustment",
      q: "Why is Colorado maintenance reduced to 80% or 75%?",
      answer:
        "Because maintenance stopped being tax-deductible. For divorce agreements signed after 2018, the paying spouse cannot deduct maintenance and the receiving spouse does not pay federal income tax on it. Colorado lowers the guideline to account for that.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-114(3)(b)(I)(B)",
            text: "...is equal to eighty percent of the amount calculated pursuant to subsection (3)(b)(I)(A) of this section.",
            plain:
              "That is the rule when combined income is $10,000 a month or less. Between $10,000 and $20,000 a month, the guideline is 75% of the formula amount (C.R.S. 14-10-114(3)(b)(I)(C)).",
            url: "https://law.justia.com/codes/colorado/title-14/dissolution-of-marriage-parental-responsibilities/article-10/section-14-10-114/",
          },
        },
        {
          p: "Calculators that skip this step overstate maintenance by 25% to 33%. The federal rule comes from the IRS: payments under agreements executed after 2018 are not deductible by the payer and not included in the recipient's income.",
        },
      ],
    },
    {
      id: "how-long",
      q: "How long does spousal maintenance last in Colorado?",
      answer:
        "The guideline term depends on the length of the marriage: 11 months for a 3-year marriage, rising to 120 months for a 20-year marriage. For marriages longer than 20 years, the court can order maintenance for a set number of years or indefinitely.",
      blocks: [
        {
          bullets: [
            "3 years (36 months): 11 months of maintenance",
            "5 years (60 months): 21 months",
            "10 years (120 months): 54 months",
            "12.5 years (150 months): 75 months",
            "15 years (180 months): 90 months",
            "20 years (240 months): 120 months",
          ],
        },
        { termTable: true },
        {
          p: "Marriage length is measured from the date of marriage to the date the decree enters. For marriages over 20 years, C.R.S. 14-10-114(3)(b)(II)(A) lets the court award maintenance for a specified term of years or for an indefinite term.",
        },
      ],
    },
    {
      id: "when-not-apply",
      q: "When does the Colorado maintenance formula not apply?",
      answer:
        "The formula does not apply when the marriage lasted less than 3 years or when the spouses' combined income is more than $240,000 a year. Even when it applies, it is advisory: the judge decides whether to award maintenance and can set a different amount or term.",
      blocks: [
        {
          bullets: [
            "Marriages under 3 years: there is no guideline, but the court can still award maintenance when the property division alone would not be fair (C.R.S. 14-10-114(3)(h)).",
            "Combined income over $240,000 a year: the court sets maintenance from the statutory factors without the formula (C.R.S. 14-10-114(3.5)).",
            "Every case: the Judicial Branch's guideline form says the calculation is for informational purposes only and that, without an agreement, the court retains full discretion.",
          ],
        },
      ],
    },
    {
      id: "whether-awarded",
      q: "How does a Colorado court decide whether to award maintenance?",
      answer:
        "Before any number, the court looks at each spouse's gross income, the marital property each will receive, each spouse's financial resources including potential income, and the reasonable financial need established during the marriage. Only then does it decide whether maintenance is appropriate, and for how much and how long.",
      blocks: [
        {
          p: "To set a fair amount and term, the court weighs factors that include the paying spouse's ability to pay, the length of the marriage, each spouse's age and health, any education or training the lower earner needs, and any other relevant factor (C.R.S. 14-10-114(3)(a) and (3)(c)).",
        },
        {
          p: "This is why two cases with the same incomes can end differently. A spouse who will receive a large share of marital property, or who has strong earning potential, may receive less than the guideline amount.",
        },
      ],
    },
    {
      id: "child-support",
      q: "How does spousal maintenance affect child support in Colorado?",
      answer:
        "Maintenance is calculated first, then child support. Maintenance paid is subtracted from the payer's income and added to the recipient's income on the child support worksheet. Because it is no longer taxable, the amount is multiplied by 1.25 when combined income is $10,000 a month or less, or by 1.33 above that.",
      blocks: [
        {
          p: "These multipliers come from C.R.S. 14-10-115(3)(a)(II) for the paying parent and 14-10-115(5)(a)(I.5) for the receiving parent. The result is that a larger maintenance award usually means a smaller child support payment from the same spouse.",
        },
      ],
    },
    {
      id: "modify-end",
      q: "Can spousal maintenance be changed or ended in Colorado?",
      answer:
        "Yes. A court can modify maintenance when circumstances have changed so much that the current terms are unfair. Maintenance also ends automatically when either spouse dies or the receiving spouse remarries or enters a civil union, unless the agreement or decree says otherwise.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-122(1)(a)",
            text: "...only upon a showing of changed circumstances so substantial and continuing as to make the terms unfair...",
            plain:
              "A modification only applies to payments that come due after the motion is filed. A paying spouse who loses a job should file right away.",
            url: "https://colorado.public.law/statutes/crs_14-10-122",
          },
        },
      ],
    },
    {
      id: "temporary",
      q: "Can I get spousal maintenance while the divorce is pending?",
      answer:
        "Yes. Either spouse can ask the court for temporary maintenance through temporary orders, which cover the months between filing and the final decree (C.R.S. 14-10-108). Temporary orders end when the final decree enters.",
      blocks: [],
    },
  ] as Sec[],
  local: {
    id: "el-paso-county",
    heading: "Spousal maintenance in El Paso County",
    intro:
      "In Colorado Springs, maintenance is decided by El Paso County District Court at the Judicial Building, 270 S. Tejon Street, as part of a divorce or legal separation.",
    steps: [
      "Request maintenance in the divorce or legal separation petition, or in the response.",
      "Each spouse files a sworn financial statement and exchanges financial disclosures within 42 days of service.",
      "Ask for temporary maintenance if you need support while the case is open.",
      "Try to agree on maintenance at mediation, using the guideline worksheet as the starting point.",
      "If you cannot agree, the court decides at the permanent orders hearing and makes findings on income, need and the statutory factors.",
      "The decree states the monthly amount and how long maintenance lasts.",
    ],
    help: "The El Paso County Self-Help Center in Room S101 can explain forms but cannot give legal advice.",
  },
  related: [
    { label: "Divorce lawyer in Colorado Springs", to: "/family-law/divorce-separation" },
    { label: "Child support lawyer in Colorado Springs", to: "/family-law/child-support" },
    {
      label: "Child custody lawyer in Colorado Springs",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
    {
      label: "El Paso County family court guide",
      to: "/family-law/el-paso-county-family-court-guide",
    },
  ],
  faq: [
    {
      q: "Is alimony the same as spousal maintenance in Colorado?",
      a: "Yes. Colorado law uses the term spousal maintenance for what many states call alimony. The rules are in C.R.S. 14-10-114.",
    },
    {
      q: "Does maintenance end if my ex moves in with someone?",
      a: "Not automatically. Remarriage or a civil union ends it. Living together is not listed as an automatic end in C.R.S. 14-10-122(2)(a), so the paying spouse would need to show changed circumstances that make the current terms unfair.",
    },
    {
      q: "Can I get maintenance if we were married less than 3 years?",
      a: "Possibly. The guideline formula does not apply, but the court can award maintenance when dividing the marital property alone would not be fair.",
    },
    {
      q: "Is spousal maintenance taxable?",
      a: "For divorce agreements signed after 2018, maintenance is not deductible by the paying spouse and is not federal taxable income for the receiving spouse.",
    },
  ],
  sources: [
    {
      label: "C.R.S. § 14-10-114 (spousal maintenance, formula and term table)",
      url: "https://law.justia.com/codes/colorado/title-14/dissolution-of-marriage-parental-responsibilities/article-10/section-14-10-114/",
    },
    {
      label: "C.R.S. § 14-10-115 (child support, maintenance multipliers)",
      url: "https://colorado.public.law/statutes/crs_14-10-115",
    },
    {
      label: "C.R.S. § 14-10-122 (modification and termination)",
      url: "https://colorado.public.law/statutes/crs_14-10-122",
    },
    {
      label: "C.R.S. § 14-10-108 (temporary orders)",
      url: "https://colorado.public.law/statutes/crs_14-10-108",
    },
    {
      label:
        "Colorado Judicial Branch, FCF 425 Spousal/Partner Advisory Maintenance Guidelines Information (rev. 10/14/2025)",
      url: "https://www.coloradojudicial.gov/sites/default/files/2026-01/FCF%20425%20Spousal_Partner%20Advisory%20Maintenance%20Guidelines%20Information.pdf",
    },
    {
      label: "Colorado Judicial Branch, support calculation software",
      url: "https://www.coloradojudicial.gov/self-help/calculate-support-payments",
    },
    {
      label: "IRS Topic No. 452, Alimony and separate maintenance",
      url: "https://www.irs.gov/taxtopics/tc452",
    },
    {
      label:
        "4th Judicial District, Domestic Relations Case Management Order (FCF 400), rev. 08/2026",
      url: FCF400,
    },
    {
      label: "Colorado Judicial Branch, El Paso County Judicial Building",
      url: "https://www.coloradojudicial.gov/location/el-paso-county-judicial-building",
    },
  ],
  cta: {
    title: "Talk to Erica Bertini about spousal maintenance.",
    body: "Erica leads our family law practice in Colorado Springs. Bring both spouses' recent income figures and your marriage date, and she will walk you through the guideline, how a judge is likely to apply it, and your options. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/spousal-maintenance")({
  head: () =>
    pageHead({
      path: PATH,
      ...content.meta,
      jsonLd: [
        webPage({
          path: PATH,
          name: content.meta.title,
          description: content.meta.description,
          modified: UPDATED,
        }),
        faqPage(content.faq.map((f) => ({ q: f.q, a: [f.a] }))),
        serviceNode({ path: PATH, name: service.title, serviceType: area.title }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: area.title, path: area.path },
          { name: service.title, path: PATH },
        ]),
      ],
    }),
  component: Page,
});

function Page() {
  const C = content;
  const toc = [
    { id: "calculator", label: "Maintenance calculator" },
    ...C.sections.map((s) => ({ id: s.id, label: s.q })),
    { id: C.local.id, label: C.local.heading },
    { id: "faq", label: "Common questions" },
  ];
  return (
    <PageShell>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-page py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-white/60">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/family-law" className="hover:text-white">
              Family Law
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Spousal Maintenance</span>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
            {C.eyebrow}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] md:text-5xl">
            {C.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">{C.answer}</p>
          <CtaButtons />
          <p className="mt-8 text-xs text-white/55">
            Written by The Kohn Law Firm · Updated {formatDate(UPDATED)}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-12 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 max-w-3xl">
          {/* Key facts */}
          <aside className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Key facts
            </h2>
            <ul className="mt-4 space-y-3">
              {C.keyFacts.map((f, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </aside>

          <MaintenanceCalculator />

          {C.sections.map((s) => (
            <QSection key={s.id} s={s} />
          ))}

          {/* El Paso County */}
          <section id={C.local.id} className="scroll-mt-28 pt-14">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              {C.local.heading}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-foreground">{C.local.intro}</p>
            <ol className="mt-6 space-y-4">
              {C.local.steps.map((st, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-ink">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[16px] leading-relaxed text-foreground">{st}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">{C.local.help}</p>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <nav aria-label="On this page" className="rounded-lg border border-border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                On this page
              </p>
              <ul className="mt-3 space-y-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block text-sm leading-snug text-foreground hover:text-brand"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="rounded-lg bg-ink p-5 text-white">
              <p className="font-display text-lg font-semibold">Need help with your case?</p>
              <p className="mt-2 text-sm text-white/75">
                Speak with Erica Bertini, who leads our family law practice.
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brass-light"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Testimonials ("What our clients are saying"), shared with the other family law pages. */}
      <TestimonialsSection variant="light" />

      <div className="container-page grid gap-12 pb-14 md:pb-20 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 max-w-3xl">
          {/* Related */}
          <section className="pt-14">
            <h2 className="font-display text-2xl font-semibold text-ink">Related guides</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {C.related.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="group flex h-full items-start justify-between gap-3 rounded-lg border border-border bg-white p-4 text-[15px] font-medium text-brand transition-colors hover:border-brass"
                  >
                    <span>{r.label}</span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-28 pt-14">
            <h2 className="font-display text-2xl font-semibold text-ink">Common questions</h2>
            <ul className="mt-5 divide-y divide-border rounded-lg border border-border bg-white">
              {C.faq.map((f, i) => (
                <li key={i}>
                  <details name="maintenance-faq" className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="font-display text-lg font-medium text-ink">{f.q}</span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-slate transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </section>

          {/* Sources */}
          <section className="pt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Sources
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {C.sources.map((s) => (
                <li key={s.url + s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-4 hover:text-brand"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              This page explains Colorado law in general terms. It is not legal advice about your
              situation. {SITE.disclaimer}
            </p>
          </section>
        </article>
      </div>

      {/* Bottom CTA */}
      <section className="bg-ink text-white">
        <div className="container-page py-14 md:py-16">
          <h2 className="font-display max-w-2xl text-3xl font-semibold">{C.cta.title}</h2>
          <p className="mt-4 max-w-2xl text-white/80">{C.cta.body}</p>
          <CtaButtons />
        </div>
      </section>
    </PageShell>
  );
}

function QSection({ s }: { s: Sec }) {
  return (
    <section id={s.id} className="scroll-mt-28 pt-14">
      <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">{s.q}</h2>
      <p className="mt-4 text-[17px] font-medium leading-relaxed text-foreground">{s.answer}</p>
      <div className="mt-5 space-y-5">
        {s.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </div>
    </section>
  );
}

function BlockView({ b }: { b: Block }) {
  if ("termTable" in b) return <TermTable />;
  if ("p" in b) return <p className="text-[16px] leading-relaxed text-foreground">{b.p}</p>;
  if ("bullets" in b)
    return (
      <ul className="space-y-2 pl-1">
        {b.bullets.map((x, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-foreground">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    );
  if ("steps" in b)
    return (
      <ol className="list-decimal space-y-2 pl-5 text-[16px] leading-relaxed text-foreground">
        {b.steps.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ol>
    );
  return (
    <figure className="rounded-lg border border-border bg-white p-5">
      <figcaption className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-text">
        <a href={b.law.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          What the law says · {b.law.cite}
        </a>
      </figcaption>
      <blockquote className="font-display mt-3 border-l-2 border-border pl-4 text-[17px] italic leading-relaxed text-ink">
        "{b.law.text}"
      </blockquote>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">What it means: </span>
        {b.law.plain}
      </p>
    </figure>
  );
}

function CtaButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        to="/consultation"
        className="inline-flex h-12 items-center rounded-md bg-brass px-6 text-sm font-semibold text-brass-foreground transition-colors hover:bg-brass-light"
      >
        Schedule a Consultation
      </Link>
      <a
        href={SITE.phoneHref}
        className="inline-flex h-12 items-center gap-2 rounded-md border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        <Phone className="h-4 w-4 text-brass-light" /> {SITE.phone}
      </a>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------------- Calculator ---------------- */

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function toNumber(v: string): number {
  const n = Number(v.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function monthsLabel(m: number): string {
  const y = Math.floor(m / 12);
  const r = m % 12;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`);
  if (r) parts.push(`${r} month${r === 1 ? "" : "s"}`);
  return parts.join(" ") || "0 months";
}

type CalcResult =
  | { kind: "empty" }
  | { kind: "short"; months: number }
  | { kind: "high"; annual: number }
  | {
      kind: "ok";
      combined: number;
      lower: number;
      fortyPct: number;
      base: number;
      factor: number;
      amount: number;
      months: number;
      term: number | null;
    };

function calculate(
  incomeA: string,
  incomeB: string,
  years: string,
  extraMonths: string,
): CalcResult {
  const a = toNumber(incomeA);
  const b = toNumber(incomeB);
  const months = Math.floor(toNumber(years)) * 12 + Math.min(11, Math.floor(toNumber(extraMonths)));
  if (!a && !b) return { kind: "empty" };
  if (months < 36) return { kind: "short", months };
  const combined = a + b;
  if (combined * 12 > 240000) return { kind: "high", annual: combined * 12 };
  const lower = Math.min(a, b);
  const fortyPct = combined * 0.4;
  const base = Math.max(0, fortyPct - lower);
  const factor = combined <= 10000 ? 0.8 : 0.75;
  return {
    kind: "ok",
    combined,
    lower,
    fortyPct,
    base,
    factor,
    amount: Math.round(base * factor),
    months,
    term: guidelineTerm(months),
  };
}

function MaintenanceCalculator() {
  const [incomeA, setIncomeA] = useState("6000");
  const [incomeB, setIncomeB] = useState("2000");
  const [years, setYears] = useState("10");
  const [extraMonths, setExtraMonths] = useState("0");
  const r = calculate(incomeA, incomeB, years, extraMonths);

  const field =
    "mt-1.5 h-11 w-full rounded-md border border-border bg-white px-3 text-[16px] text-foreground focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";
  const label = "block text-sm font-semibold text-foreground";

  return (
    <section
      id="calculator"
      className="scroll-mt-28 mt-10 rounded-lg border border-border bg-white p-6 md:p-8"
    >
      <h2 className="font-display text-2xl font-semibold text-ink">
        Spousal maintenance calculator
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Enter each spouse's monthly adjusted gross income: gross income minus any court-ordered
        child support or maintenance already paid for a prior relationship.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Spouse 1 monthly income
          <input
            className={field}
            inputMode="decimal"
            value={incomeA}
            onChange={(e) => setIncomeA(e.target.value)}
            aria-describedby="calc-note"
          />
        </label>
        <label className={label}>
          Spouse 2 monthly income
          <input
            className={field}
            inputMode="decimal"
            value={incomeB}
            onChange={(e) => setIncomeB(e.target.value)}
            aria-describedby="calc-note"
          />
        </label>
        <label className={label}>
          Length of marriage: years
          <input
            className={field}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>
        <label className={label}>
          and months
          <input
            className={field}
            inputMode="numeric"
            value={extraMonths}
            onChange={(e) => setExtraMonths(e.target.value)}
          />
        </label>
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg bg-surface p-5">
        {r.kind === "empty" && (
          <p className="text-[15px] text-muted-foreground">
            Enter both incomes to see the guideline estimate.
          </p>
        )}
        {r.kind === "short" && (
          <p className="text-[15px] leading-relaxed text-foreground">
            A marriage of {monthsLabel(r.months)} is under 3 years, so Colorado's guideline formula
            does not apply. The court can still award maintenance if dividing the marital property
            alone would not be fair.
          </p>
        )}
        {r.kind === "high" && (
          <p className="text-[15px] leading-relaxed text-foreground">
            Combined income of {money(r.annual)} a year is above $240,000, so the guideline formula
            does not apply. The court sets maintenance from the statutory factors.
          </p>
        )}
        {r.kind === "ok" && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
              Guideline estimate
            </p>
            <p className="font-display mt-2 text-3xl font-semibold text-ink">
              {money(r.amount)}{" "}
              <span className="text-lg font-medium text-muted-foreground">per month</span>
            </p>
            <p className="mt-1 text-[15px] text-foreground">
              {r.amount === 0
                ? "The incomes are close enough that the guideline amount is zero."
                : r.term
                  ? `For ${r.term} months (${monthsLabel(r.term)}), paid by the higher earner.`
                  : "Paid by the higher earner. After a marriage of more than 20 years there is no guideline term: the court can order maintenance for a set term or indefinitely."}
            </p>
            <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
              <div className="flex justify-between gap-4">
                <dt>40% of combined income ({money(r.combined)})</dt>
                <dd className="tabular-nums">{money(r.fortyPct)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Minus the lower income</dt>
                <dd className="tabular-nums">−{money(r.lower)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Formula amount</dt>
                <dd className="tabular-nums">{money(r.base)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  Tax adjustment (
                  {r.factor === 0.8
                    ? "80%, combined $10,000/mo or less"
                    : "75%, combined over $10,000/mo"}
                  )
                </dt>
                <dd className="tabular-nums">{money(r.amount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Length of marriage</dt>
                <dd>{monthsLabel(r.months)}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      <p id="calc-note" className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This is an estimate under the advisory guideline in C.R.S. 14-10-114 for divorces where
        maintenance is not tax-deductible. The court decides whether maintenance is appropriate and
        can depart from the guideline.{" "}
        <Link to="/consultation" className="font-semibold text-brand underline underline-offset-4">
          Talk to Erica Bertini about your numbers
        </Link>
        .
      </p>
    </section>
  );
}

function TermTable() {
  const rows: { m: number; pct: number; term: number }[] = [];
  for (let m = 36; m <= 240; m++)
    rows.push({ m, pct: guidelinePercent(m), term: guidelineTerm(m) as number });
  return (
    <details className="group rounded-lg border border-border bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-ink">
          Full guideline term table, 36 to 240 months (C.R.S. 14-10-114(3)(b)(II)(B))
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate transition-transform group-open:rotate-180" />
      </summary>
      <div className="max-h-96 overflow-y-auto px-5 pb-5">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-white text-slate">
            <tr>
              <th className="py-2 font-semibold">Months married</th>
              <th className="py-2 font-semibold">Percentage</th>
              <th className="py-2 font-semibold">Guideline term (months)</th>
            </tr>
          </thead>
          <tbody className="tabular-nums text-foreground">
            {rows.map((row) => (
              <tr key={row.m} className="border-t border-border">
                <td className="py-1.5">{row.m}</td>
                <td className="py-1.5">{row.pct.toFixed(2)}%</td>
                <td className="py-1.5">{row.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
