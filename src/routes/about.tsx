import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CmsHero } from "@/components/CmsHero";
import { cmsHead } from "@/lib/cms/seo";
import { CTASection } from "@/components/CTASection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import buildingImg from "@/assets/kohn-firm-building.webp.asset.json";
import { CheckCircle2, Scale, Gavel, ShieldCheck, BookOpen } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: ({ matches }) => cmsHead(matches, "about", { title: "About — The Kohn Law Firm", description: "Founded in 2003 by former 4th Judicial Deputy District Attorney Shimon Kohn, The Kohn Law Firm is built on ethical service and aggressive advocacy for the Pikes Peak region.", ogTitle: "About The Kohn Law Firm", ogDescription: "A Colorado Springs boutique law firm built on ethics, preparation, and trial readiness." }),
  component: AboutPage,
});

const STATS = [
  { n: "40+", label: "Combined Years of Experience" },
  { n: "4,300+", label: "Cases Handled" },
  { n: "150+", label: "Jury Trials" },
  { n: "22+", label: "Years Serving Colorado" },
];

function AboutPage() {
  return (
    <PageShell>
      <CmsHero page="about" />

      {/* Story + building photo */}
      <section className="py-20 md:py-28">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div className="relative">
            <img
              src={buildingImg.url}
              alt="The Kohn Law Firm office building at 320 in downtown Colorado Springs"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-elegant"
              width={1280}
              height={960}
            />
            <div className="absolute -bottom-5 -right-5 hidden rounded-xl bg-crimson p-5 text-white shadow-elegant md:block">
              <p className="font-display text-2xl">Est. 2003</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide">Colorado Springs</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">About Us</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Providing top-notch legal representation.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Founded in 2003 by former 4th Judicial Deputy District Attorney
              Shimon Kohn, our firm is built on ethical service and strong
              advocacy. We give every client personal attention and clear legal
              guidance. Our goal is to secure the best possible outcome for
              your case.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Former prosecutor experience",
                "Clear and honest communication",
                "Aggressive and ethical defense",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Who We Are</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Professional management of every case and personal attention to every client — guaranteed.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-7 shadow-card">
              <Scale className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-brand">Our Philosophy</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Our philosophy stems from the belief that our clients deserve
                exceptional service, ethical treatment, and aggressive
                representation. Established by Shimon Kohn in 2003 after
                leaving the 4th Judicial District Attorney's Office, The Kohn
                Law Firm is dedicated to serving the DUI and criminal defense
                needs of the accused in the Pikes Peak region.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                We know that your participation in the legal process is
                critical to your defense. To effectively represent you, we
                invest the time to translate "legalese" into clear definitions
                and make sure you and your family understand the charges and
                your options moving forward.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-7 shadow-card">
              <Gavel className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-brand">Our Experience</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Our experience in dealing with police and prosecutors gives
                The Kohn Law Firm a substantial advantage in collecting
                information, negotiating plea bargains, or proceeding to a
                jury trial.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-7 shadow-card">
              <ShieldCheck className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-brand">Our Adherence</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Our adherence to a strict code of ethics guarantees your
                ethical treatment in all matters. Our commitment to
                aggressive representation of clients means gaining their
                trust through executing everything we do with integrity.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                We believe quality and effective legal representation does
                not require ethical compromise, and our reputation for
                creative and aggressive representation proves it. Successful
                representation does require a thorough understanding of the
                law and meticulous preparation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-7 shadow-card">
              <BookOpen className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-brand">Ongoing Education</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Beyond academic credentials and legal experience, The Kohn
                Law Firm invests in continuing legal education and training
                to ensure that our knowledge of Colorado law is current and
                accurate.
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
                <p className="font-display text-4xl font-bold text-gold md:text-5xl">{s.n}</p>
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
