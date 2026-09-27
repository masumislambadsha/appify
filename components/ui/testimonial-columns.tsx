"use client";

import { type CSSProperties } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarqueeTestimonial {
  name: string;
  role: string;
  text: string;
}

export const ECHO_TESTIMONIALS: MarqueeTestimonial[] = [
  { name: "Nusrat J.", role: "Masters student, DU", text: "Compare mode ended my tab-hopping. I ask once and pick the clearest of three answers for citations." },
  { name: "Tanvir H.", role: "Frontend dev, Dhaka", text: "The coding assistant with two flagships side by side cut my debugging time in half. The prompt enhancer is underrated." },
  { name: "Priya S.", role: "Content strategist", text: "Finally a calm UI. Cream and olive is easy on the eyes for 6-hour writing days, and dark mode is actually good." },
  { name: "Rahim U.", role: "Research analyst", text: "PDF analysis plus web fetch in one place. I summarize 40-page reports before my coffee cools." },
  { name: "Maya K.", role: "Founder", text: "The slide outline took my rough notes to an investor-ready deck in minutes. The extension summarize is my daily driver." },
  { name: "Daniel O.", role: "CS undergrad", text: "Keyboard-first, fast, accessible. Screen-reader labels and focus states show real craft." },
  { name: "Sadia A.", role: "Product designer", text: "The glass hero got me in; the compare workspace kept me. Voting for the clearest answer is weirdly satisfying." },
  { name: "Karim M.", role: "Data analyst", text: "I paste messy CSV questions in plain English and get chart explanations back. The follow-up chips do my thinking for me." },
  { name: "Elena R.", role: "PhD researcher", text: "Grounded research with flagged contradictions replaced three tools for me. Citations I can actually check." },
];

const AVATARS = [
  "bg-olive text-cream dark:bg-brass dark:text-olive-ink",
  "bg-brass text-olive-ink",
  "bg-sand-deep text-olive-ink dark:bg-olive-deep dark:text-cream",
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function QuoteCard({ t, index }: { t: MarqueeTestimonial; index: number }) {
  return (
    <figure className="w-full max-w-xs rounded-2xl border border-sand bg-cream-card p-5 shadow-card dark:border-olive-deep dark:bg-olive-surface">
      <div className="flex gap-0.5 text-brass-deep dark:text-brass" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill="currentColor" aria-hidden="true" />
        ))}
      </div>
      <blockquote className="mt-2.5 text-sm leading-relaxed text-foreground/90">
        “{t.text}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold",
            AVATARS[index % AVATARS.length],
          )}
        >
          {initials(t.name)}
        </span>
        <span>
          <span className="block text-[13px] font-bold">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 28,
}: {
  className?: string;
  testimonials: MarqueeTestimonial[];
  duration?: number;
}) {
  return (
    // CSS-driven loop (see .marquee-track in globals.css): pausable on
    // hover/focus and fully stopped for reduced-motion — a rAF loop can't
    // do either without extra bookkeeping, and this ships zero JS per frame.
    <div className={cn("marquee", className)}>
      <div
        className="marquee-track flex flex-col gap-5 pb-5"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {testimonials.map((t, i) => (
          <QuoteCard key={t.name} t={t} index={i} />
        ))}
        {/* Second copy closes the -50% loop. Hidden from assistive tech
            so screen readers hear nine testimonials, not eighteen. */}
        <div aria-hidden="true" className="flex flex-col gap-5">
          {testimonials.map((t, i) => (
            <QuoteCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee({
  eyebrow = "Testimonials",
  title = "Loved by students, devs & teams",
  sub = "Nine voices from the demo — drifting by on their own. Hover to read at your pace.",
  items = ECHO_TESTIMONIALS,
}: {
  eyebrow?: string;
  title?: string;
  sub?: string;
  items?: MarqueeTestimonial[];
}) {
  const columns = [
    items.slice(0, 3),
    items.slice(3, 6),
    items.slice(6, 9),
  ];
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-kicker">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {sub && (
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {sub}
          </p>
        )}
      </div>
      <div className="mt-10 flex max-h-[760px] justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <TestimonialsColumn testimonials={columns[0]} duration={26} />
        <TestimonialsColumn
          testimonials={columns[1]}
          duration={32}
          className="hidden md:block"
        />
        <TestimonialsColumn
          testimonials={columns[2]}
          duration={29}
          className="hidden lg:block"
        />
      </div>
    </div>
  );
}
