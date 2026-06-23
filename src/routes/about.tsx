import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import officeImg from "@/assets/office-interior.jpg";
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
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
          <img src={officeImg} alt="The Kohn Law Firm office" loading="lazy" className="rounded-xl shadow-elegant" width={1280} height={896} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">A boutique by choice.</h2>
            <p className="mt-5 text-muted-foreground">
              We chose to stay small for a reason. Boutique practice means our
              attorneys handle their own cases — start to finish — and our clients
              always know who is answering the phone.
            </p>
            <p className="mt-4 text-muted-foreground">
              From routine misdemeanors to the most serious felony allegations,
              every matter receives the same disciplined preparation: independent
              investigation, candid counsel, and a defense built for trial.
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
