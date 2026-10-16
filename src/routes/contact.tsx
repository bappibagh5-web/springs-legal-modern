import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/site/Layout";
import { PageHero } from "@/site/blocks";
import { SITE, updatedFor } from "@/site/site";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, type LucideIcon } from "lucide-react";
import { submitConsultationLead } from "@/lib/leads.functions";
import { pageHead, webPage, breadcrumbs } from "@/lib/seo";

const updated = updatedFor("/contact");

/** Page text. */
const content = {
  meta: {
    title: "Contact The Kohn Law Firm | Colorado Springs | 719-328-9555",
    description:
      "Call 719-328-9555 or email contact@kohn.law to reach The Kohn Law Firm in Colorado Springs. Criminal calls are answered around the clock. Send us a message.",
  },
  hero: {
    eyebrow: "Contact",
    title: "Reach the firm directly.",
    subtitle:
      "Calls are answered around the clock for criminal matters. For all other questions, call or send a message and we will get back to you.",
  },
  availability: "24/7 for active criminal matters",
};

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      path: "/contact",
      ...content.meta,
      jsonLd: [
        webPage({
          path: "/contact",
          name: content.meta.title,
          description: content.meta.description,
          type: "ContactPage",
          modified: updated,
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
      ],
    }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitConsultationLead);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      email: String(fd.get("email") ?? "").trim(),
      case_type: String(fd.get("case_type") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim() || null,
      source: "contact_form" as const,
    };
    if (!payload.name || !payload.email || !payload.message) {
      setError("Please provide your name, email, and a message.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: payload });
      window.trackEvent?.("lead_generated", "conversion", "contact_form");
      window.trackEvent?.("form_submit", "conversion", "contact_form");
      setDone(true);
      form.reset();
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

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            <InfoRow icon={Phone} label="Phone" value={SITE.phone} href={SITE.phoneHref} />
            <InfoRow icon={Mail} label="Email" value={SITE.email} href={SITE.emailHref} />
            <InfoRow
              icon={MapPin}
              label="Service Area"
              value={`${SITE.city}, ${SITE.region} and surrounding counties`}
            />
            <InfoRow icon={Clock} label="Availability" value={content.availability} />
          </div>

          {done ? (
            <div className="rounded-lg border border-border bg-card p-10 flex flex-col items-start">
              <div className="h-14 w-14 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                Message sent. We'll be in touch shortly.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Thank you for reaching out. A member of our team will follow up soon. For urgent
                matters, please call{" "}
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
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">Send a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                For sensitive matters, please call instead. Email is not secure.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full name" name="name" required autoComplete="name" />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="md:col-span-2"
                />
                <Field
                  label="Case type"
                  name="case_type"
                  placeholder="e.g. DUI, Divorce, TPO"
                  className="md:col-span-2"
                />
                <div className="md:col-span-2">
                  <label htmlFor="field-message" className="text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="field-message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
              {error && (
                <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-brass px-6 text-sm font-semibold text-brass-foreground transition-colors hover:bg-brass-light disabled:opacity-70 md:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

type InfoRowProps = { icon: LucideIcon; label: string; value: string; href?: string };

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  const content = (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-brass">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">{label}</p>
        <p className="mt-1 font-display text-lg text-ink break-words">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
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
