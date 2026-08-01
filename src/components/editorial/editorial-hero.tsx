import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

import { ResponsiveImage } from "./responsive-image";

export function EditorialHero() {
  return (
    <section className="relative overflow-hidden border-b border-border pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-28 size-72 rounded-full border border-gold/35"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 xl:gap-20">
        <div className="animate-editorial-reveal relative z-10 lg:pb-10">
          <p className="mb-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.24em] text-accent">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            The new everyday edit
          </p>
          <h1 className="max-w-3xl text-display font-medium tracking-[-0.035em] text-ink">
            Wear What’s <span className="italic text-accent">Next</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-ink-muted sm:text-lg lg:mt-9 lg:text-xl lg:leading-9">
            Affordable outfit inspiration, practical style guides and wearable
            fashion trends for everyday life.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#trending">Explore Trends</ButtonLink>
            <ButtonLink href="#categories" variant="secondary">
              Browse Outfit Ideas
            </ButtonLink>
          </div>
          <div className="mt-12 flex items-center gap-5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
            <span>Independent style journal</span>
            <span className="size-1 rounded-full bg-gold" aria-hidden="true" />
            <span>Issue 001</span>
          </div>
        </div>

        <div className="animate-editorial-reveal-delayed relative mx-auto min-h-[31rem] w-full max-w-[42rem] sm:min-h-[39rem] lg:min-h-[43rem]">
          <ResponsiveImage
            alt="Abstract burgundy and ivory placeholder for a future licensed fashion photograph"
            className="absolute right-0 top-0 aspect-[4/5] w-[72%] shadow-editorial sm:w-[68%]"
            imageClassName="transition-transform duration-700 hover:scale-[1.02]"
            priority
            sizes="(max-width: 639px) 72vw, (max-width: 1023px) 55vw, 38vw"
            src="/images/placeholders/editorial-portrait-burgundy.svg"
          />
          <ResponsiveImage
            alt="Abstract taupe placeholder for a future licensed fashion detail"
            className="absolute bottom-0 left-0 aspect-[4/5] w-[43%] border-[0.6rem] border-canvas shadow-editorial sm:w-[40%] sm:border-[0.8rem]"
            imageClassName="transition-transform duration-700 hover:scale-[1.03]"
            sizes="(max-width: 639px) 43vw, (max-width: 1023px) 34vw, 22vw"
            src="/images/placeholders/editorial-portrait-taupe.svg"
          />
          <div className="absolute bottom-[8%] right-[5%] grid size-24 place-items-center rounded-full border border-gold bg-canvas text-center sm:size-28">
            <span className="max-w-16 text-[0.58rem] font-bold uppercase leading-4 tracking-[0.18em] text-accent">
              Wearable ideas, considered well
            </span>
          </div>
          <p
            aria-hidden="true"
            className="absolute left-[7%] top-[4%] font-display text-6xl italic text-gold sm:text-8xl"
          >
            01
          </p>
        </div>
      </Container>
    </section>
  );
}
