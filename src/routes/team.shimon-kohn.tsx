import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import { AttorneyBio } from "@/site/blocks";
import { attorneyBySlug, type Attorney } from "@/site/site";
import { pageHead, breadcrumbs, profilePage } from "@/lib/seo";

const PATH = "/team/shimon-kohn";

/**
 * Name, role, bio, photo and credentials live in src/site/site.ts (ATTORNEYS),
 * because the Team page and the site-wide schema use them too.
 */
const attorney = attorneyBySlug("shimon-kohn") as Attorney;

const content = {
  meta: {
    title: "Shimon Kohn, Criminal Defense Attorney in Colorado Springs",
    description:
      "Shimon Kohn founded The Kohn Law Firm after serving as a deputy DA in Teller and El Paso Counties. Admitted to the Colorado bar in 2000, federal bar in 2003.",
  },
};

export const Route = createFileRoute("/team/shimon-kohn")({
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
  component: ShimonKohnPage,
});

function ShimonKohnPage() {
  return (
    <PageShell>
      <AttorneyBio a={attorney} />
    </PageShell>
  );
}
