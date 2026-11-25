import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { TestimonialsSection } from "@/site/blocks";
import { SITE, practiceArea, practiceService, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, serviceNode, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/child-support
 * Money page: "child support lawyer colorado springs" and its variants. URL kept for existing rankings.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/family-law/child-support";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const UPDATED = updatedFor(PATH);
const FCF400 = "https://www.coloradojudicial.gov/es/media/11126";

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { steps: string[] } | { bullets: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const content = {
  meta: {
    title: "Child Support Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Colorado Springs child support lawyer Erica Bertini explains how Colorado calculates support, the 92-overnight rule, when support ends at 19, the 10% modification test and how unpaid support is enforced.",
  },
  eyebrow: "Family Law · El Paso County",
  h1: "Child Support Lawyer in Colorado Springs",
  answer:
    "The Kohn Law Firm handles child support cases in Colorado Springs and El Paso County: setting support in a divorce or custody case, changing an existing order, and collecting or defending against unpaid support. Erica Bertini leads our family law practice. Colorado sets support with a statewide formula based on both parents' incomes and the number of overnights each parent has.",
  keyFacts: [
    "Colorado child support is based on both parents' combined income, split in proportion to what each parent earns (C.R.S. 14-10-115).",
    "When each parent has the children more than 92 overnights a year, a shared-care calculation applies and usually lowers the payment.",
    "Support normally ends when the youngest child turns 19, or the month after high school graduation if the child is still in school.",
    "A change in circumstances must move support by at least 10% to justify a modification (C.R.S. 14-10-122).",
    "Each unpaid payment becomes a court judgment on its due date, and a passport can be denied once arrears pass $2,500.",
  ],
  sections: [
    {
      id: "how-calculated",
      q: "How is child support calculated in Colorado?",
      answer:
        "Colorado adds both parents' monthly gross incomes, looks up the basic support amount for that combined income and number of children in the statutory schedule, and divides it between the parents by their share of the combined income. Child care, health insurance and large medical costs are added on top, split the same way.",
      blocks: [
        {
          steps: [
            "Add the parents' monthly gross incomes to get the combined income.",
            "Find the basic child support obligation for that combined income and number of children in the schedule in C.R.S. 14-10-115.",
            "Split the basic obligation by income share. If one parent earns $6,000 a month and the other $2,000, they pay 75% and 25%.",
            "Add work-related child care, the children's health insurance premium and extraordinary medical costs, split by the same percentages.",
            "The parent with fewer overnights usually pays their share to the other parent. With shared care, the formula in the next section applies.",
          ],
        },
        {
          p: "The Colorado Judicial Branch publishes free software that runs the official worksheets, and the state child support program links to it. It gives an estimate. The court sets the final number, and the inputs (income, overnights, insurance) are where most disputes happen.",
        },
      ],
    },
    {
      id: "income",
      q: "What counts as income for child support in Colorado?",
      answer:
        "Gross income from almost any source counts: wages, overtime, bonuses, commissions, self-employment income, and benefits such as a military housing allowance. If a parent is voluntarily unemployed or underemployed, the court calculates support on what that parent could earn (C.R.S. 14-10-115(5)(b)), with exceptions such as caring for a child under two.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-115(5)(a)(I)(X)",
            text: "Expense reimbursements or in-kind payments received by a parent in the course of employment, self-employment, or operation of a business if they are significant and reduce personal living expenses;",
            plain:
              "A company car, free housing or a housing allowance can count as income. Colorado courts have counted military BAH this way (In re Marriage of Long, 921 P.2d 67 (Colo. App. 1996)).",
            url: "https://colorado.public.law/statutes/crs_14-10-115",
          },
        },
        {
          p: "Self-employment income is where the numbers move most. Business deductions that reduce taxes do not always reduce income for child support, so tax returns alone rarely tell the full story.",
        },
      ],
    },
    {
      id: "shared-care",
      q: "How does 50/50 or shared parenting time change child support?",
      answer:
        "When each parent has the children more than 92 overnights a year, Colorado uses a shared physical care calculation. The basic obligation is increased by 50% to reflect two households, each parent's share is weighted by the time the children spend with the other parent, and the parent who owes more pays the difference.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-115(3)(h)",
            text: "...each parent keeps the children overnight for more than ninety-two overnights each year and that both parents contribute to the expenses of the children in addition to the payment of child support.",
            plain:
              "Crossing 92 overnights changes the formula. That is why overnights are often the most contested number in a support case.",
            url: "https://colorado.public.law/statutes/crs_14-10-115",
          },
        },
        {
          bullets: [
            "Multiply the basic obligation by 1.5.",
            "Split that amount by income share.",
            "Multiply each parent's share by the percentage of overnights the children spend with the other parent.",
            "Add each parent's share of child care and extraordinary costs. The parent who owes more pays the difference.",
          ],
        },
        {
          p: "Even with an equal 50/50 schedule, the higher earner usually still pays some support, because the formula follows income as well as time.",
        },
      ],
    },
    {
      id: "added-costs",
      q: "What costs are added to child support in Colorado?",
      answer:
        "Three costs are added to the basic obligation and divided by income share: work-related child care, the children's share of health insurance premiums, and uninsured medical costs above $250 per child per calendar year.",
      blocks: [
        {
          bullets: [
            "Child care: net costs from a parent's work, job search or education, after subtracting the federal child care tax credit (C.R.S. 14-10-115(9)).",
            "Health insurance: the premium for the children, with credit to the parent who pays it (C.R.S. 14-10-115(10)).",
            "Extraordinary medical costs: uninsured costs over $250 per child per year, such as orthodontia or therapy (C.R.S. 14-10-115(10)(h)).",
          ],
        },
      ],
    },
    {
      id: "how-long",
      q: "How long does child support last in Colorado?",
      answer:
        "Until the youngest child turns 19. If the child is still in high school at 19, support continues through the end of the month after graduation. Support can continue longer for a child with a disability, and it ends earlier if the child marries or joins active military duty.",
      blocks: [
        {
          p: "These rules come from C.R.S. 14-10-115(13). Parents can also agree in writing to a different end date. Colorado ends support at 19, a year later than in many states, so a parent who stops paying at 18 can build up arrears.",
        },
      ],
    },
    {
      id: "modify",
      q: "How do I change a child support order in Colorado?",
      answer:
        "File a motion to modify with the court. The change in circumstances must be substantial and continuing, and a change that would move support by less than 10% does not qualify. A new amount can only apply from the date you file, so file as soon as your situation changes.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-122(1)(b)",
            text: "...results in less than a ten percent change in the amount of support due per month shall be deemed not to be a substantial and continuing change of circumstances.",
            plain:
              "Run the new numbers first. Common reasons that clear 10%: a job loss or new job, a big raise, a change in overnights, new child care costs, or a child aging out.",
            url: "https://colorado.public.law/statutes/crs_14-10-122",
          },
        },
        {
          p: "Support can be modified only for payments that come due after the motion is filed (C.R.S. 14-10-122(1)(a)). A parent who loses a job and waits three months to file still owes the old amount for those three months.",
        },
      ],
    },
    {
      id: "enforce",
      q: "What happens if the other parent doesn't pay child support?",
      answer:
        "Each missed payment becomes a final court judgment on the day it is due, and interest accrues on it. Unpaid support can be collected through wage withholding, driver's license suspension, passport denial once arrears exceed $2,500, and contempt of court.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-122(1)(c)",
            text: "...a payment becomes a final money judgment, referred to in this section as a support judgment, when it is due and not paid.",
            plain:
              "A judge cannot erase past-due support after the fact. The paying parent's only protection is to file a modification before payments fall behind.",
            url: "https://colorado.public.law/statutes/crs_14-10-122",
          },
        },
        {
          bullets: [
            "Interest: for arrears due on or after July 1, 2021, two percentage points above Colorado's statutory rate, compounded annually (C.R.S. 14-14-106).",
            "Driver's license: the child support program can have the license suspended until the parent agrees to an approved payment plan (C.R.S. 26-13-123).",
            "Passport: the U.S. State Department refuses or revokes a passport when arrears exceed $2,500 (42 U.S.C. 652(k)).",
            "Contempt: the court can find a parent who can pay but refuses in contempt.",
          ],
        },
      ],
    },
    {
      id: "county-or-lawyer",
      q: "Should I use El Paso County Child Support Services or hire a lawyer?",
      answer:
        "El Paso County Child Support Services is free and can establish paternity, locate a parent and enforce support. Its attorneys represent the State of Colorado, not either parent. A private lawyer represents you, can argue disputed income or overnights, and can handle custody and parenting time in the same case.",
      blocks: [
        {
          p: "El Paso County Child Support Services is at 1675 W. Garden of the Gods Road, Colorado Springs, and is operated by Young Williams under contract with the county. Applying is free. Under C.R.S. 26-13-105(2), the attorney in a state child support case represents the people of Colorado and has no attorney-client relationship with either parent.",
        },
        {
          bullets: [
            "The county office works well for straightforward cases: setting support with clear W-2 income, or collecting from a parent who has stopped paying.",
            "A private lawyer matters when income is disputed or self-employed, overnights are contested, custody is also at issue, or you need someone arguing for your position.",
          ],
        },
      ],
    },
  ] as Sec[],
  local: {
    id: "el-paso-county",
    heading: "Child support cases in El Paso County",
    intro:
      "In Colorado Springs, child support is set by El Paso County District Court at the Judicial Building, 270 S. Tejon Street, as part of a divorce, a custody case or a separate support case.",
    steps: [
      "Support is requested in the divorce or allocation of parental responsibilities petition, or in a motion to modify an existing order.",
      "Each parent files a sworn financial statement and exchanges financial disclosures within 42 days of service.",
      "The worksheet is prepared from both parents' incomes, overnights, child care and insurance costs.",
      "Parents can agree on support, usually at mediation, and submit it to the court for approval.",
      "If they cannot agree, the court decides at a hearing and enters the order.",
    ],
    help: "The El Paso County Self-Help Center in Room S101 can explain forms but cannot give legal advice.",
  },
  related: [
    { label: "Divorce lawyer in Colorado Springs", to: "/family-law/divorce-separation" },
    { label: "Colorado spousal maintenance calculator", to: "/family-law/spousal-maintenance" },
    {
      label: "Child custody lawyer in Colorado Springs",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
    {
      label: "El Paso County family court guide",
      to: "/family-law/el-paso-county-family-court-guide",
    },
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
  ],
  faq: [
    {
      q: "What is the minimum child support in Colorado?",
      a: "If the paying parent's monthly adjusted gross income is $650 or less, the minimum is $10 a month. Between $650 and $1,500, the minimum is $50 for one child, rising to $150 for six or more, unless each parent has more than 92 overnights.",
    },
    {
      q: "Does child support end at 18 in Colorado?",
      a: "No. Colorado support usually ends at 19, or the month after high school graduation if the child is still in school at 19.",
    },
    {
      q: "Can I stop paying child support if I lose my job?",
      a: "No. The order stays in place until a court changes it, and each missed payment becomes a judgment. File a motion to modify right away, because a new amount can only start from the date you file.",
    },
    {
      q: "Can parents agree on their own child support amount?",
      a: "Yes, but the court has to approve it before it becomes an enforceable order. Courts compare it to the guideline amount, so bring the worksheet with your agreement.",
    },
  ],
  sources: [
    {
      label: "C.R.S. § 14-10-115 (child support guidelines)",
      url: "https://colorado.public.law/statutes/crs_14-10-115",
    },
    {
      label: "C.R.S. § 14-10-122 (modification and support judgments)",
      url: "https://colorado.public.law/statutes/crs_14-10-122",
    },
    {
      label: "C.R.S. § 14-14-106 (interest on arrears)",
      url: "https://colorado.public.law/statutes/crs_14-14-106",
    },
    {
      label: "C.R.S. § 26-13-105 (state child support attorneys)",
      url: "https://colorado.public.law/statutes/crs_26-13-105",
    },
    {
      label: "C.R.S. § 26-13-123 (driver's license suspension)",
      url: "https://colorado.public.law/statutes/crs_26-13-123",
    },
    {
      label: "42 U.S.C. § 652(k) (passport denial)",
      url: "https://www.law.cornell.edu/uscode/text/42/652",
    },
    {
      label: "Colorado Judicial Branch, child support calculation software",
      url: "https://www.coloradojudicial.gov/self-help/calculate-support-payments",
    },
    {
      label: "Colorado Child Support Services, calculating payments",
      url: "https://childsupport.colorado.gov/calculating-payments",
    },
    {
      label: "El Paso County Child Support Services",
      url: "https://humanservices.elpasoco.com/child-support/",
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
    title: "Talk to Erica Bertini about child support.",
    body: "Erica leads our family law practice in Colorado Springs. Bring recent pay stubs or tax returns and your parenting schedule, and she will walk you through the likely numbers and your options. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/child-support")({
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
            <span className="text-white/80">Child Support</span>
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
                  <details name="child-support-faq" className="group">
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
