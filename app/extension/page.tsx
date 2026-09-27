"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  Bell,
  Clock,
  FileText,
  Globe,
  Keyboard,
  MousePointerClick,
  PenLine,
  Puzzle,
  Settings2,
  Sparkles,
  Wrench,
  MessageSquare,
  Check,
} from "lucide-react";
import { Logo, SectionHeading, SiteFooter } from "@/components/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRovingTabs } from "@/hooks/use-roving-tabs";
import { MODELS, QUICK_ACTIONS } from "@/lib/data";
import { mockAnswer, streamText } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

type Tab = "chat" | "tools" | "history" | "settings";

const EXT_TAB_IDS = ["chat", "tools", "history", "settings"] as const;

const HIST = [
  { t: "Summarize: Attention Is All You Need", m: "Claude Opus 5.5", time: "2m ago" },
  { t: "Explain selection: useEffect cleanup", m: "GPT-6 Astra", time: "18m ago" },
  { t: "Rewrite LinkedIn headline", m: "Grok 4.7", time: "1h ago" },
  { t: "Compare pricing pages", m: "Gemini 3.8 Flash", time: "Yesterday" },
];

export default function ExtensionConcept() {
  const [selected, setSelected] = useState(0);
  const tab: Tab = EXT_TAB_IDS[selected];
  const selectTab = (id: Tab) => setSelected(EXT_TAB_IDS.indexOf(id));
  const { getTabProps, getPanelProps } = useRovingTabs({
    idPrefix: "ext-popup",
    count: EXT_TAB_IDS.length,
    selected,
    onSelect: setSelected,
  });
  const [model, setModel] = useState("gpt-6-astra");
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState(
    "Ask anything — or hit a quick action. Page context is attached only when you toggle it on."
  );
  const [busy, setBusy] = useState(false);
  const [pageCtx, setPageCtx] = useState(true);
  const [endpoint, setEndpoint] = useState("https://api.echogpt.live/v1");
  const [toast, setToast] = useState<string | null>(null);

  async function ask(q: string) {
    const text = q.trim();
    if (!text || busy) return;
    setBusy(true);
    setAnswer("");
    const full =
      (pageCtx ? "[Page context: 'EchoGPT pricing — Pro $12/mo…']\n\n" : "") +
      mockAnswer(model, text);
    for await (const part of streamText(full, 18, 16)) setAnswer(part);
    setBusy(false);
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  return (
    <div className="min-h-screen bg-cream text-olive-ink dark:bg-olive-ink dark:text-cream">
      <header className="sticky top-0 z-40 border-b border-sand bg-cream/85 backdrop-blur dark:border-olive-deep dark:bg-olive-ink/85">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Back to home" className="rounded-lg p-2 hover:bg-sand-soft dark:hover:bg-olive-surface">
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/app" className="btn-primary !px-4 !py-2 text-sm">Open web app</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="container-x py-10">
        <h1 className="sr-only">EchoGPT Chrome extension concept</h1>
        <SectionHeading
          kicker="Task 3 · Chrome Extension"
          title="Sidebar-first, keyboard-fast"
          sub="Interactive concept: 400px popup + side panel, same palette and models as the web app. Everything below is clickable."
        />

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          <span className="chip"><Puzzle size={13} aria-hidden="true" /> Manifest V3 · Side Panel API</span>
          <span className="chip"><Keyboard size={13} aria-hidden="true" /> Ctrl / ⌘ + Shift + E</span>
          <span className="chip"><Globe size={13} aria-hidden="true" /> Page context only on demand</span>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[400px_1fr]">
          {/* POPUP */}
          <div className="mx-auto w-full max-w-[400px]">
            <div className="overflow-hidden rounded-2xl border border-sand-deep bg-cream-card shadow-pop dark:border-olive-deep dark:bg-olive-surface" role="region" aria-label="Extension popup demo">
              <div className="flex items-center gap-2 border-b border-sand bg-cream-dim/60 px-4 py-2.5 dark:border-olive-deep dark:bg-olive-ink">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-olive text-cream dark:bg-brass dark:text-olive-ink">
                  <Sparkles size={15} aria-hidden="true" />
                </span>
                <div className="leading-tight">
                  <p className="text-[13px] font-extrabold">EchoGPT</p>
                  <p className="text-[11px] opacity-60">Popup · 400px</p>
                </div>
                <label className="ml-auto flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="sr-only">Model</span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="cursor-pointer rounded-lg border border-sand-deep bg-cream px-1.5 py-1 text-[11px] font-bold dark:border-olive-deep dark:bg-olive-ink"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex gap-1 border-b border-sand p-2 dark:border-olive-deep" role="tablist" aria-label="Popup navigation">
                {(
                  [
                    ["chat", "Chat", <MessageSquare key="i" size={13} aria-hidden="true" />],
                    ["tools", "Tools", <Wrench key="i" size={13} aria-hidden="true" />],
                    ["history", "History", <Clock key="i" size={13} aria-hidden="true" />],
                    ["settings", "Settings", <Settings2 key="i" size={13} aria-hidden="true" />],
                  ] as [Tab, string, React.ReactNode][]
                ).map(([id, label, icon], i) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={tab === id}
                    onClick={() => selectTab(id)}
                    {...getTabProps(i)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold transition",
                      tab === id
                        ? "bg-olive text-cream dark:bg-brass dark:text-olive-ink"
                        : "text-olive-deep/70 hover:bg-sand-soft dark:text-cream/65 dark:hover:bg-olive-deep"
                    )}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              <div className="min-h-[380px] p-3">
                <AnimatePresence mode="wait">
                  {tab === "chat" && (
                    <motion.div key="chat" role="tabpanel" {...getPanelProps(0)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2.5">
                      <div className="rounded-xl border border-sand bg-cream p-3 text-[13px] leading-relaxed dark:border-olive-deep dark:bg-olive-ink">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brass-deep dark:text-brass-bright">
                          {MODELS.find((m) => m.id === model)?.name} {busy && <span className="animate-blink">· typing…</span>}
                        </p>
                        {/* Streaming text stays non-live (per-token announcements);
                            the status line reports state changes only. */}
                        <p role="status" className="sr-only">
                          {busy
                            ? `${MODELS.find((m) => m.id === model)?.name} is typing…`
                            : "Answer complete."}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap">{answer || " "}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {QUICK_ACTIONS.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => ask(q.id === "summarize" ? "Summarize this page in 3 bullets" : q.id === "explain" ? "Explain the selected text simply" : q.id === "rewrite" ? "Rewrite the selection to be friendlier" : "Explain this code line by line")}
                            className="rounded-xl border border-sand-deep/70 px-2 py-2 text-left text-[11px] font-bold transition hover:border-brass dark:border-olive-deep dark:hover:border-brass-bright"
                          >
                            {q.label}
                            <span className="block text-[10px] font-medium opacity-60">{q.desc}</span>
                          </button>
                        ))}
                      </div>
                      <form
                        onSubmit={(e) => { e.preventDefault(); ask(input); setInput(""); }}
                        className="input-shell flex items-center gap-1.5 p-1.5 pl-3"
                      >
                        <label htmlFor="ext-input" className="sr-only">Ask EchoGPT</label>
                        <input
                          id="ext-input"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask… (Enter to send)"
                          className="w-full bg-transparent text-[13px] outline-none placeholder:text-olive-deep/60 dark:placeholder:text-cream/60"
                        />
                        <button aria-label="Send" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-olive text-cream dark:bg-brass dark:text-olive-ink">
                          <ArrowUp size={15} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                      </form>
                      <button
                        onClick={() => setPageCtx((v) => !v)}
                        aria-pressed={pageCtx}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-bold transition",
                          pageCtx ? "border-brass bg-brass-soft/50 dark:bg-olive-deep" : "border-sand-deep dark:border-olive-deep"
                        )}
                      >
                        <span className="flex items-center gap-1.5"><FileText size={13} aria-hidden="true" /> Include page context</span>
                        <span className={cn("rounded-full px-2 py-0.5", pageCtx ? "bg-olive text-cream dark:bg-brass dark:text-olive-ink" : "bg-sand-soft")}>
                          {pageCtx ? "ON" : "OFF"}
                        </span>
                      </button>
                    </motion.div>
                  )}

                  {tab === "tools" && (
                    <motion.div key="tools" role="tabpanel" {...getPanelProps(1)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                      {[
                        ["Summarize page", "TL;DR + key points + action items", <Globe key="i" size={15} aria-hidden="true" />],
                        ["Explain selection", "Plain-English, with analogy", <MousePointerClick key="i" size={15} aria-hidden="true" />],
                        ["Rewrite", "Shorter / formal / friendly tones", <PenLine key="i" size={15} aria-hidden="true" />],
                        ["Prompt enhancer", "Rough → detailed pro brief", <Sparkles key="i" size={15} aria-hidden="true" />],
                      ].map(([t, d, icon]) => (
                        <button
                          key={t as string}
                          onClick={() => { selectTab("chat"); ask(t as string); }}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-sand bg-cream p-3 text-left transition hover:border-brass dark:border-olive-deep dark:bg-olive-ink dark:hover:border-brass-bright"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-olive text-cream dark:bg-brass dark:text-olive-ink">{icon}</span>
                          <span>
                            <span className="block text-[13px] font-bold">{t}</span>
                            <span className="block text-[11px] opacity-60">{d}</span>
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {tab === "history" && (
                    <motion.ul key="hist" role="tabpanel" {...getPanelProps(2)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1.5">
                      {HIST.map((h) => (
                        <li key={h.t}>
                          <button
                            onClick={() => { selectTab("chat"); ask(`Continue: ${h.t}`); }}
                            className="w-full rounded-xl border border-sand bg-cream p-2.5 text-left transition hover:border-brass dark:border-olive-deep dark:bg-olive-ink"
                          >
                            <span className="block truncate text-[13px] font-bold">{h.t}</span>
                            <span className="mt-0.5 block text-[11px] opacity-60">{h.m} · {h.time}</span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button onClick={() => flash("History cleared (demo)")} className="w-full rounded-xl border border-dashed border-sand-deep p-2.5 text-[12px] font-bold text-red-700/80 dark:text-red-300/80">
                          Clear history
                        </button>
                      </li>
                    </motion.ul>
                  )}

                  {tab === "settings" && (
                    <motion.div key="set" role="tabpanel" {...getPanelProps(3)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2.5 text-[13px]">
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Default model</span>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 w-full rounded-xl border border-sand-deep bg-cream p-2 font-bold dark:border-olive-deep dark:bg-olive-ink">
                          {MODELS.map((m) => (
                            <option key={m.id} value={m.id}>{m.name} · {m.vendor}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">API endpoint</span>
                        <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="mt-1 w-full rounded-xl border border-sand-deep bg-cream p-2 font-mono text-xs dark:border-olive-deep dark:bg-olive-ink" />
                      </label>
                      <ToggleRow label="Page context by default" desc="Attach tab content only when toggled" on={pageCtx} onFlip={() => setPageCtx((v) => !v)} />
                      <ToggleRow label="Dark mode follows browser" desc="Uses the same olive-ink theme" on={true} onFlip={() => flash("Theme follows the site toggle ↑")} />
                      <button onClick={() => flash("Signed out (demo)")} className="w-full rounded-xl border border-sand-deep p-2 text-[12px] font-bold hover:border-red-400 hover:text-red-700 dark:border-olive-deep">
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="border-t border-sand px-3 py-2 text-center text-[10px] opacity-55 dark:border-olive-deep">
                No trackers · Storage: chrome.storage.local · <span className="font-mono">Ctrl/⌘+Shift+E</span>
              </p>
            </div>
            <p className="mt-2 text-center text-xs opacity-60">↑ Fully interactive popup — switch tabs, change model, run quick actions.</p>
          </div>

          {/* SIDE PANEL + NOTES */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="flex items-center gap-2 font-extrabold"><Bell size={16} className="text-brass-deep dark:text-brass-bright" aria-hidden="true" /> Side panel & navigation flow</h2>
              <ol className="mt-3 space-y-2.5 text-sm">
                {[
                  ["Install", "Add from Chrome Web Store → pin the EchoGPT icon."],
                  ["Sign in", "EchoGPT account or Google OAuth; token in chrome.storage, persistent session."],
                  ["Invoke", "Icon, Ctrl/⌘+Shift+E, or right-click → Ask EchoGPT. Panel opens beside the page."],
                  ["Assist", "Summarize page / explain selection inject only the needed DOM text — toggle visible at all times."],
                  ["Continue", "History syncs with the web app; pick up any thread at /app."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive text-xs font-extrabold text-cream dark:bg-brass dark:text-olive-ink">{i + 1}</span>
                    <span><strong>{t} — </strong><span className="opacity-75">{d}</span></span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-brass-deep dark:text-brass-bright">What changed vs. original</h3>
                <ul className="mt-2.5 space-y-1.5 text-[13px]">
                  {[
                    "One input for chat + commands (was: scattered buttons)",
                    "Model switcher always visible (was: buried in settings)",
                    "Page-context toggle with preview (was: implicit)",
                    "History with search + resume (was: flat list)",
                    "Tools as first-class tab (was: hidden menu)",
                  ].map((t) => (
                    <li key={t} className="flex gap-1.5"><Check size={14} className="mt-0.5 shrink-0 text-olive dark:text-brass-bright" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-brass-deep dark:text-brass-bright">Settings page spec</h3>
                <ul className="mt-2.5 space-y-1.5 text-[13px]">
                  {[
                    "Default model + per-site override",
                    "Custom API endpoint field",
                    "Page-context default ON/OFF",
                    "Theme: light / dark / system",
                    "Account: plan, usage, sign out",
                    "Privacy: what's stored & why",
                  ].map((t) => (
                    <li key={t} className="flex gap-1.5"><Settings2 size={14} className="mt-0.5 shrink-0 opacity-60" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card flex flex-wrap items-center gap-3 p-5">
              <div className="text-sm">
                <p className="font-extrabold">Like the flow? Try it in the full workspace.</p>
                <p className="opacity-70">Same models, compare mode, and prompt enhancer.</p>
              </div>
              <Link href="/app" className="btn-primary ml-auto text-sm">Open /app</Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-olive px-4 py-2 text-sm font-semibold text-cream shadow-pop dark:bg-brass dark:text-olive-ink">
          {toast}
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, desc, on, onFlip }: { label: string; desc: string; on: boolean; onFlip: () => void }) {
  return (
    <button
      onClick={onFlip}
      aria-pressed={on}
      className="flex w-full items-center justify-between gap-2 rounded-xl border border-sand-deep/70 px-3 py-2 text-left dark:border-olive-deep"
    >
      <span>
        <span className="block text-[13px] font-bold">{label}</span>
        <span className="block text-[11px] opacity-60">{desc}</span>
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-olive dark:bg-brass" : "bg-sand-deep")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-cream shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}
