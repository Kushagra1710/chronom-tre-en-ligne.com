import type { Metadata } from "next";

import { ArticleCard } from "@/components/editorial/article-card";
import { Container } from "@/components/layout/container";
import { SearchIcon } from "@/components/ui/icons";
import { categoryDetails } from "@/config/categories";
import { getAllPublishedPosts } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description: "Search Wearlivo’s published outfit ideas, style guides and fashion-trend stories.",
  noIndex: true,
  path: "/search",
  title: "Search",
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function normalizeQuery(value: string): string {
  return value.trim().toLocaleLowerCase("en");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = (await searchParams).q;
  const query = Array.isArray(rawQuery) ? (rawQuery[0] ?? "") : (rawQuery ?? "");
  const normalizedQuery = normalizeQuery(query);
  const publishedPosts = await getAllPublishedPosts();
  const results = normalizedQuery
    ? publishedPosts.filter((post) => {
        const searchText = [
          post.title,
          post.description,
          categoryDetails[post.category].label,
          post.category,
          ...post.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("en");

        return searchText.includes(normalizedQuery);
      })
    : [];

  return (
    <main className="flex-1" id="main-content">
      <header className="border-b border-border bg-surface">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Find your next read
          </p>
          <h1 className="mt-5 text-title text-ink">Search Wearlivo</h1>
          <form action="/search" className="mt-9 max-w-3xl" method="get" role="search">
            <label
              className="text-xs font-bold uppercase tracking-[0.16em] text-ink"
              htmlFor="search-query"
            >
              Search published stories
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                <input
                  className="min-h-14 w-full border border-border bg-canvas py-3 pl-12 pr-4 text-base text-ink placeholder:text-ink-muted/70"
                  defaultValue={query}
                  id="search-query"
                  name="q"
                  placeholder="Try “college outfits”"
                  type="search"
                />
              </div>
              <button
                className="min-h-14 border border-ink bg-ink px-7 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-accent hover:bg-accent"
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
        </Container>
      </header>

      <section aria-live="polite" className="py-16 sm:py-20 lg:py-24">
        <Container>
          {normalizedQuery ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
                <h2 className="text-3xl text-ink sm:text-4xl">
                  {results.length > 0 ? `Results for “${query.trim()}”` : "No stories found"}
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
                  {results.length} {results.length === 1 ? "story" : "stories"}
                </p>
              </div>
              {results.length > 0 ? (
                <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((post) => (
                    <ArticleCard article={post} key={post.slug} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 max-w-xl text-base leading-8 text-ink-muted">
                  Try a broader phrase, a category such as Style Guides, or a
                  wardrobe topic such as business casual.
                </p>
              )}
            </>
          ) : (
            <div className="border-y border-border py-12">
              <h2 className="text-3xl text-ink sm:text-4xl">Start with a style idea.</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-ink-muted">
                Search article titles, descriptions, categories and tags. Drafts are
                never included.
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
