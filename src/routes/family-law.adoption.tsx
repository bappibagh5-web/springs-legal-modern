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
import image from "@/assets/colorado-seven-falls.jpg.asset.json";

const PATH = "/family-law/adoption";
const area = practiceArea("family-law");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Adoption Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Step-parent and kinship adoption in Colorado Springs, from consents and background checks through the final decree. Talk with Erica Bertini.",
  },
  intro: [
    "An adoption permanently changes the legal relationship between parent and child, and it gives the child a secure legal footing with the adoptive parent.",
    "We handle step-parent adoptions, kinship adoptions, and the steps needed to end a prior parent's rights when that applies. Each adoption involves background checks, consents, and often a hearing in front of the court.",
    "We work with families from the first paperwork through the final decree, and we coordinate with caseworkers and home study providers along the way.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Tiered waterfall cascading down a narrow rocky canyon",
  },
};

export const Route = createFileRoute("/family-law/adoption")({
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
  component: AdoptionPage,
});

function AdoptionPage() {
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
