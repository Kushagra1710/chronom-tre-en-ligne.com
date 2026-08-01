import Image from "next/image";

type ArticleImageProps = {
  alt: string;
  caption?: string;
  height?: number;
  src: string;
  width?: number;
};

function assertLocalImage(src: string, alt: string): void {
  if (!src.startsWith("/images/") || src.includes("..")) {
    throw new Error(`MDX image source must be a local /images/ path: ${src}`);
  }

  if (alt.trim().length === 0) {
    throw new Error(`MDX image requires meaningful alt text: ${src}`);
  }
}

export function ArticleImage({
  alt,
  caption,
  height = 1000,
  src,
  width = 800,
}: ArticleImageProps) {
  assertLocalImage(src, alt);

  return (
    <figure className="my-10">
      <div className="overflow-hidden bg-taupe">
        <Image
          alt={alt}
          className="h-auto w-full object-cover"
          height={height}
          sizes="(max-width: 767px) 100vw, 720px"
          src={src}
          unoptimized={src.endsWith(".svg")}
          width={width}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
