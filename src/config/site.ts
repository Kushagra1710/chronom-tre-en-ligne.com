export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  language: string;
  locale: string;
  social: {
    pinterest: string | null;
  };
  features: {
    ads: boolean;
    contactForm: boolean;
    newsletter: boolean;
    search: boolean;
  };
};

export const siteConfig: SiteConfig = {
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
};
