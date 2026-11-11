import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { TestimonialsSection } from "@/site/blocks";
import { SITE, practiceArea, practiceService, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, serviceNode, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/divorce-separation
 * Money page: "divorce lawyer colorado springs" and its variants.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/family-law/divorce-separation";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const UPDATED = updatedFor(PATH);

const CRS_TITLE_14 =
  "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-14.pdf";
const FCF400 = "https://www.coloradojudicial.gov/es/media/11126";
const FCF300A =
  "https://www.coloradojudicial.gov/sites/default/files/2025-07/FCF%20300A%20Mediation%20ADR%20Order%20FJ%20signed.pdf";

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { steps: string[] } | { bullets: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const content = {
  meta: {
    title: "Divorce Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Colorado Springs divorce lawyer Erica Bertini explains divorce in El Paso County: the 91-day wait, the $260 filing fee, property division, spousal maintenance and parenting plans.",
  },
  eyebrow: "Family Law · El Paso County",
  h1: "Divorce Lawyer in Colorado Springs",
  answer:
    "The Kohn Law Firm represents spouses going through divorce in Colorado Springs and El Paso County. Erica Bertini leads our family law practice and handles contested and agreed divorces, including cases where a protection order or a criminal charge is part of the picture. You meet with the attorney who handles your case.",
  keyFacts: [
    "One spouse must be domiciled in Colorado for 91 days before filing (C.R.S. 14-10-106).",
    "The court cannot enter the decree until 91 days after it has jurisdiction over the other spouse, even when you agree on everything.",
    "Colorado is a no-fault state. The only ground is that the marriage is irretrievably broken.",
    "The court filing fee for a divorce in Colorado is $260.",
    "Marital property is divided equitably, which can be different from 50/50. Gifts, inheritances and property owned before the marriage are generally separate (C.R.S. 14-10-113).",
  ],
  sections: [
    {
      id: "what-we-do",
      q: "What does a Colorado Springs divorce lawyer do for you?",
      answer:
        "A divorce lawyer files and responds to the paperwork, handles the financial disclosures, negotiates property, maintenance and the parenting plan, and represents you at mediation and hearings in El Paso County District Court.",
      blocks: [
        {
          bullets: [
            "Filing the petition, or responding if your spouse filed first.",
            "Preparing the sworn financial statement and the mandatory disclosures, and reviewing your spouse's.",
            "Asking for temporary orders on support, parenting time and use of the home while the case is open.",
            "Negotiating a separation agreement and parenting plan, and preparing you for mediation.",
            "Presenting your case at the permanent orders hearing if you cannot agree.",
          ],
        },
        {
          p: "Erica Bertini handles our divorce and custody cases. She is a former Deputy District Attorney in Colorado and Illinois. When a divorce overlaps with a criminal case, Shimon Kohn, our founding attorney and a former Deputy District Attorney in Teller and El Paso Counties, handles the criminal side, so both cases are planned together.",
        },
      ],
    },
    {
      id: "how-long",
      q: "How long does a divorce take in Colorado Springs?",
      answer:
        "At least 91 days. Colorado law does not allow a decree until 91 days after the court gets jurisdiction over the other spouse. Agreed divorces can finish soon after that. Cases with disputes over property, maintenance or the children take longer because disclosures, mediation and hearings have to be scheduled.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-106(1)(a)(III)",
            text: "Ninety-one days or more have elapsed since it acquired jurisdiction over the respondent...",
            plain:
              "The clock starts when your spouse is served, signs an acceptance of service, or joins the case as a co-petitioner. Filing together as co-petitioners starts it on the filing date.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "In El Paso County, the court's case management order sets the early deadlines. The parenting class and the initial status conference fall within 42 days of filing, and sworn financial disclosures are due within 42 days of service. Our El Paso County family court guide walks through each step.",
        },
      ],
    },
    {
      id: "cost",
      q: "How much does a divorce cost in Colorado Springs?",
      answer:
        "The court filing fee is $260. Mediation through El Paso County's process costs $150 per party for the first two hours. Attorney fees depend mostly on how many issues are disputed and whether the case needs a hearing. We explain our fees at the first meeting, before you decide to hire us.",
      blocks: [
        {
          bullets: [
            "Filing fee: $260 for the petition.",
            "Mediation: a two-hour minimum at $150 per party, then $75 an hour per party, held remotely.",
            "Other costs that come up in some cases: a business or real estate appraisal, a retirement division order, or a child and family investigator.",
          ],
        },
        {
          p: "The biggest driver of cost is conflict. Agreeing on what you can, bringing complete financial records to the first meeting, and saving attorney time for the issues that really are disputed keeps a divorce affordable.",
        },
      ],
    },
    {
      id: "no-fault",
      q: "Do I need a reason to get divorced in Colorado?",
      answer:
        "No. Colorado is a no-fault state. The court only has to find that the marriage is irretrievably broken. Your spouse does not have to agree, and affairs or other misconduct do not change how property is divided.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-106(1)(a)(II)",
            text: "The court finds that the marriage is irretrievably broken...",
            plain:
              "You do not have to prove wrongdoing. Property is divided without regard to marital misconduct (C.R.S. 14-10-113(1)).",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "If you want to stay legally married, you can ask for a legal separation instead. The court grants it in that form unless the other spouse objects (C.R.S. 14-10-106(2)). The process, disclosures and orders are the same as a divorce.",
        },
      ],
    },
    {
      id: "property",
      q: "How is property divided in a Colorado divorce?",
      answer:
        "Colorado divides marital property equitably, so the split aims to be fair and can differ from 50/50. Marital property is everything either spouse acquired during the marriage, with a few exceptions such as gifts, inheritances and property owned before the marriage.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-113(2)",
            text: '..."marital property" means all property acquired by either spouse subsequent to the marriage...',
            plain:
              "Property acquired by gift or inheritance, property exchanged for pre-marriage property, property acquired after a decree of legal separation, and property excluded by a valid agreement stay separate.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "Growth counts. If a house or account you owned before the marriage went up in value during the marriage, the increase is marital property (C.R.S. 14-10-113(4)).",
        },
        {
          p: "When dividing, the court looks at each spouse's contribution, including work as a homemaker, the value of the separate property each keeps, each spouse's economic circumstances, and who will live in the family home with the children (C.R.S. 14-10-113(1)).",
        },
      ],
    },
    {
      id: "maintenance",
      q: "How is spousal maintenance calculated in Colorado?",
      answer:
        "For marriages of at least three years where the couple's combined income is $240,000 a year or less, Colorado has a guideline: 40% of combined monthly income minus the lower earner's monthly income. If maintenance is not tax-deductible for the payer, the guideline is 80% of that figure, or 75% when combined income is over $10,000 a month. The guideline term grows with the length of the marriage, and after 20 years maintenance can be indefinite.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-114(3)(b)(I)(A)",
            text: "...forty percent of the parties' combined monthly adjusted gross income minus the lower income party's monthly adjusted gross income.",
            plain:
              "Example: spouses earn $6,000 and $2,000 a month. Forty percent of $8,000 is $3,200. Minus $2,000 leaves $1,200 a month. If maintenance is not tax-deductible for the payer, the guideline is 80% of that, or $960 a month, because combined income is $10,000 a month or less (C.R.S. 14-10-114(3)(b)(I)(B)). If the result is zero or negative, the guideline amount is zero.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "The guideline is a starting point. The court first decides whether maintenance is appropriate at all, and it can depart from the guideline after considering the factors in the statute. Above $240,000 combined, the formula does not apply and the court decides from those factors alone. In marriages under three years, there is no guideline, but the court can still award maintenance when the property division alone would not be fair (C.R.S. 14-10-114(3)(h)).",
        },
      ],
    },
    {
      id: "children",
      q: "What happens with the children in a Colorado divorce?",
      answer:
        "The court approves a parenting plan that sets parenting time and decision-making based on the children's best interests, and calculates child support using Colorado's guidelines. Since March 1, 2026, the support calculation gives a parenting time credit based on the number of overnights the children spend with each parent.",
      blocks: [
        {
          p: "Colorado calls custody the allocation of parental responsibilities. Parents can agree on a plan, and the court reviews it against the best-interests factors in C.R.S. 14-10-124. If they cannot agree, the court decides. Our child custody page explains how judges weigh those factors.",
        },
        {
          law: {
            cite: "C.R.S. § 14-10-115(3)(h)",
            text: "...each parent keeps the children for at least one overnight each year and that both parents contribute to the expenses of the children in addition to the payment of child support.",
            plain:
              "This is the definition of shared physical care. Since March 1, 2026, it no longer requires more than 92 overnights. The child support worksheet now applies a parenting time credit from a table based on each parent's overnights (C.R.S. 14-10-115(8)(b)).",
            url: "https://leg.colorado.gov/laws/session-laws/HB25-1159/334/download",
          },
        },
      ],
    },
    {
      id: "temporary-orders",
      q: "What happens before the divorce is final?",
      answer:
        "Either spouse can ask for temporary orders that cover the months while the case is open. They can set temporary maintenance and child support, a temporary parenting schedule, who stays in the home, and orders that keep one spouse from disturbing the other.",
      blocks: [
        {
          p: "The divorce statute lets the court order a spouse not to molest or disturb the peace of the other spouse or any child, and to exclude a spouse from the family home when physical or emotional harm would otherwise result (C.R.S. 14-10-108(2)(b) and (c)). Temporary orders generally end when the final decree is entered.",
        },
      ],
    },
    {
      id: "criminal-overlap",
      q: "What if my divorce involves domestic violence, a protection order or a criminal charge?",
      answer:
        "Then the criminal case and the divorce affect each other. A mandatory protection order from a criminal case can block contact that a parenting plan would allow, and a domestic violence finding limits joint decision-making. Our firm handles both sides, so the cases are planned together.",
      blocks: [
        {
          p: "A mandatory protection order in a criminal case lasts until the criminal case ends, and the criminal court keeps the power to change it (C.R.S. 18-1-1001). In the divorce, if the court finds a parent committed domestic violence, it will not order joint decision-making over the other parent's objection unless it finds they can make decisions together safely (C.R.S. 14-10-124(1.5)(c)(I)).",
        },
        {
          p: "Statements and evidence from one case can show up in the other. When a divorce involves a domestic violence arrest, a DUI or another charge, Shimon Kohn handles the criminal case and Erica Bertini handles the family case. Read more in our guide to how protection orders affect custody.",
        },
      ],
    },
  ] as Sec[],
  local: {
    id: "el-paso-county",
    heading: "Filing for divorce in El Paso County",
    intro:
      "Divorces in Colorado Springs are filed with El Paso County District Court at the Judicial Building, 270 S. Tejon Street. Here is the order things usually happen in.",
    steps: [
      "File the petition with the clerk and pay the $260 filing fee, or file together with your spouse as co-petitioners.",
      "Serve your spouse, or have them sign an acceptance of service. The 91-day waiting period starts here.",
      "Follow the court's case management order. Each parent with minor children takes the parenting class, the court holds an initial status conference within 42 days of filing, and sworn financial disclosures are due within 42 days of service.",
      "Ask for temporary orders if you need support, a parenting schedule or exclusive use of the home while the case is open.",
      "Attend mediation, where you try to settle property, maintenance and the parenting plan before a hearing.",
      "Submit a signed separation agreement and parenting plan, or go to a permanent orders hearing. The court enters the decree no sooner than 91 days after it got jurisdiction over your spouse.",
    ],
    help: "The El Paso County Self-Help Center in Room S101 can explain forms but cannot give legal advice.",
  },
  related: [
    {
      label: "Child custody (allocation of parental responsibilities)",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
    { label: "Child support", to: "/family-law/child-support" },
    {
      label: "El Paso County family court guide",
      to: "/family-law/el-paso-county-family-court-guide",
    },
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
    {
      label: "Will a domestic violence charge affect my custody case?",
      to: "/blog/domestic-violence-charge-and-custody-colorado",
    },
    { label: "Domestic violence defense", to: "/criminal-defense/domestic-violence" },
  ],
  faq: [
    {
      q: "Can I get divorced if my spouse won't agree?",
      a: "Yes. Colorado does not require both spouses to agree to the divorce. The court only has to find the marriage is irretrievably broken. Your spouse must still be served, and the 91-day waiting period still applies.",
    },
    {
      q: "Is Colorado a 50/50 state for dividing property?",
      a: "No. Colorado divides marital property equitably. Many divisions end up close to equal, but the court can divide property unequally after weighing each spouse's contributions and economic circumstances.",
    },
    {
      q: "Can I get maintenance after a short marriage?",
      a: "Possibly. The guideline formula only applies to marriages of at least three years, but the court can award maintenance in a shorter marriage when the property division alone would not be fair.",
    },
    {
      q: "What is the difference between divorce and legal separation in Colorado?",
      a: "The process and orders are the same. A legal separation leaves you legally married. If one spouse asks for legal separation, the court grants it in that form unless the other spouse objects.",
    },
  ],
  sources: [
    {
      label:
        "C.R.S. § 14-10-106 (residency, no-fault ground, 91-day waiting period, legal separation), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-108 (temporary orders), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-113 (division of property), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-114 (spousal maintenance), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label:
        "C.R.S. § 14-10-115 (child support), as amended by HB25-1159, Session Laws 2025, ch. 334 (effective March 1, 2026)",
      url: "https://leg.colorado.gov/laws/session-laws/HB25-1159/334/download",
    },
    {
      label:
        "C.R.S. § 14-10-124 (best interests of the child), as amended by HB26-1309, Session Laws 2026, ch. 163",
      url: "https://leg.colorado.gov/laws/session-laws/HB26-1309/163/download",
    },
    {
      label: "C.R.S. § 18-1-1001 (mandatory protection order), as amended by HB25-1148",
      url: "https://leg.colorado.gov/bill_files/40703/download",
    },
    {
      label: "Colorado Judicial Branch, List of Fees (divorce petition $260; C.R.S. 13-32-101)",
      url: "https://www.coloradojudicial.gov/self-help/list-fees",
    },
    {
      label:
        "4th Judicial District, Domestic Relations Case Management Order (FCF 400), rev. 08/2026",
      url: FCF400,
    },
    { label: "4th Judicial District, Mediation/ADR Order (FCF 300A)", url: FCF300A },
    {
      label: "Colorado Judicial Branch, El Paso County Judicial Building",
      url: "https://www.coloradojudicial.gov/location/el-paso-county-judicial-building",
    },
  ],
  cta: {
    title: "Talk to Erica Bertini about your divorce.",
    body: "Erica leads our family law practice in Colorado Springs. In the first meeting she will explain how Colorado law applies to your property, support and children, and what the case is likely to cost. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/divorce-separation")({
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
    ...C.sections.map((s) => ({ id: s.id, label: s.q })),
    { id: C.local.id, label: C.local.heading },
    { id: "faq", label: "Common questions" },
  ];
  return (
    <PageShell>
      {/* Hero */}
      <section className="bg-ink text-white" data-link-location="hero">
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
            <span className="text-white/80">Divorce</span>
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

      {/* Testimonials ("What our clients are saying"), carried over from the previous version of this page. */}
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
                  <details name="divorce-faq" className="group">
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
      <section className="bg-ink text-white" data-link-location="cta">
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
