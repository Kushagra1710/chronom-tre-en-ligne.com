import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import type { PostMetadata } from "@/lib/content";

import { ResponsiveImage } from "./responsive-image";

export function FeaturedStyleGuide({ guide }: { guide: PostMetadata }) {
  const href = `/blog/${guide.slug}`;

  return (
    <section className="bg-accent py-16 text-white sm:py-20 lg:py-28">
      <Container>
        <div className="grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
          <ResponsiveImage
            alt={guide.imageAlt}
            className="min-h-[28rem] lg:min-h-[40rem]"
            imageClassName="transition-transform duration-700 hover:scale-[1.025]"
            sizes="(max-width: 1023px) 100vw, 55vw"
            src={guide.coverImage}
          />
          <div className="flex flex-col justify-center border border-white/20 p-7 sm:p-12 lg:border-l-0 lg:p-14 xl:p-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              The evergreen edit
            </p>
            <h2 className="mt-6 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
              <Link
                className="transition-colors hover:text-canvas"
                href={href}
                prefetch={false}
              >
                {guide.title}
              </Link>
            </h2>
            <p className="mt-6 text-base leading-8 text-white/75 sm:text-lg">
              {guide.description}
            </p>
            <div className="mt-9">
              <ButtonLink href={href} prefetch={false} variant="light">
                Read the guide
              </ButtonLink>
            </div>
            <div className="mt-12 flex items-center gap-4 border-t border-white/20 pt-6 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-white/60">
              <span>{guide.readingTime}</span>
              <span className="size-1 rounded-full bg-gold" aria-hidden="true" />
              <span>Budget-conscious</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
