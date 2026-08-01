import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CalloutTone = "caution" | "note" | "tip";

const toneClasses: Record<CalloutTone, string> = {
  caution: "border-gold bg-gold/10",
  note: "border-taupe bg-surface",
  tip: "border-accent bg-accent/5",
};

type CalloutProps = {
  children: ReactNode;
  title?: string;
  tone?: CalloutTone;
};

export function Callout({ children, title, tone = "note" }: CalloutProps) {
  return (
    <aside
      className={cn("my-8 border-l-4 px-5 py-4 sm:px-6", toneClasses[tone])}
    >
      {title ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          {title}
        </p>
      ) : null}
      <div className="text-sm leading-7 text-ink-muted sm:text-base [&>p]:my-0">
        {children}
      </div>
    </aside>
  );
}
