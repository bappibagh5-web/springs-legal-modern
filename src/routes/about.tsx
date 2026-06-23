import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import officeImg from "@/assets/kohn-office-building.webp.asset.json";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Kohn Law Firm" },
      { name: "description", content: "Learn about The Kohn Law Firm — a Colorado Springs boutique practice focused on criminal defense, family law, and protection orders." },
      { property: "og:title", content: "About The Kohn Law Firm" },
      { property: "og:description", content: "A Colorado Springs boutique law firm built around the client." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <ServiceHero
        eyebrow="About the Firm"
        title="A practice built on preparation, candor, and trial readiness."
        subtitle="Founded in Colorado Springs to give serious cases the focused attention they deserve."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div className="relative">
            <img
              src={officeImg.url}
              alt="The Kohn Law Firm office building in Colorado Springs"
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">A boutique by choice.</h2>
            <p className="mt-5 text-muted-foreground">
              Founded in 2003 by former 4th Judicial District Attorney Shimon Kohn,
              The Kohn Law Firm is built on ethical service and strong advocacy. We
              give every client personal attention and clear legal guidance — and
              our goal is to secure the best possible outcome for your case.
            </p>
            <p className="mt-4 text-muted-foreground">
              We chose to stay small for a reason. Boutique practice means our
              attorneys handle their own cases — start to finish — and our clients
              always know who is answering the phone.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <h2 className="text-center font-display text-3xl text-ink md:text-4xl">What we stand for</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Direct Access", b: "Your attorney is the person you call, email, and meet — not an intake screener." },
              { t: "Honest Counsel", b: "We tell you what we see, including the things you may not want to hear." },
              { t: "Trial Discipline", b: "Every case is prepared as if it is going to trial. That is the only way to negotiate from strength." },
            ].map((v) => (
              <div key={v.t} className="rounded-xl border border-border bg-card p-7 shadow-card">
                <CheckCircle2 className="h-8 w-8 text-gold" />
                <h3 className="mt-4 font-display text-xl text-brand">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
