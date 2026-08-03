import type { Metadata } from "next";

import { AdSlot } from "@/components/advertising/ad-slot";
import { ArticleCard } from "@/components/editorial/article-card";
import { CategoryCard } from "@/components/editorial/category-card";
import { EditorialHero } from "@/components/editorial/editorial-hero";
import { FashionMoodboard } from "@/components/editorial/fashion-moodboard";
import { FeaturedStyleGuide } from "@/components/editorial/featured-style-guide";
import { NewsletterPlaceholder } from "@/components/editorial/newsletter-placeholder";
import { PinterestSection } from "@/components/editorial/pinterest-section";
import { SectionHeading } from "@/components/editorial/section-heading";
import { TrendTicker } from "@/components/editorial/trend-ticker";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { categories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createWebsiteJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  description: siteConfig.description,
  home: true,
  path: "/",
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
});

export default async function Home() {
  const publishedArticles = await getAllPublishedPosts();
  const featuredArticle = publishedArticles[0];
  const secondaryArticles = publishedArticles.slice(1, 3);
  const featuredGuide =
    publishedArticles.find(
      (article) => article.category === "style-guides" && article.featured,
    ) ?? publishedArticles.find((article) => article.category === "style-guides");

  return (
    <>
      <JsonLd data={createWebsiteJsonLd()} />
      <main className="flex-1" id="main-content">
      <EditorialHero />
      <TrendTicker />

      <section className="py-16 sm:py-20 lg:py-28" id="trending">
        <Container>
          {featuredArticle ? (
            <>
              <SectionHeading
                actionHref="/blog"
                actionLabel="View all stories"
                description="Fresh outfit formulas, practical wardrobe thinking and the trends moving into everyday style."
                eyebrow="The edit"
                title="Trending Now"
              />
              <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr] lg:gap-10 xl:gap-14">
                <ArticleCard article={featuredArticle} priority variant="featured" />
                <div className="grid gap-10 border-border sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:pl-10 xl:pl-14">
                  {secondaryArticles.map((article) => (
                    <ArticleCard article={article} key={article.slug} variant="compact" />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid gap-8 border-y border-border py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  The Wearlivo journal
                </p>
                <h2 className="mt-5 text-section text-ink">
                  New style stories are coming soon.
                </h2>
              </div>
              <p className="max-w-xl border-l border-gold pl-6 text-base leading-8 text-ink-muted sm:text-lg">
                We are preparing considered outfit ideas, practical style guides
                and wearable trend reports for the first issue.
              </p>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20 lg:py-28" id="categories">
        <Container>
          <SectionHeading
            description="Start with the kind of inspiration you need today."
            eyebrow="Find your edit"
            title="Explore by Category"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard category={category} index={index} key={category.slug} />
            ))}
          </div>
        </Container>
      </section>

      {publishedArticles.length > 0 ? (
        <section className="py-16 sm:py-20 lg:py-28">
          <Container>
            <SectionHeading
              actionHref="/blog"
              actionLabel="Browse the journal"
              description="Useful ideas designed to be saved, repeated and made your own."
              eyebrow="New stories"
              title="Latest on Wearlivo"
            />
            <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-20">
              {publishedArticles.map((article) => (
                <ArticleCard
                  article={article}
                  className="lg:col-span-4 lg:border-t lg:border-border lg:pt-6"
                  key={article.slug}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <AdSlot
        className="mx-5 max-w-site sm:mx-8 lg:mx-10 xl:mx-auto"
        placement="home-between-sections"
      />

      {featuredGuide ? <FeaturedStyleGuide guide={featuredGuide} /> : null}
      <FashionMoodboard />
      <NewsletterPlaceholder />
      <PinterestSection />
      </main>
    </>
  );
}
