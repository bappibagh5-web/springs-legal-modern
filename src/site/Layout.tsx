import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/klf-logo-color.png.asset.json";
import { NAV_LINKS, PRACTICE_AREAS, SITE, GLOBAL, type PracticeService } from "./site";
import { cn } from "@/lib/utils";

/*
 * Palette: ink #14213D · brand #1F3A5F · brass #B08D57 (on dark #C9A877, text on light #8C6B3A)
 * slate #5B6B80 · surface #F4F6F8 · text #1B2430 · muted #5E6876 · border #E2E6EB
 * Fonts: Newsreader (headings, .kl-display) + Public Sans (body, .kl-body)
 */
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&display=swap";

const SHELL_CSS = `
.kl-body{font-family:"Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.kl-display{font-family:"Newsreader",Georgia,"Times New Roman",serif;font-optical-sizing:auto;letter-spacing:-0.01em;text-wrap:balance}
`;

/** Page frame used by every public page: header, main content, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="kl-body flex min-h-screen flex-col bg-white text-[#1B2430]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_HREF} />
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/* ───────────── Header ───────────── */

function SiteHeader() {
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
      <div className="hidden bg-[#14213D] text-white/80 md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span className="tracking-[0.12em] uppercase text-white/55">{GLOBAL.header.tagline}</span>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C9A877]"
            >
              <Phone className="h-3.5 w-3.5" /> {SITE.phone}
            </a>
            <a
              href={SITE.emailHref}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#C9A877]"
            >
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-[#E2E6EB] bg-white/95 text-[#14213D] backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <img
              src={logoAsset.url}
              alt="The Kohn Law Firm, Criminal Defense & Family Law"
              className="h-12 w-auto md:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            {PRACTICE_AREAS.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => openMenu(cat.slug)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={activeMenu === cat.slug}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium transition-colors",
                    "text-[#1B2430] hover:text-[#1F3A5F]",
                    activeMenu === cat.slug && "text-[#1F3A5F]",
                  )}
                  onClick={() => setActiveMenu(activeMenu === cat.slug ? null : cat.slug)}
                >
                  {cat.title}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-[#5B6B80] transition-transform",
                      activeMenu === cat.slug && "rotate-180",
                    )}
                  />
                </button>
              </div>
            ))}
            <NavItem to="/team">Team</NavItem>
            <NavItem to="/blog">Blog</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/consultation"
              className="inline-flex h-10 items-center rounded-md bg-[#B08D57] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9A7A48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]"
            >
              {GLOBAL.header.ctaLabel}
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[#14213D] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mega menu panel */}
        {/* Every panel is rendered (hidden) so all service links are in the server HTML. */}
        {PRACTICE_AREAS.map((cat) => (
          <div
            key={cat.slug}
            className={cn(
              "absolute inset-x-0 top-full",
              activeMenu === cat.slug ? "hidden lg:block" : "hidden",
            )}
            onMouseEnter={() => openMenu(cat.slug)}
            onMouseLeave={scheduleClose}
          >
            <div className="border-y border-[#E2E6EB] bg-white text-[#1B2430] shadow-[0_12px_32px_-12px_rgba(20,33,61,0.18)] animate-fade-up">
              <div className="container-page py-8">
                <MegaMenuPanel slug={cat.slug} onNavigate={() => setActiveMenu(null)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-[15px] font-medium text-[#1B2430] transition-colors hover:text-[#1F3A5F]"
      activeProps={{ className: "text-[#1F3A5F] underline decoration-[#B08D57] decoration-2 underline-offset-[10px]" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

function MegaMenuPanel({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const cat = PRACTICE_AREAS.find((c) => c.slug === slug);
  if (!cat) return null;
  const services: readonly PracticeService[] = cat.services;
  const cols = chunk(services, Math.ceil(services.length / 3));
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
      <div className="md:border-r md:border-[#E2E6EB] md:pr-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B6B80]">
          Practice Area
        </p>
        <h3 className="kl-display mt-2 text-3xl font-semibold text-[#14213D]">{cat.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#5E6876]">{cat.short}</p>
        <Link
          to={cat.path}
          onClick={onNavigate}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1F3A5F] hover:text-[#8C6B3A]"
        >
          View overview →
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-1 md:grid-cols-3">
        {cols.map((col, i) => (
          <ul key={i} className="space-y-0.5">
            {col.map((it) => (
              <li key={it.slug}>
                <Link
                  to={it.path}
                  onClick={onNavigate}
                  className="block rounded-md px-3 py-2 text-sm text-[#1B2430] transition-colors hover:bg-[#F4F6F8] hover:text-[#1F3A5F]"
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

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openCat, setOpenCat] = useState<string | null>(null);
  return (
    <div className={cn("fixed inset-0 z-[100] lg:hidden", !open && "hidden")}>
      <div className="absolute inset-0 bg-[#14213D]/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-[#14213D] text-white shadow-2xl animate-[slide-in-right_0.3s_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="rounded-md bg-white px-2 py-1">
            <img src={logoAsset.url} alt="" className="h-9 w-auto" />
          </div>
          <button
            type="button"
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
              className="block rounded-md px-3 py-3 text-base font-medium hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
          {PRACTICE_AREAS.map((cat) => (
            <div key={cat.slug} className="border-t border-white/10">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-medium hover:bg-white/10"
                onClick={() => setOpenCat(openCat === cat.slug ? null : cat.slug)}
                aria-expanded={openCat === cat.slug}
              >
                {cat.title}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-white/60 transition-transform",
                    openCat === cat.slug && "rotate-180",
                  )}
                />
              </button>
              <ul className={cn("pb-3 pl-4", openCat !== cat.slug && "hidden")}>
                <li>
                  <Link
                    to={cat.path}
                    onClick={onClose}
                    className="block rounded-md px-3 py-2 text-sm font-semibold text-[#C9A877]"
                  >
                    Overview
                  </Link>
                </li>
                {cat.services.map((it) => (
                  <li key={it.slug}>
                    <Link
                      to={it.path}
                      onClick={onClose}
                      className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      {it.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-3 border-t border-white/10 px-5 py-5">
          <a href={SITE.phoneHref} className="flex min-h-11 items-center gap-2 text-sm text-white/90">
            <Phone className="h-4 w-4 text-[#C9A877]" /> {SITE.phone}
          </a>
          <a href={SITE.emailHref} className="flex min-h-11 items-center gap-2 text-sm text-white/90">
            <Mail className="h-4 w-4 text-[#C9A877]" /> {SITE.email}
          </a>
          <Link
            to="/consultation"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-md bg-[#B08D57] text-sm font-semibold text-white transition-colors hover:bg-[#9A7A48]"
          >
            {GLOBAL.header.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* ───────────── Footer ───────────── */

function SiteFooter() {
  return (
    <footer className="bg-[#14213D] text-white/80">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-md bg-white px-3 py-2">
            <img src={logoAsset.url} alt="The Kohn Law Firm" className="h-14 w-auto" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/65">{GLOBAL.footer.description}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A877]">Firm</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/team">Our Team</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/consultation">Schedule Consultation</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A877]">
            Practice Areas
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {PRACTICE_AREAS.map((c) => (
              <li key={c.slug}>
                <Link to={c.path} className="text-white/75 transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A877]">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={SITE.phoneHref}
                className="-my-3 inline-flex items-center gap-2 py-3 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#C9A877]" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={SITE.emailHref}
                className="-my-3 inline-flex items-center gap-2 py-3 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#C9A877]" /> {SITE.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C9A877]" /> {SITE.city}, {SITE.region}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/55 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>{GLOBAL.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-white/75 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}