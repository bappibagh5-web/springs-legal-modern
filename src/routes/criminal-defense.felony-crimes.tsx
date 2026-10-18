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
import image from "@/assets/colorado-wildflowers.jpg.asset.json";

const PATH = "/criminal-defense/felony-crimes";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Felony Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Felony defense in Colorado Springs for drug, weapons, violent and property charges. Suppression motions, plea review and trial preparation. 719-328-9555.",
  },
  intro: [
    "A felony conviction can mean prison, parole, and a permanent record. We prepare every felony case as if it will go to trial, because that is what gives you leverage in negotiations.",
    "We handle drug, weapons, violent, and property felonies, and habitual criminal filings. When a search or a statement to police was improper, we file motions to keep that evidence out.",
  ],
  sections: [
    {
      heading: "How do I decide whether to take a plea offer?",
      body: [
        "You decide, and you should decide with full information. Before you choose, we walk you through what the plea would mean for sentencing, parole eligibility, and your civil rights, and what a trial would put at risk.",
      ],
    },
  ],
  expect: [],
  image: {
    url: image.url,
    alt: "Purple lupine and yellow sunflowers in a mountain meadow",
  },
};

export const Route = createFileRoute("/criminal-defense/felony-crimes")({
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
  component: FelonyCrimesPage,
});

function FelonyCrimesPage() {
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
