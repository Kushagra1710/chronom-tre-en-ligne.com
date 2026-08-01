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
