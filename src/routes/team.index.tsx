import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { updatedFor, ATTORNEYS, STAFF } from "@/site/site";
import { CTASection, PageHero } from "@/site/blocks";
import { pageHead, webPage, breadcrumbs } from "@/lib/seo";

const updated = updatedFor("/team");

/** Page text. */
const content = {
  meta: {
    title: "Our Attorneys and Staff | The Kohn Law Firm, Colorado Springs",
    description:
      "Meet Shimon Kohn, founding attorney, and Erica Bertini, managing family law attorney, plus the paralegals who work on every case at The Kohn Law Firm.",
  },
  hero: {
    eyebrow: "Our Legal Team",
    title: "The attorneys behind every case.",
    subtitle:
      "At Kohn Law Firm, our attorneys and staff combine proven legal experience with detailed case preparation and ethical advocacy. We approach every case with professionalism, focus, and a commitment to delivering results our clients can trust.",
  },
};

export const Route = createFileRoute("/team/")({
  head: () =>
    pageHead({
      path: "/team",
      ...content.meta,
      jsonLd: [
        webPage({
          path: "/team",
          name: content.meta.title,
          description: content.meta.description,
          modified: updated,
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Our team", path: "/team" },
        ]),
      ],
    }),
  component: TeamPage,
});

type Member = {
  name: string;
  title: string;
  img: string;
  bio: string[];
};

/** Built from src/content/attorneys.ts so the bios live in one place. */
const MEMBERS: Member[] = [
  ...ATTORNEYS.map((a) => ({ name: a.name, title: a.role, img: a.image.src, bio: a.bio })),
  ...STAFF.map((m) => ({ name: m.name, title: m.role, img: m.image?.src ?? "", bio: m.bio })),
];

function TeamPage() {
  return (
    <PageShell>
      <PageHero {...content.hero} />

      <section className="py-20 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
              Meet Our Team
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Experienced attorneys and the staff who back them.
            </h2>
          </div>
        </div>
      </section>

      <div className="space-y-0">
        {MEMBERS.map((m, i) => {
          const alt = i % 2 === 1;
          const reverse = i % 2 === 1;
          return (
            <section
              key={m.name}
              className={`${alt ? "bg-surface" : "bg-background"} py-16 md:py-20`}
            >
              <div className="container-page">
                <article
                  className={`grid gap-10 md:items-center lg:gap-16 ${
                    reverse ? "md:grid-cols-[1fr_360px]" : "md:grid-cols-[360px_1fr]"
                  }`}
                >
                  <div
                    className={`relative mx-auto w-full max-w-[360px] md:mx-0 ${
                      reverse ? "md:order-2" : ""
                    }`}
                  >
                    <div
                      aria-hidden
                      className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-gold/30 via-transparent to-brand/30 blur-2xl"
                    />
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface shadow-elegant ring-1 ring-border">
                      {m.img ? (
                        <img
                          src={m.img}
                          alt={m.name}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                          width={680}
                          height={850}
                        />
                      ) : (
                        <div
                          aria-label={`${m.name} portrait placeholder`}
                          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-surface text-muted-foreground"
                        >
                          <svg
                            viewBox="0 0 100 120"
                            className="h-2/3 w-2/3 text-border"
                            fill="currentColor"
                            aria-hidden
                          >
                            <circle cx="50" cy="40" r="20" />
                            <path d="M15 115 C15 85, 35 72, 50 72 C65 72, 85 85, 85 115 Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-3 left-6 h-1 w-16 bg-gold" />
                  </div>

                  <div className={`min-w-0 ${reverse ? "md:order-1" : ""}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                      {m.title}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-ink md:text-4xl">{m.name}</h3>
                    <div className="mt-3 h-1 w-12 bg-gold" />
                    <div className="mt-6 space-y-4 text-muted-foreground">
                      {m.bio.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          );
        })}
      </div>

      <CTASection />
    </PageShell>
  );
}
