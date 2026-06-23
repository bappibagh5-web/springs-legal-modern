import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceHero } from "@/components/ServiceHero";
import { CTASection } from "@/components/CTASection";
import shimonAsset from "@/assets/shimon-kohn.png.asset.json";
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
      "Shimon has been fighting for clients' rights for over 24 years. Previously serving as a Deputy District Attorney in Teller and El Paso Counties, he prosecuted felony, misdemeanor, and traffic violations. Shimon has been admitted to the Colorado Bar since 2000 and the Federal Bar since 2003. He graduated from the Cleveland Marshall College of Law in 1999 with his Juris Doctorate degree.",
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
        subtitle="A boutique team means your case is led by an attorney from intake to verdict — backed by experienced support staff at every step."
      />

      <section className="py-20 md:py-28">
        <div className="container-page space-y-20 md:space-y-28">
          {MEMBERS.map((m, i) => (
            <article
              key={m.name}
              className={`grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-start ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-xl object-cover shadow-elegant"
                  width={1024}
                  height={1280}
                />
                <span className="absolute -bottom-3 left-6 h-1 w-16 bg-gold" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                  {m.title}
                </p>
                <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                  {m.name}
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  {m.bio.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
