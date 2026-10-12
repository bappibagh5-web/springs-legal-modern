import { Quote, Star } from "lucide-react";
import { useCms, CmsSection } from "@/lib/cms/context";
import type { Testimonial } from "@/lib/cms/testimonials-data";



type Props = {
  variant?: "light" | "surface";
  limit?: number;
};

export function TestimonialsSection({ variant = "light", limit = 3 }: Props) {
  const g = useCms("global");
  const items = g.list<Testimonial>("testimonials.items").slice(0, limit);
  const bg = variant === "surface" ? "bg-surface" : "bg-background";

  return (
    <CmsSection page="global" id="testimonials">
    <section className={`${bg} py-20 md:py-28`}>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            {g.text("testimonials.eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            {g.text("testimonials.heading")}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold text-gold" />
            ))}
            <span className="ml-2 text-sm font-semibold text-ink">
              {g.text("testimonials.rating")}
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.author + t.context}
              className="relative flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <Quote className="absolute -top-3 left-6 h-7 w-7 rounded bg-gold p-1.5 text-gold-foreground" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-display text-base font-bold text-brand">
                  {t.author}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-crimson">
                  {t.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Testimonials reflect individual client experiences and do not
          guarantee a similar outcome.
        </p>
      </div>
    </section>
    </CmsSection>
  );
}
