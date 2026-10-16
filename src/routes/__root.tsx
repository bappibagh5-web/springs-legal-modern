import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE } from "@/site/site";
import { siteGraph } from "@/lib/seo";
import { PageShell } from "@/site/Layout";
import favicon32 from "@/assets/klf-icon.png.asset.json";
import appleTouchIcon from "@/assets/klf-icon.png.asset.json";

function NotFoundComponent() {
  return (
    <PageShell>
      <section className="container-page py-24 text-center md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">404</p>
        <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Try one of these, or call us at{" "}
          <a href={SITE.phoneHref} className="font-semibold text-brand hover:text-crimson">
            {SITE.phone}
          </a>
          .
        </p>
        <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-3">
          {[
            { to: "/", label: "Home" },
            { to: "/criminal-defense", label: "Criminal Defense" },
            { to: "/family-law", label: "Family Law" },
            { to: "/protection-orders", label: "Protection Orders" },
            { to: "/contact", label: "Contact" },
          ].map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-4 text-sm font-semibold uppercase tracking-wide text-brand shadow-card hover:text-crimson"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.name },
      {
        name: "description",
        content:
          "The Kohn Law Firm: criminal defense, family law and protection orders in Colorado Springs, Colorado.",
      },
      { name: "author", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: favicon32.url },
      { rel: "apple-touch-icon", sizes: "180x180", href: appleTouchIcon.url },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(siteGraph()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    if (window.location.pathname.startsWith("/admin")) return;
    // Local dev/preview shares the production Supabase project; don't record test traffic.
    if (/^(localhost|127\.\d+\.\d+\.\d+|\[::1\])$/.test(window.location.hostname)) return;
    void import("@/lib/analytics").then((m) => {
      if (cancelled) return;
      m.installAnalytics();
      m.trackPageview();
      const unsub = router.subscribe("onResolved", () => m.trackPageview());
      (window as unknown as { __klfAnalyticsUnsub?: () => void }).__klfAnalyticsUnsub = unsub;
    });
    return () => {
      cancelled = true;
      const w = window as unknown as { __klfAnalyticsUnsub?: () => void };
      w.__klfAnalyticsUnsub?.();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
