import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/klf-logo-color.png.asset.json";
import { CATEGORIES, NAV_LINKS } from "@/lib/site";
import { useSiteInfo, useCms, CmsSection } from "@/lib/cms/context";
import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const SITE = useSiteInfo();
  const g = useCms("global");
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const openMenu = (slug: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMenu(slug);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility bar */}
      <div className="hidden bg-ink text-white/85 md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span className="tracking-wide uppercase text-white/60">
            {g.text("header.tagline")}
          </span>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-1.5 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" /> {SITE.phone}
            </a>
            <a
              href={SITE.emailHref}
              className="inline-flex items-center gap-1.5 hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-white text-ink shadow-card">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <img
              src={logoAsset.url}
              alt="The Kohn Law Firm — Criminal Defense & Family Law"
              className="h-14 w-auto md:h-16"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => openMenu(cat.slug)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
                    "text-ink/85 hover:bg-brand/5 hover:text-brand",
                    activeMenu === cat.slug && "bg-brand/5 text-brand",
                  )}
                  onClick={() =>
                    setActiveMenu(activeMenu === cat.slug ? null : cat.slug)
                  }
                >
                  {cat.title}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <NavItem to="/team">Team</NavItem>
            <NavItem to="/blog">Blog</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ActionButton variant="gold" size="sm">
              {g.text("header.ctaLabel")}
            </ActionButton>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mega menu panel */}
        {activeMenu && (
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={() => openMenu(activeMenu)}
            onMouseLeave={scheduleClose}
          >
            <div className="border-t border-white/10 bg-white text-foreground shadow-elegant animate-fade-up">
              <div className="container-page py-8">
                <MegaMenuPanel slug={activeMenu} onNavigate={() => setActiveMenu(null)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <MobileDrawer onClose={() => setOpen(false)} />
      )}
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-ink/85 transition-colors hover:bg-brand/5 hover:text-brand"
      activeProps={{ className: "bg-brand/10 text-brand" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

function MegaMenuPanel({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const cols = chunk(cat.items, Math.ceil(cat.items.length / 3));
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Practice Area
        </p>
        <h3 className="mt-2 font-display text-3xl text-brand">{cat.title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{cat.short}</p>
        <Link
          to="/$category"
          params={{ category: cat.slug }}
          onClick={onNavigate}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brand hover:text-crimson"
        >
          View overview →
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-2 md:grid-cols-3">
        {cols.map((col, i) => (
          <ul key={i} className="space-y-1">
            {col.map((it) => (
              <li key={it.slug}>
                <Link
                  to="/$category/$service"
                  params={{ category: cat.slug, service: it.slug }}
                  onClick={onNavigate}
                  className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const SITE = useSiteInfo();
  const g = useCms("global");
  const [openCat, setOpenCat] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-brand text-white shadow-2xl animate-[slide-in-right_0.3s_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <img src={logoAsset.url} alt="" className="h-10 w-auto" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="block rounded-md px-3 py-3 text-base font-medium uppercase tracking-wide hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="border-t border-white/10">
              <button
                className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-medium uppercase tracking-wide hover:bg-white/10"
                onClick={() =>
                  setOpenCat(openCat === cat.slug ? null : cat.slug)
                }
              >
                {cat.title}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openCat === cat.slug && "rotate-180",
                  )}
                />
              </button>
              {openCat === cat.slug && (
                <ul className="pb-3 pl-4">
                  <li>
                    <Link
                      to="/$category"
                      params={{ category: cat.slug }}
                      onClick={onClose}
                      className="block rounded-md px-3 py-2 text-sm font-semibold text-gold"
                    >
                      Overview
                    </Link>
                  </li>
                  {cat.items.map((it) => (
                    <li key={it.slug}>
                      <Link
                        to="/$category/$service"
                        params={{ category: cat.slug, service: it.slug }}
                        onClick={onClose}
                        className="block rounded-md px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                      >
                        {it.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="space-y-3 border-t border-white/10 px-5 py-5">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-sm text-white/90"
          >
            <Phone className="h-4 w-4 text-gold" /> {SITE.phone}
          </a>
          <a
            href={SITE.emailHref}
            className="flex items-center gap-2 text-sm text-white/90"
          >
            <Mail className="h-4 w-4 text-gold" /> {SITE.email}
          </a>
          <ActionButton variant="gold" size="md" className="w-full">
            {g.text("header.ctaLabel")}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
