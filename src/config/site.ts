export const siteConfig = {
  name: "Wearlivo",
  tagline: "Wear What’s Next",
  description:
    "Affordable outfit inspiration, practical style guides and wearable fashion trends for everyday life.",
  url: "https://wearlivo.com",
  language: "en",
  locale: "en_US",
  social: {
    pinterest: null,
  },
  features: {
    ads: false,
    contactForm: false,
    newsletter: false,
    search: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
