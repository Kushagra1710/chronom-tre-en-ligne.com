import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { ArrowRightIcon } from "./icons";

type ButtonVariant = "primary" | "secondary" | "light" | "text";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-white hover:border-accent-dark hover:bg-accent-dark",
  secondary:
    "border-ink bg-transparent text-ink hover:bg-ink hover:text-canvas",
  light:
    "border-white bg-white text-ink hover:border-canvas hover:bg-canvas",
  text: "border-transparent px-0 text-ink hover:text-accent",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  showArrow?: boolean;
  variant?: ButtonVariant;
};

export function ButtonLink({
  children,
  className,
  showArrow = true,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {showArrow ? (
        <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </Link>
  );
}
