export const AD_PLACEMENTS = [
  "article-after-introduction",
  "article-middle",
  "article-end",
  "article-sidebar",
  "home-between-sections",
  "archive-lower",
] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number];

type AdvertisingConfig = {
  enabled: boolean;
  provider: null;
  showDevelopmentPlaceholders: boolean;
};

export const ads: AdvertisingConfig = {
  enabled: false,
  provider: null,
  showDevelopmentPlaceholders: true,
};
