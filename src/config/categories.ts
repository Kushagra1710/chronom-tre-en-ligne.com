import type { ContentCategory } from "@/lib/content";

export type CategoryDetails = {
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  label: string;
  slug: ContentCategory;
};

export const categories: readonly CategoryDetails[] = [
  {
    description:
      "Wearable outfit inspiration for college, work, weekends and everyday life.",
    href: "/outfit-ideas",
    image: "/images/placeholders/editorial-portrait-burgundy.svg",
    imageAlt: "Abstract burgundy editorial placeholder for outfit ideas",
    label: "Outfit Ideas",
    slug: "outfit-ideas",
  },
  {
    description:
      "Practical advice for building better outfits and a more useful wardrobe.",
    href: "/style-guides",
    image: "/images/placeholders/editorial-portrait-taupe.svg",
    imageAlt: "Abstract taupe editorial placeholder for style guides",
    label: "Style Guides",
    slug: "style-guides",
  },
  {
    description:
      "Current fashion movements translated into wearable, realistic ideas.",
    href: "/fashion-trends",
    image: "/images/placeholders/editorial-sun.svg",
    imageAlt: "Abstract gold editorial placeholder for fashion trends",
    label: "Fashion Trends",
    slug: "fashion-trends",
  },
] as const;

export const categoryDetails = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<ContentCategory, CategoryDetails>;
