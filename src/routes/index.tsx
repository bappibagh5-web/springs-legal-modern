import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { CTASection, TestimonialsSection } from "@/site/blocks";
import { PRACTICE_AREAS, SITE, updatedFor } from "@/site/site";
import { pageHead, webPage, faqPage } from "@/lib/seo";
import scalesImg from "@/assets/scales-justice.jpg";
import familyImg from "@/assets/family-hands.jpg";
import courthouseImg from "@/assets/courthouse.jpg";
import skylineImg from "@/assets/colorado-springs-skyline.webp";
import { Phone, Shield, Scale, Users, CheckCircle2, ChevronDown } from "lucide-react";
import aboutFirmImg from "@/assets/courthouse-modern.webp.asset.json";
import shimonAsset from "@/assets/shimon-kohn-v3.jpg.asset.json";
import ericaAsset from "@/assets/erica-bertini.jpg.asset.json";
import maceyAsset from "@/assets/macey-jardee.jpg.asset.json";

const updated = updatedFor("/");

/*
 * Home page trial palette (scoped to this page only):
 * ink #14213D · brand #1F3A5F · brass #B08D57 (light brass on dark: #C9A877, text on light: #8C6B3A)
 * slate #5B6B80 · surface #F4F6F8 · text #1B2430 · muted #5E6876 · border #E2E6EB
 * Fonts: Newsreader (headings) + Public Sans (body)
 */
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&display=swap";

const PAGE_CSS = `
.hv2{font-family:"Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1B2430}
.hv2 .hv2-display{font-family:"Newsreader",Georgia,"Times New Roman",serif;font-optical-sizing:auto;letter-spacing:-0.01em;text-wrap:balance}
.hv2 p{line-height:1.65}
`;

/** Home page text. */
const content = {
  meta: {
    title: "Criminal Defense & Family Law Attorneys in Colorado Springs | Kohn Law",
    description:
      "The Kohn Law Firm handles criminal defense, family law and protection orders in Colorado Springs and El Paso County. Founded in 2003. Call 719-328-9555.",
  },
  hero: {
    titleLine1: "Criminal Defense and Family Law",
    titleHighlight: "in Colorado Springs",
    tagline: "El Paso County · Since 2003",
    subtitle:
      "Shimon Kohn handles criminal and protection order cases. Erica Bertini handles family law. You work directly with your attorney from the first call.",
    ctaLabel: "Schedule a Consultation",
    image: {
      url: skylineImg,
      alt: "Colorado Springs skyline with Pikes Peak and the Front Range",
    },
    stats: [
      { n: "25+", label: "Years in practice" },
      { n: "2003", label: "Firm founded" },
      { n: "24/7", label: "Criminal case line" },
    ],
  },
  services: {
    eyebrow: "Practice Areas",
    heading: "Criminal, family, and protection order cases",
    intro: "Three practice areas, each handled by an attorney who knows it.",
  },
  about: {
    image: {
      url: aboutFirmImg.url,
      alt: "Modern courthouse exterior in Colorado",
    },
    badgeNumber: "25+",
    badgeLabel: "Years of Experience",
    eyebrow: "About the Firm",
    heading: "A small firm where you work with your attorney.",
    body: "Shimon Kohn founded the firm in 2003 after working as a Deputy District Attorney in Teller and El Paso Counties. When you call, you reach people who know your file, and the attorney you meet with is the one handling your case.",
    bullets: [
      { text: "Both attorneys are former Deputy District Attorneys" },
      { text: "You meet with the attorney who handles your case" },
      { text: "Honest advice about what to expect in your case" },
      { text: "Fees explained at the first meeting" },
    ],
    linkLabel: "More about the firm →",
  },
  team: {
    eyebrow: "Our Legal Team",
    heading: "Counsel you can call by name.",
    linkLabel: "Meet the team →",
    members: [
      {
        name: "Shimon Kohn",
        title: "Founding Attorney",
        bio: "Over 25 years fighting for clients' rights. Former Deputy District Attorney in Teller and El Paso Counties, now leading the firm's criminal defense practice.",
        image: { url: shimonAsset.url, alt: "Shimon Kohn" },
      },
      {
        name: "Erica Bertini",
        title: "Managing Attorney – Family Law",
        bio: "Leads our family law practice, with a focus on family cases that intersect with criminal court. Former Deputy District Attorney in Colorado and Illinois.",
        image: { url: ericaAsset.url, alt: "Erica Bertini" },
      },
      {
        name: "Macey",
        title: "Family Law Paralegal",
        bio: "Supports clients at every stage of their case, assisting our family law attorneys with case preparation, file management, deadlines, and the litigation process.",
        image: { url: maceyAsset.url, alt: "Macey" },
      },
    ],
  },
  faq: {
    eyebrow: "Frequently Asked",
    heading: "Questions we hear most often.",
    intro: "Don't see your question? Call us at 719-328-9555 and ask.",
    items: [
      {
        q: "What should I do if I've been arrested in Colorado Springs?",
        a: "Invoke your right to remain silent and ask for an attorney. Do not discuss the facts of the case with officers, cellmates, or over recorded jail calls. Call our office as soon as you can safely do so.",
      },
      {
        q: "How quickly can I speak with an attorney?",
        a: "We answer the phone around the clock for criminal matters. For family law questions, call us and we will set up a consultation based on how soon you need one.",
      },
      {
        q: "Do you handle cases outside El Paso County?",
        a: "Yes. We regularly appear in Pueblo, Teller, Fremont, and Douglas counties, and we accept select matters elsewhere in Colorado.",
      },
      {
        q: "How much will my case cost?",
        a: "Fees depend on the charge or type of case, the court, and how much work the case is likely to need. We explain our fees at the first meeting, before you decide whether to hire us.",
      },
    ],
  },
  whoWeAre: {
    eyebrow: "Who We Are",
    heading:
      "Lawyers who treat their clients like neighbors, because in Colorado Springs, they are.",
    body: [
      "The Kohn Law Firm is a Colorado Springs practice rooted in this community. We know the courts, the prosecutors, and the judges. More importantly, we know the people who walk through our doors are usually facing the worst week of their lives.",
      "Our standard is simple: answer the phone, prepare the case, and tell the truth, even when the truth is hard.",
    ],
  },
};
const H = content;

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      ...content.meta,
      jsonLd: [
        webPage({
          path: "/",
          name: content.meta.title,
          description: content.meta.description,
          modified: updated,
        }),
        faqPage(H.faq.items.map((f) => ({ q: f.q, a: [f.a] }))),
      ],
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <PageShell>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_HREF} />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="hv2">
        <Hero />
        <ServicesSection />
        <AboutSection />
        <TeamPreview />
        <FAQSection />
        <WhoWeAre />
        <TestimonialsSection />
        <CTASection />
      </div>
    </PageShell>
  );
}

function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className={
        onDark
          ? "text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A877]"
          : "text-xs font-semibold uppercase tracking-[0.18em] text-[#5B6B80]"
      }
    >
      {children}
    </p>
  );
}

function Hero() {
  const img = H.hero.image;
  return (
    <section className="relative isolate overflow-hidden bg-[#14213D] text-white">
      {/* Background photo */}
      <img
        src={img.url}
        alt={img.alt}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        width={2400}
        height={1000}
        loading="eager"
        fetchPriority="high"
      />
      {/* Dark sheet: even tint plus a deeper base so the stats stay readable */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#14213D]/70" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#14213D]/30 via-transparent to-[#14213D]/90"
      />

      <div className="container-page flex min-h-[620px] flex-col md:min-h-[720px] lg:min-h-[780px]">
        {/* Centered message */}
        <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center py-20 text-center md:py-24">
          <h1 className="hv2-display text-4xl font-semibold leading-[1.08] md:text-5xl lg:text-6xl animate-fade-up">
            {H.hero.titleLine1}{" "}
            <span className="block text-[#C9A877]">{H.hero.titleHighlight}</span>
          </h1>

          <p
            className="mt-6 text-xs font-medium uppercase tracking-[0.45em] text-white/85 md:text-sm animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {H.hero.tagline}
          </p>

          <p
            className="mt-6 max-w-2xl text-base text-white/80 md:text-lg animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            {H.hero.subtitle}
          </p>

          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              to="/consultation"
              className="inline-flex h-12 items-center rounded-md bg-[#B08D57] px-7 text-base font-semibold text-white transition-colors hover:bg-[#9A7A48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {H.hero.ctaLabel}
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex h-12 items-center gap-2.5 rounded-md border border-white/35 px-6 text-base font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-[#C9A877]" />
              {SITE.phone}
            </a>
          </div>
        </div>

        {/* Stats row along the bottom */}
        <div className="grid grid-cols-3 border-t border-white/15 py-7 md:py-9">
          {H.hero.stats.map((st, i) => (
            <Stat key={i} n={st.n} label={st.label} divider={i > 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label, divider }: { n: string; label: string; divider?: boolean }) {
  return (
    <div className={`px-2 text-center ${divider ? "border-l border-white/15" : ""}`}>
      <p className="hv2-display text-2xl font-semibold text-white md:text-4xl">{n}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 md:text-xs">
        {label}
      </p>
    </div>
  );
}

function ServicesSection() {
  const icons = [Shield, Scale, Users];
  const images = [courthouseImg, familyImg, scalesImg];
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{H.services.eyebrow}</Eyebrow>
          <h2 className="hv2-display mt-3 text-3xl font-semibold text-[#14213D] md:text-4xl">
            {H.services.heading}
          </h2>
          <p className="mt-4 text-[#5E6876]">{H.services.intro}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PRACTICE_AREAS.map((cat, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={cat.slug}
                to={cat.path}
                className="group relative overflow-hidden rounded-lg border border-[#E2E6EB] bg-white transition-colors hover:border-[#B08D57]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={images[i]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/95 text-[#14213D]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="hv2-display text-xl font-semibold text-[#14213D]">{cat.title}</h3>
                  <p className="mt-2 text-sm text-[#5E6876]">{cat.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1F3A5F] group-hover:text-[#8C6B3A]">
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
  const aboutImg = H.about.image;
  return (
    <section className="bg-[#F4F6F8] py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative">
          <img
            src={aboutImg.url}
            alt={aboutImg.alt}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover"
            width={1280}
            height={960}
          />
          <div className="absolute -bottom-6 -right-6 hidden rounded-lg bg-[#14213D] p-6 text-white md:block">
            <p className="hv2-display text-3xl font-semibold text-[#C9A877]">{H.about.badgeNumber}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/75">{H.about.badgeLabel}</p>
          </div>
        </div>
        <div>
          <Eyebrow>{H.about.eyebrow}</Eyebrow>
          <h2 className="hv2-display mt-3 text-3xl font-semibold text-[#14213D] md:text-4xl">
            {H.about.heading}
          </h2>
          <p className="mt-5 text-[#5E6876]">{H.about.body}</p>
          <ul className="mt-6 space-y-3">
            {H.about.bullets.map(({ text: p }, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1B2430]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#B08D57]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F3A5F] hover:text-[#8C6B3A]"
            >
              {H.about.linkLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamPreview() {
  const TEAM = H.team.members;
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow>{H.team.eyebrow}</Eyebrow>
            <h2 className="hv2-display mt-3 text-3xl font-semibold text-[#14213D] md:text-4xl">
              {H.team.heading}
            </h2>
          </div>
          <Link
            to="/team"
            className="text-sm font-semibold text-[#1F3A5F] hover:text-[#8C6B3A]"
          >
            {H.team.linkLabel}
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TEAM.map((m, i) => (
            <article
              key={i}
              className="group relative overflow-hidden rounded-lg border border-[#E2E6EB] bg-white"
            >
              <div className="relative h-80 overflow-hidden bg-[#F4F6F8]">
                <img
                  src={m.image?.url}
                  alt={m.image?.alt || m.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  width={1024}
                  height={1280}
                />
              </div>
              <div className="p-6">
                <h3 className="hv2-display text-xl font-semibold text-[#14213D]">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8C6B3A]">
                  {m.title}
                </p>
                <p className="mt-3 text-sm text-[#5E6876]">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const FAQS = H.faq.items;
  return (
    <section className="bg-[#F4F6F8] py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_2fr]">
        <div>
          <Eyebrow>{H.faq.eyebrow}</Eyebrow>
          <h2 className="hv2-display mt-3 text-3xl font-semibold text-[#14213D] md:text-4xl">
            {H.faq.heading}
          </h2>
          <p className="mt-4 text-[#5E6876]">{H.faq.intro}</p>
        </div>
        <ul className="divide-y divide-[#E2E6EB] rounded-lg border border-[#E2E6EB] bg-white">
          {FAQS.map((f, i) => (
            <li key={i}>
              {/* Native <details> keeps every answer in the server HTML. */}
              <details name="home-faq" open={i === 0} className="group">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="hv2-display text-lg font-medium text-[#14213D]">{f.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#5B6B80] transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-sm text-[#5E6876]">{f.a}</div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="relative isolate overflow-hidden bg-[#14213D] py-20 text-white md:py-28">
      <img
        src={scalesImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-10"
        loading="lazy"
      />
      <div className="container-page relative grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Eyebrow onDark>{H.whoWeAre.eyebrow}</Eyebrow>
          <h2 className="hv2-display mt-3 text-3xl font-semibold md:text-4xl">
            {H.whoWeAre.heading}
          </h2>
        </div>
        <div className="space-y-4 text-white/80">
          {H.whoWeAre.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}