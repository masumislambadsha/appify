"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavLink = readonly [label: string, href: string];

/**
 * Mobile navigation disclosure for the site header. A dropdown panel (not a
 * modal drawer), so no focus trap or scroll-lock is needed — but it still
 * manages focus: opening moves to the first link, Escape closes and returns
 * to the trigger, and choosing a link closes the panel.
 */
export function MobileNav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const firstLinkRef = React.useRef<HTMLAnchorElement>(null);

  const close = React.useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close(true);
    }
  };

  return (
    <div className="md:hidden" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          // Focus the first link after the panel mounts.
          requestAnimationFrame(() => firstLinkRef.current?.focus());
        }}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sand-deep bg-cream-card text-olive-deep transition hover:border-brass dark:border-olive-deep dark:bg-olive-surface dark:text-cream"
      >
        {open ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-sand bg-cream/95 backdrop-blur dark:border-olive-deep dark:bg-olive-ink/95"
        >
          <ul className="container-x space-y-1 py-3">
            {links.map(([label, href], i) => (
              <li key={href + label}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  onClick={() => close()}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-olive-deep transition",
                    "hover:bg-sand-soft hover:text-olive-ink dark:text-cream/85 dark:hover:bg-olive-surface dark:hover:text-cream"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pb-1 pt-2">
              <Link
                href="/extension"
                onClick={() => close()}
                className="flex-1 rounded-xl border border-sand-deep px-3 py-2.5 text-center text-sm font-semibold text-olive-deep dark:border-olive-deep dark:text-cream"
              >
                Extension
              </Link>
              <Link
                href="/app"
                onClick={() => close()}
                className="btn-primary flex-1 !py-2.5 text-sm"
              >
                Open app
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
