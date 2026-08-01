export type EditorialArticle = {
  title: string;
  description: string;
  category: "Outfit Ideas" | "Style Guides" | "Fashion Trends";
  publishedAt: string;
  readingTime: string;
  coverImage: string;
  imageAlt: string;
  href: string;
};

export type EditorialCategory = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const trendTopics = [
  "Quiet Luxury",
  "Y2K Revival",
  "Office Core",
  "Minimal Streetwear",
  "Summer Layers",
  "Neutral Palette",
  "Capsule Wardrobe",
] as const;

export const demonstrationArticles: EditorialArticle[] = [
  {
    title: "8 Business-Casual Outfits for Your First Job",
    description:
      "A modern starter wardrobe that feels polished without losing your personal style.",
    category: "Outfit Ideas",
    publishedAt: "2026-07-28",
    readingTime: "6 min read",
    coverImage: "/images/placeholders/editorial-portrait-burgundy.svg",
    imageAlt: "Abstract burgundy and ivory editorial placeholder",
    href: "/blog/business-casual-outfits-for-your-first-job",
  },
  {
    title: "How to Build a Capsule Wardrobe on a Budget",
    description:
      "The versatile pieces, practical rules and spending priorities that make a small wardrobe work harder.",
    category: "Style Guides",
    publishedAt: "2026-07-23",
    readingTime: "8 min read",
    coverImage: "/images/placeholders/editorial-portrait-taupe.svg",
    imageAlt: "Abstract taupe wardrobe-inspired editorial placeholder",
    href: "/blog/how-to-build-a-capsule-wardrobe-on-a-budget",
  },
  {
    title: "10 Gen Z Summer Outfit Ideas",
    description:
      "Easy warm-weather formulas built around relaxed tailoring, texture and repeatable basics.",
    category: "Fashion Trends",
    publishedAt: "2026-07-18",
    readingTime: "5 min read",
    coverImage: "/images/placeholders/editorial-sun.svg",
    imageAlt: "Abstract gold and charcoal summer editorial placeholder",
    href: "/blog/gen-z-summer-outfit-ideas",
  },
  {
    title: "10 Affordable College Outfit Ideas",
    description:
      "Comfortable campus looks designed for early classes, long days and real-life budgets.",
    category: "Outfit Ideas",
    publishedAt: "2026-07-12",
    readingTime: "6 min read",
    coverImage: "/images/placeholders/editorial-check.svg",
    imageAlt: "Abstract checked editorial placeholder in warm neutrals",
    href: "/blog/affordable-college-outfit-ideas",
  },
  {
    title: "12 Minimalist Outfit Ideas for Everyday Wear",
    description:
      "Low-effort combinations with considered proportions and a calm neutral palette.",
    category: "Outfit Ideas",
    publishedAt: "2026-07-08",
    readingTime: "7 min read",
    coverImage: "/images/placeholders/editorial-arch.svg",
    imageAlt: "Minimal charcoal arch on a warm ivory editorial placeholder",
    href: "/blog/minimalist-outfit-ideas-for-everyday-wear",
  },
  {
    title: "How to Match Shirt and Trouser Colours",
    description:
      "A straightforward colour guide for combinations that look intentional every time.",
    category: "Style Guides",
    publishedAt: "2026-07-02",
    readingTime: "7 min read",
    coverImage: "/images/placeholders/editorial-blocks.svg",
    imageAlt: "Abstract blocks of charcoal, taupe and burgundy",
    href: "/blog/how-to-match-shirt-and-trouser-colours",
  },
  {
    title: "How to Make Affordable Clothes Look Premium",
    description:
      "Fabric, fit and finishing details that create a more elevated everyday wardrobe.",
    category: "Style Guides",
    publishedAt: "2026-06-26",
    readingTime: "8 min read",
    coverImage: "/images/placeholders/editorial-portrait-burgundy.svg",
    imageAlt: "Abstract burgundy and ivory editorial placeholder",
    href: "/blog/how-to-make-affordable-clothes-look-premium",
  },
  {
    title: "Common Business-Casual Fashion Mistakes",
    description:
      "The small styling choices that can make office outfits feel dated, awkward or overdone.",
    category: "Fashion Trends",
    publishedAt: "2026-06-20",
    readingTime: "6 min read",
    coverImage: "/images/placeholders/editorial-portrait-taupe.svg",
    imageAlt: "Abstract taupe wardrobe-inspired editorial placeholder",
    href: "/blog/common-business-casual-fashion-mistakes",
  },
];

export const editorialCategories: EditorialCategory[] = [
  {
    title: "Outfit Ideas",
    description: "Wearable looks for campus, work, weekends and everything between.",
    image: "/images/placeholders/editorial-portrait-burgundy.svg",
    imageAlt: "Abstract burgundy editorial placeholder for outfit ideas",
    href: "/outfit-ideas",
  },
  {
    title: "Style Guides",
    description: "Clear advice that makes getting dressed feel simpler and more intentional.",
    image: "/images/placeholders/editorial-portrait-taupe.svg",
    imageAlt: "Abstract taupe editorial placeholder for style guides",
    href: "/style-guides",
  },
  {
    title: "Fashion Trends",
    description: "The ideas worth noticing, translated into outfits you can actually wear.",
    image: "/images/placeholders/editorial-sun.svg",
    imageAlt: "Abstract gold editorial placeholder for fashion trends",
    href: "/fashion-trends",
  },
];

export const moodboardImages = [
  {
    src: "/images/placeholders/editorial-portrait-taupe.svg",
    alt: "Abstract taupe fashion moodboard placeholder",
  },
  {
    src: "/images/placeholders/editorial-check.svg",
    alt: "Abstract checked fashion moodboard placeholder",
  },
  {
    src: "/images/placeholders/editorial-sun.svg",
    alt: "Abstract muted-gold fashion moodboard placeholder",
  },
  {
    src: "/images/placeholders/editorial-arch.svg",
    alt: "Abstract charcoal fashion moodboard placeholder",
  },
  {
    src: "/images/placeholders/editorial-blocks.svg",
    alt: "Abstract color-block fashion moodboard placeholder",
  },
] as const;
