import Link from "next/link";

import { ResponsiveImage } from "@/components/editorial/responsive-image";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { EditorialArticle } from "@/data/homepage";
import { cn } from "@/lib/utils/cn";

type ArticleCardVariant = "compact" | "featured" | "standard";

type ArticleCardProps = {
  article: EditorialArticle;
  className?: string;
  priority?: boolean;
  variant?: ArticleCardVariant;
};

const imageClasses: Record<ArticleCardVariant, string> = {
  compact: "aspect-[4/3] sm:aspect-[3/2]",
  featured: "aspect-[4/5] sm:aspect-[16/11]",
  standard: "aspect-[4/5]",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticleCard({
  article,
  className,
  priority = false,
  variant = "standard",
}: ArticleCardProps) {
  return (
    <article className={cn("group", className)}>
      <Link
        aria-label={`Read ${article.title}`}
        className="block focus-visible:outline-offset-4"
        href={article.href}
        prefetch={false}
      >
        <ResponsiveImage
          alt={article.imageAlt}
          className={imageClasses[variant]}
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          priority={priority}
          sizes={
            variant === "featured"
              ? "(max-width: 1023px) 100vw, 58vw"
              : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          }
          src={article.coverImage}
        />
      </Link>
      <div className={cn("pt-5", variant === "compact" && "sm:pt-4")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-bold uppercase tracking-[0.17em]">
          <span className="text-accent">{article.category}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
          <time className="text-ink-muted" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <span className="text-ink-muted">{article.readingTime}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display leading-[1.06] text-ink",
            variant === "featured"
              ? "text-3xl sm:text-4xl lg:text-5xl"
              : variant === "compact"
                ? "text-2xl sm:text-[1.75rem]"
                : "text-[1.8rem] sm:text-3xl",
          )}
        >
          <Link
            className="transition-colors duration-300 hover:text-accent"
            href={article.href}
            prefetch={false}
          >
            {article.title}
          </Link>
        </h3>
        {variant !== "compact" ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
            {article.description}
          </p>
        ) : null}
        <Link
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 group-hover:text-accent"
          href={article.href}
          prefetch={false}
        >
          Read story
          <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
