import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CATEGORIES, SITE } from "@/lib/site";
import { Phone, Mail, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { submitConsultationLead } from "@/lib/leads.functions";
import { useSiteInfo, useCms, CmsSection } from "@/lib/cms/context";
import { cmsHead } from "@/lib/cms/seo";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Schedule a Consultation — The Kohn Law Firm" },
      { name: "description", content: "Request a confidential consultation with The Kohn Law Firm in Colorado Springs." },
      { property: "og:title", content: "Schedule a Consultation" },
      { property: "og:description", content: "Confidential case review with attorney Shimon Kohn." },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  const SITE = useSiteInfo();
  const submit = useServerFn(submitConsultationLead);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      email: String(fd.get("email") ?? "").trim(),
      case_type: String(fd.get("case_type") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim() || null,
      best_time_to_reach: String(fd.get("best_time") ?? "").trim() || null,
    };
    if (!payload.name || !payload.email) {
      setError("Please provide your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: payload });
      window.trackEvent?.("lead_generated", "conversion", "consultation_form");
      window.trackEvent?.("form_submit", "conversion", "consultation_form");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <ServiceHero
        eyebrow="Confidential Intake"
        title="Schedule a consultation."
        subtitle="Tell us a little about your situation. We will reach out promptly to set a time."
      />

      <section className="py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <Shield className="h-8 w-8 text-gold" />
              <h3 className="mt-3 font-display text-xl text-brand">What to expect</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Confidential review of the facts</li>
                <li>• Honest assessment of likely outcomes</li>
                <li>• Clear explanation of fees and next steps</li>
              </ul>
            </div>
            <div className="rounded-xl bg-brand p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Prefer to call?</p>
              <a href={SITE.phoneHref} className="mt-3 flex items-center gap-2 text-lg font-semibold hover:text-gold">
                <Phone className="h-5 w-5" /> {SITE.phone}
              </a>
              <a href={SITE.emailHref} className="mt-2 flex items-center gap-2 text-sm text-white/85 hover:text-gold">
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </div>
          </aside>

          {done ? (
            <div className="rounded-xl border border-border bg-card p-10 shadow-card flex flex-col items-start">
              <div className="h-14 w-14 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-brand">Thank you — we'll be in touch shortly.</h3>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Your request has been received. An attorney or member of our team will reach out at the
                time you provided. If your matter is urgent, please call us directly at{" "}
                <a href={SITE.phoneHref} className="font-semibold text-brand hover:text-crimson">{SITE.phone}</a>.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-8 shadow-card">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Phone" name="phone" type="tel" required />
                <Field label="Email" name="email" type="email" required className="md:col-span-2" />
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink">Case type</label>
                  <select
                    name="case_type"
                    required
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  >
                    <option value="">Select a practice area…</option>
                    {CATEGORIES.flatMap((c) => [
                      <optgroup key={c.slug} label={c.title}>
                        {c.items.map((i) => (
                          <option key={i.slug} value={`${c.title} — ${i.title}`}>
                            {i.title}
                          </option>
                        ))}
                      </optgroup>,
                    ])}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink">Brief description</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Share whatever you are comfortable putting in writing. Sensitive details can wait for the call."
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
                <Field label="Best time to reach you" name="best_time" className="md:col-span-2" placeholder="e.g. weekdays after 5pm" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Submitting this form does not create an attorney-client relationship.
                Please do not include privileged information.
              </p>
              {error && (
                <div className="mt-4 rounded-md border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-crimson px-6 text-sm font-semibold uppercase tracking-wide text-crimson-foreground transition-colors hover:bg-crimson/90 disabled:opacity-70"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                ) : "Request Consultation"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required, placeholder, className }: any) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}
