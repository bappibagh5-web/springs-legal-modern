import { createFileRoute, notFound } from "@tanstack/react-router";
import { notFoundHead } from "@/lib/seo";

/**
 * Catch-all for URLs no page matches. Responds 404 with the site's not-found page
 * (root notFoundComponent) and a noindex "Page not found" head.
 */
export const Route = createFileRoute("/$")({
  loader: () => {
    throw notFound();
  },
  head: () => notFoundHead(),
});
