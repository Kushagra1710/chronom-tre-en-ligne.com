import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-5 py-20 text-center sm:px-8 lg:py-28" id="main-content">
      <div className="max-w-3xl">
        <p className="font-display text-[clamp(6rem,20vw,12rem)] leading-none text-taupe">
          404
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-accent">
          This look is off the rack
        </p>
        <h1 className="mt-5 text-title text-ink">The story is not in this edit.</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
          It may still be on the editorial desk, or the address may have changed.
          There is plenty more to explore.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/blog" variant="secondary">
            Browse the blog
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
