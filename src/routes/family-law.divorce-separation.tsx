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

const PATH = "/family-law/divorce-separation";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  h1: "Divorce Lawyer in Colorado Springs",
  meta: {
    title: "Divorce Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Divorce and legal separation in El Paso County: property division, maintenance, financial disclosures and parenting plans. Talk with Erica Bertini.",
  },
  intro: [
    "In Colorado, divorce and custody are often the same case. Property, maintenance, parenting time, and decision-making all move together on one docket. We handle every part of that case with the same preparation, whether the matter is amicable or contested.",
    "Colorado is a no-fault state, but that does not make divorce simple. Property division, maintenance, sworn financial disclosures, and, when there are children, a parenting plan all have to be negotiated or decided at a hearing.",
    "When there are children, the standard is the best interests of the child. We build parenting plans that address holiday schedules, transportation, school choice, medical decisions, and communication between households.",
    "We will tell you which positions are likely to succeed and which are not, and we will not run up fees on issues that should be settled. When the other side refuses a reasonable resolution, we are ready to go to a hearing.",
  ],
  sections: [],
  expect: [],
  seeAlso: [
    {
      heading: "Filing in El Paso County",
      text: "Divorces for Colorado Springs residents are filed in El Paso County District Court. After filing, the court issues a case management order with deadlines for the parenting class, the initial status conference and financial disclosures.",
      label: "Read our El Paso County family court guide.",
      to: "/family-law/el-paso-county-family-court-guide",
    },
  ],
  image: {
    url: image.url,
    alt: "Downtown city buildings and trees below a large mountain",
  },
};

export const Route = createFileRoute("/family-law/divorce-separation")({
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
  component: DivorceSeparationPage,
});

function DivorceSeparationPage() {
  return (
    <PageShell>
      <PageHero eyebrow={area.title} title={content.h1} subtitle={service.summary} />
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
