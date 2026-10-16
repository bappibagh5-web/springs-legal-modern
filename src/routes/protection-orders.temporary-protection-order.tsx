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
import image from "@/assets/colorado-air-force-academy.jpg.asset.json";

const PATH = "/protection-orders/temporary-protection-order";
const area = practiceArea("protection-orders");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Temporary Protection Order Lawyer, Colorado Springs | Kohn Law Firm",
    description:
      "A temporary protection order can be issued the same day it is requested. We help you seek one or contest it before the return hearing. 719-328-9555.",
  },
  intro: [
    "A judge can issue a temporary protection order the same day a petition is filed, before the other person has a chance to respond.",
    "A hearing on whether to make the order permanent follows soon after. If you are seeking protection, we help you prepare the petition and the evidence. If an order has been entered against you, we prepare your side for that hearing.",
  ],
  sections: [],
  expect: [],
  seeAlso: {
    text: "If you and the other party share children, a temporary order can also say who cares for them for now and set conditions on parenting time.",
    label: "How protection orders affect custody in Colorado",
    to: "/family-law/protection-orders-and-custody",
  },
  image: {
    url: image.url,
    alt: "United States Air Force Academy Chapel",
  },
};

export const Route = createFileRoute("/protection-orders/temporary-protection-order")({
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
  component: TemporaryProtectionOrderPage,
});

function TemporaryProtectionOrderPage() {
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
