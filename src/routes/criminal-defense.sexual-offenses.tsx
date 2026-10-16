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
import image from "@/assets/colorado-royal-gorge.jpg.asset.json";

const PATH = "/criminal-defense/sexual-offenses";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Sex Crimes Defense Lawyer in Colorado Springs | Kohn Law Firm",
    description:
      "Defense for indecent exposure, unlawful sexual contact and internet sting charges in Colorado Springs, with registration consequences planned for early.",
  },
  intro: [
    "Sex offense convictions can bring registration, indeterminate sentencing, and long supervision. The defense needs to start right away.",
    "We handle indecent exposure, unlawful sexual contact, internet sting cases, and related charges. When an evaluation becomes part of the case, we work with qualified evaluators. Where a resolution without registration is possible, we work toward it.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Royal Gorge Bridge spanning the canyon",
  },
};

export const Route = createFileRoute("/criminal-defense/sexual-offenses")({
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
  component: SexualOffensesPage,
});

function SexualOffensesPage() {
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
