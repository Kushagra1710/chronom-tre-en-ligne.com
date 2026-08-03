import Image from "next/image";
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
        "inline-flex shrink-0 items-center focus-visible:outline-offset-4",
        inverse && "bg-canvas px-3 py-2",
        className,
      )}
      href="/"
    >
      <Image
        alt=""
        className={cn(
          "h-14 w-auto sm:h-16",
          inverse && "h-24 sm:h-28",
        )}
        height={1108}
        loading="eager"
        src="/images/brand/wearlivo-logo.png"
        width={1419}
      />
    </Link>
  );
}
