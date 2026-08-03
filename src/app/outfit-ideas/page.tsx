import type { Metadata } from "next";

import { ArticleArchive } from "@/components/editorial/article-archive";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryDetails } from "@/config/categories";
import { getPostsByCategory } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const category = categoryDetails["outfit-ideas"];

export const metadata: Metadata = createPageMetadata({
  description: category.description,
  path: category.href,
  title: category.label,
});

export default async function OutfitIdeasPage() {
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
        emptyMessage="New outfit ideas are coming soon."
        emptyTitle="No articles in this category yet."
        eyebrow="Looks to repeat"
        posts={posts}
        title={category.label}
      />
    </>
  );
}
