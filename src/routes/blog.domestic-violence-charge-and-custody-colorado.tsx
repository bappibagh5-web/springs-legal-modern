import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { SITE, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /blog/domestic-violence-charge-and-custody-colorado
 * Article: how a criminal domestic violence charge and its mandatory protection order affect a custody case.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/blog/domestic-violence-charge-and-custody-colorado";
const updated = updatedFor(PATH);

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { bullets: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const content = {
  meta: {
    title: "Will a Domestic Violence Charge Affect My Custody Case in Colorado?",
    description:
      "How a Colorado domestic violence charge, its mandatory protection order and the family court's own findings affect parenting time and decision-making.",
  },
  eyebrow: "Criminal Defense + Family Law · Colorado",
  h1: "Will a Domestic Violence Charge Affect My Custody Case in Colorado?",
  answerBox:
    "Yes. A domestic violence charge in Colorado comes with an automatic mandatory protection order that can limit contact with the other parent and sometimes the children. The family court also decides for itself whether domestic violence happened, and a finding limits joint decision-making even if the criminal case is still open.",
  keyFacts: [
    "Anyone charged with a crime under Title 18, Colorado's criminal code, is subject to a mandatory protection order from the time they are advised of their rights at arraignment or first appearance and informed of the order (C.R.S. 18-1-1001(1)(a)).",
    "It lasts until the case ends: dismissal, acquittal or a completed sentence (C.R.S. 18-1-1001(8)(b)), unless the court orders otherwise (C.R.S. 18-1-1001(1)(a)).",
    "Only the criminal court can change it. The defendant or the district attorney can ask at any time (C.R.S. 18-1-1001(3)(a)(I)).",
    "The family court decides whether domestic violence happened by a preponderance of the evidence, with findings on the record (C.R.S. 14-10-124(1.5)(a)(III.5)).",
  ],
  sections: [
    {
      id: "automatic-order",
      q: "Does a domestic violence arrest create an automatic protection order?",
      answer:
        "Yes. In Colorado, a mandatory protection order takes effect against anyone charged with a crime under Title 18, the criminal code, once they are informed of it at arraignment or first appearance. No one has to ask for it.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 18-1-1001(1)(a)",
            text: "There is created a mandatory protection order against a person charged with a criminal violation of the provisions of this title 18, which order remains in effect from the time that the person is advised of the person's rights at arraignment or the person's first appearance before the court and is informed of the order until final disposition of the action, unless otherwise ordered by the court pursuant to subsection (3)(a) or (6.5) of this section.",
            plain:
              "The order must bar harassing, molesting, intimidating, retaliating against or tampering with any witness or victim (C.R.S. 18-1-1001(1)(a)). On the district attorney's motion or its own, the court can add terms such as staying away from the alleged victim's home, no contact, and no firearms or other weapons (C.R.S. 18-1-1001(3)(a)(II)).",
            url: "https://leg.colorado.gov/bill_files/40703/download",
          },
        },
        {
          p: "In some domestic violence cases involving force, the order also requires you to give up firearms and ammunition for as long as it lasts (C.R.S. 18-1-1001(9)). Read the written order you received at your first appearance. Its exact terms decide what you can and cannot do.",
        },
      ],
    },
    {
      id: "contact-with-kids",
      q: "Can I contact my kids while the criminal case is open?",
      answer:
        "It depends on the written order. If your children are named as victims or witnesses, or the court added a no-contact term that covers them, any contact breaks the order. If they are not covered, contact with them may be allowed, but you still cannot use them to reach the protected parent.",
      blocks: [
        {
          p: "Many families end up with an order that protects one parent while the children are not listed. Contact with the children is then possible in principle, but every exchange risks contact with the protected parent. Messages passed through the children can count as contact with the protected parent.",
        },
        {
          p: "The safe approach is to get written permission from a court before you see or call the children: either a modification of the mandatory protection order, or parenting orders from the family court that the criminal order allows.",
        },
      ],
    },
    {
      id: "conflicting-orders",
      q: "What happens when the criminal protection order and the parenting plan conflict?",
      answer:
        "The criminal order still applies until the criminal court changes it. A parenting plan from the family court does not give you permission to break a mandatory protection order, so the fix is a motion in the criminal case.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 18-1-1001(3)(a)(I)",
            text: "Nothing in this section precludes the defendant from applying to the court at any time for modification or dismissal of the protection order issued pursuant to this section or the district attorney from applying to the court at any time for further orders, additional provisions under the protection order, or modification or dismissal of the same. The trial court retains jurisdiction to enforce, modify, or dismiss the protection order until final disposition of the action.",
            plain:
              "You or your lawyer file the request in the criminal case. Ask for a specific change, such as allowing exchanges at a set place or through a third party, or allowing contact with the children while keeping the order in place for the other parent.",
            url: "https://leg.colorado.gov/bill_files/40703/download",
          },
        },
        {
          p: "Either side can also ask for a hearing on the terms of the order in domestic violence cases (C.R.S. 18-1-1001(6)). The judge weighs the request against the safety of the protected person, and the prosecutor can oppose it.",
        },
        {
          p: "A criminal order and a civil protection order can exist at the same time (C.R.S. 18-1-1001(10)). If both are in place, you have to follow both. This is where having the criminal case and the family case handled together matters, because a change in one court does not change the other.",
        },
      ],
    },
    {
      id: "plea-conviction",
      q: "How can a plea or conviction affect custody?",
      answer:
        "The family court makes its own finding about domestic violence using the preponderance standard, which is lower than the criminal standard. A plea or conviction can be used as evidence of domestic violence, and a dismissal does not stop the family court from looking at the same events.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 14-10-124(1.5)(c)",
            text: "(I) If a court determines by a preponderance of the evidence that a party has committed domestic violence, child abuse or neglect, or sexual assault that resulted in the conception of a child, it is not in the best interests of the child to allocate mutual decision-making responsibility over the objection of the other party or the legal representative of the child unless the court makes specific findings that mutual decision-making can occur without coercion, intimidation, retaliation, or risk of harm to the abused party or the child; and (II) The court shall not appoint a parenting coordinator solely to ensure that mutual decision-making can be accomplished.",
            plain:
              "If the family court finds domestic violence and the other parent or the child's legal representative objects, joint decision-making is not ordered unless the court makes specific findings that it can happen without coercion, intimidation, retaliation, or risk of harm. After that finding, the safety and well-being of the child and the abused parent are the court's primary concern, and it must set parenting time conditions that keep them safe (C.R.S. 14-10-124(1.6)(a)).",
            url: "https://leg.colorado.gov/laws/session-laws/HB26-1309/163/download",
          },
        },
        {
          p: "Plea decisions in the criminal case should be made with the custody case in mind. What you admit in one case can be used in the other.",
        },
      ],
    },
    {
      id: "mistakes",
      q: "Mistakes that make it worse",
      answer:
        "These three mistakes come straight from how the statutes work, and each one can hurt both cases.",
      blocks: [
        {
          bullets: [
            "Accepting an invitation from the protected parent. The order restrains you, and the statute has no exception for contact the protected person invites. Only a judge can change the order.",
            "Treating a parenting plan as permission. Until the criminal court modifies the mandatory protection order, its terms still apply.",
            "Keeping firearms when the order requires you to give them up. Possessing a firearm while barred by a protection order is its own violation (C.R.S. 18-6-803.5(1)(c)(II)(A)).",
          ],
        },
        {
          p: "Violating a protection order is a class 2 misdemeanor, but it is a class 1 misdemeanor if the order is a mandatory protection order from a criminal case, if you have a prior conviction for violating a protection order, if the basis for the order included an allegation of stalking, or if the parties were in an intimate relationship, which includes two parents of the same child (C.R.S. 18-6-803.5(2)(a); 18-6-800.3(2)). Officers must arrest, or seek a warrant if an arrest is impractical, when they have probable cause, with limited exceptions (C.R.S. 18-6-803.5(3)(b), (3)(b.5)).",
        },
      ],
    },
  ] as Sec[],
  faq: [
    {
      q: "Can the alleged victim drop the mandatory protection order?",
      a: "No. It is a court order in the criminal case. The defendant or the district attorney can ask the judge to modify or dismiss it (C.R.S. 18-1-1001(3)(a)(I)).",
    },
    {
      q: "How long does a mandatory protection order last?",
      a: "Until the criminal case ends: dismissal, acquittal or completion of the sentence (C.R.S. 18-1-1001(8)(b)), unless the court changes it sooner.",
    },
    {
      q: "If my charge is dismissed, does that end the custody question?",
      a: "No. The family court decides whether domestic violence happened based on its own evidence and a preponderance standard, so it can still consider the same events.",
    },
  ],
  related: [
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
    {
      label: "Can I see my kids if there's a protection order against me?",
      to: "/blog/protection-order-against-me-see-my-kids-colorado",
    },
    { label: "Domestic violence defense", to: "/criminal-defense/domestic-violence" },
    {
      label: "Allocation of parental responsibilities",
      to: "/family-law/allocation-of-parental-responsibilities",
    },
  ],
  sources: [
    {
      label:
        "C.R.S. § 18-6-800.3 (definitions: domestic violence, intimate relationship), Colorado Revised Statutes 2024",
      url: "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-18.pdf",
    },
    {
      label: "C.R.S. § 18-1-1001 (mandatory protection order), as amended by HB25-1148",
      url: "https://leg.colorado.gov/bill_files/40703/download",
    },
    {
      label:
        "C.R.S. § 18-6-803.5 (violation of a protection order), Colorado Revised Statutes 2024; (1)(a), (1)(c), (2)(c) amended by HB25-1148",
      url: "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-18.pdf",
    },
    {
      label:
        "C.R.S. § 14-10-124 (best interests of the child), as amended by HB26-1309, Session Laws 2026, ch. 163",
      url: "https://leg.colorado.gov/laws/session-laws/HB26-1309/163/download",
    },
  ],
  cta: {
    title: "Two cases, one firm.",
    body: "Shimon Kohn defends the criminal charge. Erica Bertini handles the custody case. They work the two cases together, so each decision is made with both courts in view. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/blog/domestic-violence-charge-and-custody-colorado")({
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
          { name: "Blog", path: "/blog" },
          { name: content.h1, path: PATH },
        ]),
      ],
    }),
  component: Page,
});

function Page() {
  const C = content;
  return (
    <PageShell>
      <section className="bg-ink text-white">
        <div className="container-page max-w-4xl py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-white/60">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
            {C.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.1] md:text-5xl">
            {C.h1}
          </h1>
          <p className="mt-8 text-xs text-white/55">
            Written by The Kohn Law Firm · Updated {formatDate(updated)}
          </p>
        </div>
      </section>

      <article className="container-page max-w-3xl py-14 md:py-20">
        <div className="rounded-lg border border-border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-text">
            Short answer
          </p>
          <p className="mt-3 text-[18px] leading-relaxed text-ink">{C.answerBox}</p>
        </div>

        <aside className="mt-6 rounded-lg bg-surface p-6">
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

        <InlineCta />

        {C.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-28 pt-12">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">{s.q}</h2>
            <p className="mt-4 text-[17px] font-medium leading-relaxed text-foreground">
              {s.answer}
            </p>
            <div className="mt-5 space-y-5">
              {s.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
          </section>
        ))}

        <section className="pt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Common questions</h2>
          <ul className="mt-5 divide-y divide-border rounded-lg border border-border bg-white">
            {C.faq.map((f, i) => (
              <li key={i}>
                <details name="dv-faq" className="group">
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

        <section className="pt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Related guides</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {C.related.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className="group flex h-full items-start justify-between gap-3 rounded-lg border border-border bg-white p-4 text-[15px] font-medium text-brand transition-colors hover:border-brass"
                >
                  <span>{r.label}</span>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Sources</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {C.sources.map((s) => (
              <li key={s.url}>
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
            This article explains Colorado law in general terms. It is not legal advice about your
            situation. {SITE.disclaimer}
          </p>
        </section>
      </article>

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

function BlockView({ b }: { b: Block }) {
  if ("p" in b) return <p className="text-[16px] leading-relaxed text-foreground">{b.p}</p>;
  if ("bullets" in b)
    return (
      <ul className="space-y-3 pl-1">
        {b.bullets.map((x, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-foreground">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
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

function InlineCta() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] text-foreground">
        Facing a charge and a custody case at the same time? Talk to Shimon Kohn and Erica Bertini.
      </p>
      <Link
        to="/consultation"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-brass px-5 text-sm font-semibold text-brass-foreground transition-colors hover:bg-brass-light"
      >
        Schedule a Consultation
      </Link>
    </div>
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
