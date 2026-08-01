import { Container } from "@/components/layout/container";
import { moodboardImages } from "@/data/homepage";

import { ResponsiveImage } from "./responsive-image";
import { SectionHeading } from "./section-heading";

const placementClasses = [
  "col-span-7 row-span-2 sm:col-span-5",
  "col-span-5 sm:col-span-3",
  "col-span-5 sm:col-span-4",
  "col-span-5 sm:col-span-4",
  "col-span-7 sm:col-span-3",
] as const;

export function FashionMoodboard() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading
          description="A study in shape, texture and warm neutrals—ready to become a living inspiration board when original photography arrives."
          eyebrow="Visual notes"
          title="The Wearlivo Moodboard"
        />
        <div className="grid auto-rows-[9rem] grid-cols-12 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:auto-rows-[15rem]">
          {moodboardImages.map((image, index) => (
            <ResponsiveImage
              alt={image.alt}
              className={placementClasses[index] ?? "col-span-12"}
              imageClassName="transition-transform duration-700 hover:scale-[1.035]"
              key={image.src}
              sizes="(max-width: 639px) 60vw, (max-width: 1023px) 42vw, 32vw"
              src={image.src}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
