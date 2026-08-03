"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { CloseIcon, MenuIcon, PinterestIcon, SearchIcon } from "../ui/icons";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={menuButtonRef}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="grid size-11 place-items-center border border-border text-ink transition-colors hover:border-ink"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        {isOpen ? (
          <CloseIcon className="size-5" />
        ) : (
          <MenuIcon className="size-5" />
        )}
      </button>

      {isOpen ? (
        <div
          className="animate-menu-in absolute inset-x-0 top-full z-50 min-h-[calc(100vh-5rem)] border-t border-border bg-canvas px-5 py-8 sm:min-h-[calc(100vh-6rem)] sm:px-8"
          id={menuId}
        >
          <nav aria-label="Mobile navigation">
            <ul className="divide-y divide-border border-y border-border">
              {primaryNavigation.map((item, index) => (
                <li key={item.href}>
                  {item.available === false ? (
                    <span
                      aria-disabled="true"
                      className="flex min-h-14 items-center justify-between py-4 font-display text-3xl text-ink-muted/55"
                    >
                      {item.label}
                      <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.12em]">
                        Soon
                      </span>
                    </span>
                  ) : (
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      className="flex min-h-14 items-center justify-between py-4 font-display text-3xl text-ink transition-colors hover:text-accent"
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      prefetch={false}
                    >
                      {item.label}
                      <span className="font-sans text-xs text-ink-muted">
                        0{index + 1}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              className="flex min-h-12 items-center justify-center gap-2 border border-border text-xs font-bold uppercase tracking-[0.14em] text-ink-muted"
              href="/search"
              onClick={() => setIsOpen(false)}
              prefetch={false}
            >
              <SearchIcon className="size-4" />
              Search
            </Link>
            {siteConfig.social.pinterest ? (
              <a
                className="flex min-h-12 items-center justify-center gap-2 border border-border text-xs font-bold uppercase tracking-[0.14em]"
                href={siteConfig.social.pinterest}
                rel="noopener noreferrer"
                target="_blank"
              >
                <PinterestIcon className="size-4" />
                Pinterest
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="flex min-h-12 items-center justify-center gap-2 border border-border text-xs font-bold uppercase tracking-[0.14em] text-ink-muted"
              >
                <PinterestIcon className="size-4" />
                Pinterest soon
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
