import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.url,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
