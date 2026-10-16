import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { AttorneyBio } from "@/site/blocks";
import { attorneyBySlug, type Attorney } from "@/site/site";
import { pageHead, breadcrumbs, profilePage } from "@/lib/seo";

const PATH = "/team/erica-bertini";

/**
 * Name, role, bio, photo and credentials live in src/site/site.ts (ATTORNEYS),
 * because the Team page and the site-wide schema use them too.
 */
const attorney = attorneyBySlug("erica-bertini") as Attorney;

const content = {
  meta: {
    title: "Erica Bertini, Family Law Attorney in Colorado Springs",
    description:
      "Erica Bertini is managing attorney for family law at The Kohn Law Firm in Colorado Springs, and a former deputy district attorney in Colorado and Illinois.",
  },
};

export const Route = createFileRoute("/team/erica-bertini")({
  head: () =>
    pageHead({
      path: PATH,
      ...content.meta,
      type: "profile",
      image: attorney.image.srcLarge,
      imageAlt: attorney.image.alt,
      jsonLd: [
        profilePage(attorney, content.meta.description),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Our team", path: "/team" },
          { name: attorney.name, path: PATH },
        ]),
      ],
    }),
  component: EricaBertiniPage,
});

function EricaBertiniPage() {
  return (
    <PageShell>
      <AttorneyBio a={attorney} />
    </PageShell>
  );
}
