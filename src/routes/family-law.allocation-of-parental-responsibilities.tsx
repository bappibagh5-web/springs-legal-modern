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
import image from "@/assets/colorado-cheyenne-mountain.jpg.asset.json";

const PATH = "/family-law/allocation-of-parental-responsibilities";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  h1: "Child Custody Lawyer in Colorado Springs",
  meta: {
    title: "Child Custody Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Child custody in Colorado is called allocation of parental responsibilities. We handle parenting time and decision-making cases in El Paso County.",
  },
  intro: [
    "Allocation of parental responsibilities is Colorado's term for custody. These cases decide decision-making and parenting time for unmarried parents or after a divorce, and the court decides them based on the best interests of the child.",
    "We prepare detailed parenting plans that address holiday schedules, transportation, school choice, medical decisions, and communication between households.",
    "When the schedule is contested, we take it to a hearing. We work with child and family investigators, parental responsibility evaluators, and, where appropriate, therapists, so the court hears the full picture.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Cheyenne Mountain in Colorado Springs",
  },
};

export const Route = createFileRoute("/family-law/allocation-of-parental-responsibilities")({
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
  component: AllocationOfParentalResponsibilitiesPage,
});

function AllocationOfParentalResponsibilitiesPage() {
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
