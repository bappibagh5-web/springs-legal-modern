import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CTASection } from "@/components/CTASection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { findService, type ServiceItem } from "@/lib/site";
import { cmsHead } from "@/lib/cms/seo";
import { CmsHero } from "@/components/CmsHero";
import { useCms, CmsSection } from "@/lib/cms/context";
import { serviceKey, paragraphs } from "@/lib/cms/registry";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";

/* Colorado & Colorado Springs landscapes — one unique image per service page */
import coloradoSpringsDowntown from "@/assets/colorado-springs-downtown.jpg.asset.json";
import coloradoSevenFalls from "@/assets/colorado-seven-falls.jpg.asset.json";
import coloradoRedRockCanyon from "@/assets/colorado-red-rock-canyon.jpg.asset.json";
import coloradoAirForceAcademy from "@/assets/colorado-air-force-academy.jpg.asset.json";
import coloradoCheyenneMountain from "@/assets/colorado-cheyenne-mountain.jpg.asset.json";
import coloradoWildflowers from "@/assets/colorado-wildflowers.jpg.asset.json";
import coloradoAspenFall from "@/assets/colorado-aspen-fall.jpg.asset.json";
import coloradoRoyalGorge from "@/assets/colorado-royal-gorge.jpg.asset.json";
import coloradoPikesPeak from "@/assets/colorado-pikes-peak.jpg.asset.json";
import coloradoGardenGods from "@/assets/colorado-garden-gods.jpg.asset.json";
import coloradoLake from "@/assets/colorado-lake.jpg.asset.json";
import coloradoMountains from "@/assets/colorado-mountains.jpg.asset.json";

const SERVICE_IMAGES: Record<string, { url: string; alt: string }> = {
  /* Criminal Defense */
  "misdemeanor-crimes": { url: coloradoSpringsDowntown.url, alt: "Colorado Springs downtown skyline with Pikes Peak" },
  "financial-crimes": { url: coloradoSevenFalls.url, alt: "Seven Falls waterfall in Colorado Springs" },
  "sexual-assault": { url: coloradoRedRockCanyon.url, alt: "Red Rock Canyon Open Space" },
  "burglary": { url: coloradoAirForceAcademy.url, alt: "United States Air Force Academy Chapel" },
  "domestic-violence": { url: coloradoCheyenneMountain.url, alt: "Cheyenne Mountain in Colorado Springs" },
  "felony-crimes": { url: coloradoWildflowers.url, alt: "Colorado mountain wildflower meadow" },
  "theft": { url: coloradoAspenFall.url, alt: "Golden aspen trees in Colorado fall" },
  "sexual-offenses": { url: coloradoRoyalGorge.url, alt: "Royal Gorge Bridge spanning the canyon" },
  "crimes-against-a-person": { url: coloradoPikesPeak.url, alt: "Pikes Peak mountain summit" },
  "murder-attempted-murder": { url: coloradoGardenGods.url, alt: "Garden of the Gods red rock formations" },
  "sexual-assault-on-a-child": { url: coloradoLake.url, alt: "Serene Colorado alpine lake" },
  "sexual-exploitation-of-a-child": { url: coloradoMountains.url, alt: "Rocky Mountain panorama" },
  /* Family Law */
  "divorce-separation": { url: coloradoSpringsDowntown.url, alt: "Colorado Springs downtown skyline with Pikes Peak" },
  "adoption": { url: coloradoSevenFalls.url, alt: "Seven Falls waterfall in Colorado Springs" },
  "child-support": { url: coloradoRedRockCanyon.url, alt: "Red Rock Canyon Open Space" },
  "allocation-of-parental-responsibilities": { url: coloradoCheyenneMountain.url, alt: "Cheyenne Mountain in Colorado Springs" },
  /* Protection Orders */
  "permanent-protection-order": { url: coloradoWildflowers.url, alt: "Colorado mountain wildflower meadow" },
  "temporary-protection-order": { url: coloradoAirForceAcademy.url, alt: "United States Air Force Academy Chapel" },
};

export const Route = createFileRoute("/$category/$service")({
  head: ({ params, matches }) => {
    const { category, item } = findService(params.category, params.service);
    const title = item ? `${item.title} — ${category?.title} | The Kohn Law Firm` : "Service";
    return cmsHead(matches, serviceKey(params.category, params.service), { title, description: item?.blurb ?? "" });
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
  const pageKey = serviceKey(category.slug, item.slug);
  const cms = useCms(pageKey);
  const expect = cms.list<{ text: string }>("expect.items").map((x) => x.text).filter(Boolean);
  const image = SERVICE_IMAGES[item.slug] ?? { url: coloradoMountains.url, alt: "Colorado landscape" };

  return (
    <PageShell>
      <CmsHero page={pageKey} />

      <section className="py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
          <CmsSection page={pageKey} id="overview">
          <article className="space-y-5 text-base leading-relaxed text-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Overview</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">{cms.text("overview.heading")}</h2>
            {paragraphs(cms.text("overview.body")).map((p: string, i: number) => (
              <p key={i} className="text-muted-foreground">{p}</p>
            ))}
          </article>
          </CmsSection>

          <aside className="space-y-6 md:sticky md:top-24">
            {expect.length > 0 && (
              <CmsSection page={pageKey} id="expect">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">What to expect</p>
                <ul className="mt-4 space-y-3">
                  {expect.map((w: string) => (
                    <li key={w} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </CmsSection>
            )}

            <figure className="relative overflow-hidden rounded-xl shadow-elegant">
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                width={1280}
                height={1600}
                className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  <MapPin className="h-3.5 w-3.5" /> Serving Colorado
                </p>
                <p className="mt-1 font-display text-lg">Proudly representing clients across Colorado.</p>
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
