import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { updatedFor } from "@/site/site";
import { CTASection, PageHero, TestimonialsSection } from "@/site/blocks";
import { pageHead, webPage, breadcrumbs } from "@/lib/seo";
import buildingImg from "@/assets/kohn-firm-building.webp.asset.json";
import { CheckCircle2, Scale, Gavel, ShieldCheck, BookOpen } from "lucide-react";

const updated = updatedFor("/about");

/** Page text. */
const content = {
  meta: {
    title: "About The Kohn Law Firm | Colorado Springs Attorneys Since 2003",
    description:
      "Shimon Kohn founded The Kohn Law Firm in 2003 after serving as a deputy DA in El Paso and Teller Counties. Meet the firm behind our criminal and family cases.",
  },
  hero: {
    eyebrow: "About Us",
    title: "A Colorado Springs law firm since 2003.",
    subtitle:
      "The Kohn Law Firm protects your rights with careful, ethical representation. We handle criminal defense, protection order, and family law cases, and both of our attorneys are former prosecutors.",
  },
};

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      ...content.meta,
      type: "website",
      jsonLd: [
        webPage({
          path: "/about",
          name: content.meta.title,
          description: content.meta.description,
          type: "AboutPage",
          modified: updated,
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    }),
  component: AboutPage,
});

/* Only figures the site can back up (audit/client-needs.md §4). */
const STATS = [
  { n: "2003", label: "Year Founded" },
  { n: "25+", label: "Years of Experience" },
  { n: "2", label: "Former Prosecutors" },
  { n: "22+", label: "Years Serving Colorado" },
];

function AboutPage() {
  return (
    <PageShell>
      <PageHero {...content.hero} />

      {/* Story + building photo */}
      <section className="py-20 md:py-28">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div className="relative">
            <img
              src={buildingImg.url}
              alt="The Kohn Law Firm office, a white building with a yellow sign"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover"
              width={1280}
              height={960}
            />
            <div className="absolute -bottom-5 -right-5 hidden rounded-lg bg-ink p-5 text-white md:block">
              <p className="font-display text-2xl font-semibold text-brass-light">Est. 2003</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/75">
                Colorado Springs
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">About Us</p>
            <h2 className="mt-3 font-display font-semibold text-3xl text-ink md:text-4xl">
              A Colorado Springs firm since 2003.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Shimon Kohn founded the firm in 2003 after serving as a Deputy District Attorney in
              Teller and El Paso Counties, which make up Colorado's 4th Judicial District. You work
              directly with the attorney on your case, and we tell you plainly where your case
              stands.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Former prosecutor experience",
                "Clear and honest communication",
                "Careful, ethical representation",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Who We Are
            </p>
            <h2 className="mt-3 font-display font-semibold text-3xl text-ink md:text-4xl">
              Two former prosecutors and one standard of preparation for every case.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-7">
              <Scale className="h-8 w-8 text-brass" />
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">How We Work</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                You meet with the attorney who will handle your case. Shimon Kohn started the firm
                in 2003, after leaving the 4th Judicial District Attorney's Office, to defend people
                charged with DUI and other crimes in the Pikes Peak region.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Your participation matters to your case. We take the time to explain the charges or
                issues in plain language, and we make sure you and your family understand your
                options before any decision is made.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-7">
              <Gavel className="h-8 w-8 text-brass" />
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">Our Experience</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Both of our attorneys worked as prosecutors. We know how police reports are written
                and what the State has to prove, and we use that when we gather information,
                negotiate, or try a case.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-7">
              <ShieldCheck className="h-8 w-8 text-brass" />
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">Our Ethics</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                We follow the Colorado Rules of Professional Conduct in every matter. We tell you
                the truth about your case, including when it is not what you hoped to hear.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Strong representation does not require cutting corners. It requires knowing the law,
                preparing carefully, and being ready for the hearing or trial if the case does not
                settle.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-7">
              <BookOpen className="h-8 w-8 text-brass" />
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                Ongoing Education
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Colorado law changes every year. Our attorneys take continuing legal education so
                our advice reflects the law as it stands today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink py-16 text-white">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-semibold text-brass md:text-5xl">{s.n}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection variant="surface" />
      <CTASection />
    </PageShell>
  );
}
