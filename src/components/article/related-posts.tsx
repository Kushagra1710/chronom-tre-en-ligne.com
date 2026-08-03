import { ArticleCard } from "@/components/editorial/article-card";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Container } from "@/components/layout/container";
import type { PostMetadata } from "@/lib/content";

export function RelatedPosts({ posts }: { posts: readonly PostMetadata[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          actionHref="/blog"
          actionLabel="View all stories"
          eyebrow="Continue the edit"
          title="Related Stories"
        />
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard article={post} key={post.slug} />
          ))}
        </div>
      </Container>
    </section>
  );
}
