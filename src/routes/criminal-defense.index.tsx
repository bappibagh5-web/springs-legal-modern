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

const PATH = "/criminal-defense";
const area = practiceArea("criminal-defense");
const updated = updatedFor(PATH);

/** Page text. The area's name, short blurb and CTA come from PRACTICE_AREAS in src/site/site.ts. */
const content = {
  meta: {
    title: "Criminal Defense Lawyer in Colorado Springs | The Kohn Law Firm",
    description:
      "Criminal defense in Colorado Springs led by Shimon Kohn, a former El Paso and Teller County deputy DA. Misdemeanors, felonies, DV and sex offense cases.",
  },
  intro: [
    "If you have been arrested or charged with a crime in El Paso County, you need a lawyer who knows how the case against you was built. Shimon Kohn prosecuted cases as a Deputy District Attorney in Teller and El Paso Counties before he founded this firm in 2003.",
    "We defend people charged with misdemeanors and felonies in municipal, county, and district courts. That includes DUI, domestic violence, theft, assault, sex offenses, and homicide.",
    "Every case starts the same way. We get the police reports, video, and lab results, find the weak points in the State's evidence, and tell you plainly what we found. Then we decide with you whether to negotiate or go to trial.",
  ],
};

export const Route = createFileRoute("/criminal-defense/")({
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
  component: CriminalDefensePage,
});

function CriminalDefensePage() {
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
