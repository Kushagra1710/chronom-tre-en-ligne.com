import { categoryDetails } from "@/config/categories";
import { siteConfig } from "@/config/site";
import type { PostMetadata } from "@/lib/content";

import { absoluteUrl } from "./metadata";

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    name: siteConfig.name,
    potentialAction: {
      "@type": "SearchAction",
      "query-input": "required name=search_term_string",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
    },
    url: siteConfig.url,
  };
}

export function createBreadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function createArticleJsonLd(post: PostMetadata) {
  const category = categoryDetails[post.category];
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    articleSection: category.label,
    author: post.author,
    dateModified: post.updatedAt ?? post.publishedAt,
    datePublished: post.publishedAt,
    description: post.description,
    headline: post.title,
    image: absoluteUrl(post.coverImage),
    inLanguage: siteConfig.language,
    keywords: post.tags,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };
}
