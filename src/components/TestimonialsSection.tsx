import { Quote, Star } from "lucide-react";

type Testimonial = {
  quote: string;
  author: string;
  context: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Erica was exactly what I needed at one of the most difficult times in my life. As a divorce attorney, she was always prepared, provided invaluable expertise in all the legal grey areas I never knew existed, and made sure to communicate both with me and on my behalf.",
    author: "Former Client",
    context: "Family Law",
  },
  {
    quote:
      "It is no exaggeration to say that Mr. Kohn saved my life. There were several setbacks and it took over a year but he was able to make sure that I was a free man. I could not recommend him more.",
    author: "Adian",
    context: "Criminal Defense",
  },
  {
    quote:
      "This law firm was there for me through my worst of times. I was diagnosed with cancer and going through divorce — Erica and the team were every step ahead. I am grateful they represented me.",
    author: "Jesse",
    context: "Family Law Case",
  },
  {
    quote:
      "I highly recommend the Kohn Law Firm. Shimon is an amazing attorney and guided me through every step of my case. He was extremely professional, knowledgeable, and continuously put my mind at ease.",
    author: "Shari",
    context: "Protection Order",
  },
  {
    quote:
      "Shimon is a no BS, no nonsense attorney who has earned the respect of everyone in his profession. He outlined what my expectations should be, then exceeded them. Case dismissed.",
    author: "Matt",
    context: "Criminal Defense",
  },
  {
    quote:
      "When I needed legal representation during one of the most difficult times in my life, Kohn Law Firm exceeded every expectation. Their team remained responsive, professional, and truly committed to my case.",
    author: "Sean H.",
    context: "Criminal Defense",
  },
];

type Props = {
  variant?: "light" | "surface";
  limit?: number;
};

export function TestimonialsSection({ variant = "light", limit = 3 }: Props) {
  const items = TESTIMONIALS.slice(0, limit);
  const bg = variant === "surface" ? "bg-surface" : "bg-background";

  return (
    <section className={`${bg} py-20 md:py-28`}>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            Testimonials
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            What our clients are saying.
          </h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold text-gold" />
            ))}
            <span className="ml-2 text-sm font-semibold text-ink">
              Excellent · 139+ Google reviews
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
  );
}
