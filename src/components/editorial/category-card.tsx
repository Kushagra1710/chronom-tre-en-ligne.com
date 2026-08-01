import Link from "next/link";

import { ResponsiveImage } from "@/components/editorial/responsive-image";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { EditorialCategory } from "@/data/homepage";

type CategoryCardProps = {
  category: EditorialCategory;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link
      className="group relative block min-h-[30rem] overflow-hidden focus-visible:outline-offset-4 sm:min-h-[34rem]"
      href={category.href}
      prefetch={false}
    >
      <ResponsiveImage
        alt={category.imageAlt}
        className="absolute inset-0 size-full"
        imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 767px) 100vw, 33vw"
        src={category.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent" />
      <span className="absolute left-6 top-6 text-xs font-bold tracking-[0.2em] text-white/80">
        0{index + 1}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className="text-4xl leading-none sm:text-5xl">{category.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              {category.description}
            </p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center border border-white/60 transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
            <ArrowUpRightIcon className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
