import Link from "next/link";

import { AdSlot } from "@/components/advertising/ad-slot";
import { PinterestIcon } from "@/components/ui/icons";
import { categories } from "@/config/categories";
import type { PostMetadata } from "@/lib/content";

export function ArticleSidebar({ latestPosts }: { latestPosts: readonly PostMetadata[] }) {
  return (
    <div className="space-y-10">
      {latestPosts.length > 0 ? (
        <section>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Latest reads
          </h2>
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {latestPosts.map((post, index) => (
              <li className="grid grid-cols-[2rem_1fr] gap-3 py-4" key={post.slug}>
                <span className="font-display text-xl text-gold" aria-hidden="true">
                  0{index + 1}
                </span>
                <Link
                  className="text-sm font-semibold leading-6 text-ink transition-colors hover:text-accent"
                  href={`/blog/${post.slug}`}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <nav aria-label="Article categories">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Explore the edits
        </h2>
        <ul className="mt-5 space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                className="flex min-h-11 items-center justify-between border-b border-border text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                href={category.href}
              >
                {category.label}
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="bg-taupe p-6">
        <PinterestIcon className="size-7 text-accent" />
        <h2 className="mt-5 text-3xl leading-tight text-ink">Save the mood</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Wearlivo’s Pinterest profile is being prepared. No external account is
          connected yet.
        </p>
        <span
          aria-disabled="true"
          className="mt-5 inline-flex min-h-11 items-center border border-ink/25 px-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink/55"
        >
          Profile coming soon
        </span>
      </section>

      <section className="border border-border bg-surface p-6">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-gold">
          Weekly Style Drop
        </p>
        <h2 className="mt-4 text-3xl leading-tight text-ink">The inbox edit</h2>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Newsletter signup is a visible preview only. No information is collected.
        </p>
        <span
          aria-disabled="true"
          className="mt-5 inline-flex min-h-11 items-center bg-ink px-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/55"
        >
          Signup not connected
        </span>
      </section>

      <AdSlot className="my-0" placement="article-sidebar" />
    </div>
  );
}
