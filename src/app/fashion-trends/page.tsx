import type { Metadata } from "next";

import { ArticleArchive } from "@/components/editorial/article-archive";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryDetails } from "@/config/categories";
import { getPostsByCategory } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const category = categoryDetails["fashion-trends"];

export const metadata: Metadata = createPageMetadata({
  description: category.description,
  path: category.href,
  title: category.label,
});

export default async function FashionTrendsPage() {
  const posts = await getPostsByCategory(category.slug);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: category.label, path: category.href },
        ])}
      />
      <ArticleArchive
        description={category.description}
        emptyMessage="Our first trend report is still on the editorial desk. Published stories will appear here automatically."
        emptyTitle="No articles in this category yet."
        eyebrow="What is moving"
        posts={posts}
        title={category.label}
      />
    </>
  );
}
