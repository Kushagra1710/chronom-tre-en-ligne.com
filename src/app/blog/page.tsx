import type { Metadata } from "next";

import { ArticleArchive } from "@/components/editorial/article-archive";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPublishedPosts } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  description:
    "Explore Wearlivo’s newest outfit ideas, practical style guides and wearable fashion-trend stories.",
  path: "/blog",
  title: "Fashion Stories and Style Advice",
});

export default async function BlogPage() {
  const posts = await getAllPublishedPosts();

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <ArticleArchive
        description="A considered mix of outfit formulas, wardrobe advice and fashion movements made useful for real life."
        eyebrow="The Wearlivo journal"
        posts={posts}
        title="Stories for getting dressed now"
      />
    </>
  );
}
