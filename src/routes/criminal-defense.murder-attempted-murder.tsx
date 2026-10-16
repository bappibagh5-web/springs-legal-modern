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
import image from "@/assets/colorado-garden-gods.jpg.asset.json";

const PATH = "/criminal-defense/murder-attempted-murder";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Homicide Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Defense for murder, attempted murder and manslaughter in Colorado, led by a former deputy DA who has served as defense counsel on a death penalty case.",
  },
  intro: [
    "A homicide charge is the most serious case the State can bring. The defense has to start the day of the arrest, with investigators and experts brought in early.",
    "We defend first and second degree murder, manslaughter, criminally negligent homicide, and attempt charges. Shimon Kohn served as defense counsel on the last death penalty case in Colorado after the moratorium was passed.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Garden of the Gods red rock formations",
  },
};

export const Route = createFileRoute("/criminal-defense/murder-attempted-murder")({
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
  component: MurderAttemptedMurderPage,
});

function MurderAttemptedMurderPage() {
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
