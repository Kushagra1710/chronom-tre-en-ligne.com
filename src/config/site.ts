export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  lastUpdated: string;
  language: string;
  locale: string;
  social: {
    pinterest: string | null;
  };
  ownerReview: {
    contactEmail: string | null;
    effectiveDate: string | null;
    jurisdiction: string | null;
    legalName: string | null;
  };
  features: {
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
  lastUpdated: "2026-08-03",
  language: "en",
  locale: "en_US",
  social: {
    pinterest: null,
  },
  ownerReview: {
    contactEmail: "wearlivo@gmail.com",
    effectiveDate: "2026-08-03",
    jurisdiction: "India",
    legalName: "Kushagra Sharma",
  },
  features: {
    contactForm: false,
    newsletter: false,
    search: true,
  },
};
