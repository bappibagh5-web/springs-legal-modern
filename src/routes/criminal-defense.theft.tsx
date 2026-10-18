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
import image from "@/assets/colorado-aspen-fall.jpg.asset.json";

const PATH = "/criminal-defense/theft";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Theft Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Theft charges in Colorado depend on the dollar amount and intent. We contest valuations, negotiate restitution and push back on aggregated theft charges.",
  },
  intro: [
    "Colorado's theft law covers everything from shoplifting to schemes involving employers and trust accounts. How serious the charge is depends largely on the value of what was taken, and both value and intent can be disputed.",
    "We challenge the State's valuation, negotiate restitution, and look for diversion that keeps a conviction off your record. When an employer is involved, we also pay attention to the civil and licensing side.",
  ],
  sections: [
    {
      heading: "What if the State combines several incidents into one charge?",
      body: [
        "Prosecutors sometimes add up several smaller incidents to reach a higher felony level. We push back when the law or the facts do not support combining them.",
      ],
    },
  ],
  expect: [],
  image: {
    url: image.url,
    alt: "Trail through golden aspen trees toward snowy mountain peaks",
  },
};

export const Route = createFileRoute("/criminal-defense/theft")({
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
  component: TheftPage,
});

function TheftPage() {
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
