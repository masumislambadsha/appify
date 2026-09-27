"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { mockAnswer, streamText } from "@/lib/mock-ai";
import { useRovingTabs } from "@/hooks/use-roving-tabs";
import { cn } from "@/lib/utils";

const DEMOS = [
  { model: "GPT-6 Astra", modelId: "gpt-6-astra", q: "Summarize this report in 5 bullets…" },
  { model: "Claude Opus 5.5", modelId: "opus-5-5", q: "Rewrite this launch email — confident but warm…" },
  { model: "DeepSeek V4.1", modelId: "deepseek-v4-1", q: "Why does this loop fetch twice?…" },
];

const EXT_TOOLS = [
  { id: "sum", label: "Summarize page", out: "This page in 3 bullets: Pro $12/mo, annual −20%, cancel anytime." },
  { id: "exp", label: "Explain selection", out: "“KV cache” = the model's short-term memory of what it already read." },
  { id: "rew", label: "Rewrite", out: "Friendlier version ready — 2 sentences, same meaning." },
];

const EXT_HISTORY = [
  "Summarize: Attention Is All You Need",
  "Explain selection: useEffect cleanup",
  "Rewrite LinkedIn headline",
];

function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Frame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand-deep/60 bg-cream-card text-olive-ink shadow-pop">
      <div className="flex items-center gap-1.5 border-b border-sand bg-cream-dim/50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-brass" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-sand-deep" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-olive" aria-hidden="true" />
        <span className="ml-2 rounded-md bg-olive px-2 py-0.5 font-mono text-[11px] font-bold text-cream">
          {url}
        </span>
      </div>
      <div className="min-h-[360px] p-4 sm:p-5">{children}</div>
    </div>
  );
}

/** The chat demo: cycles prompts and streams answers like the real workspace. */
function MiniChat() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [qi, setQi] = React.useState(0);
  const [text, setText] = React.useState("");
  const [done, setDone] = React.useState(false);
  const demo = DEMOS[qi % DEMOS.length];
  const full = React.useMemo(
    () => mockAnswer(demo.modelId, demo.q),
    [demo.modelId, demo.q],
  );

  React.useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
    let timer = 0;
    (async () => {
      setText("");
      setDone(false);
      for await (const part of streamText(full, 8, 14)) {
        if (cancelled) return;
        setText(part);
      }
      if (cancelled) return;
      setDone(true);
      timer = window.setTimeout(() => {
        if (!cancelled) setQi((q) => (q + 1) % DEMOS.length);
      }, 2600);
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [qi, reduce, inView, full]);

  const shown = reduce ? full : text;

  return (
    <div ref={ref} className="space-y-2.5" aria-label="Live chat demo">
      {/* Token-by-token streaming would spam a live region, so the rapidly
          changing text stays out of the live tree and a status line
          announces only question changes + completion. */}
      <p role="status" className="sr-only">
        Demo {qi + 1} of {DEMOS.length}: {demo.model} answering “{demo.q}”
        {done ? " — answer complete." : " — generating…"}
      </p>
      <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-olive px-3 py-2 text-xs text-cream">
        {demo.q}
      </div>
      <div className="rounded-xl rounded-bl-sm border border-sand bg-cream px-3 py-2 text-xs leading-relaxed">
        <span className="font-bold text-brass-deep">{demo.model} · </span>
        <span className="whitespace-pre-wrap text-olive-deep">
          {shown}
          {!done && !reduce && (
            <span aria-hidden="true" className="animate-blink">
              ▍
            </span>
          )}
        </span>
      </div>
      {done && (
        <div className="flex flex-wrap gap-1.5">
          {["Copy", "Regenerate", "Compare ×3"].map((a) => (
            <span
              key={a}
              className="rounded-full border border-sand-deep/70 px-2.5 py-1 text-[11px] font-semibold text-olive-deep"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** The extension demo: switchable Chat / Tools / History panes. */
const EXT_PANES = ["chat", "tools", "history"] as const;

function ExtDemo() {
  const [selected, setSelected] = React.useState(0);
  const tab = EXT_PANES[selected];
  const { getTabProps, getPanelProps } = useRovingTabs({
    idPrefix: "extdemo",
    count: EXT_PANES.length,
    selected,
    onSelect: setSelected,
  });
  const [tool, setTool] = React.useState(EXT_TOOLS[0]);
  return (
    <div>
      <div className="flex gap-1.5" role="tablist" aria-label="Extension panes">
        {EXT_PANES.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={i === selected}
            onClick={() => setSelected(i)}
            {...getTabProps(i)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition",
              i === selected
                ? "bg-olive text-cream"
                : "bg-sand-soft text-olive-deep hover:bg-sand",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          role="tabpanel"
          {...getPanelProps(selected)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-3"
        >
          {tab === "chat" && (
            <div className="space-y-2">
              <p className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-olive px-2.5 py-1.5 text-[11px] text-cream">
                tl;dr this pricing page?
              </p>
              <p className="rounded-xl rounded-bl-sm border border-sand bg-cream px-2.5 py-2 text-[11px] leading-relaxed text-olive-deep">
                Pro $12/mo, annual −20%, cancel anytime.
              </p>
              <p className="font-mono text-[10px] text-olive-deep/75">
                Page context attached · Ctrl/⌘ + Shift + E
              </p>
            </div>
          )}
          {tab === "tools" && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {EXT_TOOLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t)}
                    aria-pressed={tool.id === t.id}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-left text-[11px] font-bold transition",
                      tool.id === t.id
                        ? "border-brass bg-brass-soft/60"
                        : "border-sand-deep/60 hover:border-brass",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p
                className="rounded-xl border border-sand bg-cream px-2.5 py-2 text-[11px] leading-relaxed text-olive-deep"
                aria-live="polite"
              >
                {tool.out}
              </p>
            </div>
          )}
          {tab === "history" && (
            <ul className="space-y-1.5">
              {EXT_HISTORY.map((h) => (
                <li
                  key={h}
                  className="truncate rounded-xl border border-sand bg-cream px-2.5 py-2 text-[11px] font-semibold text-olive-deep"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const TABS = [
  { id: "app", label: "Chat workspace" },
  { id: "ext", label: "Extension sidebar" },
] as const;

export function PreviewShowcase() {
  const [selected, setSelected] = React.useState(0);
  const tab = TABS[selected].id;
  const { getTabProps, getPanelProps } = useRovingTabs({
    idPrefix: "preview",
    count: TABS.length,
    selected,
    onSelect: setSelected,
  });
  return (
    <div>
      <div
        className="mb-6 flex justify-center"
        role="tablist"
        aria-label="Product preview"
      >
        <div className="inline-flex gap-1 rounded-full border border-cream/25 p-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === selected}
              onClick={() => setSelected(i)}
              {...getTabProps(i)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                i === selected ? "text-olive-ink" : "text-cream/65 hover:text-cream",
              )}
            >
              {i === selected && (
                <motion.span
                  layoutId="pv-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-cream"
                  aria-hidden="true"
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            {...getPanelProps(selected)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <Frame url={tab === "app" ? "echogpt.live/app" : "echogpt — sidebar"}>
              {tab === "app" ? <MiniChat /> : <ExtDemo />}
            </Frame>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex justify-center">
          <Link
            href={tab === "app" ? "/app" : "/extension"}
            className="btn-primary !py-2 text-sm"
          >
            Open {tab === "app" ? "workspace" : "concept"}{" "}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
