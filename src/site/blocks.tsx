import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Phone, Quote, Star, ArrowLeft, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import courthouse from "@/assets/courthouse.jpg";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { PageShell } from "./Layout";
import {
  GLOBAL,
  PRACTICE_AREAS,
  SITE,
  reviewsFor,
  type Attorney,
  type PracticeArea,
  type SeeAlso,
  type ServiceContent,
} from "./site";

/** Building blocks shared by two or more public pages. */

/* ───────────── Buttons ───────────── */

type ActionButtonProps = {
  to?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

const variants = {
  primary: "bg-brand text-brand-foreground hover:bg-ink",
  secondary: "bg-slate text-white hover:bg-brand",
  gold: "bg-brass text-brass-foreground hover:bg-brass-light",
  ghost: "bg-transparent text-foreground border border-border hover:border-brass",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

export function ActionButton({
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  children = "Schedule a Consultation",
}: ActionButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    className,
  );
  const label = typeof children === "string" ? children : "cta";
  const onClickTrack = () => {
    if (typeof window !== "undefined") {
      const isPhone = href?.startsWith("tel:");
      window.trackEvent?.(isPhone ? "book_call_click" : "cta_click", "conversion", label);
    }
  };
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClickTrack}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/consultation"} className={cls} onClick={onClickTrack}>
      {children}
    </Link>
  );
}

/* ───────────── Heroes ───────────── */

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
};

/** Inner-page hero: courthouse photo, eyebrow, H1, subtitle and the consultation button. */
export function PageHero({ eyebrow, title, subtitle, image = courthouse }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        loading="eager"
        width={1280}
        height={800}
      />
      <div aria-hidden className="absolute inset-0 bg-ink/75" />
      <div className="container-page relative py-20 md:py-28">
        <div className="max-w-3xl animate-fade-up">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">{subtitle}</p>
          )}
          <div className="mt-8">
            <ActionButton variant="gold" size="lg">
              Schedule a Consultation
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── CTA band ───────────── */

export function CTASection(props: { title?: string; body?: string }) {
  // Practice pages pass their own CTA naming the right attorney (F-05).
  const title = props.title ?? GLOBAL.cta.title;
  const body = props.body ?? GLOBAL.cta.body;
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="container-page relative grid gap-8 py-16 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-white/80">{body}</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ActionButton variant="gold" size="lg">
            {GLOBAL.cta.buttonLabel}
          </ActionButton>
          <a
            href={SITE.phoneHref}
            className="-my-3 inline-flex items-center gap-2 py-3 text-sm text-white/90 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4 text-brass-light" /> {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Testimonials ───────────── */

type TestimonialsProps = {
  variant?: "light" | "surface";
  limit?: number;
  /** Practice-area slug: shows that area's reviews first. */
  category?: string;
};

export function TestimonialsSection({ variant = "light", limit = 3, category }: TestimonialsProps) {
  const items = reviewsFor(category, limit).map((r) => ({
    quote: r.quote,
    author: r.name,
    context: r.practice,
  }));
  const bg = variant === "surface" ? "bg-surface" : "bg-background";

  return (
    <section className={`${bg} py-20 md:py-28`}>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            {GLOBAL.testimonials.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {GLOBAL.testimonials.heading}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-brass text-brass" />
            ))}
            {/* TODO(firm): wrap in a link to the Google Business Profile once its URL is supplied. */}
            <span className="ml-2 text-sm font-semibold text-ink">
              {GLOBAL.testimonials.rating}
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.author + t.context}
              className="relative flex h-full flex-col rounded-lg border border-border bg-card p-7 transition-colors hover:border-brass"
            >
              <Quote className="absolute -top-3 left-6 h-7 w-7 rounded bg-brass p-1.5 text-brass-foreground" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brass text-brass" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-display text-base font-semibold text-ink">{t.author}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-brass-text">
                  {t.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Testimonials reflect individual client experiences and do not guarantee a similar outcome.
        </p>
      </div>
    </section>
  );
}

/* ───────────── Byline ───────────── */

/** "Written by The Kohn Law Firm · Updated [date]", styled with the site's existing card classes. */
export function UpdatedByline({ updated }: { updated: string }) {
  return (
    <aside aria-label="About this page" className="rounded-lg border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">
        Written by{" "}
        <span className="font-display text-base font-semibold text-ink">The Kohn Law Firm</span> ·
        Updated <time dateTime={updated}>{formatDate(updated)}</time>
      </p>
    </aside>
  );
}

/* ───────────── Blog ───────────── */

export function PostNotFound() {
  return (
    <PageShell>
      <div className="container-page py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          The article you're looking for isn't published or may have been moved.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brass-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    </PageShell>
  );
}

/* ───────────── Practice-area pages ───────────── */

/** Closing paragraph with a link to a related guide (matches the overview paragraph style). */
function SeeAlsoParagraph({
  seeAlso,
  className,
  headingClassName,
}: {
  seeAlso: SeeAlso;
  className: string;
  headingClassName: string;
}) {
  const paragraph = (
    <p className={className}>
      {seeAlso.text}{" "}
      <Link to={seeAlso.to} className="font-semibold text-brand hover:text-brass-text">
        {seeAlso.label}
      </Link>
    </p>
  );
  if (!seeAlso.heading) return paragraph;
  return (
    <>
      <h3 className={headingClassName}>{seeAlso.heading}</h3>
      {paragraph}
    </>
  );
}

/** Overview + services list on a practice-area page. */
export function PracticeOverview({
  heading,
  intro,
  updated,
  area,
  seeAlso,
}: {
  heading: string;
  intro: string[];
  updated: string;
  area: PracticeArea;
  seeAlso?: SeeAlso[];
}) {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Overview</p>
          <h2 className="mt-3 font-display font-semibold text-3xl text-ink md:text-4xl">
            {heading}
          </h2>
          {intro.map((p, i) => (
            <p key={i} className="mt-5 text-muted-foreground">
              {p}
            </p>
          ))}
          {seeAlso?.map((item) => (
            <SeeAlsoParagraph
              key={item.to}
              seeAlso={item}
              className="mt-5 text-muted-foreground"
              headingClassName="mt-8 font-display text-xl font-semibold text-ink"
            />
          ))}
          <div className="mt-8">
            <UpdatedByline updated={updated} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Services</p>
          <ul className="mt-4 divide-y divide-border">
            {area.services.map((it) => (
              <li key={it.slug}>
                <Link
                  to={it.path}
                  className="group flex items-center justify-between gap-3 py-3 text-sm font-medium text-ink hover:text-brand"
                >
                  <span>{it.title}</span>
                  <ArrowRight className="h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** "Explore <area>" card grid on a practice-area page. */
export function PracticeExplore({ area }: { area: PracticeArea }) {
  return (
    <section className="bg-surface py-20">
      <div className="container-page">
        <h2 className="font-display font-semibold text-3xl text-ink md:text-4xl">
          Explore {area.title}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {area.services.map((it) => (
            <Link
              key={it.slug}
              to={it.path}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-brass"
            >
              <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:text-brass-text">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Overview article and sidebar on a service page. */
export function ServiceOverview({
  heading,
  content,
  updated,
}: {
  heading: string;
  content: ServiceContent;
  updated: string;
}) {
  return (
    <section className="py-20">
      <div className="container-page grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
        <article className="space-y-5 text-base leading-relaxed text-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Overview</p>
          <h2 className="font-display font-semibold text-3xl text-ink md:text-4xl">{heading}</h2>
          {content.intro.map((p, i) => (
            <p key={i} className="text-muted-foreground">
              {p}
            </p>
          ))}
          {content.sections.map((sec) => (
            <div key={sec.heading} className="space-y-3 pt-2">
              <h3 className="font-display font-semibold text-xl text-ink">{sec.heading}</h3>
              {sec.body.map((p, i) => (
                <p key={i} className="text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          ))}
          {content.seeAlso?.map((item) => (
            <div key={item.to} className="space-y-3 pt-2">
              <SeeAlsoParagraph
                seeAlso={item}
                className="text-muted-foreground"
                headingClassName="font-display font-semibold text-xl text-ink"
              />
            </div>
          ))}
          <div className="pt-3">
            <UpdatedByline updated={updated} />
          </div>
        </article>

        <aside className="space-y-6 md:sticky md:top-24">
          {content.expect.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                What to expect
              </p>
              <ul className="mt-4 space-y-3">
                {content.expect.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <figure className="relative overflow-hidden rounded-lg">
            <img
              src={content.image.url}
              alt={content.image.alt}
              loading="lazy"
              width={1280}
              height={1600}
              className="h-72 w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
                <MapPin className="h-3.5 w-3.5" /> Serving Colorado
              </p>
              <p className="mt-1 font-display text-lg font-semibold">
                Proudly representing clients across Colorado.
              </p>
            </figcaption>
          </figure>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Confidential consultation
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Speak directly with an attorney about your case. No judgment, just clear and honest
              answers.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/** Up to three other services in the same practice area. */
export function RelatedServices({
  area,
  currentPath,
}: {
  area: PracticeArea;
  currentPath: string;
}) {
  const related = area.services.filter((s) => s.path !== currentPath).slice(0, 3);
  return (
    <section className="bg-surface py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display font-semibold text-2xl text-ink md:text-3xl">
            Related {area.title} services
          </h2>
          <Link to={area.path} className="text-sm font-semibold text-brand hover:text-brass-text">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to={r.path}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-brass"
            >
              <h3 className="font-display text-lg font-semibold text-ink">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:text-brass-text">
                Learn more <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Attorney bio pages ───────────── */

/** Bio page body: hero, photo and bio, admissions and experience, CTA. */
export function AttorneyBio({ a }: { a: Attorney }) {
  const led = PRACTICE_AREAS.find((c) => c.lead === a.slug);
  const details = [
    ...a.credentials.map((c) => (c.year ? `${c.label}, ${c.year}.` : `${c.label}.`)),
    ...a.education.map((e) => `${e.degree}, ${e.school}${e.year ? `, ${e.year}` : ""}.`),
  ];

  return (
    <>
      <PageHero eyebrow="Our Legal Team" title={a.name} subtitle={a.summary} />

      <section className="bg-background py-16 md:py-20">
        <div className="container-page">
          <article className="grid gap-10 md:grid-cols-[360px_1fr] md:items-center lg:gap-16">
            <div className="relative mx-auto w-full max-w-[360px] md:mx-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface ring-1 ring-border">
                <img
                  src={a.image.src}
                  alt={a.image.alt}
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                  width={680}
                  height={850}
                />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                {a.role}
              </p>
              <h2 className="mt-3 font-display font-semibold text-3xl text-ink md:text-4xl">
                {a.name}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                {a.bio.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      {(details.length > 0 || a.priorRoles.length > 0 || a.sameAs.length > 0) && (
        <section className="bg-surface py-16 md:py-20">
          <div className="container-page grid gap-10 md:grid-cols-2 lg:gap-16">
            {details.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  Admissions and education
                </p>
                <div className="mt-6 space-y-2 text-muted-foreground">
                  {details.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Prior experience
              </p>
              <div className="mt-6 space-y-2 text-muted-foreground">
                {a.priorRoles.map((r) => (
                  <p key={r}>{r}</p>
                ))}
                {a.sameAs.map((u) => (
                  <p key={u}>
                    <a
                      href={u}
                      rel="noopener"
                      className="font-semibold text-brand hover:text-brass-text"
                    >
                      {new URL(u).hostname.replace(/^www\./, "")} profile
                    </a>
                  </p>
                ))}
                {led && (
                  <p>
                    <a
                      href={`/${led.slug}`}
                      className="font-semibold text-brand hover:text-brass-text"
                    >
                      {led.title} at The Kohn Law Firm →
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <CTASection title={led?.cta.title} body={led?.cta.body} />
    </>
  );
}
