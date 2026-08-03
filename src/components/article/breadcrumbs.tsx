import Link from "next/link";

import type { CategoryDetails } from "@/config/categories";

type BreadcrumbsProps = {
  category: CategoryDetails;
  title: string;
};

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">
        <li>
          <Link className="transition-colors hover:text-accent" href="/">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-gold">
          /
        </li>
        <li>
          <Link className="transition-colors hover:text-accent" href={category.href}>
            {category.label}
          </Link>
        </li>
        <li aria-hidden="true" className="text-gold">
          /
        </li>
        <li aria-current="page" className="max-w-full truncate text-ink sm:max-w-md">
          {title}
        </li>
      </ol>
    </nav>
  );
}
