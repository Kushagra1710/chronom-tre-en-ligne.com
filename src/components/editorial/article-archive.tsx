import { AdSlot } from "@/components/advertising/ad-slot";
import { ArticleCard } from "@/components/editorial/article-card";
import { Container } from "@/components/layout/container";
import type { PostMetadata } from "@/lib/content";

type ArticleArchiveProps = {
  description: string;
  emptyMessage?: string;
  emptyTitle?: string;
  eyebrow: string;
  posts: readonly PostMetadata[];
  title: string;
};

export function ArticleArchive({
  description,
  emptyMessage = "New Wearlivo style stories are coming soon.",
  emptyTitle = "No articles published yet.",
  eyebrow,
  posts,
  title,
}: ArticleArchiveProps) {
  const [leadPost, ...remainingPosts] = posts;

  return (
    <main className="flex-1" id="main-content">
      <header className="border-b border-border bg-surface">
        <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-20 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-title text-ink">{title}</h1>
          </div>
          <p className="max-w-xl border-l border-gold pl-6 text-base leading-8 text-ink-muted sm:text-lg">
            {description}
          </p>
        </Container>
      </header>

      <section aria-label={`${title} articles`} className="py-16 sm:py-20 lg:py-28">
        <Container>
          {leadPost ? (
            <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 xl:gap-14">
              <ArticleCard article={leadPost} priority variant="featured" />
              {remainingPosts.length > 0 ? (
                <div className="grid content-start gap-12 border-border sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:pl-10 xl:pl-14">
                  {remainingPosts.map((post) => (
                    <ArticleCard article={post} key={post.slug} variant="compact" />
                  ))}
                </div>
              ) : (
                <aside className="self-start border-y border-border py-8 lg:border-l lg:border-y-0 lg:pl-10 xl:pl-14">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                    More soon
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-ink-muted">
                    {emptyMessage}
                  </p>
                </aside>
              )}
            </div>
          ) : (
            <div className="border-y border-border py-16 text-center sm:py-20">
              <p className="font-display text-3xl text-ink sm:text-4xl">
                {emptyTitle}
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
                {emptyMessage}
              </p>
            </div>
          )}
        </Container>
      </section>
      <AdSlot
        className="mx-5 max-w-site sm:mx-8 lg:mx-10 xl:mx-auto"
        placement="archive-lower"
      />
    </main>
  );
}
