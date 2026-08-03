import { PinterestIcon } from "@/components/ui/icons";

type ShareLinksProps = {
  canonicalUrl: string;
  coverImageUrl: string;
  title: string;
};

const linkClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-border px-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";

export function ShareLinks({ canonicalUrl, coverImageUrl, title }: ShareLinksProps) {
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(title);
  const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(coverImageUrl)}&description=${encodedTitle}`;
  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <section aria-label="Share this article" className="border-t border-border pt-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
        Share this story
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          aria-label={`Share ${title} on Pinterest`}
          className={linkClasses}
          href={pinterestUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <PinterestIcon className="size-4" />
          Pinterest
        </a>
        <a
          aria-label={`Share ${title} on X`}
          className={linkClasses}
          href={xUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          X
        </a>
        <a
          aria-label={`Share ${title} on LinkedIn`}
          className={linkClasses}
          href={linkedInUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
