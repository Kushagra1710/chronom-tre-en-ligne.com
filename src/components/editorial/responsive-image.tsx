import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type ResponsiveImageProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
  src: string;
};

export function ResponsiveImage({
  alt,
  className,
  imageClassName,
  priority = false,
  sizes,
  src,
}: ResponsiveImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-taupe", className)}>
      <Image
        alt={alt}
        className={cn("object-cover", imageClassName)}
        fill
        priority={priority}
        sizes={sizes}
        src={src}
        unoptimized={src.endsWith(".svg")}
      />
    </div>
  );
}
