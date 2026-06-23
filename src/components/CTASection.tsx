import { ActionButton } from "./ActionButton";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function CTASection({
  title = "Your defense starts with a conversation.",
  body = "Speak directly with attorney Shimon Kohn about your case. Consultations are confidential and judgment-free.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(253,186,52,0.6), transparent 40%), radial-gradient(circle at 80% 70%, rgba(159,40,40,0.5), transparent 45%)",
        }}
      />
      <div className="container-page relative grid gap-8 py-16 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-white/85">{body}</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ActionButton variant="gold" size="lg">
            Schedule a Consultation
          </ActionButton>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-gold"
          >
            <Phone className="h-4 w-4" /> {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
