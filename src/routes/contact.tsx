import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { SITE } from "@/lib/site";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Kohn Law Firm" },
      { name: "description", content: "Call 719-328-9555 or email shimon@kohn.law to reach The Kohn Law Firm in Colorado Springs." },
      { property: "og:title", content: "Contact The Kohn Law Firm" },
      { property: "og:description", content: "Reach our Colorado Springs office for a confidential consultation." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <ServiceHero
        eyebrow="Contact"
        title="Reach the firm directly."
        subtitle="Calls are answered around the clock for criminal matters. For all other inquiries, we respond within one business day."
      />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <InfoRow icon={Phone} label="Phone" value={SITE.phone} href={SITE.phoneHref} />
            <InfoRow icon={Mail} label="Email" value={SITE.email} href={SITE.emailHref} />
            <InfoRow icon={MapPin} label="Service Area" value={`${SITE.city} & surrounding counties`} />
            <InfoRow icon={Clock} label="Availability" value="24/7 for active criminal matters" />
          </div>

          <form
            className="rounded-xl border border-border bg-card p-8 shadow-card"
            action={SITE.emailHref}
            method="post"
            encType="text/plain"
          >
            <h2 className="font-display text-2xl text-ink">Send a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For sensitive matters, please call instead — email is not secure.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Phone" name="phone" type="tel" required />
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
            <button
              type="submit"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-6 text-sm font-semibold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90 md:w-auto"
            >
              Send message
            </button>
          </form>
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
