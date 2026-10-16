import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { SITE, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/protection-orders-and-custody
 * Topic page: how Colorado protection orders affect custody (allocation of parental responsibilities).
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/family-law/protection-orders-and-custody";
const updated = updatedFor(PATH);

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { steps: string[] } | { bullets: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const content = {
  meta: {
    title: "How Protection Orders Affect Custody in Colorado | Kohn Law",
    description:
      "How a Colorado protection order affects custody, parenting time and decision-making, what the statutes say, and how to file in El Paso County.",
  },
  eyebrow: "Family Law · Colorado",
  h1: "How Protection Orders Affect Custody in Colorado",
  answer:
    "A Colorado civil protection order can give one parent temporary care and control of the children for up to one year, set conditions on the other parent's parenting time, or stop parenting time when the court finds the children cannot be kept safe. In the family case, a finding of domestic violence also limits joint decision-making.",
  keyFacts: [
    "Temporary care and control under a civil protection order lasts no more than one year (C.R.S. 13-14-105(1)(e)(I)).",
    "The court can deny parenting time only if it finds the child's or protected party's safety cannot be ensured.",
    "A temporary order needs a finding of imminent danger. The hearing on a permanent order is set within 14 days.",
    "After a domestic violence finding, joint decision-making is not ordered over the other parent's objection unless the court finds the parents can decide cooperatively and safely.",
    "Child-related terms in a civil protection order end when a family court later rules on the same issue.",
  ],
  sections: [
    {
      id: "how-it-affects-custody",
      q: "How does a protection order affect custody in Colorado?",
      answer:
        "A protection order can change who has the children right away. In a civil protection order case, the court can award temporary care and control, set or deny parenting time, and give one parent interim decision-making, all judged by the same best-interests standard used in custody cases.",
      blocks: [
        {
          p: "Colorado does not use the word custody in its statutes. Family courts allocate parental responsibilities, which means parenting time (where the children live and when) and decision-making (education, health care, religion). A protection order can touch both.",
        },
        {
          p: "Two kinds of orders matter most. A civil protection order is one you ask for in a civil case, usually because of domestic abuse. A mandatory protection order is issued automatically in a criminal case when someone is charged with a crime. This page covers the civil order and how it fits with the family case. For the criminal side, see our guide to how a domestic violence charge affects custody.",
        },
        {
          law: {
            cite: "C.R.S. § 13-14-105(1.5)(d)",
            text: "Temporary care and control and interim decision-making responsibility must be determined in accordance with the standard contained in section 14-10-124.",
            plain:
              "The protection order court uses the same best-interests test as a custody case. The question is what arrangement keeps the children safe.",
            url: "https://colorado.public.law/statutes/crs_13-14-105",
          },
        },
      ],
    },
    {
      id: "temporary-custody",
      q: "Can a protection order give me temporary custody of my children?",
      answer:
        "Yes. A Colorado civil protection order can award you temporary care and control of the children for up to one year. The court decides it using the best-interests standard in C.R.S. 14-10-124.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-105(1.5)(a)",
            text: "shall include in the order, at the request of the petitioner or respondent, a provision awarding temporary care and control of any joint or shared minor children of the parties involved for a period of not more than one year after the date on which the temporary care and control is awarded in the temporary protection order",
            plain:
              "Temporary care and control is a short-term arrangement. It is meant to protect the children while a longer-term plan is made in a family case.",
            url: "https://colorado.public.law/statutes/crs_13-14-105",
          },
        },
        {
          p: "The court can also give one parent interim decision-making responsibility. It can only do that when the award is reasonably related to preventing domestic abuse or preventing the child from witnessing domestic abuse (C.R.S. 13-14-105(1)(e)(III)).",
        },
        {
          p: "Because these terms are temporary, most families also need a case in domestic relations court, such as a divorce or an allocation of parental responsibilities case. When that court enters its own order on the same issue, the child-related terms of the civil protection order end (C.R.S. 13-14-108(1)).",
        },
      ],
    },
    {
      id: "parenting-time",
      q: "What happens to parenting time when there's a protection order?",
      answer:
        "The court can allow parenting time with conditions, such as supervision by a third party, or deny it. It can deny parenting time only if it finds that the safety of the child or the protected parent cannot be ensured.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-105(1.5)(b)",
            text: "The order for temporary care and control described in subsection (1.5)(a) of this section may include parenting time responsibilities for both parties involved and any conditions of parenting time, including supervised parenting time by a third party who agrees to the terms of the supervised parenting time, and any costs associated with supervised parenting time, if necessary.",
            plain:
              "Supervision is the most common middle ground. A friend, relative or agency agrees to be present. The court can split the cost between the parents but cannot assign it to a publicly funded agency.",
            url: "https://colorado.public.law/statutes/crs_13-14-105",
          },
        },
        {
          bullets: [
            "Supervised parenting time with an approved third party.",
            "Exchanges at a set place or through another person, so the parents do not meet.",
            "No parenting time, only when the court finds safety cannot be ensured.",
          ],
        },
        {
          p: "Read the order itself. If the children are listed as protected persons, or the order bars contact with them, any visit or call breaks the order until a judge changes it.",
        },
      ],
    },
    {
      id: "decision-making",
      q: "How does a domestic violence finding affect decision-making?",
      answer:
        "If a Colorado court finds that a parent committed domestic violence, it will not order joint decision-making over the other parent's objection unless it finds credible evidence that the parents can make decisions together safely.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1.5)(c)(I)",
            text: "If a court determines by a preponderance of the evidence that a party has committed domestic violence, child abuse or neglect, or sexual assault that resulted in the conception of a child, it is not in the best interests of the child to allocate mutual decision-making responsibility over the objection of the other party or the legal representative of the child unless the court makes specific findings that mutual decision-making can occur without coercion, intimidation, retaliation, or risk of harm to the abused party or the child",
            plain:
              "The court decides whether domestic violence happened by a preponderance of the evidence. If it did, the abused parent's objection usually decides the question, and the court leans toward giving decisions to one parent.",
            url: "https://colorado.public.law/statutes/crs_14-10-124",
          },
        },
        {
          p: "Two more rules apply. The court cannot appoint a parenting coordinator just to make joint decision-making work (C.R.S. 14-10-124(4)(a)(II)(B)). And once it makes a domestic violence finding, the safety and well-being of the child and the abused parent become the court's primary concern when it sets parenting time (C.R.S. 14-10-124(4)(d)).",
        },
        {
          p: "Some websites call this a rebuttable presumption. In the statute, that phrase appears only in the separate rule about a child conceived through sexual assault (C.R.S. 14-10-124(4)(a)(III)). For domestic violence, the test is the objection rule quoted above.",
        },
      ],
    },
    {
      id: "during-divorce",
      q: "Can I get a protection order during my divorce?",
      answer:
        "Yes. You can ask the divorce court for a protection order inside your existing case, or file a separate civil protection order case. The divorce court can also order a spouse not to disturb you or the children and exclude them from the family home.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-104.5(5)",
            text: 'Any district court, in an action commenced under the "Uniform Dissolution of Marriage Act", article 10 of title 14, C.R.S., shall have authority to issue temporary and permanent protection orders pursuant to the provisions of subsection (1) of this section.',
            plain:
              "You file a motion with a supporting affidavit in the divorce case. Either spouse can ask.",
            url: "https://colorado.public.law/statutes/crs_13-14-104.5",
          },
        },
        {
          p: "Separate from a protection order, the divorce statute lets either spouse ask for temporary orders that keep the other spouse from molesting or disturbing the peace of a spouse or any child, and that exclude a spouse from the family home on a showing that physical or emotional harm would otherwise result (C.R.S. 14-10-108(2)(b) and (c)).",
        },
        {
          p: "Courts also have to ask about earlier protection or restraining orders between the parties, and the parties must disclose them (C.R.S. 13-14-104.5(6)).",
        },
      ],
    },
    {
      id: "conflicting-orders",
      q: "What happens if a protection order and a parenting plan conflict?",
      answer:
        "For a civil protection order, the later family court order controls on the same issue. The child-related terms of the protection order end when a domestic relations court enters an order on the same subject. A criminal mandatory protection order stays in place until the criminal court changes it or the case ends.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-108(1)",
            text: 'Any order granted pursuant to section 13-14-105 (1)(c) or (1.5) terminates whenever a subsequent order regarding the same subject matter is granted pursuant to the "Uniform Dissolution of Marriage Act", article 10 of title 14; the "Uniform Child-custody Jurisdiction and Enforcement Act", article 13 of title 14; or the "Colorado Children\'s Code", title 19.',
            plain:
              "Temporary care and control and the parenting time terms of a civil order are placeholders. Once the family court rules on the same subject, its order takes over on that subject.",
            url: "https://colorado.public.law/statutes/crs_13-14-108",
          },
        },
        {
          p: "A mandatory protection order from a criminal case works differently. It lasts until the criminal case ends, and the criminal court keeps the power to enforce, modify or dismiss it (C.R.S. 18-1-1001(1) and (3)(a)). If that order blocks contact a parenting plan would allow, ask the criminal court to modify it. Until it does, the order's terms still apply.",
        },
      ],
    },
  ] as Sec[],
  local: {
    id: "el-paso-county",
    heading: "Protection orders in El Paso County",
    intro:
      "Civil protection orders in Colorado Springs are filed at the El Paso County Judicial Building, 270 S. Tejon Street. Check the court's page or call before you go, because filing times change.",
    steps: [
      "Fill out the Verified Complaint or Motion for Civil Protection Order (JDF 402) from the Colorado Judicial Branch self-help forms.",
      "File it with the Clerk's Office in Room S101. For a same-day hearing, the court's page says to file Monday through Friday between 7:30 and 9:30 a.m. Petitions filed later are heard the next business day.",
      "A judge or magistrate reviews it the same day. A temporary order issues if the court finds imminent danger (C.R.S. 13-14-104.5(7)(a)).",
      "The other party must be served. There is no filing fee and no service fee from a public agency when the order is sought because of domestic abuse, domestic violence, stalking or sexual assault (C.R.S. 13-14-109).",
      "Come back for the permanent order hearing, set no more than 14 days after the temporary order issues. It is extended if the other party cannot be served in time (C.R.S. 13-14-104.5(10)).",
    ],
    help: "The Self-Help Center is also in Room S101 and schedules WebEx appointments at 719-452-5100. Staff can explain forms but cannot give legal advice.",
  },
  related: [
    {
      label: "Will a domestic violence charge affect my custody case?",
      to: "/blog/domestic-violence-charge-and-custody-colorado",
    },
    {
      label: "Can I see my kids if there's a protection order against me?",
      to: "/blog/protection-order-against-me-see-my-kids-colorado",
    },
    { label: "Temporary protection orders", to: "/protection-orders/temporary-protection-order" },
    { label: "Permanent protection orders", to: "/protection-orders/permanent-protection-order" },
    {
      label: "Allocation of parental responsibilities",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
    { label: "Domestic violence defense", to: "/criminal-defense/domestic-violence" },
  ],
  faq: [
    {
      q: "Does a temporary protection order automatically change custody?",
      a: "Only if the order says so. A temporary civil protection order changes custody when the judge includes temporary care and control or parenting time terms. Read the order to see whether it names the children.",
    },
    {
      q: "Can a protection order be changed or dismissed?",
      a: "Yes. The protected party can ask at any time. The restrained party must wait two years after a permanent order issues, or two years after a previous motion was decided, and must file a recent fingerprint-based background check (C.R.S. 13-14-108).",
    },
    {
      q: "What is supervised parenting time?",
      a: "Parenting time with another adult present. Under a protection order, the supervisor must be a third party who agrees to the terms, and the court decides who pays.",
    },
    {
      q: "Does dismissing the protection order restore my parenting time?",
      a: "Not by itself. If a family court has entered parenting orders, those control. If none exist, you may need to file an allocation of parental responsibilities case to set a schedule.",
    },
  ],
  sources: [
    {
      label: "C.R.S. § 13-14-104.5 (procedure for civil protection orders)",
      url: "https://colorado.public.law/statutes/crs_13-14-104.5",
    },
    {
      label: "C.R.S. § 13-14-105 (provisions of civil protection orders)",
      url: "https://colorado.public.law/statutes/crs_13-14-105",
    },
    {
      label: "C.R.S. § 13-14-108 (modification and termination)",
      url: "https://colorado.public.law/statutes/crs_13-14-108",
    },
    {
      label: "C.R.S. § 13-14-109 (fees and costs)",
      url: "https://colorado.public.law/statutes/crs_13-14-109",
    },
    {
      label: "C.R.S. § 14-10-108 (temporary orders in a divorce)",
      url: "https://colorado.public.law/statutes/crs_14-10-108",
    },
    {
      label: "C.R.S. § 14-10-124 (best interests of the child)",
      url: "https://colorado.public.law/statutes/crs_14-10-124",
    },
    {
      label: "C.R.S. § 18-1-1001 (mandatory protection order)",
      url: "https://colorado.public.law/statutes/crs_18-1-1001",
    },
    {
      label: "Colorado Judicial Branch, El Paso County Judicial Building",
      url: "https://www.coloradojudicial.gov/location/el-paso-county-judicial-building",
    },
    {
      label: "Colorado Judicial Branch, El Paso County Self-Help Center",
      url: "https://www.coloradojudicial.gov/courts/trial-courts/el-paso-county/self-help-center",
    },
  ],
  cta: {
    title: "Talk to Erica Bertini about your custody case.",
    body: "Erica leads our family law practice and handles custody cases that involve protection orders and criminal charges. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/protection-orders-and-custody")({
  head: () =>
    pageHead({
      path: PATH,
      ...content.meta,
      jsonLd: [
        webPage({
          path: PATH,
          name: content.meta.title,
          description: content.meta.description,
          modified: updated,
        }),
        faqPage(content.faq.map((f) => ({ q: f.q, a: [f.a] }))),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Family Law", path: "/family-law" },
          { name: "Protection Orders and Custody", path: PATH },
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
            <span className="text-white/80">Protection Orders and Custody</span>
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
            Written by The Kohn Law Firm · Updated {formatDate(updated)}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_280px]">
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
                  <details name="po-faq" className="group">
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
