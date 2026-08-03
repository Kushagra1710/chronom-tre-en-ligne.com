import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { PostMetadata } from "@/lib/content";

const defaultSocialImage = {
  alt: "Wearlivo — Wear What’s Next",
  height: 630,
  url: "/opengraph-image",
  width: 1200,
};

type PageMetadataInput = {
  description: string;
  home?: boolean;
  noIndex?: boolean;
  path: string;
  title: string;
};

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.url).toString();
}

export function createPageMetadata({
  description,
  home = false,
  noIndex = false,
  path,
  title,
}: PageMetadataInput): Metadata {
  return {
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    description,
    openGraph: {
      description,
      images: [defaultSocialImage],
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      type: "website",
      url: path,
    },
    robots: noIndex ? { follow: true, index: false } : undefined,
    title: home ? { absolute: title } : title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [defaultSocialImage.url],
      title,
    },
  };
}

export function createArticleMetadata(post: PostMetadata): Metadata {
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;
  const path = `/blog/${post.slug}`;
  const image = {
    alt: post.imageAlt,
    url: post.coverImage,
  };

  return {
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    description,
    openGraph: {
      authors: [post.author],
      description,
      images: [image],
      locale: siteConfig.locale,
      modifiedTime: post.updatedAt ?? undefined,
      publishedTime: post.publishedAt,
      siteName: siteConfig.name,
      tags: post.tags,
      title,
      type: "article",
      url: path,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [post.coverImage],
      title,
    },
  };
}
