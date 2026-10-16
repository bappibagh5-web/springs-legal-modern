import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/site/Layout";
import {
  PageHero,
  PracticeOverview,
  PracticeExplore,
  TestimonialsSection,
  CTASection,
} from "@/site/blocks";
import { practiceArea, updatedFor } from "@/site/site";
import { pageHead, webPage, serviceNode, breadcrumbs } from "@/lib/seo";

const PATH = "/family-law";
const area = practiceArea("family-law");
const updated = updatedFor(PATH);

/** Page text. The area's name, short blurb and CTA come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Family Law Attorney in Colorado Springs | The Kohn Law Firm",
    description:
      "Divorce, custody, child support, maintenance and adoption in Colorado Springs, led by managing family law attorney Erica Bertini. Call 719-328-9555.",
  },
  intro: [
    "Erica Bertini leads our family law practice. She handles divorce, custody, child support, and adoption cases in El Paso County and nearby courts, with a focus on family cases that intersect with criminal court.",
    "Most family cases settle, and we try to settle yours on good terms. When the other side will not be reasonable, we prepare for a contested hearing with the financial records, witnesses, and exhibits the court needs to see.",
  ],
};

export const Route = createFileRoute("/family-law/")({
  head: () =>
    pageHead({
      path: PATH,
      ...content.meta,
      jsonLd: [
        webPage({
          path: PATH,
          name: content.meta.title,
          description: content.meta.description,
          type: "CollectionPage",
          modified: updated,
        }),
        serviceNode({ path: PATH, name: area.title, serviceType: area.title }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: area.title, path: PATH },
        ]),
      ],
    }),
  component: FamilyLawPage,
});

function FamilyLawPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Practice Area" title={area.title} subtitle={area.short} />
      <PracticeOverview
        heading={`${area.title} in Colorado`}
        intro={content.intro}
        updated={updated}
        area={area}
      />
      <PracticeExplore area={area} />
      <TestimonialsSection variant="light" />
      <CTASection title={area.cta.title} body={area.cta.body} />
    </PageShell>
  );
}
