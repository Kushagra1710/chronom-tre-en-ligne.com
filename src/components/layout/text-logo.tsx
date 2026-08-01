import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type TextLogoProps = {
  className?: string;
  inverse?: boolean;
};

export function TextLogo({ className, inverse = false }: TextLogoProps) {
  return (
    <Link
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex flex-col leading-none focus-visible:outline-offset-4",
        inverse ? "text-white" : "text-ink",
        className,
      )}
      href="/"
    >
      <span className="font-display text-[1.65rem] font-semibold tracking-[0.08em] sm:text-[1.85rem]">
        WEARLIVO
      </span>
      <span
        className={cn(
          "mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.23em]",
          inverse ? "text-white/60" : "text-ink-muted",
        )}
      >
        {siteConfig.tagline}
      </span>
    </Link>
  );
}
