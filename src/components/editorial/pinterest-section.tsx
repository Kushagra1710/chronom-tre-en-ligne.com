import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PinterestIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { moodboardImages } from "@/data/homepage";

import { ResponsiveImage } from "./responsive-image";

export function PinterestSection() {
  return (
    <section className="overflow-hidden bg-taupe py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <PinterestIcon className="size-9 text-accent" />
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Daily inspiration
            </p>
            <h2 className="mt-5 text-section text-ink">Follow Wearlivo on Pinterest</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-ink/70 sm:text-lg">
              Daily outfit inspiration, moodboards and practical style ideas.
            </p>
            <div className="mt-8">
              {siteConfig.social.pinterest ? (
                <ButtonLink
                  href={siteConfig.social.pinterest}
                  target="_blank"
                  variant="primary"
                >
                  Follow on Pinterest
                </ButtonLink>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex min-h-12 items-center justify-center border border-ink/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/55"
                  role="link"
                  tabIndex={0}
                >
                  Pinterest profile coming soon
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
            {moodboardImages.slice(0, 3).map((image, index) => (
              <ResponsiveImage
                alt={image.alt}
                className={index === 1 ? "aspect-[4/6]" : "aspect-[4/5]"}
                imageClassName="transition-transform duration-700 hover:scale-[1.035]"
                key={image.src}
                sizes="(max-width: 1023px) 32vw, 20vw"
                src={image.src}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
