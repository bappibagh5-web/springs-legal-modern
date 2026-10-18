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
import image from "@/assets/colorado-red-rock-canyon.jpg.asset.json";

const PATH = "/criminal-defense/sexual-assault";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Sexual Assault Defense Lawyer in Colorado Springs | Kohn Law Firm",
    description:
      "Accused of sexual assault in Colorado? We preserve evidence early, review forensic and digital records, and prepare every case for trial. Confidential calls.",
  },
  intro: [
    "A sexual assault accusation can cost you your job, your housing, and time with your children before a court ever looks at the evidence. Call a lawyer before you speak with police.",
    "We move quickly to preserve messages, phone records, video, and witness statements. We review the medical and forensic evidence independently, and we prepare the case for trial from the start.",
    "Even when a case ends without a conviction, it can show up in background checks and affect professional licenses and parenting time. We plan for those issues alongside the criminal defense.",
  ],
  sections: [],
  expect: [],
  image: {
    url: image.url,
    alt: "Jagged red rock ridge above green shrubs and grass",
  },
};

export const Route = createFileRoute("/criminal-defense/sexual-assault")({
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
  component: SexualAssaultPage,
});

function SexualAssaultPage() {
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
