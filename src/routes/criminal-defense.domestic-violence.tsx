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

const PATH = "/criminal-defense/domestic-violence";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Domestic Violence Defense Lawyer, Colorado Springs | Kohn Law Firm",
    description:
      "Arrested for domestic violence in Colorado Springs? We handle bond conditions, no-contact orders and the charge itself, including the DV sentence enhancer.",
  },
  intro: [
    "Colorado requires police to make an arrest when they believe domestic violence occurred. Within hours you can face a no-contact order that keeps you out of your home, limits time with your children, and affects your right to own firearms.",
    "We work on the bond conditions and the protection order first, then on the charge itself. Domestic violence is an enhancer that can attach to many different offenses, so the defense has to address both the underlying charge and the enhancer.",
  ],
  sections: [
    {
      heading: "Can the no-contact order be changed?",
      body: [
        "Sometimes. A court can modify bond conditions, including contact restrictions, after a hearing. We can ask for changes that let you return home or see your children while the case is open.",
      ],
    },
  ],
  expect: [],
  seeAlso: [
    {
      text: "A domestic violence charge can also affect a custody case, through the protection order and through the family court's own findings.",
      label: "Will a domestic violence charge affect my custody case?",
      to: "/blog/domestic-violence-charge-and-custody-colorado",
    },
  ],
  image: {
    url: image.url,
    alt: "Cheyenne Mountain in Colorado Springs",
  },
};

export const Route = createFileRoute("/criminal-defense/domestic-violence")({
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
  component: DomesticViolencePage,
});

function DomesticViolencePage() {
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
