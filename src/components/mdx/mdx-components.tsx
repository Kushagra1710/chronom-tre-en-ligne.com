import type { MDXComponents } from "mdx/types";

import { ArticleImage } from "./article-image";
import { AffiliateNotice } from "./affiliate-notice";
import { Callout } from "./callout";
import { Divider } from "./divider";
import { ImageGroup } from "./image-group";

function isSafeLink(href: string): boolean {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  );
}

export const mdxComponents = {
  a: ({ href = "", ...props }) => {
    if (!isSafeLink(href)) {
      throw new Error(`Unsupported link protocol in MDX: ${href}`);
    }

    const isExternal = href.startsWith("https://");

    return (
      <a
        {...props}
        className="font-semibold text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:text-accent-dark"
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-ink sm:text-3xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2 className="mb-5 mt-14 scroll-mt-28 text-4xl leading-tight text-ink" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-4 mt-10 scroll-mt-28 text-3xl leading-tight text-ink" {...props} />
  ),
  hr: () => <Divider />,
  img: ({ alt = "", src = "" }) => (
    <ArticleImage alt={alt} src={typeof src === "string" ? src : ""} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  ol: (props) => (
    <ol className="my-6 list-decimal space-y-3 pl-6 leading-8 text-ink-muted" {...props} />
  ),
  p: (props) => <p className="my-5 leading-8 text-ink-muted" {...props} />,
  table: (props) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  td: (props) => <td className="border-b border-border px-4 py-3" {...props} />,
  th: (props) => (
    <th
      className="border-b border-ink bg-surface px-4 py-3 text-xs font-bold uppercase tracking-[0.12em]"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-6 list-disc space-y-3 pl-6 leading-8 text-ink-muted" {...props} />
  ),
  AffiliateNotice,
  ArticleImage,
  Callout,
  Divider,
  ImageGroup,
} satisfies MDXComponents;
