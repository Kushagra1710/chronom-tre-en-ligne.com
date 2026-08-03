import Link from "next/link";

import type { PreviousNextPosts } from "@/lib/content";

export function PreviousNext({ next, previous }: PreviousNextPosts) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Previous and next articles"
      className="grid gap-px border-y border-border bg-border sm:grid-cols-2"
    >
      {previous ? (
        <Link
          className="group bg-canvas py-7 pr-6 transition-colors hover:bg-surface sm:pr-8"
          href={`/blog/${previous.slug}`}
        >
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-ink-muted">
            Previous story
          </span>
          <span className="mt-3 block font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden bg-canvas sm:block" />
      )}
      {next ? (
        <Link
          className="group bg-canvas py-7 pl-0 transition-colors hover:bg-surface sm:pl-8 sm:text-right"
          href={`/blog/${next.slug}`}
        >
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-ink-muted">
            Next story
          </span>
          <span className="mt-3 block font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
