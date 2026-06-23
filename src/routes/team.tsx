import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import attorneyImg from "@/assets/attorney-portrait.jpg";
import { Award, Users } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — The Kohn Law Firm" },
      { name: "description", content: "Meet the attorneys and staff of The Kohn Law Firm in Colorado Springs." },
      { property: "og:title", content: "Our Legal Team — The Kohn Law Firm" },
      { property: "og:description", content: "Colorado Springs attorneys ready to defend your case." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <PageShell>
      <ServiceHero
        eyebrow="Our Legal Team"
        title="The attorneys behind every case."
        subtitle="A boutique team means your case is led by an attorney from intake to verdict."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.5fr] md:items-start">
          <img src={attorneyImg} alt="Shimon Kohn" loading="lazy" className="rounded-xl shadow-elegant" width={1024} height={1280} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Founding Attorney</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Shimon Kohn, Esq.</h2>
            <p className="mt-2 text-sm uppercase tracking-wide text-brand">Lead Trial Counsel</p>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Shimon founded The Kohn Law Firm to bring focused, client-first
                representation to people facing the most serious moments of their
                lives — criminal charges, custody disputes, and protection-order
                hearings.
              </p>
              <p>
                His practice spans the full range of Colorado criminal law, from
                misdemeanor DUIs to complex felony allegations, with an emphasis on
                aggressive motion practice and trial preparation.
              </p>
              <p>
                Outside the courtroom, Shimon is a long-time Colorado Springs
                resident committed to the community he serves.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Award className="mx-auto h-10 w-10 text-gold" />
            <h3 className="mt-4 font-display text-xl text-brand">Of Counsel</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We bring in experienced co-counsel for complex felony, family, and
              federal matters where additional firepower benefits the client.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-gold" />
            <h3 className="mt-4 font-display text-xl text-brand">Paralegal & Intake</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our support staff coordinates filings, court dates, and client
              communication so nothing slips through the cracks.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
