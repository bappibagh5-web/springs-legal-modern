import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { TestimonialsSection } from "@/site/blocks";
import { SITE, practiceArea, practiceService, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, serviceNode, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/allocation-of-parental-responsibilities
 * Money page: "child custody lawyer colorado springs" and its variants. URL kept for existing rankings.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/family-law/allocation-of-parental-responsibilities";
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
    title: "Child Custody Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Colorado Springs child custody lawyer Erica Bertini explains how El Paso County courts decide parenting time and decision-making, 50/50 schedules, a child's wishes, modifications and unmarried parents.",
  },
  eyebrow: "Family Law · El Paso County",
  h1: "Child Custody Lawyer in Colorado Springs",
  answer:
    "The Kohn Law Firm represents parents in child custody cases in Colorado Springs and El Paso County, during a divorce or between parents who never married. Erica Bertini leads our family law practice. Colorado calls custody the allocation of parental responsibilities, and the court decides it by the child's best interests.",
  keyFacts: [
    "Colorado splits custody into parenting time (where the child lives and when) and decision-making (education, health care, religion).",
    "Neither parent starts with an advantage. The court cannot favor a parent because of their sex (C.R.S. 14-10-124(3)).",
    "There is no age at which a child chooses. A child's wishes count if the child is mature enough to give reasoned, independent preferences.",
    "A request to change decision-making cannot be refiled within two years of the last one, unless the child may be endangered (C.R.S. 14-10-131).",
    "When a parent withholds court-ordered parenting time, the court must order that parent to pay the other parent's attorney fees (C.R.S. 14-10-129.5).",
  ],
  sections: [
    {
      id: "how-decided",
      q: "How do Colorado courts decide child custody?",
      answer:
        "The court decides parenting time and decision-making based on the child's best interests, using the factors in C.R.S. 14-10-124. Parents can agree on a parenting plan, and the court reviews it against those factors. If they cannot agree, the judge decides after a hearing.",
      blocks: [
        {
          bullets: [
            "Each parent's wishes and the child's wishes, if the child is mature enough.",
            "The child's relationships with each parent, siblings and anyone else who significantly affects the child.",
            "How well the child is adjusted to home, school and community.",
            "The mental and physical health of everyone involved. A disability alone cannot be the basis to deny or restrict parenting time.",
            "Each parent's willingness to support the child's relationship with the other parent.",
            "Each parent's past involvement with the child, and whether each can put the child's needs ahead of their own.",
            "How far apart the parents live, because distance affects how a schedule works in practice.",
          ],
        },
        {
          law: {
            cite: "C.R.S. § 14-10-124(2)",
            text: "The court shall not consider conduct of a party that does not affect that party's relationship to the child.",
            plain:
              "An affair, a past mistake or a criminal record matters only to the extent it affects how a parent cares for the child. Domestic violence and child abuse are treated separately, and they weigh heavily.",
            url: CRS_TITLE_14,
          },
        },
      ],
    },
    {
      id: "parenting-time-decision-making",
      q: "What is the difference between parenting time and decision-making?",
      answer:
        "Parenting time is the schedule: where the child lives and when. Decision-making is the authority over major decisions such as school, non-emergency health care and religion. The court can give both parents joint decision-making while giving one parent more time, or split decisions by topic.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1.5)(b)(I)",
            text: "Credible evidence of the ability of the parties to cooperate and to make decisions jointly...",
            plain:
              "For decision-making, the court adds this factor and asks whether the parents' history shows they can make decisions together. Parents who cannot communicate often end up with one parent deciding some or all issues.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "Older terms like sole custody, joint custody and visitation are not used in Colorado statutes. You will still hear them, and judges know what people mean, but the orders themselves speak in terms of parenting time and decision-making responsibility.",
        },
      ],
    },
    {
      id: "fifty-fifty",
      q: "Can I get 50/50 custody in Colorado?",
      answer:
        "Yes, if an equal schedule serves your child's best interests. Colorado has no automatic 50/50 rule in either direction. The law favors frequent and continuing contact with both parents, and whether an equal split works depends on distance, school, work schedules and how well the parents cooperate.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1)",
            text: "...encourage frequent and continuing contact between each parent and the minor children of the marriage.",
            plain:
              "This is the policy behind the factors. It supports meaningful time with both parents but does not require equal time.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "You may read online that a parent with fewer than 90 or so overnights is the primary parent. That number comes from the child support statute, which used more than 92 overnights a year as the line for shared physical care. Since March 1, 2026, that line is gone: the support worksheet gives a parenting time credit based on each parent's number of overnights (C.R.S. 14-10-115(3)(h) and (8)(b)). It affects support, not the custody label.",
        },
      ],
    },
    {
      id: "child-choose",
      q: "At what age can a child choose which parent to live with in Colorado?",
      answer:
        "There is no set age. A Colorado court considers a child's wishes when the child is mature enough to express reasoned and independent preferences. The judge weighs those wishes with every other factor, and the child does not get the final say.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1.5)(a)(II)",
            text: "...sufficiently mature to express reasoned and independent preferences as to the parenting time schedule.",
            plain:
              "A teenager's settled, well-reasoned view carries more weight than a young child's or a preference that seems coached by a parent.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "Instead of having a child testify, the court can appoint a child and family investigator, a neutral attorney or mental health professional who talks with the child and the parents and writes a report with recommendations. If the child expresses wishes, the investigator must disclose them in the report, and the court considers the whole report before adopting any recommendation (C.R.S. 14-10-116.5(2)(b)).",
        },
      ],
    },
    {
      id: "unmarried-parents",
      q: "How does custody work for unmarried parents in Colorado?",
      answer:
        "The same best-interests rules apply. The difference is that legal parentage has to be established first if it is not already. After that, either parent can file a case for allocation of parental responsibilities in El Paso County to set parenting time, decision-making and child support.",
      blocks: [
        {
          p: "A parent married to the birth parent when the child is born is presumed to be a legal parent (C.R.S. 19-4-105(1)(a)). Unmarried parents usually establish parentage by signing a voluntary acknowledgment of parentage, often at the hospital. Once it is filed with the state registrar, it has the same effect as a court finding of parentage. Either signer can rescind it within 60 days, or until a court or support proceeding involving the child starts, if that comes first (C.R.S. 19-4-105(2)(b)).",
        },
        {
          p: "If there is no acknowledgment, parentage can be decided in court, often with genetic testing. Fathers and mothers stand on equal footing in the custody case that follows, because the court cannot presume either parent is better because of sex (C.R.S. 14-10-124(3)).",
        },
      ],
    },
    {
      id: "modify",
      q: "How do I modify a custody order in Colorado?",
      answer:
        "File a motion to modify. Smaller parenting time changes need only to serve the child's best interests. A change that substantially alters the schedule and moves the child's majority-time home to the other parent needs more, such as both parents agreeing, a relocation, or proof that the current situation endangers the child.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-129(2)(d)",
            text: "...endangers the child's physical health or significantly impairs the child's emotional development...",
            plain:
              "When a parent asks to become the majority-time parent without the other's agreement, the court keeps the current arrangement unless the child's present environment is harmful in this way and the benefits of a change outweigh the harm of moving the child.",
            url: CRS_TITLE_14,
          },
        },
        {
          p: "Decision-making has a two-year rule. After a motion to modify decision-making is decided, another one cannot be filed for two years unless affidavits show the current order may endanger the child's physical health or significantly impair the child's emotional development (C.R.S. 14-10-131(1)).",
        },
      ],
    },
    {
      id: "enforce",
      q: "What can I do if the other parent won't follow the parenting plan?",
      answer:
        "File a verified motion for parenting time enforcement. The court must act on it within 35 days by setting a hearing, ordering mediation or denying it. If it finds a violation, it can order make-up time, counseling, a bond, fines or contempt, and it must order the violating parent to pay your attorney fees.",
      blocks: [
        {
          bullets: [
            "Make-up parenting time of the same type and length, within six months, or within a year if six months is not enough.",
            "Parenting classes or family counseling at the violating parent's expense.",
            "A bond or security to make sure future orders are followed.",
            "A civil fine of up to $100 for each incident of denied parenting time, or contempt of court.",
            "A hearing on changing parenting time or decision-making.",
          ],
        },
        {
          p: "Child support and parenting time are separate. The court cannot make child support depend on parenting time (C.R.S. 14-10-129.5(2)(a)). Keep records of missed exchanges and messages, because they become your evidence.",
        },
      ],
    },
    {
      id: "domestic-violence",
      q: "How does domestic violence or a protection order affect custody?",
      answer:
        "Significantly. If the court finds a parent committed domestic violence, it will not order joint decision-making over the other parent's objection unless it finds the parents can decide together safely, and the safety of the child and the abused parent becomes the court's main concern in setting parenting time.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1.5)(c)(I)",
            text: "If a court determines by a preponderance of the evidence that a party has committed domestic violence, child abuse or neglect, or sexual assault that resulted in the conception of a child, it is not in the best interests of the child to allocate mutual decision-making responsibility over the objection of the other party or the legal representative of the child unless the court makes specific findings that mutual decision-making can occur without coercion, intimidation, retaliation, or risk of harm to the abused party or the child...",
            plain:
              "A civil protection order can also give one parent temporary care of the children for up to a year. Our guide to how protection orders affect custody covers the details.",
            url: "https://leg.colorado.gov/laws/session-laws/HB26-1309/163/download",
          },
        },
        {
          p: "When a custody case runs alongside a criminal case, such as a domestic violence charge, Shimon Kohn handles the criminal side and Erica Bertini handles the custody case, so a mandatory protection order and the parenting plan are planned together.",
        },
      ],
    },
    {
      id: "relocation",
      q: "Can I move out of Colorado Springs with my child?",
      answer:
        "If you have a parenting order, not without written notice and, if the other parent objects, a court decision. The parent who wants to move must give written notice as soon as practicable with the new location, the reason, and a proposed revised parenting plan. Relocation hearings get priority on the court's docket.",
      blocks: [
        {
          p: "If the majority-time parent's move would substantially change the child's ties to the other parent, the court weighs factors including the reasons for the move, its expected impact on the child, the objecting parent's reasons, each parent's history with the child, schools, extended family, and whether a workable long-distance schedule is possible (C.R.S. 14-10-129).",
        },
      ],
    },
  ] as Sec[],
  local: {
    id: "el-paso-county",
    heading: "Custody cases in El Paso County",
    intro:
      "Custody cases in Colorado Springs are filed with El Paso County District Court at the Judicial Building, 270 S. Tejon Street, either inside a divorce or as a separate case for allocation of parental responsibilities.",
    steps: [
      "File the petition for allocation of parental responsibilities, or include the children in your divorce petition. If parentage is not established, it is decided first.",
      "Serve the other parent, or have them sign an acceptance of service.",
      "Follow the case management order. Each parent takes the required parenting class, and the court holds an initial status conference within 42 days of filing.",
      "Ask for temporary orders if you need a parenting schedule or child support while the case is open.",
      "Attend mediation to try to agree on a parenting plan.",
      "If you still disagree, the court may appoint a child and family investigator or a parental responsibilities evaluator, then decides at a hearing.",
    ],
    help: "The El Paso County Self-Help Center in Room S101 can explain forms but cannot give legal advice.",
  },
  related: [
    { label: "Divorce lawyer in Colorado Springs", to: "/family-law/divorce-separation" },
    { label: "Child support", to: "/family-law/child-support" },
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
    {
      label: "Can I see my kids if there's a protection order against me?",
      to: "/blog/protection-order-against-me-see-my-kids-colorado",
    },
    {
      label: "El Paso County family court guide",
      to: "/family-law/el-paso-county-family-court-guide",
    },
    { label: "Domestic violence defense", to: "/criminal-defense/domestic-violence" },
  ],
  faq: [
    {
      q: "Do mothers get custody preference in Colorado?",
      a: "No. A Colorado court cannot presume either parent is better able to serve the child's best interests because of sex. Mothers and fathers start on equal footing.",
    },
    {
      q: "Is joint decision-making the same as 50/50 custody?",
      a: "No. Joint decision-making means both parents share major decisions. Parenting time is set separately and can be unequal even when decisions are shared.",
    },
    {
      q: "Does a criminal record or DUI affect custody?",
      a: "Only if it affects your relationship with your child. The court cannot consider conduct that does not affect that relationship, but recent substance abuse, domestic violence or charges involving children can weigh heavily.",
    },
    {
      q: "Can I stop parenting time if the other parent doesn't pay child support?",
      a: "No. Colorado treats child support and parenting time as separate obligations. Withholding the children can lead to make-up time, fines and an order to pay the other parent's attorney fees. Enforce unpaid support through the court instead.",
    },
  ],
  sources: [
    {
      label:
        "C.R.S. § 14-10-115 (child support, shared physical care), as amended by HB25-1159, Session Laws 2025, ch. 334 (effective March 1, 2026)",
      url: "https://leg.colorado.gov/laws/session-laws/HB25-1159/334/download",
    },
    {
      label: "C.R.S. § 14-10-116.5 (child and family investigator), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-124 (best interests of the child), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label:
        "C.R.S. § 14-10-124(1.5)(c) (domestic violence and decision-making), added by HB26-1309, Session Laws 2026, ch. 163",
      url: "https://leg.colorado.gov/laws/session-laws/HB26-1309/163/download",
    },
    {
      label:
        "C.R.S. § 14-10-129 (modifying parenting time, relocation), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-129.5 (enforcing parenting time), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label: "C.R.S. § 14-10-131 (modifying decision-making), Colorado Revised Statutes 2024",
      url: CRS_TITLE_14,
    },
    {
      label:
        "C.R.S. § 19-4-105 (presumption and acknowledgment of parentage), Colorado Revised Statutes 2024",
      url: "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-19.pdf",
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
    title: "Talk to Erica Bertini about your custody case.",
    body: "Erica leads our family law practice in Colorado Springs. In the first meeting she will look at your current schedule, what the court is likely to weigh, and the realistic options for your child. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/allocation-of-parental-responsibilities")({
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
            <span className="text-white/80">Child Custody</span>
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
                  <details name="custody-faq" className="group">
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
