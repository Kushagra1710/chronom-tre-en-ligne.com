import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  description?: string;
  eyebrow?: string;
  inverse?: boolean;
  title: string;
};

export function SectionHeading({
  actionHref,
  actionLabel,
  className,
  description,
  eyebrow,
  inverse = false,
  title,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 border-b pb-7 sm:mb-12 md:flex-row md:items-end md:justify-between",
        inverse ? "border-white/20" : "border-border",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p
            className={cn(
              "mb-4 text-xs font-bold uppercase tracking-[0.22em]",
              inverse ? "text-gold" : "text-accent",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-section",
            inverse ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-base leading-7 sm:text-lg",
              inverse ? "text-white/70" : "text-ink-muted",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <ButtonLink
          href={actionHref}
          prefetch={false}
          variant={inverse ? "light" : "text"}
        >
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
