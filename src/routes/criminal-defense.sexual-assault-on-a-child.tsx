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
import image from "@/assets/colorado-lake.jpg.asset.json";

const PATH = "/criminal-defense/sexual-assault-on-a-child";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Child Sex Assault Defense Lawyer, Colorado Springs | Kohn Law Firm",
    description:
      "Defense for sexual assault on a child charges in Colorado, including review of forensic interviews, digital evidence and prior statements. Call 719-328-9555.",
  },
  intro: [
    "These charges can carry indeterminate sentencing and lifetime registration. If you learn you are under investigation, call before charges are filed.",
    "A child's statements often depend on how, and how many times, the child was interviewed. We review every recorded interview, the chain of custody, the digital evidence, and any earlier statements that conflict with the State's account.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Snowy mountain peaks reflected in a still alpine lake",
  },
};

export const Route = createFileRoute("/criminal-defense/sexual-assault-on-a-child")({
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
  component: SexualAssaultOnAChildPage,
});

function SexualAssaultOnAChildPage() {
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
