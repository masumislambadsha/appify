"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  title: string;
  /** One-line explanation under the title in the list. */
  blurb?: string;
  /** Panel visual: JSX mockup, image/video URL, or plain text. */
  content: string | React.ReactNode;
  /** Alt text when content is an image URL. */
  alt?: string;
  /** Text on the button. No text, no button. */
  action?: string;
  /** Where the button goes. */
  href?: string;
}

function FeatureMedia({
  content,
  alt,
}: {
  content: string | React.ReactNode;
  alt?: string;
}) {
  if (typeof content !== "string") {
    return <div className="h-full w-full">{content}</div>;
  }

  const isVideo = /\.(mp4|webm|ogg)$/i.test(content);
  const isImage =
    /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(content) ||
    /unsplash|images\./i.test(content);

  if (isVideo) {
    return (
      <video
        src={content}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (isImage) {
    return (
      // Raw <img> is intentional: caller-provided remotes that next/image
      // cannot optimize without a loader config. Our items use JSX instead.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={content} alt={alt} className="h-full w-full object-cover" />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EchoGPT product mockups — pure JSX/CSS, no external assets.                */
/* -------------------------------------------------------------------------- */

/** Floating "Copied!" confirmation, like a clipboard toast. */
function CopyTip({
  show,
  label = "Copied!",
}: {
  show: boolean;
  label?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          role="status"
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 2, scale: 0.97 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-none absolute -top-2 right-2 z-10 flex -translate-y-full items-center gap-1.5 rounded-xl border border-sand-deep bg-cream-card px-2.5 py-1.5 text-[11px] font-bold text-olive-deep shadow-pop dark:border-olive-deep dark:bg-olive-surface dark:text-cream"
        >
          <span className="grid size-4 place-items-center rounded-full bg-olive text-cream dark:bg-brass dark:text-olive-ink">
            <Check size={10} strokeWidth={3.5} />
          </span>
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function MockCompare() {
  const cols = [
    {
      m: "GPT-6 Astra",
      t: "Balanced take with trade-offs and a next step.",
      win: true,
      time: "1.1s",
    },
    {
      m: "Claude Opus 5.5",
      t: "Careful read, assumptions stated plainly.",
      win: false,
      time: "1.4s",
    },
    {
      m: "DeepSeek V4.1",
      t: "Step-by-step, verified with an example.",
      win: false,
      time: "0.9s",
    },
  ];
  const [pick, setPick] = React.useState<string | null>("GPT-6 Astra");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard?.writeText(
        "Compare GPT-6 Astra, Claude Opus 5.5 and DeepSeek V4.1 side by side.",
      );
    } catch {
      /* clipboard unavailable — still confirm the gesture */
    }
    setCopied(true);
  };

  return (
    <div className="flex h-full flex-col gap-2 bg-cream-card p-4 dark:bg-olive-surface">
      <div className="grid flex-1 grid-cols-3 gap-2">
        {cols.map((c) => (
          <div
            key={c.m}
            className={cn(
              "flex flex-col rounded-xl border p-2.5 text-left",
              c.win
                ? "border-brass bg-brass-soft/50 dark:bg-olive-deep"
                : "border-sand dark:border-olive-deep",
            )}
          >
            <p className="flex items-center justify-between text-[10px] font-bold">
              {c.m}
              {c.win && (
                <span className="rounded-full bg-brass px-1.5 py-px text-[9px] text-olive-ink">
                  ★
                </span>
              )}
            </p>
            <p className="mt-1 text-[10px] leading-snug text-olive-deep/80 dark:text-cream/75">
              {c.t}
            </p>
            <div className="mt-2 animate-pulse space-y-1.5" aria-hidden="true">
              {[92, 76, 86].map((w) => (
                <div
                  key={w}
                  className="h-1.5 rounded-full bg-olive/10 dark:bg-cream/10"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-[9px] font-semibold text-olive-deep/75 dark:text-cream/60">
                {c.time}
              </span>
              <button
                type="button"
                onClick={() => setPick(c.m)}
                aria-pressed={pick === c.m}
                aria-label={`Vote ${c.m} as clearest`}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold transition",
                  pick === c.m
                    ? "bg-brass text-olive-ink"
                    : "text-olive-deep/55 hover:bg-olive/10 hover:text-olive-deep dark:text-cream/50 dark:hover:bg-cream/10 dark:hover:text-cream",
                )}
              >
                {pick === c.m ? "★ your pick" : "pick"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        <CopyTip show={copied} />
        <div className="input-shell flex items-center gap-2 px-3 py-2 text-[11px] text-olive-deep/60 dark:text-cream/50">
          <span className="flex-1 truncate">Ask once, compare all…</span>
          <button
            type="button"
            onClick={copyPrompt}
            aria-label="Copy sample prompt"
            className="flex shrink-0 items-center gap-1 rounded-lg border border-sand-deep px-2 py-1 text-[10px] font-bold text-olive-deep transition hover:border-brass hover:text-brass-deep dark:border-olive-deep dark:text-cream/70 dark:hover:border-brass-bright dark:hover:text-brass-bright"
          >
            <Copy size={11} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

function MockDoc() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden bg-cream-card p-4 dark:bg-olive-surface">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
        Report.pdf · 40 pages
      </p>
      {[
        "Market expanded 18% YoY",
        "Churn concentrated in tier-2",
        "Pricing is the top complaint",
        "Expansion beats new logos 2:1",
      ].map((b) => (
        <p
          key={b}
          className="rounded-lg border border-sand bg-cream px-2.5 py-1.5 text-[11px] dark:border-olive-deep dark:bg-olive-ink"
        >
          • {b}
        </p>
      ))}
      <div className="mt-auto">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-olive/10 dark:bg-cream/10"
          role="progressbar"
          aria-valuenow={68}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        >
          <div className="h-full w-2/3 rounded-full bg-brass" />
        </div>
        <p className="mt-1.5 text-[10px] font-semibold text-olive-deep/60 dark:text-cream/50">
          Reading… 68% · 5 bullets · 2 action items
        </p>
      </div>
    </div>
  );
}

function MockCode() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-olive-ink p-4 font-mono text-[11px] leading-relaxed dark:bg-black/40">
      <p className="text-cream/40">{"import { useEffect } from 'react';"}</p>
      <p className="text-cream/40">{"// infinite re-render — found it"}</p>
      <p>
        <span className="text-brass-bright">useEffect</span>
        <span className="text-cream/85">{"(() => { fetch(); }"}</span>
      </p>
      <p className="text-cream/85">
        {"}, []) "}
        <span className="text-cream/40">← deps were missing</span>
      </p>
      <p className="text-cream/40">{"// 3 renders → 1. Ship it."}</p>
      <p className="mt-auto pt-2 font-sans text-[10px] font-semibold text-cream/45">
        Explained 6 lines · 1 bug fixed
      </p>
      <p className="mt-2 inline-block rounded-md bg-brass px-2 py-0.5 font-sans text-[10px] font-bold text-olive-ink">
        ✓ Fixed + explained line by line
      </p>
    </div>
  );
}

function MockResearch() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden bg-cream-card p-4 dark:bg-olive-surface">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
        Web-grounded · 3 sources
      </p>
      {[
        "GLP-1 trials 2024–26, compared",
        "Dosage tables, cited",
        "Sample sizes cross-checked",
        "Contradictions flagged ×2",
      ].map((r) => (
        <p
          key={r}
          className="flex items-center gap-2 rounded-lg border border-sand bg-cream px-2.5 py-1.5 text-[11px] dark:border-olive-deep dark:bg-olive-ink"
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-olive text-[9px] text-cream dark:bg-brass dark:text-olive-ink">
            ✓
          </span>
          {r}
        </p>
      ))}
      <p className="mt-auto text-[10px] font-semibold text-olive-deep/60 dark:text-cream/50">
        Verified 2m ago · 3 sources cited
      </p>
    </div>
  );
}

function MockSidebar() {
  return (
    <div className="flex h-full flex-col gap-2 bg-cream-dim/60 p-4 dark:bg-olive-ink">
      <div className="flex gap-1.5">
        {["Chat", "Tools", "History"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-lg px-2 py-1 text-[10px] font-bold",
              i === 0 ? "bg-olive text-cream" : "bg-sand-soft text-olive-deep",
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-olive px-2.5 py-1.5 text-[11px] text-cream dark:bg-brass dark:text-olive-ink">
        tl;dr this pricing page?
      </p>
      <p className="rounded-xl rounded-bl-sm border border-sand bg-cream-card px-2.5 py-2 text-[11px] dark:border-olive-deep dark:bg-olive-surface">
        This page in 3 bullets: pricing starts at $12, annual saves 20%…
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5" aria-hidden="true">
        {["Summarize", "Explain", "Rewrite"].map((q) => (
          <span
            key={q}
            className="rounded-full border border-sand-deep/70 px-2 py-0.5 text-[10px] font-semibold text-olive-deep dark:border-olive-deep dark:text-cream/70"
          >
            {q}
          </span>
        ))}
      </div>
      <p className="mt-auto font-mono text-[10px] text-olive-deep/75 dark:text-cream/60">
        Ctrl/⌘ + Shift + E anywhere
      </p>
    </div>
  );
}

const DEFAULT_ITEMS: FeatureItem[] = [
  {
    title: "Compare ×3",
    blurb: "Ask once, keep the clearest answer.",
    content: <MockCompare />,
    action: "Open the workspace",
    href: "/app",
  },
  {
    title: "PDFs in, briefs out",
    blurb: "40 pages become 5 bullets + actions.",
    content: <MockDoc />,
    action: "Try it",
    href: "/app?cat=pdf",
  },
  {
    title: "Code, debugged",
    blurb: "Generate, explain and fix with citations of lines.",
    content: <MockCode />,
    action: "Try it",
    href: "/app?cat=coding",
  },
  {
    title: "Research with receipts",
    blurb: "Live web grounding, contradictions flagged.",
    content: <MockResearch />,
    action: "Try it",
    href: "/app?cat=research",
  },
  {
    title: "A sidebar where you browse",
    blurb: "Summarize and explain without leaving the tab.",
    content: <MockSidebar />,
    action: "See the concept",
    href: "/extension",
  },
];

export interface FeaturesWithPanelProps {
  eyebrow?: string;
  title?: string;
  sub?: string;
  items?: FeatureItem[];
  /** Advance automatically. Default `true`. */
  autoplay?: boolean;
  /** Milliseconds a panel stays open under autoplay. Default `5000`. */
  interval?: number;
}

/** Reduced-motion flag without setState-in-effect (SSR-safe). */
function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export default function FeaturesWithPanel({
  eyebrow = "Featured",
  title = "Five workflows, zero tab-hopping.",
  sub = "Sit back — the tour plays itself. Click any step to jump in; every panel opens live in the workspace or the extension.",
  items = DEFAULT_ITEMS,
  autoplay = true,
  interval = 3500,
}: FeaturesWithPanelProps) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();
  const safeActive = Math.min(active, items.length - 1);
  const shown = items[safeActive];

  React.useEffect(() => {
    if (!autoplay || paused || reduced || items.length < 2) return;
    const timer = window.setTimeout(() => {
      setActive((a) => (a + 1) % items.length);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [autoplay, paused, reduced, items.length, interval, active]);

  return (
    <section
      className="relative w-full py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center justify-center">
          <div>
            <p className="section-kicker">{eyebrow}</p>
            <h2 className="mb-10 mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
            {sub && (
              <p className="-mt-6 mb-10 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {sub}
              </p>
            )}

            <ul className="flex flex-col gap-1">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-xl px-4 py-3.5 transition-all duration-200 lg:flex-row lg:items-center lg:gap-4",
                    active === index
                      ? "bg-card shadow-card ring-1 ring-foreground"
                      : "ring-1 ring-transparent",
                  )}
                >
                  <div className="flex w-full flex-row items-center gap-4 lg:contents">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200",
                        active === index
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex flex-col">
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          active === index
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.title}
                      </span>
                      {item.blurb && (
                        <span className="text-xs text-muted-foreground">
                          {item.blurb}
                        </span>
                      )}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {active === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full overflow-hidden lg:hidden"
                      >
                        <Card className="relative mt-3 aspect-[4/3] w-full gap-0 overflow-hidden p-0 shadow-pop">
                          <div className="absolute inset-0">
                            <FeatureMedia
                              content={item.content}
                              alt={item.title}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="sticky top-10 hidden lg:block">
            <Card className="relative aspect-[4/3] w-full gap-0 overflow-hidden p-0 shadow-pop">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeActive}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <FeatureMedia content={shown.content} alt={shown.title} />
                </motion.div>
              </AnimatePresence>
            </Card>
            {shown.action && shown.href && (
              <a
                href={shown.href}
                className="btn-primary mt-4 inline-flex text-sm"
              >
                {shown.action}
              </a>
            )}
            {autoplay && !reduced && (
              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-olive/10 dark:bg-cream/10"
                aria-hidden="true"
              >
                <div
                  key={safeActive}
                  className="h-full origin-left rounded-full bg-brass"
                  style={{
                    animation: `tour-progress ${interval}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
