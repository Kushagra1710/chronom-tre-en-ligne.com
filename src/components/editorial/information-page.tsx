import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd } from "@/lib/seo/structured-data";

type InformationPageProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  path: string;
  title: string;
};

export function InformationPage({
  children,
  description,
  eyebrow,
  path,
  title,
}: InformationPageProps) {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />
      <main className="flex-1" id="main-content">
        <header className="border-b border-border bg-surface">
          <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:py-28">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                {eyebrow}
              </p>
              <h1 className="mt-5 text-title text-ink">{title}</h1>
            </div>
            <p className="max-w-xl border-l border-gold pl-6 text-base leading-8 text-ink-muted sm:text-lg">
              {description}
            </p>
          </Container>
        </header>
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-article space-y-12 text-base leading-8 text-ink-muted sm:text-[1.05rem] [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-ink sm:[&_h2]:text-4xl [&_p+p]:mt-4">
            {children}
          </div>
        </Container>
      </main>
    </>
  );
}
