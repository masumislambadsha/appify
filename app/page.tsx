import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Columns2,
  FileText,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  PenLine,
  Puzzle,
  Search,
  Presentation,
  Sparkles,
} from "lucide-react";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site";
import { Reveal } from "@/components/ui/reveal";
import GlassHeadlineHero from "@/components/ui/glass-headline-hero";
import FeaturesWithPanel from "@/components/ui/features-with-panel";
import { Pricing, ECHO_PLANS } from "@/components/ui/pricing";
import { TestimonialsMarquee } from "@/components/ui/testimonial-columns";
import { PreviewShowcase } from "@/components/preview-showcase";
import { FaqTabs } from "@/components/ui/faq-tabs";
import { FlowGradient } from "@/components/flow-gradient";
import { CATEGORIES, MODELS } from "@/lib/data";

const CAT_ICONS: Record<string, React.ReactNode> = {
  "💬": <MessageSquare size={18} aria-hidden="true" />,
  "✍️": <PenLine size={18} aria-hidden="true" />,
  "📄": <FileText size={18} aria-hidden="true" />,
  "💻": <Code2 size={18} aria-hidden="true" />,
  "🔎": <Search size={18} aria-hidden="true" />,
  "🖼️": <ImageIcon size={18} aria-hidden="true" />,
  "📊": <Presentation size={18} aria-hidden="true" />,
  "✨": <Sparkles size={18} aria-hidden="true" />,
  "🌐": <Globe size={18} aria-hidden="true" />,
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream text-olive-ink dark:bg-olive-ink dark:text-cream">
      <SiteNav />
      <main id="main">
        {/* HERO — refractive glass headline. Field speaks the brand palette:
            olive-ink ground, olive / brass / sand bands, cream light —
            so the hero melts into the cream sections below. */}
        <GlassHeadlineHero
          eyebrow="EchoGPT · Web app + Chrome extension"
          title="One prompt. Every AI answer."
          description="Stop tab-hopping between GPT, Claude, Gemini, Grok and DeepSeek. EchoGPT asks once and answers side by side — then summarizes PDFs, debugs code, builds slides and sharpens your prompts."
          primaryAction={{ label: "Open the web app", href: "/app" }}
          secondaryAction={{ label: "Get the extension", href: "/extension" }}
          colors={["#15180E", "#4F5B2A", "#B8892D", "#D8C9A8", "#F5EFE3"]}
          height="92svh"
          className="hero-glass"
        />

        {/* Product proof band */}
        <section className="container-x grid items-center gap-8 py-14 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {/* NOTE: no role="img" here on purpose — the cards below are
                real text, and role="img" would hide all of it from
                screen readers. Decorative dots are empty spans. */}
            <Reveal index={1} className="card overflow-hidden shadow-pop">
              <div className="flex items-center gap-1.5 border-b border-sand bg-cream-dim/50 px-4 py-3 dark:border-olive-deep dark:bg-olive-surface">
                <span className="h-2.5 w-2.5 rounded-full bg-brass" />
                <span className="h-2.5 w-2.5 rounded-full bg-sand-deep" />
                <span className="h-2.5 w-2.5 rounded-full bg-olive" />
                <span className="ml-2 rounded-md bg-olive px-2 py-0.5 text-[11px] font-bold text-cream">
                  echogpt / app
                </span>
                <span className="ml-auto hidden items-center gap-1 rounded-full border border-brass/50 px-2 py-0.5 text-[11px] font-semibold text-brass-deep sm:flex dark:text-brass-bright">
                  <Columns2 size={12} aria-hidden="true" /> Compare ×3
                </span>
              </div>
              <div className="grid gap-3 bg-cream-card p-4 sm:grid-cols-3 dark:bg-olive-ink">
                {[
                  { m: "GPT-6 Astra", t: "Agentic answer with trade-offs + next step you can copy.", win: true },
                  { m: "Claude Opus 5.5", t: "Careful, Fable-class take with assumptions stated plainly." },
                  { m: "DeepSeek V4.1", t: "Step-by-step reasoning with a worked example." },
                ].map((c) => (
                  <div
                    key={c.m}
                    className={`rounded-xl border p-3 text-left ${
                      c.win
                        ? "border-brass bg-brass-soft/40 dark:bg-olive-surface"
                        : "border-sand bg-cream dark:border-olive-deep dark:bg-olive-surface/60"
                    }`}
                  >
                    <p className="flex items-center justify-between text-[11px] font-bold">
                      {c.m}
                      {c.win && (
                        <span className="rounded-full bg-brass px-1.5 py-0.5 text-[10px] text-olive-ink">
                          ★ clearest
                        </span>
                      )}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-olive-deep dark:text-cream/80">{c.t}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand p-3 dark:border-olive-deep">
                <div className="input-shell flex items-center gap-2 px-3 py-2.5">
                  <span className="text-xs text-olive-deep/60 dark:text-cream/50">Ask once, compare all…</span>
                  <span className="ml-auto grid h-7 w-7 place-items-center rounded-lg bg-olive text-cream dark:bg-brass dark:text-olive-ink">
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-2">
            <p className="section-kicker">Why it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-olive-ink dark:text-cream">
              Ask once, compare everything
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-olive-deep/85 dark:text-cream/70">
              Single-model tools make you guess. EchoGPT asks once across every
              frontier model and lets you continue with the winner.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                ["6", "AI models"],
                ["9", "Workflows"],
                ["0", "Keys needed"],
              ].map(([v, l]) => (
                <div key={l} className="card px-2 py-3">
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl font-semibold text-olive-ink dark:text-cream">{v}</dd>
                  <dd className="text-[11px] font-medium text-olive-deep/75 dark:text-cream/65">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/app" className="btn-primary !py-2.5 text-sm">
                Open the workspace <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="#features" className="btn-secondary !py-2.5 text-sm">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED — interactive product tour on a dark showcase band */}
        <div className="dark bg-olive-ink">
          <FeaturesWithPanel />
        </div>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-20 py-14">
          <div className="container-x">
            <SectionHeading
              kicker="Features"
              title="Nine workflows, one input box"
              sub="Every category from the original platform — rebuilt with consistent cards, pre-filled prompts and one-click switching."
            />
            <div className="mt-10 overflow-hidden rounded-2xl border border-sand bg-sand shadow-card dark:border-olive-deep dark:bg-olive-deep">
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((c, i) => (
                  <Reveal
                    as="article"
                    key={c.id}
                    index={i % 3}
                    className="group bg-cream-card p-6 transition-colors duration-200 hover:bg-cream-dim/70 sm:p-7 dark:bg-olive-surface dark:hover:bg-olive-deep/70"
                  >
                    <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-olive-ink dark:text-cream">
                      <span className="shrink-0 text-brass-deep transition-colors group-hover:text-brass dark:text-brass-bright">
                        {CAT_ICONS[c.icon] ?? <Sparkles size={17} aria-hidden="true" />}
                      </span>
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-deep/80 dark:text-cream/70">
                      {c.desc}
                    </p>
                    <Link
                      href={`/app?cat=${c.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brass-deep hover:underline dark:text-brass-bright"
                    >
                      Try it{" "}
                      <ArrowRight
                        size={13}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MODELS */}
        <section id="models" className="scroll-mt-20 border-y border-sand bg-cream-dim/50 py-14 dark:border-olive-deep dark:bg-olive-surface/40">
          <div className="container-x">
            <SectionHeading
              kicker="AI Models"
              title="Pick the right brain for the job"
              sub="Per-chat model switching plus side-by-side comparison. Personalities below are mirrored in the mock engine."
            />
            <div className="mt-10 overflow-hidden rounded-2xl border border-sand bg-cream-card shadow-card dark:border-olive-deep dark:bg-olive-surface">
              <ul className="divide-y divide-sand dark:divide-olive-deep">
                {MODELS.map((m, i) => (
                  <Reveal as="li" key={m.id} index={i % 3}>
                    <Link
                      href="/app"
                      className="group grid gap-x-6 gap-y-2 p-5 transition-colors duration-200 hover:bg-cream-dim/60 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:p-6 dark:hover:bg-olive-deep/60"
                    >
                      <span className="hidden font-mono text-xs font-semibold tracking-widest text-brass-deep sm:block dark:text-brass-bright">
                        0{i + 1}
                      </span>
                      <span className="min-w-0 space-y-1.5">
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="h-4 w-4 shrink-0 rounded-full ring-2 ring-cream transition-transform group-hover:scale-110 dark:ring-olive-ink"
                            style={{ background: m.color }}
                          />
                          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[15px] font-bold text-olive-ink dark:text-cream">
                              {m.name}
                            </span>
                            {m.badge && (
                              <span className="shrink-0 rounded-full bg-brass px-2 py-px text-[10px] font-bold text-olive-ink">
                                {m.badge}
                              </span>
                            )}
                          </span>
                        </span>
                        <span className="block text-xs text-olive-deep/60 dark:text-cream/55">
                          {m.vendor}
                        </span>
                        <span className="block text-sm leading-relaxed text-olive-deep/85 dark:text-cream/75">
                          {m.tagline}
                        </span>
                        <span className="block text-[11px] font-medium tracking-wide text-olive-deep/60 dark:text-cream/50">
                          {m.strengths.join("  ·  ")}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="hidden shrink-0 text-brass-deep transition-transform duration-200 group-hover:translate-x-1 sm:block dark:text-brass-bright"
                      />
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PREVIEW — dark showcase band, same language as Featured */}
        <div className="dark bg-olive-ink">
        <section id="preview" className="scroll-mt-20 py-14">
          <div className="container-x">
            <SectionHeading
              kicker="Product preview"
              title="Designed for focus, built for speed"
              sub="Real screens from the demo — not stock mockups. Open the app to interact with all of these."
            />
            <div className="mt-8">
              <PreviewShowcase />
            </div>
          </div>
        </section>
        </div>

        {/* WHY */}
        <section className="border-y border-sand bg-olive py-14 text-cream dark:border-olive-deep dark:bg-olive-surface">
          <div className="container-x grid gap-8 lg:grid-cols-2">
            <div>
              <p className="section-kicker !text-brass-bright">Why EchoGPT</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Stop choosing. Start comparing.</h2>
              <p className="mt-3 text-cream/80">Single-model tools make you guess. EchoGPT asks once, shows every perspective, and lets you continue with the winner.</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  "Compare up to 3 models in one prompt — vote for the clearest",
                  "Page-aware extension: summarize & explain without copy-paste",
                  "Prompt enhancer turns rough ideas into pro briefs",
                  "Private by default: local mock, local history, no trackers",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brass text-olive-ink"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-center gap-4 sm:grid-cols-2">
              {[
                ["3×", "faster research", "One prompt, three answers, zero tab-hopping."],
                ["40+", "page reports", "PDF summarizer tested on long docs."],
                ["10s", "to first answer", "Streaming mock, optimistic UI."],
                ["AA", "contrast target", "Visible focus, keyboard-first."],
              ].map(([v, l, d]) => (
                <div key={l} className="rounded-2xl border border-cream/20 bg-cream/10 p-5 backdrop-blur">
                  <p className="text-3xl font-extrabold text-brass-bright">{v}</p>
                  <p className="text-sm font-bold">{l}</p>
                  <p className="mt-1 text-xs text-cream/70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-20 py-14">
          <div className="container-x">
            <Pricing plans={ECHO_PLANS} />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-y border-sand bg-cream-dim/50 py-14 dark:border-olive-deep dark:bg-olive-surface/40">
          <div className="container-x">
            <TestimonialsMarquee />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-14">
          <div className="container-x max-w-3xl">
            <FaqTabs />
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl bg-olive px-6 py-12 text-center text-cream sm:px-12 dark:bg-olive-surface dark:ring-1 dark:ring-olive-deep">
              <div aria-hidden className="absolute inset-0">
                <FlowGradient className="absolute inset-0" speed={0.5} opacity={0.55} />
                <div className="absolute inset-0 bg-olive/72 dark:bg-olive-ink/78" />
              </div>
              <div className="relative">
              <Sparkles className="mx-auto text-brass-bright" size={28} aria-hidden="true" />
              <h2 className="mx-auto mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                Try the redesign in one click
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-cream/80">
                No signup, no keys. Open the workspace, compare three models, then peek at the extension concept.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/app" className="inline-flex items-center gap-2 rounded-xl bg-cream px-5 py-3 text-sm font-bold text-olive-ink transition hover:bg-white">
                  Launch web app <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/extension" className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-5 py-3 text-sm font-bold text-cream transition hover:border-brass-bright hover:text-brass-bright">
                  <Puzzle size={16} aria-hidden="true" /> Extension concept
                </Link>
              </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
