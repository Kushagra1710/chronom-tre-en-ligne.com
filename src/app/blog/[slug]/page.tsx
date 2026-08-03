import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { AdSlot } from "@/components/advertising/ad-slot";
import { ArticleSidebar } from "@/components/article/article-sidebar";
import { Breadcrumbs } from "@/components/article/breadcrumbs";
import { EditorialTrustLinks } from "@/components/article/editorial-trust-links";
import { PreviousNext } from "@/components/article/previous-next";
import { RelatedPosts } from "@/components/article/related-posts";
import { ShareLinks } from "@/components/article/share-links";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ResponsiveImage } from "@/components/editorial/responsive-image";
import { Container } from "@/components/layout/container";
import { AffiliateNotice } from "@/components/mdx/affiliate-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryDetails } from "@/config/categories";
import { siteConfig } from "@/config/site";
import {
  extractTableOfContents,
  getAllPublishedPosts,
  getLatestPosts,
  getPostBySlug,
  getPreviousNextPosts,
  getRelatedPosts,
  renderPostMdx,
} from "@/lib/content";
import { formatEditorialDate } from "@/lib/utils/format-date";
import { createArticleMetadata } from "@/lib/seo/metadata";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
} from "@/lib/seo/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getAllPublishedPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      robots: { follow: false, index: false },
      title: "Story not found",
    };
  }

  return createArticleMetadata(post);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [content, relatedPosts, adjacentPosts, latestPosts] = await Promise.all([
    renderPostMdx(post),
    getRelatedPosts(post.slug, 3),
    getPreviousNextPosts(post.slug),
    getLatestPosts(5),
  ]);
  const tableOfContents = extractTableOfContents(post.source);
  const category = categoryDetails[post.category];
  const canonicalUrl = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
  const coverImageUrl = new URL(post.coverImage, siteConfig.url).toString();
  const sidebarPosts = latestPosts
    .filter((latestPost) => latestPost.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={createArticleJsonLd(post)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: category.label, path: category.href },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <main className="flex-1" id="main-content">
      <article>
        <header className="border-b border-border bg-surface">
          <Container className="py-10 sm:py-14 lg:py-20">
            <Breadcrumbs category={category} title={post.title} />
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end lg:gap-16">
              <div>
                <LinkCategory href={category.href} label={category.label} />
                <h1 className="mt-5 max-w-5xl text-[clamp(3rem,7vw,6.25rem)] leading-[0.94] text-ink">
                  {post.title}
                </h1>
              </div>
              <p className="border-l border-gold pl-6 text-base leading-8 text-ink-muted sm:text-lg">
                {post.description}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">
              <span className="text-ink">By {post.author}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
              <time dateTime={post.publishedAt}>
                Published {formatEditorialDate(post.publishedAt)}
              </time>
              {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                <>
                  <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
                  <time dateTime={post.updatedAt}>
                    Updated {formatEditorialDate(post.updatedAt)}
                  </time>
                </>
              ) : null}
              <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
              <span>{post.readingTime}</span>
            </div>
          </Container>
        </header>

        <Container className="py-8 sm:py-10 lg:py-14">
          <ResponsiveImage
            alt={post.imageAlt}
            className="aspect-[4/3] shadow-editorial sm:aspect-[16/9]"
            imageClassName="object-cover"
            priority
            sizes="(max-width: 1279px) 100vw, 1200px"
            src={post.coverImage}
          />
        </Container>

        <Container className="pb-16 sm:pb-20 lg:pb-28">
          <div className="mx-auto grid max-w-[68rem] gap-12 lg:grid-cols-[minmax(0,72ch)_18rem] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <TableOfContents className="mb-10 lg:hidden" items={tableOfContents} />
              {post.hasAffiliateLinks ? <AffiliateNotice active /> : null}
              <AdSlot placement="article-after-introduction" />
              <div className="text-base sm:text-[1.05rem]">{content}</div>
              <div className="mt-14 space-y-10 sm:mt-16">
                <AdSlot placement="article-end" />
                <ShareLinks
                  canonicalUrl={canonicalUrl}
                  coverImageUrl={coverImageUrl}
                  title={post.title}
                />
                <EditorialTrustLinks />
                <PreviousNext {...adjacentPosts} />
              </div>
            </div>

            <aside aria-label="More from Wearlivo" className="hidden lg:block">
              <div className="space-y-10">
                <TableOfContents items={tableOfContents} />
                <ArticleSidebar latestPosts={sidebarPosts} />
              </div>
            </aside>
          </div>

          <aside aria-label="More from Wearlivo" className="mt-16 border-t border-border pt-12 lg:hidden">
            <ArticleSidebar latestPosts={sidebarPosts} />
          </aside>
        </Container>
      </article>

      <RelatedPosts posts={relatedPosts} />
      </main>
    </>
  );
}

function LinkCategory({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="text-xs font-bold uppercase tracking-[0.22em] text-accent transition-colors hover:text-accent-dark"
      href={href}
    >
      {label}
    </Link>
  );
}
