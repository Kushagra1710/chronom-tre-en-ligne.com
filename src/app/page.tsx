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
import {
  demonstrationArticles,
  editorialCategories,
} from "@/data/homepage";

export default function Home() {
  const featuredArticle = demonstrationArticles[0];
  const secondaryArticles = demonstrationArticles.slice(1, 3);
  const latestArticles = demonstrationArticles.slice(3);

  return (
    <main className="flex-1" id="main-content">
      <EditorialHero />
      <TrendTicker />

      <section className="py-16 sm:py-20 lg:py-28" id="trending">
        <Container>
          <SectionHeading
            actionHref="/blog"
            actionLabel="View all stories"
            description="Fresh outfit formulas, practical wardrobe thinking and the trends moving into everyday style."
            eyebrow="The edit"
            title="Trending Now"
          />
          {featuredArticle ? (
            <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr] lg:gap-10 xl:gap-14">
              <ArticleCard article={featuredArticle} priority variant="featured" />
              <div className="grid gap-10 border-border sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:pl-10 xl:pl-14">
                {secondaryArticles.map((article) => (
                  <ArticleCard article={article} key={article.title} variant="compact" />
                ))}
              </div>
            </div>
          ) : null}
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
            {editorialCategories.map((category, index) => (
              <CategoryCard category={category} index={index} key={category.title} />
            ))}
          </div>
        </Container>
      </section>

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
            {latestArticles.map((article, index) => (
              <ArticleCard
                article={article}
                className={
                  index < 2
                    ? "lg:col-span-6"
                    : "lg:col-span-4 lg:border-t lg:border-border lg:pt-6"
                }
                key={article.title}
              />
            ))}
          </div>
        </Container>
      </section>

      <FeaturedStyleGuide />
      <FashionMoodboard />
      <NewsletterPlaceholder />
      <PinterestSection />
    </main>
  );
}
