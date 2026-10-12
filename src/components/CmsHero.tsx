import { ServiceHero } from "./ServiceHero";
import { useCms, CmsSection } from "@/lib/cms/context";

/** Inner-page hero banner driven by the Content Editor ("hero" section). */
export function CmsHero({ page }: { page: string }) {
  const c = useCms(page);
  const image = c.image("hero.image");
  return (
    <CmsSection page={page} id="hero">
      <ServiceHero
        eyebrow={c.text("hero.eyebrow")}
        title={c.text("hero.title")}
        subtitle={c.text("hero.subtitle")}
        image={image.url || undefined}
      />
    </CmsSection>
  );
}
