import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, Calendar, Clock, Copy, Check, Facebook, Linkedin, Twitter, Phone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ActionButton } from "@/components/ActionButton";
import { CTASection } from "@/components/CTASection";
import { getPublicPost, type PublicPostCard } from "@/lib/public-posts.functions";
import { useSiteInfo } from "@/lib/cms/context";

const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public-post", slug],
    queryFn: () => getPublicPost({ data: { slug } }),
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(postQueryOptions(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found | The Kohn Law Firm" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    const desc = p.meta_description ?? p.excerpt ?? "Legal insight from The Kohn Law Firm.";
    return {
      meta: [
        { title: `${p.title} | The Kohn Law Firm` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p.featured_image_url
          ? [
              { property: "og:image", content: p.featured_image_url },
              { name: "twitter:image", content: p.featured_image_url },
            ]
          : []),
      ],
      scripts: p.schema_jsonld
        ? [{ type: "application/ld+json", children: JSON.stringify(p.schema_jsonld) }]
        : [],
    };
  },
  component: BlogPostPage,
  notFoundComponent: PostNotFound,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="container-page py-24 text-center">
        <p className="text-destructive">{error.message}</p>
        <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-brand hover:text-crimson">
          ← Back to blog
        </Link>
      </div>
    </PageShell>
  ),
});

function PostNotFound() {
  return (
    <PageShell>
      <div className="container-page py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl text-brand">Article not found</h1>
        <p className="mt-3 text-muted-foreground">The article you're looking for isn't published or may have been moved.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    </PageShell>
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

type Heading = { id: string; text: string; level: 2 | 3 };

function extractHeadings(md: string): Heading[] {
  const lines = md.split("\n");
  const out: Heading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    out.push({ id, text, level });
  }
  return out;
}

function BlogPostPage() {
  const SITE = useSiteInfo();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQueryOptions(slug));
  if (!data) return <PostNotFound />;
  const { post, related } = data;
  const headings = extractHeadings(post.body);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
    window.trackEvent?.("blog_post_read", "engagement", post.title);
  }, [slug, post.title]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-white">
        <div className="container-page py-10 md:py-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="mt-6 max-w-3xl">
            {post.category && (
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: post.category.color }}
              >
                {post.category.name}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 border-l-2 border-gold pl-4 text-lg italic text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="font-medium text-ink">By The Kohn Law Firm Team</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {fmtDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.read_time_minutes} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {post.featured_image_url && (
        <div className="bg-background">
          <div className="container-page pt-8">
            <div className="aspect-[16/7] w-full overflow-hidden rounded-xl bg-muted">
              <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Body + Sidebar */}
      <section className="bg-background py-12 md:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-brand prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:text-[17px] prose-p:leading-[1.75] prose-p:text-ink/85 prose-a:text-brand prose-a:no-underline hover:prose-a:text-crimson prose-strong:text-ink prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-white prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-ink/80 prose-ul:my-4 prose-li:my-1 prose-img:rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {post.body}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
                <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</span>
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-white px-3 py-1 text-xs text-ink/80">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-4">
              <span className="text-sm font-semibold text-ink">Share this article</span>
              <div className="ml-auto flex items-center gap-2">
                <ShareIcon href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}><Twitter className="h-4 w-4" /></ShareIcon>
                <ShareIcon href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}><Facebook className="h-4 w-4" /></ShareIcon>
                <ShareIcon href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}><Linkedin className="h-4 w-4" /></ShareIcon>
                <button
                  onClick={handleCopy}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-white px-3 text-xs font-semibold text-ink transition-colors hover:bg-muted"
                >
                  {copied ? <><Check className="h-4 w-4 text-brand" /> Copied</> : <><Copy className="h-4 w-4" /> Copy link</>}
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit space-y-6">
            {headings.length > 0 && (
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">In this article</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                      <a href={`#${h.id}`} className="block text-ink/75 hover:text-brand">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-brand bg-brand p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Need legal help?</p>
              <h3 className="mt-2 font-display text-xl leading-snug">
                Talk to an attorney at The Kohn Law Firm.
              </h3>
              <p className="mt-2 text-sm text-white/85">
                Confidential consultations for criminal defense and family law matters in Colorado Springs.
              </p>
              <div className="mt-5">
                <ActionButton variant="gold" size="sm">Book a free consultation</ActionButton>
              </div>
              <a href={SITE.phoneHref} className="mt-4 inline-flex items-center gap-2 text-sm text-white/90 hover:text-gold">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* More from the blog */}
      {related.length > 0 && (
        <section className="border-t border-border bg-white py-16">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Keep reading</p>
              <h2 className="mt-2 font-display text-3xl text-brand">More from the blog</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <RelatedCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </PageShell>
  );
}

function ShareIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink transition-colors hover:bg-brand hover:text-white hover:border-brand"
    >
      {children}
    </a>
  );
}

function RelatedCard({ post }: { post: PublicPostCard }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {post.featured_image_url ? (
          <img src={post.featured_image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand/5 text-brand/40 font-display text-4xl">KLF</div>
        )}
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-md" style={{ background: post.category.color }}>
            {post.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg leading-snug text-ink line-clamp-2 group-hover:text-brand">{post.title}</h3>
        {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_time_minutes} min</span>
        </div>
      </div>
    </Link>
  );
}
