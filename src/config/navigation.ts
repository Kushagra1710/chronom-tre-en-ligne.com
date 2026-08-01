export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Outfit Ideas", href: "/outfit-ideas" },
  { label: "Style Guides", href: "/style-guides" },
  { label: "Fashion Trends", href: "/fashion-trends" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  Explore: [
    { label: "Outfit Ideas", href: "/outfit-ideas" },
    { label: "Style Guides", href: "/style-guides" },
    { label: "Fashion Trends", href: "/fashion-trends" },
    { label: "Latest Posts", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
} satisfies Record<string, NavigationItem[]>;
