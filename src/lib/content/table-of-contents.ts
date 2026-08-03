import GithubSlugger from "github-slugger";

export type TableOfContentsItem = {
  id: string;
  level: 2 | 3;
  text: string;
};

function headingText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1")
    .trim();
}

export function extractTableOfContents(source: string): TableOfContentsItem[] {
  const slugger = new GithubSlugger();
  const withoutCodeFences = source.replace(/```[\s\S]*?```/g, "");
  const items: TableOfContentsItem[] = [];

  for (const line of withoutCodeFences.split("\n")) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);

    if (!match?.[1] || !match[2]) {
      continue;
    }

    const level = match[1].length;
    const text = headingText(match[2]);

    if (!text) {
      continue;
    }

    const id = slugger.slug(text);

    if (level === 2 || level === 3) {
      items.push({ id, level, text });
    }
  }

  return items;
}
