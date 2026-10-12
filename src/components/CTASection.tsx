import { ActionButton } from "./ActionButton";
import { Phone } from "lucide-react";
import { useSiteInfo, useCms, CmsSection } from "@/lib/cms/context";

export function CTASection(props: { title?: string; body?: string }) {
  const SITE = useSiteInfo();
  const g = useCms("global");
  const title = props.title ?? g.text("cta.title");
  const body = props.body ?? g.text("cta.body");
  return (
    <CmsSection page="global" id="cta">
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
            {g.text("cta.buttonLabel")}
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
    </CmsSection>
  );
}
