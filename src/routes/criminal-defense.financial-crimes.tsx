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

const PATH = "/criminal-defense/financial-crimes";
const area = practiceArea("criminal-defense");
const service = practiceService(PATH);
const updated = updatedFor(PATH);

/** Page text. The page name and short blurb come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Financial Crimes Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Defense for fraud, embezzlement, forgery and identity theft charges in Colorado Springs. Talk to us early, often before charges are filed. 719-328-9555.",
  },
  intro: [
    "Financial crime investigations often run for months before anyone is charged. If you have received a subpoena, a target letter, or a call from a detective, talk to a lawyer before you talk to investigators.",
    "We defend fraud, identity theft, forgery, embezzlement, money laundering, and theft charges that involve employers, contracts, or trust accounts.",
  ],
  sections: [
    {
      heading: "Why does it help to hire a lawyer before charges are filed?",
      body: [
        "Early on, a lawyer can deal with investigators for you, gather records that support your side, and sometimes keep charges from being filed at all. Once charges are filed, those options narrow.",
      ],
    },
    {
      heading: "How do you defend a case built on financial records?",
      body: [
        "These cases turn on documents. We go through the State's records line by line, rebuild the financial history, and look for gaps in how the numbers were put together. When a case needs it, we bring in a forensic accountant.",
      ],
    },
  ],
  expect: [],
  image: {
    url: image.url,
    alt: "Seven Falls waterfall in Colorado Springs",
  },
};

export const Route = createFileRoute("/criminal-defense/financial-crimes")({
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
  component: FinancialCrimesPage,
});

function FinancialCrimesPage() {
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
