import { ActionButton } from "./ActionButton";
import courthouse from "@/assets/courthouse.jpg";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
};

export function ServiceHero({ eyebrow, title, subtitle, image = courthouse }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        loading="lazy"
        width={1280}
        height={800}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="container-page relative py-20 md:py-28">
        <div className="max-w-3xl animate-fade-up">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mt-8">
            <ActionButton variant="gold" size="lg">
              Schedule a Consultation
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
