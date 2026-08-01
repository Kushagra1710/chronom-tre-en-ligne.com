import type { ReactNode } from "react";

type ImageGroupProps = {
  children: ReactNode;
};

export function ImageGroup({ children }: ImageGroupProps) {
  return (
    <div className="my-10 grid gap-4 sm:grid-cols-2 [&>figure]:my-0">
      {children}
    </div>
  );
}
