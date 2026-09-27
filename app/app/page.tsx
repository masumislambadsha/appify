"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Plus, Sparkles } from "lucide-react";
import { ArenaTopbar } from "@/components/arena/topbar";
import { ArenaSidebar } from "@/components/arena/sidebar";
import { ModelStrip } from "@/components/arena/model-strip";
import {
  ConsensusBanner,
  QueryCard,
  TelemetryHeader,
} from "@/components/arena/telemetry";
import { ArenaColumns } from "@/components/arena/columns";
import { ComposerDock } from "@/components/arena/composer";
import { CATEGORIES } from "@/lib/data";
import { latestExchange, modelColor, modelName } from "@/lib/arena";
import { mockAnswer, streamText } from "@/lib/mock-ai";
import { useChats, type Chat } from "@/lib/store";
import { cn } from "@/lib/utils";

const uid = () => Math.random().toString(36).slice(2, 10);

/** Appends the mock web-grounding note when the chat has search enabled. */
function groundAnswer(target: Chat, base: string): string {
  return target.webSearch
    ? `${base}\n\n_Web-grounded (mock): checked against 3 live sources._`
    : base;
}

export default function WebApp() {
  const {
    chats, activeId, compareIds, newChat, setActive,
    remove, togglePin,
  } = useChats();
  const [compareMode, setCompareMode] = useState(true);
  const [query, setQuery] = useState("");
  // Always start empty so the first client render matches the server HTML.
  // The ?cat= deep-link prefill happens in the mount effect below — reading
  // window.location.search during useState init hydrates `disabled` (and the
  // textarea value) differently from the server and throws a mismatch.
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const catLinked = useRef(false);

  const active = chats.find((c) => c.id === activeId) ?? chats[0];

  // ?cat= deep-link from landing: rehydrate persisted chats first (so the
  // first client render still matches the server HTML), then spin up the
  // category chat + prefill once. Store-only side effects, mount-only.
  useEffect(() => {
    if (catLinked.current) return;
    catLinked.current = true;
    void Promise.resolve(useChats.persist.rehydrate()).then(() => {
      const cat = new URLSearchParams(window.location.search).get("cat");
      const found = CATEGORIES.find((c) => c.id === cat);
      if (!found) return;
      newChat(found.id, "gpt-6-astra");
      setInput(found.prompt);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bottomRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "end" });
  }, [active?.messages.length, busy]);

  // Mobile drawer dialog: initial focus, Escape-to-close with focus return,
  // and a Tab trap while open (the overlay marks it modal for AT).
  useEffect(() => {
    if (!drawer) return;
    drawerRef.current
      ?.querySelector<HTMLElement>("[data-drawer-close]")
      ?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setDrawer(false);
        menuBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const root = drawerRef.current;
      if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
    return [...list].sort(
      (a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false) || b.updatedAt - a.updatedAt
    );
  }, [chats, query]);

  async function send(raw?: string, chatId?: string) {
    const text = (raw ?? input).trim();
    // Resolve live from the store to avoid stale closures (e.g. quick-start cards)
    const state = useChats.getState();
    const target = state.chats.find((c) => c.id === (chatId ?? active?.id));
    if (!text || !target || busy) return;
    if (!chatId) setInput("");
    setBusy(true);
    const um = { id: uid(), role: "user" as const, text, ts: Date.now() };
    state.pushMsg(target.id, um);

    const ground = (base: string) => groundAnswer(target, base);

    if (compareMode && compareIds.length > 1) {
      const jobs = compareIds.map((mid) => {
        const id = uid();
        state.pushMsg(target.id, { id, role: "assistant", modelId: mid, text: "", ts: Date.now() });
        return (async () => {
          const full = ground(mockAnswer(mid, text));
          for await (const part of streamText(full)) state.updateMsg(target.id, id, part);
        })();
      });
      await Promise.all(jobs);
    } else {
      const mid = target.modelId;
      const id = uid();
      state.pushMsg(target.id, { id, role: "assistant", modelId: mid, text: "", ts: Date.now() });
      const full = ground(mockAnswer(mid, text));
      for await (const part of streamText(full)) state.updateMsg(target.id, id, part);
    }
    setBusy(false);
  }

  // Single-column refresh: re-streams ONLY this model's latest answer in
  // place. Other columns are untouched (unlike send, which re-broadcasts).
  async function regenerateModel(modelId: string) {
    const state = useChats.getState();
    const target = state.chats.find((c) => c.id === active?.id);
    if (!target || busy) return;
    const lastUser = [...target.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const after = target.messages.slice(target.messages.findIndex((m) => m.id === lastUser.id) + 1);
    const existing = [...after]
      .reverse()
      .find((m) => m.role === "assistant" && m.modelId === modelId);
    const salt = after.filter((m) => m.role === "assistant" && m.modelId === modelId).length;
    const msgId = existing?.id ?? uid();
    if (!existing) {
      state.pushMsg(target.id, { id: msgId, role: "assistant", modelId, text: "", ts: Date.now() });
    }
    setBusy(true);
    try {
      const full = groundAnswer(target, mockAnswer(modelId, lastUser.text, salt));
      for await (const part of streamText(full)) {
        state.updateMsg(target.id, msgId, part);
      }
    } finally {
      setBusy(false);
    }
  }

  // Empty-state cards: create the chat first, then send into it (never the stale one)
  function quickStart(prompt: string, category?: string) {
    if (busy) return;
    if (category) {
      const id = newChat(category, active?.modelId ?? "gpt-6-astra");
      void send(prompt, id);
    } else {
      void send(prompt);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  }

  if (!active) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream dark:bg-olive-ink">
        <button onClick={() => newChat()} className="btn-primary"><Plus size={16} aria-hidden="true" /> New chat</button>
      </div>
    );
  }

  // Fall back for chats saved before the Sept 2026 lineup refresh is handled
  // inside lib/arena helpers (modelName/modelColor default safely).
  const models = compareMode ? compareIds : [active.modelId];
  const exchange = latestExchange(active);
  const scrollback = (() => {
    if (!exchange.user) return active.messages;
    const idx = active.messages.findIndex((m) => m.id === exchange.user?.id);
    return idx < 0 ? [] : active.messages.slice(0, idx);
  })();

  const sidebar = (onNavigate?: () => void) => (
    <ArenaSidebar
      query={query}
      onQuery={setQuery}
      chats={filtered}
      activeId={active.id}
      onNew={(cat) => { newChat(cat); onNavigate?.(); }}
      onSelect={(id) => { setActive(id); onNavigate?.(); }}
      onPin={togglePin}
      onRemove={remove}
      onClose={onNavigate}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-cream text-olive-ink dark:bg-olive-ink dark:text-cream">
      <h1 className="sr-only">EchoGPT arena workspace</h1>
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-sand bg-cream-dim/60 md:flex dark:border-olive-deep dark:bg-olive-ink" aria-label="Conversations">
        {sidebar()}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-olive-ink/50 md:hidden"
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              ref={drawerRef}
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-cream md:hidden dark:bg-olive-ink"
              role="dialog"
              aria-modal="true"
              aria-label="Conversations"
            >
              {sidebar(() => setDrawer(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="sr-only">EchoGPT Studio workspace</h1>
        <ArenaTopbar onMenu={() => setDrawer(true)} menuButtonRef={menuBtnRef} compareMode={compareMode} onCompareMode={setCompareMode} />
        <ModelStrip chatId={active.id} modelId={active.modelId} compareMode={compareMode} />

        {/* Arena scroll */}
        <div className="slim-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6" role="region" aria-label="Conversation">
          <div className="mx-auto max-w-5xl space-y-4">
            {/* Token streaming would spam a live region, so answers stay
                non-live and this status announces turn state changes only. */}
            <p role="status" className="sr-only">
              {busy
                ? `${models.map((id) => modelName(id)).join(", ")} ${models.length > 1 ? "are" : "is"} responding…`
                : exchange.user
                  ? "Response complete."
                  : "New conversation started."}
            </p>
            <TelemetryHeader chat={active} models={models} />

            {active.messages.length === 0 && (
              <EmptyState onStart={(prompt, category) => quickStart(prompt, category)} />
            )}

            {scrollback.length > 0 && (
              <ol className="space-y-3" aria-label="Earlier messages">
                {scrollback.map((m) => (
                  <li key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[92%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed sm:max-w-[80%]",
                        m.role === "user"
                          ? "rounded-br-md bg-olive text-cream dark:bg-brass dark:text-olive-ink"
                          : "rounded-bl-md border border-sand bg-cream-card dark:border-olive-deep dark:bg-olive-surface",
                      )}
                    >
                      {m.role === "assistant" && (
                        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brass-deep dark:text-brass-bright">
                          <span className="h-2 w-2 rounded-full" style={{ background: modelColor(m.modelId) }} />
                          {modelName(m.modelId)}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{m.text || " "}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {exchange.user && (
              <QueryCard
                chat={active}
                user={exchange.user}
                onEdit={(t) => setInput(t)}
                onBranch={() => {
                  const id = newChat(active.category, active.modelId);
                  setInput(exchange.user?.text ?? "");
                  setActive(id);
                }}
                onCopy={(t, id) => copy(t, id)}
                copied={copied === `q-${exchange.user.id}`}
              />
            )}

            <ConsensusBanner chat={active} votes={votes} />

            {exchange.user && (
              <ArenaColumns
                models={models}
                answers={exchange.answers}
                busy={busy}
                votes={votes}
                onVote={(msgId) => setVotes({ [msgId]: 1 })}
                onCopy={(t, id) => copy(t, id)}
                copiedId={copied}
                onRegenerate={(mid) => void regenerateModel(mid)}
              />
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <ComposerDock
          chat={active}
          models={models}
          compareMode={compareMode}
          input={input}
          onInput={setInput}
          onSend={() => send()}
          busy={busy}
          onNewChat={() => newChat(active.category, active.modelId)}
        />
      </div>
    </div>
  );
}

function EmptyState({ onStart }: { onStart: (prompt: string, category?: string) => void }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-olive text-cream dark:bg-brass dark:text-olive-ink">
        <Sparkles size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">What should we explore?</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-olive-deep/75 dark:text-cream/65">
        Pick a workflow or ask anything. Toggle <strong>Compare</strong> up top to query multiple models at once.
      </p>
      <div className="mx-auto mt-5 grid max-w-2xl gap-2 text-left sm:grid-cols-3">
        {CATEGORIES.slice(0, 6).map((c) => (
          <button
            key={c.id}
            onClick={() => onStart(c.prompt, c.id)}
            className="card p-3.5 text-left transition hover:-translate-y-0.5 hover:border-brass"
          >
            <p className="text-sm font-bold"><span aria-hidden="true">{c.icon}</span> {c.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-olive-deep/70 dark:text-cream/60">{c.desc}</p>
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {["Explain quantum computing simply", "Rewrite my resume bullet", "Debug a Python loop"].map((s) => (
          <button key={s} onClick={() => onStart(s)} className="chip transition hover:border-brass">
            <MessageSquare size={12} aria-hidden="true" /> {s}
          </button>
        ))}
      </div>
    </div>
  );
}
