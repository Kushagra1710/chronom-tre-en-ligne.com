import Link from "next/link";

import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { PinterestIcon, SearchIcon } from "../ui/icons";
import { Container } from "./container";
import { MobileNavigation } from "./mobile-navigation";
import { TextLogo } from "./text-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/95 backdrop-blur-sm">
      <a
        className="absolute left-4 top-0 z-[60] -translate-y-full bg-ink px-4 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-2"
        href="#main-content"
      >
        Skip to content
      </a>
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <TextLogo />

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                {item.available === false ? (
                  <span
                    aria-disabled="true"
                    className="py-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink-muted/60"
                    title={`${item.label} coming in a later phase`}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    className="relative py-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:origin-left hover:after:scale-x-100"
                    href={item.href}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            aria-label="Search Wearlivo"
            className="grid size-10 place-items-center text-ink transition-colors hover:text-accent"
            href="/search"
            prefetch={false}
          >
            <SearchIcon className="size-[1.15rem]" />
          </Link>
          {siteConfig.social.pinterest ? (
            <a
              aria-label="Wearlivo on Pinterest"
              className="grid size-10 place-items-center text-ink transition-colors hover:text-accent"
              href={siteConfig.social.pinterest}
              rel="noopener noreferrer"
              target="_blank"
            >
              <PinterestIcon className="size-[1.15rem]" />
            </a>
          ) : (
            <span
              aria-disabled="true"
              aria-label="Pinterest profile will be available soon"
              className="grid size-10 place-items-center text-ink-muted"
              title="Pinterest profile coming soon"
            >
              <PinterestIcon className="size-[1.15rem]" />
            </span>
          )}
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
