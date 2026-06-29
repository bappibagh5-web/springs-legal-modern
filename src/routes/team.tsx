import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import shimonAsset from "@/assets/shimon-kohn-v3.jpg.asset.json";
import ericaAsset from "@/assets/erica-bertini.jpg.asset.json";
import jeromeAsset from "@/assets/jerome-aquino.jpg.asset.json";
import maceyAsset from "@/assets/macey-jardee.jpg.asset.json";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — The Kohn Law Firm" },
      { name: "description", content: "Meet the attorneys and staff of The Kohn Law Firm in Colorado Springs — Shimon Kohn, Erica Bertini, Jerome Aquino, and Macey Jardee." },
      { property: "og:title", content: "Our Legal Team — The Kohn Law Firm" },
      { property: "og:description", content: "Colorado Springs attorneys ready to defend your case." },
    ],
  }),
  component: TeamPage,
});

type Member = {
  name: string;
  title: string;
  img: string;
  bio: string[];
};

const MEMBERS: Member[] = [
  {
    name: "Shimon Kohn",
    title: "Founding Attorney",
    img: shimonAsset.url,
    bio: [
      "Shimon has been fighting for clients' rights for over 25 years — 26 in August. Previously serving as a Deputy District Attorney in Teller and El Paso Counties, he prosecuted felony, misdemeanor, and traffic violations. Shimon has been admitted to the Colorado Bar since 2000 and the Federal Bar since 2003. He graduated from the Cleveland Marshall College of Law in 1999 with his Juris Doctorate degree.",
      "Shimon established The Kohn Law Firm so he could advocate for clients' rights in cases such as first degree assault, murder, financial crimes, domestic violence, and anything in between. He understands that being charged with a crime comes with personal challenges and consequences, and he guides clients through a complex legal system with empathy, advice, and support.",
      "Shimon has been a pillar of the Colorado Springs legal community for over two decades, securing acquittals for clients in cases involving domestic violence, sexual assault, attempted murder, drug charges, and assault. He served as defense counsel on the last death penalty case in Colorado after the moratorium was passed.",
    ],
  },
  {
    name: "Erica Bertini",
    title: "Managing Attorney – Family Law",
    img: ericaAsset.url,
    bio: [
      "With over 15 years of experience, Erica L. Bertini guides clients through the maze of family law, providing support during what can be one of the most challenging periods in their lives. With a focus on family law cases intersecting with criminal court, Erica is relentless in her advocacy, whether in the courtroom or at the negotiation table.",
      "As a former Deputy District Attorney in Colorado and Illinois, Erica brings a wealth of knowledge in criminal law — from felonies and misdemeanors to juvenile delinquency and abuse and neglect cases. Her extensive courtroom experience has honed her skills as a persuasive advocate.",
      "Drawing from her background in accounting and finance, Erica adeptly handles intricate financial aspects often involved in family law cases. She prioritizes clear communication and unwavering support so clients never feel alone during the process.",
    ],
  },
  {
    name: "Jerome Aquino",
    title: "Attorney – Family Law",
    img: jeromeAsset.url,
    bio: [
      "As a long-time resident of Colorado Springs, Jerome understands what it takes to advocate for his clients in the arena of family law. Jerome has been an attorney for more than 16 years. He graduated magna cum laude from Drexel University Kline School of Law in Philadelphia, where he was also president of the Moot Court Board.",
      "Jerome started his career as a personal injury attorney and then a civil defense attorney before transitioning to family law. He has managed cases both in litigation and non-litigation, both state and federal, and from intake to resolution — through settlement, mediation, arbitration, trial, or appeal.",
      "Jerome takes pride in being a compassionate yet aggressive advocate for his clients. As an immigrant from the Philippines, Jerome speaks Filipino (Tagalog) fluently. When he's not working hard for his clients, he enjoys spending time with his wife and two children.",
    ],
  },
  {
    name: "Macey Jardee",
    title: "Paralegal",
    img: maceyAsset.url,
    bio: [
      "Macey is a dedicated paralegal at The Kohn Law Firm, where she provides critical support to clients at every stage of their case. She assists our family law attorneys with case preparation, file management, calendaring all case deadlines, and every aspect of the litigation process.",
      "Prior to joining The Kohn Law Firm, Macey worked as a judicial clerk at the El Paso County Combined Courts, where she developed experience in both criminal and family law. She attended Arizona State University and Colorado Technical University and continues ongoing legal education.",
      "Outside of work, Macey enjoys reading, spending time with her dogs, and camping.",
    ],
  },
];

function TeamPage() {
  

  return (
    <PageShell>
      <ServiceHero
        eyebrow="Our Legal Team"
        title="The attorneys behind every case."
        subtitle="At Kohn Law Firm, our attorneys and staff combine proven legal experience with detailed case preparation and ethical advocacy. We approach every case with professionalism, focus, and a commitment to delivering results our clients can trust."
      />

      <section className="py-20 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
              Meet Our Team
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Experienced attorneys and the staff who back them.
            </h2>
          </div>
        </div>
      </section>

      <div className="space-y-0">
        {MEMBERS.map((m, i) => {
          const alt = i % 2 === 1;
          const reverse = i % 2 === 1;
          return (
            <section
              key={m.name}
              className={`${alt ? "bg-surface" : "bg-background"} py-16 md:py-20`}
            >
              <div className="container-page">
                <article
                  className={`grid gap-10 md:items-center lg:gap-16 ${
                    reverse ? "md:grid-cols-[1fr_360px]" : "md:grid-cols-[360px_1fr]"
                  }`}
                >
                  <div
                    className={`relative mx-auto w-full max-w-[360px] md:mx-0 ${
                      reverse ? "md:order-2" : ""
                    }`}
                  >
                    <div
                      aria-hidden
                      className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-gold/30 via-transparent to-brand/30 blur-2xl"
                    />
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface shadow-elegant ring-1 ring-border">
                      <img
                        src={m.img}
                        alt={m.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                        width={680}
                        height={850}
                      />
                    </div>
                    <span className="absolute -bottom-3 left-6 h-1 w-16 bg-gold" />
                  </div>

                  <div className={`min-w-0 ${reverse ? "md:order-1" : ""}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                      {m.title}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                      {m.name}
                    </h3>
                    <div className="mt-3 h-1 w-12 bg-gold" />
                    <div className="mt-6 space-y-4 text-muted-foreground">
                      {m.bio.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          );
        })}
      </div>

      <CTASection />
    </PageShell>
  );
}
