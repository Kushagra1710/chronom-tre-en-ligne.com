import type { MetadataRoute } from "next";

import { categories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified: siteConfig.lastUpdated,
      priority: 1,
      url: absoluteUrl("/"),
    },
    {
      changeFrequency: "weekly",
      lastModified: siteConfig.lastUpdated,
      priority: 0.9,
      url: absoluteUrl("/blog"),
    },
    {
      changeFrequency: "monthly",
      lastModified: siteConfig.lastUpdated,
      priority: 0.5,
      url: absoluteUrl("/about"),
    },
    {
      changeFrequency: "yearly",
      lastModified: siteConfig.lastUpdated,
      priority: 0.4,
      url: absoluteUrl("/contact"),
    },
    ...[
      "/privacy-policy",
      "/terms-and-conditions",
      "/affiliate-disclosure",
      "/disclaimer",
    ].map((path) => ({
      changeFrequency: "yearly" as const,
      lastModified: siteConfig.lastUpdated,
      priority: 0.3,
      url: absoluteUrl(path),
    })),
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    changeFrequency: "weekly",
    lastModified: siteConfig.lastUpdated,
    priority: 0.8,
    url: absoluteUrl(category.href),
  }));
  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    changeFrequency: "monthly",
    lastModified: post.updatedAt ?? post.publishedAt,
    priority: 0.7,
    url: absoluteUrl(`/blog/${post.slug}`),
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
