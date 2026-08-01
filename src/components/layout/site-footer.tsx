import Link from "next/link";

import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { ChevronUpIcon, PinterestIcon } from "../ui/icons";
import { Container } from "./container";
import { TextLogo } from "./text-logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-14 border-b border-white/15 pb-14 lg:grid-cols-[1.5fr_2fr] lg:gap-20 lg:pb-20">
          <div>
            <TextLogo inverse />
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/65 sm:text-base">
              Affordable outfit inspiration, practical style guides and wearable
              trends for everyday life.
            </p>
            <div className="mt-8">
              {siteConfig.social.pinterest ? (
                <a
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:text-gold"
                  href={siteConfig.social.pinterest}
                  rel="noreferrer"
                  target="_blank"
                >
                  <PinterestIcon className="size-5" />
                  Pinterest
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45"
                  role="link"
                  tabIndex={0}
                >
                  <PinterestIcon className="size-5" />
                  Pinterest coming soon
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {Object.entries(footerNavigation).map(([group, items]) => (
              <div key={group}>
                <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {group}
                </h2>
                <ul className="mt-6 space-y-4">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-sm text-white/70 transition-colors hover:text-white"
                        href={item.href}
                        prefetch={false}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Wearlivo. All rights reserved.</p>
          <a
            className="inline-flex min-h-11 items-center gap-2 self-start font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-gold sm:self-auto"
            href="#top"
          >
            Back to top
            <ChevronUpIcon className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
