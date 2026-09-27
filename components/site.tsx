import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav, type NavLink } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  ["Features", "/#features"],
  ["Models", "/#models"],
  ["Preview", "/#preview"],
  ["Pricing", "/#pricing"],
  ["FAQ", "/#faq"],
] as const satisfies readonly NavLink[];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="EchoGPT home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-olive text-cream dark:bg-brass dark:text-olive-ink">
        <Sparkles size={18} strokeWidth={2.2} aria-hidden="true" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[18px] font-semibold tracking-tight text-olive-ink dark:text-cream">
            EchoGPT
          </span>
          <span className="block text-[11px] font-medium tracking-wide text-brass-deep dark:text-brass-bright">
            Multi-AI workspace
          </span>
        </span>
      )}
    </Link>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/85 backdrop-blur dark:border-olive-deep dark:bg-olive-ink/85">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex" aria-label="Primary">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href + label}
              href={href}
              className="rounded-lg px-3 py-2 text-olive-deep transition hover:bg-sand-soft hover:text-olive-ink dark:text-cream/85 dark:hover:bg-olive-surface dark:hover:text-cream"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/extension"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-olive-deep hover:text-brass-deep sm:block dark:text-cream/85 dark:hover:text-brass-bright"
          >
            Extension
          </Link>
          <Link href="/app" className="btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex">
            Open app
          </Link>
          <ThemeToggle />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-sand bg-cream-dim/60 dark:border-olive-deep dark:bg-olive-ink">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-olive-deep/80 dark:text-cream/70">
            Redesign concept for the AppifyDevs internship — one workspace to
            chat, compare, research and create across every major AI model.
          </p>
          <p className="mt-3 text-xs text-olive-deep/60 dark:text-cream/50">
            Mock demo: no API keys, history stays in your browser.
          </p>
        </div>
        <nav aria-label="Product">
          <p className="text-xs font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/app">Web app</Link></li>
            <li><Link className="hover:underline" href="/extension">Extension concept</Link></li>
            <li><Link className="hover:underline" href="/#models">Models</Link></li>
            <li><Link className="hover:underline" href="/#pricing">Pricing</Link></li>
          </ul>
        </nav>
        <nav aria-label="Resources">
          <p className="text-xs font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">Resources</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:underline" href="https://echogpt.live" target="_blank" rel="noreferrer">echogpt.live</a></li>
            <li><Link className="hover:underline" href="/#faq">FAQ</Link></li>
            <li><Link className="hover:underline" href="/app">Try the demo</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-sand dark:border-olive-deep">
        <div className="container-x flex flex-col justify-between gap-2 py-4 text-xs text-olive-deep/70 sm:flex-row dark:text-cream/60">
          <span>© 2026 EchoGPT redesign concept — built with Next.js + Tailwind.</span>
          <span>Palette: #F5EFE3 · #4F5B2A · #B8892D · #D8C9A8</span>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
  align = "center",
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-olive-ink sm:text-4xl dark:text-cream">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-[15px] leading-relaxed text-olive-deep/85 dark:text-cream/70">{sub}</p>
      )}
    </div>
  );
}
