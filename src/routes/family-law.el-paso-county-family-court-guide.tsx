import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { SITE, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /family-law/el-paso-county-family-court-guide
 * Local guide: filing, parenting class, first hearing, mediation and timing in El Paso County, Colorado
 * (4th Judicial District, Colorado Springs). Local facts come from the court's own orders and pages.
 * Filing fee checked 2026-10-17 against the Colorado Judicial Branch List of Fees: $260 for a divorce petition
 * (C.R.S. 13-32-101; increased January 1, 2025 by HB24-1286).
 */

const PATH = "/family-law/el-paso-county-family-court-guide";
const updated = updatedFor(PATH);

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { steps: string[] } | { bullets: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const FCF400 = "https://www.coloradojudicial.gov/es/media/11126";
const FCF300A =
  "https://www.coloradojudicial.gov/sites/default/files/2025-07/FCF%20300A%20Mediation%20ADR%20Order%20FJ%20signed.pdf";

const content = {
  meta: {
    title: "El Paso County, Colorado Family Court Guide (Colorado Springs) | Kohn Law",
    description:
      "How divorce and custody cases work in El Paso County, Colorado: where to file, the required parenting class, the first hearing, mandatory mediation and timing.",
  },
  eyebrow: "Family Law · El Paso County, Colorado",
  h1: "El Paso County, Colorado Family Court Guide",
  answer:
    "Divorce and custody cases in Colorado Springs are filed in El Paso County District Court, part of Colorado's 4th Judicial District, at 270 S. Tejon Street. Every case gets a case management order that sets three early deadlines: a parenting class, an initial status conference and financial disclosures, each within 42 days. Contested issues must go to mediation before a hearing.",
  keyFacts: [
    "Court: El Paso County Judicial Building, 270 S. Tejon St., Colorado Springs. Clerk's Office and Self-Help Center in Room S101.",
    "Parents of children under 18 must attend a Level 1 parenting seminar within 42 days of filing (Case Management Order FCF 400).",
    "The initial status conference must take place within 42 days of filing, usually with a Family Court Facilitator.",
    "Mediation is mandatory for contested issues: a two-hour minimum session, held remotely. Court-contract mediators charge $150 per party.",
    "No divorce decree can enter until 91 days after the court has jurisdiction over the other spouse (C.R.S. 14-10-106).",
  ],
  sections: [
    {
      id: "where-is-family-court",
      q: "Where is family court in Colorado Springs?",
      answer:
        "Family court for Colorado Springs is El Paso County District Court, in the El Paso County Judicial Building at 270 S. Tejon Street, Colorado Springs, CO 80903. The Clerk's Office is in Room S101 and is open Monday through Friday, 7:30 a.m. to 4:30 p.m.",
      blocks: [
        {
          p: "El Paso County and Teller County together make up Colorado's 4th Judicial District. Divorce, legal separation, allocation of parental responsibilities (custody), child support and protection order cases for Colorado Springs are all handled here.",
        },
        {
          bullets: [
            "Clerk's Office, Room S101: Monday to Friday, 7:30 a.m. to 4:30 p.m.",
            "Self-Help Center, Room S101: Monday, Tuesday, Thursday and Friday, 7:30 a.m. to 4:30 p.m.; Wednesday, 7:30 a.m. to noon. WebEx appointments: 719-452-5100.",
            "Family Court Facilitator's Office, for general questions about family cases: 719-452-5104.",
          ],
        },
        {
          p: "Self-Help Center staff can explain forms and steps, but they cannot give legal advice.",
        },
      ],
    },
    {
      id: "how-to-file",
      q: "How do I file for divorce in El Paso County, Colorado?",
      answer:
        "File a Case Information Sheet (JDF 1000) and a Petition for Dissolution of Marriage (JDF 1101) with El Paso County District Court, pay the filing fee or ask for a fee waiver, and have your spouse served unless you file together. At least one spouse must have lived in Colorado for 91 days before filing.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-106(1)(a)(I)",
            text: "The court finds that one of the parties has been domiciled in this state for ninety-one days next preceding the commencement of the proceeding",
            plain:
              "One spouse must have lived in Colorado for at least 91 days before the petition is filed. If you have children, file in the county where they have lived for the last 182 days.",
            url: "https://colorado.public.law/statutes/crs_14-10-106",
          },
        },
        {
          steps: [
            "Complete JDF 1000 (Case Information Sheet) and JDF 1101 (Petition). Both are required whether you file jointly or separately.",
            "If you file alone, also complete JDF 1102 (Summons). Your spouse is then served in person, or signs a Waiver of Service (JDF 1102(a)). File the Return of Service (JDF 1102(b)) or the waiver with the court.",
            "File in person at the Clerk's Office (Room S101) or through Colorado's e-filing system. The filing fee to start the case is $260. You can ask the court to waive it with JDF 205 and JDF 206, but fees cannot be waived when you e-file.",
            "The court issues its Case Management Order (FCF 400) and a notice of your initial status conference. Read the order closely: it sets your deadlines.",
            "Exchange financial disclosures within 42 days of service, including a Sworn Financial Statement (JDF 1111), and file a Certificate of Compliance (JDF 1104).",
          ],
        },
        {
          p: "Missing the disclosure deadline can lead to sanctions against the party who does not comply (FCF 400).",
        },
      ],
    },
    {
      id: "parenting-class",
      q: "Is a parenting class required in El Paso County, Colorado?",
      answer:
        "Yes. In El Paso County, every parent with a child under 18 in a divorce or custody case must attend a Level 1 parenting seminar within 42 days of filing and file the certificate with the court. The requirement comes from the 4th Judicial District's Case Management Order.",
      blocks: [
        {
          p: "Colorado law lets courts order a parenting class (C.R.S. 14-10-123.7(2)). The 4th Judicial District makes it standard: its Case Management Order (FCF 400, revised August 2026) requires it of every parent with a child under 18.",
        },
        {
          bullets: [
            "Who: each parent with a child under 18 in the case.",
            "When: within 42 days of the case being filed.",
            "Where: any approved provider. The 4th Judicial District website lists providers and costs.",
            "Proof: file a copy of your certificate with the court. Certificates are not accepted by email.",
            "Cost: paid by the parents, based on each parent's ability to pay (C.R.S. 14-10-123.7(3)).",
          ],
        },
      ],
    },
    {
      id: "first-hearing",
      q: "What happens at the first hearing in an El Paso County custody or divorce case?",
      answer:
        "The first court event is an initial status conference, which must happen within 42 days of filing. It is usually held with a Family Court Facilitator, sometimes with a judge or magistrate, and its job is to check your case's progress and set next steps.",
      blocks: [
        {
          p: "It is a case management meeting. The facilitator checks whether service and disclosures are complete, which issues you agree on, and what still needs to happen, including mediation. You can schedule mediation through the court's mediation office at the conference.",
        },
        {
          bullets: [
            "It is not confidential and may be held in a group with other cases at the same time.",
            "Your notice gives appearance instructions and login details.",
            "Missing it can lead to fees or costs against you, or dismissal of your case (FCF 400).",
          ],
        },
      ],
    },
    {
      id: "mediation",
      q: "Is mediation required for divorce in El Paso County, Colorado?",
      answer:
        "Yes, for any contested issue. The 4th Judicial District has a standing order requiring at least a two-hour mediation session before a court hearing. Sessions are remote, and the court's contract mediators charge $150 per party for the first two hours.",
      blocks: [
        {
          p: "The requirement comes from the district's mediation order (FCF 300A), issued under Colorado's dispute resolution statute (C.R.S. 13-22-311), and from the Case Management Order, which says your final orders date may be canceled or your case dismissed if you do not complete mediation.",
        },
        {
          bullets: [
            "Mediator: any qualified private mediator, or a contract mediator through the 4th Judicial District Office of Dispute Resolution (04JDMediation@judicial.state.co.us).",
            "Cost through the court office: $150 per party for the two-hour session, $75 per hour per party after that, paid directly to the mediator. Fee reductions are available with JDF 211 for parties without a private attorney.",
            "Format: all sessions are remote. Each party attends from their own device, and children may not attend or listen.",
            "Timing: sessions are usually set four to five weeks out. Cancelling with less than seven days' notice can cost up to two hours.",
            "Abuse: a party unwilling to mediate because of physical or psychological abuse can ask the court to waive mediation by filing a motion.",
            "Proof: the mediator files a Certificate of Mediation/ADR Compliance (JDF 1337) within five business days.",
          ],
        },
        {
          p: "If you reach a full agreement and file it at least seven days before mediation, you can cancel without charge once the Mediation Office confirms the cancellation.",
        },
      ],
    },
    {
      id: "how-long",
      q: "How long does a divorce take in El Paso County, Colorado?",
      answer:
        "At least 91 days. Colorado law bars a final decree until 91 days after the court gains jurisdiction over the other spouse, through service, a signed waiver or a joint filing. How much longer it takes depends on whether you agree and how quickly the local steps get done.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-106(1)(a)(III)",
            text: "The court finds that ninety-one days or more have elapsed since it acquired jurisdiction over the respondent either as the result of process pursuant to rule 4 of the Colorado rules of civil procedure or as the result of the act of the respondent in joining as copetitioner in the petition or in entering an appearance in any other manner.",
            plain:
              "The 91-day clock starts when your spouse is served, signs a waiver, or files jointly with you. It does not start on the date you file alone.",
            url: "https://colorado.public.law/statutes/crs_14-10-106",
          },
        },
        {
          p: "In El Paso County, the early deadlines all fall within the first six weeks: parenting class within 42 days of filing, initial status conference within 42 days of filing, and disclosures within 42 days of service. Contested cases then add mediation, usually booked four to five weeks ahead, before any hearing.",
        },
      ],
    },
  ] as Sec[],
  local: {
    id: "free-help",
    heading: "Free help in El Paso County",
    intro:
      "If you are handling part of your case yourself, the court offers several free resources.",
    steps: [
      "Self-Help Center, Room S101, El Paso County Judicial Building. Book WebEx appointments at 719-452-5100 or email 04SelfHelp@judicial.state.co.us (allow 48 hours).",
      "Family Court Facilitator's Office: 719-452-5104 for general questions about family cases.",
      "Free attorney advice line: Wednesdays, 7:00 to 8:30 p.m., at 719-473-6212.",
      "Colorado Judicial Branch self-help forms, including every JDF form named on this page.",
    ],
    help: "These services explain procedure. They cannot advise you on your own case or represent you.",
  },
  related: [
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
    { label: "Divorce & child custody", to: "/family-law/divorce-separation" },
    {
      label: "Allocation of parental responsibilities",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
    { label: "Child support", to: "/family-law/child-support" },
  ],
  faq: [
    {
      q: "Do we still need the parenting class if we agree on everything?",
      a: "Yes. The Case Management Order applies to all parents with children under 18, whether or not the case is contested.",
    },
    {
      q: "Do we need mediation if we agree on everything?",
      a: "Mediation is mandatory for contested issues. If you file a full agreement at least seven days before a scheduled session, you can cancel it at no charge once the Mediation Office confirms.",
    },
    {
      q: "Can I file for divorce online in El Paso County?",
      a: "Yes, through Colorado's e-filing system. E-filing adds a convenience fee and a service fee to each filing, and filing fees cannot be waived when you e-file.",
    },
    {
      q: "Is the initial status conference private?",
      a: "No. It is not confidential and may be held in a group setting with other cases.",
    },
  ],
  sources: [
    {
      label:
        "4th Judicial District, Domestic Relations Case Management Order (FCF 400), rev. 08/2026",
      url: FCF400,
    },
    { label: "4th Judicial District, Mediation/ADR Order (FCF 300A)", url: FCF300A },
    {
      label: "4th Judicial District Mediation Office",
      url: "https://www.coloradojudicial.gov/find-odr-mediator-4th-judicial-district",
    },
    {
      label: "Colorado Judicial Branch, El Paso County Judicial Building",
      url: "https://www.coloradojudicial.gov/location/el-paso-county-judicial-building",
    },
    {
      label: "Colorado Judicial Branch, El Paso County Self-Help Center",
      url: "https://www.coloradojudicial.gov/courts/trial-courts/el-paso-county/self-help-center",
    },
    {
      label: "Colorado Legal Help Center, divorce with children: forms and fees",
      url: "https://lawhelp.colorado.gov/DivorceKids2",
    },
    {
      label: "C.R.S. § 14-10-106 (residency and 91-day waiting period)",
      url: "https://colorado.public.law/statutes/crs_14-10-106",
    },
    {
      label: "C.R.S. § 14-10-123.7 (parenting education programs)",
      url: "https://colorado.public.law/statutes/crs_14-10-123.7",
    },
  ],
  cta: {
    title: "Talk to Erica Bertini about your El Paso County case.",
    body: "Erica leads our family law practice and handles divorce and custody cases in El Paso County District Court. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/family-law/el-paso-county-family-court-guide")({
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
          { name: "El Paso County Court Guide", path: PATH },
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
            <span className="text-white/80">El Paso County Court Guide</span>
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
                  <details name="guide-faq" className="group">
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
