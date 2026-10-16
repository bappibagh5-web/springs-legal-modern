import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { SITE, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage, breadcrumbs } from "@/lib/seo";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";

/*
 * /blog/protection-order-against-me-see-my-kids-colorado
 * Article: seeing your children when a Colorado protection order names you as the restrained person.
 * Every legal statement is tied to a source in `sources`. Verify against the official C.R.S. before publishing.
 */

const PATH = "/blog/protection-order-against-me-see-my-kids-colorado";
const updated = updatedFor(PATH);

type Law = { cite: string; text: string; plain: string; url: string };
type Block = { p: string } | { law: Law } | { bullets: string[] } | { steps: string[] };
type Sec = { id: string; q: string; answer: string; blocks: Block[] };

const content = {
  meta: {
    title: "Can I See My Kids If There's a Protection Order Against Me in Colorado?",
    description:
      "When a Colorado protection order lets you see your children, how to ask the court to change it (JDF 397, the two-year rule, background check), and what a violation costs you.",
  },
  eyebrow: "Family Law · Colorado",
  h1: "Can I See My Kids If There's a Protection Order Against Me in Colorado?",
  answerBox:
    "Only if the order allows it. If your children are protected persons, or the order bars contact with them, you cannot see or call them until a judge changes the order, even if the other parent agrees. You can ask the court for parenting time, supervised visits or a change to the order.",
  keyFacts: [
    "A civil protection order can bar contact with the minor child of either party (C.R.S. 13-14-105(1)(b)).",
    "It can also allow parenting time with conditions, such as a third-party supervisor (C.R.S. 13-14-105(1)(e)(II)).",
    "A restrained party must wait two years after a permanent order, or after a prior motion was decided, before asking to change it (C.R.S. 13-14-108(2)(b)).",
    "The motion needs a fingerprint-based background check done within 90 days before filing (C.R.S. 13-14-108(3)(b)).",
    "Child-related terms of a civil order end when a family court later enters an order on the same subject (C.R.S. 13-14-108(1)).",
  ],
  sections: [
    {
      id: "does-it-cover-kids",
      q: "Does the protection order cover my children?",
      answer:
        "Check two places in the written order: the list of protected persons, and the terms about contact and parenting time. A Colorado civil protection order can bar contact with the children, award temporary care and control to the other parent, or allow parenting time with conditions.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-105(1)(b)",
            text: "Restraining a party from contacting any other party or the minor child of either of the parties",
            plain:
              "If the order includes this term for your children, calls, texts, social media messages and visits are all off limits until a judge changes it.",
            url: "https://colorado.public.law/statutes/crs_13-14-105",
          },
        },
        {
          p: "If the children are not named and the order only protects the other parent, contact with the children may be allowed. Exchanges are the risky part, because meeting or messaging the other parent to arrange them can be contact the order prohibits.",
        },
      ],
    },
    {
      id: "change-the-order",
      q: "How do I ask the court to change the order so I can see my kids?",
      answer:
        "File a Motion to Modify or Dismiss Temporary or Permanent Protection Order (JDF 397) in the case that issued the order. For a permanent civil order, you must wait two years after it issued, file a recent fingerprint-based background check, serve the other party in person, and prove the change is appropriate.",
      blocks: [
        {
          steps: [
            "Check your timing. The two-year wait runs from the date the permanent order issued, or from the decision on your last motion, whether or not it was granted (C.R.S. 13-14-108(2)(b)).",
            "Get a fingerprint-based criminal history check from the Colorado Bureau of Investigation and the FBI, done within 90 days before you file. You pay for it (C.R.S. 13-14-108(3)(b)).",
            "Fill out JDF 397 and file it with the court that issued the order. Say exactly what you want changed, such as supervised parenting time or exchanges through a third party.",
            "Have the other party personally served with the motion and the hearing notice under C.R.C.P. 4(e) (C.R.S. 13-14-108(5)).",
            "At the hearing, you must show by a preponderance of the evidence that the change is appropriate. The court considers the circumstances, including whether you and the other party have minor children together (C.R.S. 13-14-108(5) and (6)(i)).",
          ],
        },
        {
          law: {
            cite: "C.R.S. § 13-14-108(3)(a)(I)",
            text: "Notwithstanding any provision of subsection (2) of this section to the contrary, after issuance of the permanent protection order, if the restrained party has been convicted of or pled guilty to any misdemeanor or any felony against the protected person, other than the original offense, if any, that formed the basis for the issuance of the protection order, then the protection order remains permanent and must not be modified or dismissed by the court.",
            plain:
              "A new conviction for a crime against the protected person locks the order in place.",
            url: "https://colorado.public.law/statutes/crs_13-14-108",
          },
        },
        {
          p: "There is a second route for the children. Because the child-related terms of a civil protection order end when a family court enters an order on the same subject (C.R.S. 13-14-108(1)), filing an allocation of parental responsibilities case lets a family judge set parenting time directly.",
        },
        {
          p: "If the order comes from a criminal case, it is a mandatory protection order. You ask the criminal court to modify it, and you can do that at any time while the case is open (C.R.S. 18-1-1001(3)(a)).",
        },
      ],
    },
    {
      id: "supervised-visits",
      q: "Can exchanges or supervised visits happen while the order is in place?",
      answer:
        "Yes, if a court orders them. A Colorado civil protection order can include parenting time with conditions, including supervision by a third party who agrees to the terms.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 13-14-105(1.5)(b)",
            text: "The order for temporary care and control described in subsection (1.5)(a) of this section may include parenting time responsibilities for both parties involved and any conditions of parenting time, including supervised parenting time by a third party who agrees to the terms of the supervised parenting time, and any costs associated with supervised parenting time, if necessary.",
            plain:
              "The court can split the supervisor's cost between the parents but cannot assign it to a publicly funded agency. It can deny parenting time only if it finds the safety of the child or the protected party cannot be ensured.",
            url: "https://colorado.public.law/statutes/crs_13-14-105",
          },
        },
        {
          p: "Ask at the permanent order hearing, held within 14 days of a temporary order (C.R.S. 13-14-104.5(10)). That hearing is your first chance to propose a safe plan, such as a named supervisor and an exchange location, before the order becomes permanent.",
        },
      ],
    },
    {
      id: "violations",
      q: "What happens if I violate the order to see my kids?",
      answer:
        "Violating a Colorado protection order is a crime. It is a class 2 misdemeanor, and more serious in some situations, such as a prior conviction for violating a protection order. Officers must arrest you, or seek a warrant, when they have probable cause.",
      blocks: [
        {
          law: {
            cite: "C.R.S. § 18-6-803.5(3)(b)",
            text: "A peace officer shall arrest, or, if an arrest would be impractical under the circumstances, seek a warrant for the arrest of a restrained person when the peace officer has information amounting to probable cause that: (I) The restrained person has violated or attempted to violate any provision of a protection order; and (II) The restrained person has been properly served with a copy of the protection order or the restrained person has received actual notice of the existence and substance of such order.",
            plain:
              "Once an officer has probable cause, the statute requires an arrest or a warrant. Seeing your own children is not an exception.",
            url: "https://colorado.public.law/statutes/crs_18-6-803.5",
          },
        },
        {
          bullets: [
            "The other parent's permission does not change the order. The statute has no exception for contact the protected person invites, and only a judge can modify the order.",
            "A sentence for the violation runs consecutively with the sentence for the crime behind the order (C.R.S. 18-6-803.5(2)(c)).",
            "A new charge can be raised in your custody case, and a conviction for a crime against the protected person can make a civil order impossible to modify (C.R.S. 13-14-108(3)(a)(I)).",
          ],
        },
      ],
    },
  ] as Sec[],
  faq: [
    {
      q: "The other parent says it's okay. Can I see the kids?",
      a: "No. The order binds you until a judge changes it. If both of you want contact, the protected party can ask the court to modify the order at any time (C.R.S. 13-14-108(2)(a)).",
    },
    {
      q: "Can I call or text my kids?",
      a: "Only if the order allows contact with them. If the children are protected persons, calls, texts and messages through other people are contact.",
    },
    {
      q: "Can I ask for the children to be left off the order at the permanent hearing?",
      a: "Yes. At the permanent order hearing you can present evidence and ask the court to leave the children off the order or allow parenting time with conditions.",
    },
  ],
  related: [
    {
      label: "How protection orders affect custody in Colorado",
      to: "/family-law/protection-orders-and-custody",
    },
    {
      label: "Will a domestic violence charge affect my custody case?",
      to: "/blog/domestic-violence-charge-and-custody-colorado",
    },
    { label: "Permanent protection orders", to: "/protection-orders/permanent-protection-order" },
    {
      label: "Allocation of parental responsibilities",
      to: "/family-law/allocation-of-parental-responsibilities",
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
      label: "C.R.S. § 18-1-1001 (mandatory protection order)",
      url: "https://colorado.public.law/statutes/crs_18-1-1001",
    },
    {
      label: "C.R.S. § 18-6-803.5 (violation of a protection order)",
      url: "https://colorado.public.law/statutes/crs_18-6-803.5",
    },
    {
      label: "Colorado Judicial Branch, JDF 397 Motion to Modify or Dismiss Protection Order",
      url: "https://www.coloradojudicial.gov/sites/default/files/2023-06/JDF%20397%20Motion%20to%20Modify%20Dismiss%20Temporary%20Permanent%20PO.pdf",
    },
  ],
  cta: {
    title: "Talk to Erica Bertini about seeing your children.",
    body: "Erica handles custody cases that involve protection orders, including requests for supervised parenting time and changes to existing orders. The consultation is confidential.",
  },
};

export const Route = createFileRoute("/blog/protection-order-against-me-see-my-kids-colorado")({
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
                <details name="kids-faq" className="group">
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
  if ("steps" in b)
    return (
      <ol className="space-y-4">
        {b.steps.map((x, i) => (
          <li key={i} className="flex gap-4">
            <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-ink">
              {i + 1}
            </span>
            <p className="pt-1 text-[16px] leading-relaxed text-foreground">{x}</p>
          </li>
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

function InlineCta() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] text-foreground">
        Want to see your children without risking a violation? Talk to Erica Bertini.
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
