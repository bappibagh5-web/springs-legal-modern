import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getActivePublicSnippets } from "@/lib/settings.functions";

type Snippet = { id: string; location: "head" | "body_start" | "body_end"; code: string; priority: number; load_on: string };

const MARK_ATTR = "data-klf-snippet";

function inject(snippets: Snippet[]) {
  // Remove prior injections
  document.querySelectorAll(`[${MARK_ATTR}]`).forEach((n) => n.remove());
  const sorted = [...snippets].sort((a, b) => a.priority - b.priority);
  for (const s of sorted) {
    const frag = document.createRange().createContextualFragment(s.code);
    const nodes = Array.from(frag.childNodes);
    nodes.forEach((n) => {
      if (n instanceof HTMLElement) n.setAttribute(MARK_ATTR, s.id);
    });
    if (s.location === "head") {
      nodes.forEach((n) => document.head.appendChild(n));
    } else if (s.location === "body_start") {
      const first = document.body.firstChild;
      nodes.forEach((n) => document.body.insertBefore(n, first));
    } else {
      nodes.forEach((n) => document.body.appendChild(n));
    }
  }
}

export function CodeSnippetsInjector() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchSnippets = useServerFn(getActivePublicSnippets);

  useEffect(() => {
    // Don't inject on admin routes
    if (pathname.startsWith("/admin")) {
      document.querySelectorAll(`[${MARK_ATTR}]`).forEach((n) => n.remove());
      return;
    }
    let cancelled = false;
    fetchSnippets()
      .then((snips) => {
        if (cancelled) return;
        inject(snips as Snippet[]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
    // Refetch on route change so pages picking up snippets stay in sync
  }, [pathname, fetchSnippets]);

  return null;
}
