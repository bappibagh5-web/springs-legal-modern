import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import { findCategory } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/$category/")({
  head: ({ params }) => {
    const cat = findCategory(params.category);
    const title = cat ? `${cat.title} — The Kohn Law Firm` : "Practice Area";
    return {
      meta: [
        { title },
        { name: "description", content: cat?.short ?? "Practice area at The Kohn Law Firm." },
        { property: "og:title", content: title },
        { property: "og:description", content: cat?.short ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = findCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  return (
    <PageShell>
      <ServiceHero
        eyebrow="Practice Area"
        title={category.title}
        subtitle={category.short}
      />

      <section className="py-20 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Overview</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">{category.title} in Colorado</h2>
            <p className="mt-5 text-muted-foreground">{category.intro}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Services</p>
            <ul className="mt-4 divide-y divide-border">
              {category.items.map((it) => (
                <li key={it.slug}>
                  <Link
                    to="/$category/$service"
                    params={{ category: category.slug, service: it.slug }}
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

      <section className="bg-surface py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl text-ink md:text-4xl">Explore {category.title}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((it) => (
              <Link
                key={it.slug}
                to="/$category/$service"
                params={{ category: category.slug, service: it.slug }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand hover:shadow-elegant"
              >
                <h3 className="font-display text-lg text-brand">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-crimson group-hover:text-brand">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
