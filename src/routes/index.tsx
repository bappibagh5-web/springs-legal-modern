import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ActionButton } from "@/components/ActionButton";
import { CTASection } from "@/components/CTASection";
import { SITE, CATEGORIES } from "@/lib/site";
import heroAsset from "@/assets/colorado-springs.webp.asset.json";
import attorneyImg from "@/assets/attorney-portrait.jpg";
import attorney2 from "@/assets/attorney-2.jpg";
import attorney3 from "@/assets/attorney-3.jpg";
import officeImg from "@/assets/office-interior.jpg";
import scalesImg from "@/assets/scales-justice.jpg";
import familyImg from "@/assets/family-hands.jpg";
import courthouseImg from "@/assets/courthouse.jpg";
import { Phone, Shield, Scale, Users, CheckCircle2, Quote, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Kohn Law Firm — Colorado Springs Criminal Defense Attorney" },
      { name: "description", content: "Colorado Springs criminal defense, family law, and protection-order representation. Schedule a confidential consultation with attorney Shimon Kohn." },
      { property: "og:title", content: "The Kohn Law Firm — Colorado Springs Criminal Defense" },
      { property: "og:description", content: "Trusted defense counsel for Colorado Springs and El Paso County." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PageShell>
      <Hero />
      <ServicesSection />
      <AboutSection />
      <TeamPreview />
      <FAQSection />
      <WhoWeAre />
      <TestimonialsSection />
      <CTASection />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white lg:grid lg:grid-cols-2">
      {/* ── LEFT: clean text half ── */}
      <div className="relative flex flex-col justify-center px-6 py-20 md:px-12 md:py-28 lg:px-16 lg:py-0 lg:pr-10 xl:px-24">
        {/* subtle top-to-bottom warmth on the dark panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink via-[#0a1628] to-ink"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-[32rem] w-[32rem] bg-brand/10 blur-3xl"
        />

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Colorado Springs · Trusted Trial Counsel
          </div>

          <h1
            className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-[3.4rem] xl:text-6xl animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            We Help You Solve{" "}
            <span className="block">
              Your Legal{" "}
              <span className="bg-gradient-to-r from-gold via-[#ffd773] to-gold bg-clip-text text-transparent">
                Challenges
              </span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-md text-base leading-relaxed text-white/80 md:text-lg animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            Kohn Law Firm provides focused and aggressive legal representation in
            criminal defense and family law cases. With decades of combined
            experience, our attorneys protect your rights and guide you through
            the legal process with clarity and care.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            <Link to="/consultation">
              <div className="group relative overflow-hidden rounded-md">
                <ActionButton variant="gold" size="lg">
                  Schedule a Consultation
                </ActionButton>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/40 animate-shine"
                />
              </div>
            </Link>
            <a
              href={SITE.phoneHref}
              className="group inline-flex h-12 items-center gap-3 rounded-md border border-white/25 bg-white/5 px-5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-all hover:border-gold hover:bg-white/10 hover:text-gold"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40 transition-transform group-hover:scale-110">
                <Phone className="h-4 w-4 text-gold" />
              </span>
              {SITE.phone}
            </a>
          </div>

          <div
            className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-white/15 pt-7 animate-fade-up"
            style={{ animationDelay: "420ms" }}
          >
            <Stat n="15+" label="Years experience" />
            <Stat n="1000+" label="Cases handled" />
            <Stat n="24/7" label="Case response" />
          </div>
        </div>
      </div>

      {/* ── RIGHT: image half ── */}
      <div className="relative hidden lg:block">
        <img
          src={heroAsset.url}
          alt="Downtown Colorado Springs with the Rocky Mountains"
          className="h-full w-full object-cover animate-ken-burns"
          width={1920}
          height={1280}
        />
        {/* gentle inner edge fade so the split feels soft, not harsh */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent" />

        {/* floating badge over image */}
        <div className="absolute bottom-10 left-10 animate-float rounded-xl border border-white/20 bg-white/95 px-5 py-4 text-ink shadow-elegant backdrop-blur">
          <p className="font-display text-2xl font-bold text-brand">A+</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Client rated
          </p>
        </div>
        <div
          className="absolute right-10 top-10 animate-float rounded-xl border border-white/20 bg-gold px-5 py-4 text-gold-foreground shadow-elegant"
          style={{ animationDelay: "-2.5s" }}
        >
          <p className="font-display text-2xl font-bold">15+</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider">
            Years trial
          </p>
        </div>
      </div>

      {/* Mobile image strip (below text) */}
      <div className="relative h-64 lg:hidden">
        <img
          src={heroAsset.url}
          alt="Downtown Colorado Springs with the Rocky Mountains"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-gold md:text-4xl">{n}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
        {label}
      </p>
    </div>
  );
}

function ServicesSection() {
  const icons = [Shield, Scale, Users];
  const images = [courthouseImg, familyImg, scalesImg];
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            Practice Areas
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            Focused, full-service representation
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three core practice areas, one standard of preparation.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={cat.slug}
                to="/$category"
                params={{ category: cat.slug }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={images[i]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold text-gold-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-brand">{cat.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{cat.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-crimson group-hover:text-brand">
                    Learn more →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative">
          <img
            src={officeImg}
            alt="The Kohn Law Firm office interior"
            loading="lazy"
            className="rounded-xl shadow-elegant"
            width={1280}
            height={896}
          />
          <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-crimson p-6 text-white shadow-elegant md:block">
            <p className="font-display text-3xl">15+</p>
            <p className="mt-1 text-xs uppercase tracking-wide">Years of Trial Experience</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            About the Firm
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            A boutique practice built around the client.
          </h2>
          <p className="mt-5 text-muted-foreground">
            The Kohn Law Firm was founded on a simple idea: people facing serious
            legal trouble deserve direct access to their attorney. Not an associate,
            not a paralegal — the lawyer handling their case.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Direct, attorney-led communication on every case",
              "Trial-ready preparation from day one",
              "Strategic, candid counsel — not false promises",
              "Decades of combined courtroom experience",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
            >
              More about the firm →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const TEAM = [
  {
    name: "Shimon Kohn, Esq.",
    title: "Founding Attorney",
    bio: "Lead trial counsel for the firm's criminal defense and protection-order practices.",
    img: attorneyImg,
  },
  {
    name: "Rachel Bennett, Esq.",
    title: "Senior Family Law Attorney",
    bio: "Guides clients through divorce, custody, and protection orders with steady, strategic counsel.",
    img: attorney2,
  },
  {
    name: "Marcus Patel, Esq.",
    title: "Associate Attorney",
    bio: "Handles criminal defense matters from arraignment through trial across the Front Range.",
    img: attorney3,
  },
];

function TeamPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
              Our Legal Team
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Counsel you can call by name.
            </h2>
          </div>
          <Link to="/team" className="text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson">
            Meet the team →
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TEAM.map((m) => (
            <article
              key={m.name}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={1024}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                <span className="absolute left-4 top-4 inline-block h-1 w-10 bg-gold" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-brand">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-crimson">
                  {m.title}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "What should I do if I've been arrested in Colorado Springs?",
    a: "Invoke your right to remain silent and ask for an attorney. Do not discuss the facts of the case with officers, cellmates, or over recorded jail calls. Call our office as soon as you can safely do so.",
  },
  {
    q: "How quickly can I speak with an attorney?",
    a: "We answer the phone around the clock for criminal matters. For non-emergency family-law questions, we typically schedule a consultation within one to three business days.",
  },
  {
    q: "Do you handle cases outside El Paso County?",
    a: "Yes. We regularly appear in Pueblo, Teller, Fremont, and Douglas counties, and we accept select matters elsewhere in Colorado.",
  },
  {
    q: "How much will my case cost?",
    a: "Fees depend on the charge, court, and projected work. We discuss fee structure openly during the initial consultation so you can make an informed decision.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            Frequently Asked
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            Questions we hear most often.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Don't see your question? Reach out — most calls are answered the same day.
          </p>
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="font-display text-lg text-ink">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-brand transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground animate-fade-up">
                  {f.a}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white md:py-28">
      <img src={scalesImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink to-ink/70" />
      <div className="container-page relative grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Who We Are
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Lawyers who treat their clients like neighbors — because in Colorado Springs, they are.
          </h2>
        </div>
        <div className="space-y-4 text-white/85">
          <p>
            The Kohn Law Firm is a Colorado Springs practice rooted in this community.
            We know the courts, the prosecutors, and the judges. More importantly, we
            know the people who walk through our doors are usually facing the worst
            week of their lives.
          </p>
          <p>
            Our standard is simple: answer the phone, prepare the case, and tell the
            truth — even when the truth is hard.
          </p>
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  { q: "Shimon was straightforward from the first call. He explained the realistic outcomes and then delivered better than we hoped.", a: "Former Client, Colorado Springs" },
  { q: "I never felt like a case number. Every email, every call — answered promptly and with respect.", a: "Former Client, El Paso County" },
  { q: "Trial preparation was meticulous. The other side knew it the moment we walked into court.", a: "Former Client, Pueblo County" },
];

function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
            Client Testimonials
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            What clients say.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.a} className="relative rounded-xl border border-border bg-card p-7 shadow-card">
              <Quote className="absolute -top-3 left-6 h-7 w-7 rounded bg-gold p-1.5 text-gold-foreground" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                "{r.q}"
              </blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wide text-crimson">
                {r.a}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Testimonials reflect individual client experiences and do not guarantee a similar outcome.
        </p>
      </div>
    </section>
  );
}
