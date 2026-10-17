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
import image from "@/assets/colorado-red-rock-canyon.jpg.asset.json";

const PATH = "/family-law/child-support";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Child Support Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Setting, changing or enforcing child support in El Paso County. We check the income, overnight and childcare numbers that drive Colorado's guideline.",
  },
  intro: [
    "Colorado calculates child support using statutory worksheets, but the inputs are often disputed: income, overnights, health insurance, and work-related child care. Small differences in those inputs can change the monthly amount.",
    "We make sure the numbers reflect reality. That includes documenting self-employment income, accounting for variable bonuses, and making sure the parenting time schedule on paper matches what is actually happening.",
    "When circumstances change, such as a job loss, a move, or a change in parenting time, we file for a modification. We also handle enforcement when the other parent stops paying.",
  ],
  sections: [],
  expect: [],
  seeAlso: [
    {
      heading: "Filing in El Paso County",
      text: "In El Paso County, the court addresses child support in cases involving children, and financial disclosures, including a sworn financial statement, are due within 42 days of service.",
      label: "Read our El Paso County family court guide.",
      to: "/family-law/el-paso-county-family-court-guide",
    },
  ],
  image: {
    url: image.url,
    alt: "Red Rock Canyon Open Space",
  },
};

export const Route = createFileRoute("/family-law/child-support")({
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
  component: ChildSupportPage,
});

function ChildSupportPage() {
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
