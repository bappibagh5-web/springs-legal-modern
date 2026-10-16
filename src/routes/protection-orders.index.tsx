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

const PATH = "/protection-orders";
const area = practiceArea("protection-orders");
const updated = updatedFor(PATH);

/** Page text. The area's name, short blurb and CTA come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Protection Order Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Seeking or contesting a protection order in El Paso County? We prepare witnesses and evidence for temporary and permanent order hearings. 719-328-9555.",
  },
  intro: [
    "A protection order can decide where you live, where you work, and who you can see. It can be issued within hours, and the hearing that decides whether it becomes permanent comes quickly.",
    "We represent people on both sides: those asking the court for protection and those defending against an order. Either way, we prepare the witnesses, gather the documents, and present an organized case at the hearing.",
  ],
};

export const Route = createFileRoute("/protection-orders/")({
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
  component: ProtectionOrdersPage,
});

function ProtectionOrdersPage() {
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
