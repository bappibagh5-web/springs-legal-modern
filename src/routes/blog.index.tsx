import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Search, Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CTASection } from "@/components/CTASection";
import { listPublicPosts, type PublicCategory, type PublicPostCard } from "@/lib/public-posts.functions";

const PER_PAGE = 9;

const blogQueryOptions = queryOptions({
  queryKey: ["public-posts"],
  queryFn: () => listPublicPosts(),
});

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Legal Insights | The Kohn Law Firm" },
      { name: "description", content: "Practical legal guidance from Colorado Springs attorneys on criminal defense, family law, and protecting your rights." },
      { property: "og:title", content: "Blog — Legal Insights | The Kohn Law Firm" },
      { property: "og:description", content: "Practical legal guidance from Colorado Springs attorneys on criminal defense, family law, and protecting your rights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogQueryOptions),
  component: BlogArchivePage,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="container-page py-24 text-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    </PageShell>
  ),
});

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function BlogArchivePage() {
  const { data } = useSuspenseQuery(blogQueryOptions);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.posts.filter((p) => {
      if (cat && p.category?.slug !== cat) return false;
      if (!needle) return true;
      return (
        p.title.toLowerCase().includes(needle) ||
        (p.excerpt ?? "").toLowerCase().includes(needle)
      );
    });
  }, [data.posts, q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(253,186,52,0.6), transparent 40%), radial-gradient(circle at 85% 75%, rgba(159,40,40,0.4), transparent 45%)",
          }}
        />
        <div className="container-page relative py-20 md:py-24">
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Our Blog
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
            Legal insights for <span className="text-gold">Colorado Springs</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Straightforward guidance from our attorneys on criminal defense, family law, and the rights you need to protect at every stage of your case.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
            <input
              type="search"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="h-12 w-full rounded-md border border-white/20 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-border bg-white">
        <div className="container-page overflow-x-auto py-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <FilterPill active={cat === null} onClick={() => { setCat(null); setPage(1); }} color="#004AAD">
              All
            </FilterPill>
            {data.categories.map((c) => (
              <FilterPill key={c.id} active={cat === c.slug} onClick={() => { setCat(c.slug); setPage(1); }} color={c.color}>
                {c.name}
              </FilterPill>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Latest Articles</p>
              <h2 className="mt-2 font-display text-3xl text-brand md:text-4xl">Fresh from the firm</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {paged.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white py-20 text-center">
              <p className="text-muted-foreground">No articles match your search.</p>
              {(q || cat) && (
                <button
                  onClick={() => { setQ(""); setCat(null); setPage(1); }}
                  className="mt-3 text-sm font-semibold text-brand hover:text-crimson"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paged.map((p) => <PostCard key={p.id} post={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1">
                  <PagerButton disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </PagerButton>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`h-9 min-w-9 rounded-md px-3 text-sm font-semibold transition-colors ${
                        n === currentPage
                          ? "bg-brand text-white"
                          : "border border-border bg-white text-ink hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <PagerButton disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </PagerButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection
        title="Have questions about your case?"
        body="Every situation is different. Speak directly with an attorney at The Kohn Law Firm to understand your options — consultations are confidential."
      />
    </PageShell>
  );
}

function FilterPill({
  active, onClick, color, children,
}: { active: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-white text-ink hover:bg-muted"
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {children}
    </button>
  );
}

function PagerButton({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-white px-2 text-ink transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function PostCard({ post }: { post: PublicPostCard }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand/5 text-brand/40 font-display text-4xl">
            KLF
          </div>
        )}
        {post.category && (
          <span
            className="absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-md"
            style={{ background: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug text-ink line-clamp-2 group-hover:text-brand">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_time_minutes} min read</span>
          <span className="ml-auto inline-flex items-center gap-1 text-brand font-semibold group-hover:text-crimson">
            Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
