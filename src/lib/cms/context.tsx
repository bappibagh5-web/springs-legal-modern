import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { queryOptions } from "@tanstack/react-query";
import { getPublishedContent, type PublishedMap } from "./published.functions";
import { GLOBAL_KEY, getPageDef, readValue, type ImageValue, type PageContent } from "./registry";
import { SITE } from "@/lib/site";

export const cmsPublishedQuery = queryOptions({
  queryKey: ["cms", "published"],
  queryFn: () => getPublishedContent(),
  staleTime: 60_000,
});

export const PREVIEW_PARAM = "cms_preview";
export const MSG = {
  ready: "klf-cms-ready",
  draft: "klf-cms-draft",
  select: "klf-cms-select",
  clicked: "klf-cms-clicked",
} as const;

type Ctx = {
  published: PublishedMap;
  drafts: PublishedMap;
  preview: boolean;
  selected: string | null;
};

const CmsCtx = createContext<Ctx>({ published: {}, drafts: {}, preview: false, selected: null });

export function isPreviewWindow() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === "1" && window.parent !== window;
}

export function CmsProvider({ published, children }: { published: PublishedMap; children: ReactNode }) {
  const [drafts, setDrafts] = useState<PublishedMap>({});
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!isPreviewWindow()) return;
    setPreview(true);
    document.documentElement.classList.add("cms-preview");
    const origin = window.location.origin;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== origin || e.source !== window.parent) return;
      const d = e.data as { type?: string; pages?: PublishedMap; id?: string | null };
      if (d?.type === MSG.draft && d.pages) setDrafts(d.pages);
      if (d?.type === MSG.select) {
        setSelected(d.id ?? null);
        if (d.id) {
          const el = document.querySelector(`[data-cms="${CSS.escape(d.id)}"]`)?.firstElementChild;
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button[type=submit], form")) e.preventDefault();
      const sec = target.closest<HTMLElement>("[data-cms]");
      if (sec) window.parent.postMessage({ type: MSG.clicked, id: sec.dataset.cms }, origin);
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    window.parent.postMessage({ type: MSG.ready }, origin);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const value = useMemo(() => ({ published, drafts, preview, selected }), [published, drafts, preview, selected]);
  return <CmsCtx.Provider value={value}>{children}</CmsCtx.Provider>;
}

/** Content accessor for one page. Draft overrides only ever exist inside the admin preview frame. */
export function useCms(pageKey: string) {
  const { published, drafts } = useContext(CmsCtx);
  const def = getPageDef(pageKey);
  const content: PageContent | undefined = drafts[pageKey] ?? published[pageKey];
  return useMemo(
    () => ({
      text: (path: string) => (readValue<string>(def, content, path) ?? "") as string,
      list: <T,>(path: string) => (readValue<T[]>(def, content, path) ?? []) as T[],
      image: (path: string): ImageValue => {
        const v = readValue<ImageValue | string>(def, content, path);
        if (!v) return { url: "", alt: "" };
        return typeof v === "string" ? { url: v, alt: "" } : v;
      },
    }),
    [def, content],
  );
}

/** Site-wide contact info, overridable from Global Content. */
export function useSiteInfo() {
  const g = useCms(GLOBAL_KEY);
  const phone = g.text("contact.phone") || SITE.phone;
  const email = g.text("contact.email") || SITE.email;
  return {
    ...SITE,
    phone,
    phoneHref: `tel:+1${phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")}`,
    email,
    emailHref: `mailto:${email}`,
    city: g.text("contact.city") || SITE.city,
  };
}

/** Marks an editable region. Uses display:contents so it never affects layout. */
export function CmsSection({ page, id, children }: { page: string; id: string; children: ReactNode }) {
  const { preview, selected } = useContext(CmsCtx);
  const key = `${page}.${id}`;
  return (
    <div className="cms-section" data-cms={key} data-selected={preview && selected === key ? "true" : undefined}>
      {children}
    </div>
  );
}
