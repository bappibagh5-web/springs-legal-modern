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
import image from "@/assets/colorado-air-force-academy.jpg.asset.json";

const PATH = "/criminal-defense/burglary";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Burglary Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Burglary is a felony in Colorado even when nothing is taken. We challenge entry, intent and identification evidence in El Paso County burglary cases.",
  },
  intro: [
    "In Colorado, burglary is a felony even if nothing was taken. The prosecution has to prove two things: that you entered or stayed somewhere unlawfully, and that you meant to commit a crime inside.",
    "Both can be challenged. We look closely at how you were identified, what was said to police, how any search was carried out, and whether the facts point to a lesser charge such as criminal trespass.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "United States Air Force Academy Chapel",
  },
};

export const Route = createFileRoute("/criminal-defense/burglary")({
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
  component: BurglaryPage,
});

function BurglaryPage() {
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
