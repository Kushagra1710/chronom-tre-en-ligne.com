import { siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toUTCString();
}

export async function GET() {
  const posts = await getAllPublishedPosts();
  const latestDate = posts
    .map((post) => post.updatedAt ?? post.publishedAt)
    .sort((left, right) => right.localeCompare(left))[0] ?? siteConfig.lastUpdated;
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${toRssDate(post.publishedAt)}</pubDate>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.language)}</language>
    <lastBuildDate>${toRssDate(latestDate)}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
