import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { findService, type ServiceItem } from "@/lib/site";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import coloradoMountains from "@/assets/colorado-mountains.jpg.asset.json";
import coloradoPikesPeak from "@/assets/colorado-pikes-peak.jpg.asset.json";
import coloradoGardenGods from "@/assets/colorado-garden-gods.jpg.asset.json";
import coloradoLake from "@/assets/colorado-lake.jpg.asset.json";

const LANDSCAPES = [coloradoPikesPeak, coloradoGardenGods, coloradoLake, coloradoMountains];
const pickLandscape = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return LANDSCAPES[h % LANDSCAPES.length];
};

export const Route = createFileRoute("/$category/$service")({
  head: ({ params }) => {
    const { category, item } = findService(params.category, params.service);
    const title = item ? `${item.title} — ${category?.title} | The Kohn Law Firm` : "Service";
    return {
      meta: [
        { title },
        { name: "description", content: item?.blurb ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: item?.blurb ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const { category, item } = findService(params.category, params.service);
    if (!category || !item) throw notFound();
    return { category, item };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { category, item } = Route.useLoaderData();
  const related = category.items.filter((i: ServiceItem) => i.slug !== item.slug).slice(0, 3);

  return (
    <PageShell>
      <ServiceHero eyebrow={category.title} title={item.title} subtitle={item.blurb} />

      <section className="py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
          <article className="space-y-5 text-base leading-relaxed text-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Overview</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">{item.title} in Colorado Springs</h2>
            {item.body.map((p: string, i: number) => (
              <p key={i} className="text-muted-foreground">{p}</p>
            ))}
          </article>

          <aside className="space-y-6 md:sticky md:top-24">
            {item.whatToExpect && item.whatToExpect.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">What to expect</p>
                <ul className="mt-4 space-y-3">
                  {item.whatToExpect.map((w: string) => (
                    <li key={w} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <figure className="relative overflow-hidden rounded-xl shadow-elegant">
              <img
                src={coloradoMountains.url}
                alt="Colorado Springs landscape with Pikes Peak"
                loading="lazy"
                width={1280}
                height={1600}
                className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  <MapPin className="h-3.5 w-3.5" /> Serving Colorado Springs
                </p>
                <p className="mt-1 font-display text-lg">Proudly representing clients across El Paso & Teller County.</p>
              </figcaption>
            </figure>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">Confidential consultation</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Speak directly with an attorney about your case. No judgment — just clear, honest answers.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Related {category.title} services</h2>
            <Link
              to="/$category"
              params={{ category: category.slug }}
              className="text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r: ServiceItem) => (
              <Link
                key={r.slug}
                to="/$category/$service"
                params={{ category: category.slug, service: r.slug }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand hover:shadow-elegant"
              >
                <h3 className="font-display text-lg text-brand">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-crimson group-hover:text-brand">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection variant="light" />
      <CTASection />
    </PageShell>
  );
}
