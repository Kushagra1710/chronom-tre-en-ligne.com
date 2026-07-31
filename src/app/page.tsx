import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl border-y border-border py-16 text-center sm:py-20">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Project foundation
        </p>
        <h1 className="text-title text-balance text-ink">{siteConfig.name}</h1>
        <p className="mt-4 text-lg text-ink-muted sm:text-xl">
          {siteConfig.tagline}
        </p>
        <p className="mx-auto mt-8 max-w-xl leading-7 text-ink-muted">
          The Wearlivo design and application foundation is ready. The editorial
          homepage will be created in Phase 2.
        </p>
      </div>
    </main>
  );
}
