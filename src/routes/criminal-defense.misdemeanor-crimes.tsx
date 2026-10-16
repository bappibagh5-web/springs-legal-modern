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
import image from "@/assets/colorado-springs-downtown.jpg.asset.json";

const PATH = "/criminal-defense/misdemeanor-crimes";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Misdemeanor Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Charged with a misdemeanor in El Paso County? We defend DUI, assault, harassment and theft cases and look for options like deferred judgment and sealing.",
  },
  intro: [
    "A misdemeanor conviction stays on your record. It can come up in background checks for jobs, housing, professional licenses, and immigration. We treat these cases with the same care as a felony.",
    "We handle DUI and DWAI, third degree assault, harassment, trespass, disorderly conduct, theft, and other misdemeanor charges. We appear in El Paso, Teller, Pueblo, Fremont, and Douglas County courts.",
  ],
  sections: [
    {
      heading: "How do misdemeanor cases usually end?",
      body: [
        "Many end with a plea to a reduced charge or a deferred judgment, which can keep a conviction off your record if you complete its terms. Some are dismissed after we challenge the evidence. Some go to trial. Which of these is realistic depends on the evidence, your record, and the prosecutor.",
      ],
    },
    {
      heading: "Can a misdemeanor be sealed later?",
      body: [
        "Often, yes. Colorado allows many criminal records to be sealed, and eligibility depends on the charge, the outcome, and how much time has passed. We can tell you whether your record qualifies and handle the filing.",
      ],
    },
  ],
  expect: [
    "Confidential case review",
    "Pre-trial motion strategy",
    "Plea negotiation or trial defense",
    "Sealing and expungement when eligible",
  ],
  image: {
    url: image.url,
    alt: "Colorado Springs downtown skyline with Pikes Peak",
  },
};

export const Route = createFileRoute("/criminal-defense/misdemeanor-crimes")({
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
  component: MisdemeanorCrimesPage,
});

function MisdemeanorCrimesPage() {
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
