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
import image from "@/assets/colorado-wildflowers.jpg.asset.json";

const PATH = "/protection-orders/permanent-protection-order";
const area = practiceArea("protection-orders");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Permanent Protection Order Lawyer, Colorado Springs | Kohn Law Firm",
    description:
      "A permanent protection order can last indefinitely and appear on background checks. We prepare evidence and witnesses for the hearing, on either side.",
  },
  intro: [
    "A permanent protection order can stay in place indefinitely and can show up on background checks. It can also affect firearm rights, housing, and contact with your children.",
    "The hearing is usually your one chance to tell the full story. We prepare the witnesses, the exhibits, and the cross-examination for every permanent order hearing we take, whether we represent the person asking for the order or the person responding to it.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Colorado mountain wildflower meadow",
  },
};

export const Route = createFileRoute("/protection-orders/permanent-protection-order")({
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
  component: PermanentProtectionOrderPage,
});

function PermanentProtectionOrderPage() {
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
