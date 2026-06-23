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
  const attorneys = MEMBERS.filter((m) => m.title !== "Paralegal");
  const staff = MEMBERS.filter((m) => m.title === "Paralegal");

  return (
    <PageShell>
      <ServiceHero
        eyebrow="Our Legal Team"
        title="The attorneys behind every case."
        subtitle="A boutique team means your case is led by an attorney from intake to verdict — backed by experienced support staff at every step."
      />

      {/* Attorney grid */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
              Attorneys
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Counsel you can call by name.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {attorneys.map((m) => (
              <article
                key={m.name}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    width={1024}
                    height={1280}
                  />
                  <span className="absolute left-5 top-5 inline-block h-1 w-10 bg-gold" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
                    {m.title}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-brand">
                    {m.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {m.bio[0]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed attorney bios */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
              Attorney Bios
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Meet the team.
            </h2>
          </div>

          <div className="mt-14 space-y-16">
            {attorneys.map((m) => (
              <article
                key={m.name}
                className="grid gap-10 md:grid-cols-[280px_1fr] md:items-start lg:grid-cols-[320px_1fr] lg:gap-12"
              >
                <div className="relative mx-auto w-full max-w-[320px] md:mx-0">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full rounded-xl object-cover object-top shadow-elegant"
                    width={640}
                    height={800}
                  />
                  <span className="absolute -bottom-3 left-6 h-1 w-16 bg-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                    {m.title}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                    {m.name}
                  </h3>
                  <div className="mt-6 space-y-4 text-muted-foreground">
                    {m.bio.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Support staff */}
      {staff.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                Support Staff
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                The people who keep every case on track.
              </h2>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-start">
              {staff.map((m) => (
                <article
                  key={m.name}
                  className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-start"
                >
                  <div className="mx-auto w-full max-w-[220px] sm:mx-0">
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                      className="aspect-square w-full rounded-xl object-cover object-top shadow-elegant"
                      width={440}
                      height={440}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">
                      {m.title}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-ink">
                      {m.name}
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {m.bio.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </PageShell>
  );
}
