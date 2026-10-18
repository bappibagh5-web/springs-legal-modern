import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/site/Layout";
import { PageHero } from "@/site/blocks";
import { SITE, updatedFor, PRACTICE_AREAS } from "@/site/site";
import { Phone, Mail, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { submitConsultationLead } from "@/lib/leads.functions";
import { gaEvent } from "@/lib/ga";
import { pageHead, webPage, breadcrumbs } from "@/lib/seo";

const updated = updatedFor("/consultation");

/** Page text. */
const content = {
  meta: {
    title: "Request a Consultation | The Kohn Law Firm, Colorado Springs",
    description:
      "Request a confidential consultation about a criminal, family law or protection order case in Colorado Springs. Tell us what happened and when to call you.",
  },
  hero: {
    eyebrow: "Confidential Intake",
    title: "Schedule a consultation.",
    subtitle: "Tell us a little about your situation. We will reach out promptly to set a time.",
  },
};

export const Route = createFileRoute("/consultation")({
  head: () =>
    pageHead({
      path: "/consultation",
      ...content.meta,
      jsonLd: [
        webPage({
          path: "/consultation",
          name: content.meta.title,
          description: content.meta.description,
          modified: updated,
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Schedule a consultation", path: "/consultation" },
        ]),
      ],
    }),
  component: ConsultationPage,
});

function ConsultationPage() {
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
      source: "consultation_form" as const,
    };
    if (!payload.name || !payload.email) {
      setError("Please provide your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: payload });
      // GA4: no personal data, only the form and the practice area chosen from the list.
      const practiceArea = payload.case_type?.split(":")[0]?.trim();
      gaEvent("generate_lead", {
        form_name: "consultation",
        ...(practiceArea ? { practice_area: practiceArea } : {}),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(
        `Sorry, your message didn't go through. Please try again, or call us at ${SITE.phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHero {...content.hero} />

      <section className="py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <Shield className="h-8 w-8 text-brass" />
              <h2 className="mt-3 font-display text-xl font-semibold text-ink">What to expect</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Confidential review of the facts</li>
                <li>• Honest assessment of likely outcomes</li>
                <li>• Clear explanation of fees and next steps</li>
              </ul>
            </div>
            <div className="rounded-lg bg-ink p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
                Prefer to call?
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-1 flex items-center gap-2 py-2 text-lg font-semibold hover:text-brass-light"
              >
                <Phone className="h-5 w-5" /> {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="mt-2 flex items-center gap-2 text-sm text-white/80 hover:text-brass-light"
              >
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </div>
          </aside>

          {done ? (
            <div className="rounded-lg border border-border bg-card p-10 flex flex-col items-start">
              <div className="h-14 w-14 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                Thank you. We'll be in touch shortly.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Your request has been received. An attorney or member of our team will reach out at
                the time you provided. If your matter is urgent, please call us directly at{" "}
                <a href={SITE.phoneHref} className="font-semibold text-brand hover:text-brass-text">
                  {SITE.phone}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-6 text-sm font-semibold text-brand hover:text-brass-text"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" name="name" required autoComplete="name" />
                <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="md:col-span-2"
                />
                <div className="md:col-span-2">
                  <label htmlFor="field-case_type" className="text-sm font-medium text-ink">
                    Case type
                  </label>
                  <select
                    id="field-case_type"
                    name="case_type"
                    required
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  >
                    <option value="">Select a practice area…</option>
                    {PRACTICE_AREAS.flatMap((c) => [
                      <optgroup key={c.slug} label={c.title}>
                        {c.services.map((i) => (
                          <option key={i.slug} value={`${c.title}: ${i.title}`}>
                            {i.title}
                          </option>
                        ))}
                      </optgroup>,
                    ])}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="field-message" className="text-sm font-medium text-ink">
                    Brief description
                  </label>
                  <textarea
                    id="field-message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Share whatever you are comfortable putting in writing. Sensitive details can wait for the call."
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
                <Field
                  label="Best time to reach you"
                  name="best_time"
                  className="md:col-span-2"
                  placeholder="e.g. weekdays after 5pm"
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Submitting this form does not create an attorney-client relationship. Please do not
                include privileged information.
              </p>
              {error && (
                <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-brass px-6 text-sm font-semibold text-brass-foreground transition-colors hover:bg-brass-light disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Request Consultation"
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
};

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  className,
  autoComplete,
}: FieldProps) {
  const id = `field-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}
