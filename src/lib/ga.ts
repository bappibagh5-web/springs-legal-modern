/**
 * Google Analytics 4 (gtag.js), production only.
 *
 * - Loads once, and only on shimonkohn.com / www.shimonkohn.com. Never on localhost,
 *   127.0.0.1, lovable.app or any preview host.
 * - Page views come from GA4 enhanced measurement (browser history changes), so no
 *   manual page_view events are sent.
 * - Events never include personal data: no names, emails, phone numbers or message text.
 *   Events and parameters are listed in README.md ("Analytics").
 */

export const GA_MEASUREMENT_ID = "G-B9DFKVM4MB";

const PRODUCTION_HOSTS = new Set(["shimonkohn.com", "www.shimonkohn.com"]);

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let loaded = false;

export function isProductionHost(
  hostname = typeof window === "undefined" ? "" : window.location.hostname,
): boolean {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

/** Inject gtag.js and run the standard setup. No-op outside production or if already loaded. */
export function loadGoogleAnalytics(): void {
  if (loaded || typeof window === "undefined" || !isProductionHost()) return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js reads the Arguments object, so push `arguments`, not an array copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  document.addEventListener("click", onContactLinkClick, { capture: true });
}

/** Send a GA4 event. Does nothing unless GA is loaded (production host). */
export function gaEvent(name: string, params: Record<string, string> = {}): void {
  if (!loaded || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export type LinkLocation = "header" | "hero" | "footer" | "cta" | "sidebar" | "page";

/**
 * Where a link sits on the page. An explicit data-link-location on the link or an ancestor wins;
 * CTA bands carry data-link-location="cta". Otherwise: inside <header> = header, <footer> = footer,
 * <aside> = sidebar, the first section of <main> = hero, else page.
 */
export function linkLocation(el: Element): LinkLocation {
  const explicit = el.closest<HTMLElement>("[data-link-location]")?.dataset.linkLocation;
  if (explicit) return explicit as LinkLocation;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("aside")) return "sidebar";
  const main = el.closest("main");
  const firstSection = main?.querySelector("section");
  if (firstSection && firstSection.contains(el)) return "hero";
  return "page";
}

function onContactLinkClick(e: MouseEvent): void {
  const a = (e.target as Element | null)?.closest?.("a[href]");
  if (!a) return;
  const href = (a.getAttribute("href") || "").trim().toLowerCase();
  // Only the link's position is sent; never the number or address itself.
  if (href.startsWith("tel:")) gaEvent("click_to_call", { link_location: linkLocation(a) });
  else if (href.startsWith("mailto:")) gaEvent("click_email", { link_location: linkLocation(a) });
}
