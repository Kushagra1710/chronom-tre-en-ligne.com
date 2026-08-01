import { Container } from "@/components/layout/container";

export function NewsletterPlaceholder() {
  return (
    <section className="border-y border-border bg-surface py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              The inbox edit
            </p>
            <h2 className="mt-5 text-section text-ink">Your Weekly Style Drop</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted sm:text-lg">
              Get new outfit ideas, practical style tips and trends straight to
              your inbox.
            </p>
          </div>

          <form aria-describedby="newsletter-status">
            <fieldset disabled>
              <label
                className="text-xs font-bold uppercase tracking-[0.16em] text-ink"
                htmlFor="newsletter-email"
              >
                Email address
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  className="min-h-13 flex-1 border border-border bg-canvas px-4 text-ink placeholder:text-ink-muted/70 disabled:cursor-not-allowed disabled:opacity-75"
                  id="newsletter-email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
                <button
                  className="min-h-13 border border-ink bg-ink px-6 text-xs font-bold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-55"
                  type="submit"
                >
                  Subscribe
                </button>
              </div>
            </fieldset>
            <p className="mt-3 text-xs leading-5 text-ink-muted" id="newsletter-status">
              Preview only—email delivery is not connected yet. No information
              is collected.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
