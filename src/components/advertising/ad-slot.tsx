import { ads, type AdPlacement } from "@/config/ads";
import { cn } from "@/lib/utils/cn";

const placementClasses: Record<AdPlacement, string> = {
  "archive-lower": "grid min-h-32",
  "article-after-introduction": "grid min-h-28",
  "article-end": "grid min-h-28",
  "article-middle": "grid min-h-36",
  "article-sidebar": "hidden min-h-64 lg:grid",
  "home-between-sections": "grid min-h-32",
};

type AdSlotProps = {
  className?: string;
  placement: AdPlacement;
};

export function AdSlot({ className, placement }: AdSlotProps) {
  if (!ads.enabled) {
    if (
      process.env.NODE_ENV !== "development" ||
      !ads.showDevelopmentPlaceholders
    ) {
      return null;
    }

    return (
      <aside
        aria-label={`Development advertising placeholder: ${placement}`}
        className={cn(
          "my-8 place-items-center border border-dashed border-border bg-surface px-5 py-8 text-center text-ink-muted",
          placementClasses[placement],
          className,
        )}
        data-ad-placement={placement}
      >
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-accent">
            Development preview only
          </p>
          <p className="mt-2 text-xs">Advertising slot · {placement}</p>
        </div>
      </aside>
    );
  }

  // A provider adapter will be added here only after approval, consent review,
  // and verified publisher configuration. Enabled-without-provider stays empty.
  return null;
}
