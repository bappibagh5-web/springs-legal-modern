import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import {
  PageHero,
  ServiceOverview,
  RelatedServices,
  TestimonialsSection,
  CTASection,
} from "@/site/blocks";
import { practiceArea, practiceService, updatedFor } from "@/site/site";
import { pageHead, webPage, serviceNode, breadcrumbs } from "@/lib/seo";
import image from "@/assets/colorado-pikes-peak.jpg.asset.json";

const PATH = "/criminal-defense/crimes-against-a-person";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Assault Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Defense for assault, menacing, false imprisonment and kidnapping charges in El Paso County, including self-defense claims and related protection orders.",
  },
  intro: [
    "In an assault case, the details decide the outcome: who started it, what was said, what the video shows, and what the medical records actually say.",
    "We defend assault in all degrees, menacing, false imprisonment, and second degree kidnapping. Self-defense and defense of others are often available and easy to miss without a full investigation. We also handle the protection order that often runs alongside these charges.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Mountain range at sunset under dramatic clouds, with pine trees",
  },
};

export const Route = createFileRoute("/criminal-defense/crimes-against-a-person")({
  head: () =>
    pageHead({
      path: PATH,
      ...content.meta,
      jsonLd: [
        webPage({
          path: PATH,
          name: content.meta.title,
          description: content.meta.description,
          modified: updated,
        }),
        serviceNode({ path: PATH, name: service.title, serviceType: area.title }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: area.title, path: area.path },
          { name: service.title, path: PATH },
        ]),
      ],
    }),
  component: CrimesAgainstAPersonPage,
});

function CrimesAgainstAPersonPage() {
  return (
    <PageShell>
      <PageHero eyebrow={area.title} title={service.title} subtitle={service.summary} />
      <ServiceOverview
        heading={`${service.title} in Colorado Springs`}
        content={content}
        updated={updated}
      />
      <RelatedServices area={area} currentPath={PATH} />
      <TestimonialsSection variant="light" />
      <CTASection title={area.cta.title} body={area.cta.body} />
    </PageShell>
  );
}
