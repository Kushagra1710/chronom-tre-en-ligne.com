import type { TableOfContentsItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

type TableOfContentsProps = {
  className?: string;
  items: readonly TableOfContentsItem[];
};

export function TableOfContents({ className, items }: TableOfContentsProps) {
  if (items.length < 3) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn("border-y border-border py-6", className)}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
        In this story
      </p>
      <ol className="mt-5 space-y-3 text-sm leading-6">
        {items.map((item) => (
          <li className={item.level === 3 ? "pl-4" : undefined} key={item.id}>
            <a
              className="text-ink-muted transition-colors hover:text-accent"
              href={`#${item.id}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
