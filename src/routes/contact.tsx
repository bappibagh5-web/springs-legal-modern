import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { SITE } from "@/lib/site";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { submitConsultationLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Kohn Law Firm" },
      { name: "description", content: "Call 719-328-9555 or email contact@kohn.law to reach The Kohn Law Firm in Colorado Springs." },
      { property: "og:title", content: "Contact The Kohn Law Firm" },
      { property: "og:description", content: "Reach our Colorado Springs office for a confidential consultation." },
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
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <ServiceHero
        eyebrow="Contact"
        title="Reach the firm directly."
        subtitle="Calls are answered around the clock for criminal matters. For all other inquiries, we respond within one business day."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            <InfoRow icon={Phone} label="Phone" value={SITE.phone} href={SITE.phoneHref} />
            <InfoRow icon={Mail} label="Email" value={SITE.email} href={SITE.emailHref} />
            <InfoRow icon={MapPin} label="Service Area" value={`${SITE.city} & surrounding counties`} />
            <InfoRow icon={Clock} label="Availability" value="24/7 for active criminal matters" />
          </div>

          {done ? (
            <div className="rounded-xl border border-border bg-card p-10 shadow-card flex flex-col items-start">
              <div className="h-14 w-14 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-brand">Message sent — we'll be in touch shortly.</h3>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Thank you for reaching out. A member of our team will follow up soon. For urgent matters,
                please call <a href={SITE.phoneHref} className="font-semibold text-brand hover:text-crimson">{SITE.phone}</a>.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-8 shadow-card">
              <h2 className="font-display text-2xl text-ink">Send a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                For sensitive matters, please call instead — email is not secure.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Email" name="email" type="email" required className="md:col-span-2" />
                <Field label="Case type" name="case_type" placeholder="e.g. DUI, Divorce, TPO" className="md:col-span-2" />
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
              {error && (
                <div className="mt-4 rounded-md border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-6 text-sm font-semibold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-70 md:w-auto"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                ) : "Send message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function InfoRow({ icon: Icon, label, value, href }: any) {
  const content = (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-brand">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-crimson">{label}</p>
        <p className="mt-1 font-display text-lg text-ink break-words">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
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
