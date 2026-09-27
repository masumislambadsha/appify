"use client";

import Link from "next/link";
import { useState, type Ref } from "react";
import { ArrowLeft, Check, Menu, Share, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MODELS } from "@/lib/data";
import { chatTokens, formatTokens } from "@/lib/arena";
import { useChats } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ArenaTopbarProps {
  onMenu: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
  compareMode: boolean;
  onCompareMode: (v: boolean) => void;
}

export function ArenaTopbar({ onMenu, menuButtonRef, compareMode, onCompareMode }: ArenaTopbarProps) {
  const { chats, activeId, compareIds, setCompareIds } = useChats();
  const [exported, setExported] = useState(false);
  const active = chats.find((c) => c.id === activeId) ?? chats[0];
  const sessionTokens = active ? chatTokens(active) : 0;

  const setCount = (n: 2 | 3) => {
    if (compareMode && compareIds.length === n) {
      onCompareMode(false);
      return;
    }
    if (compareIds.length > n) {
      setCompareIds(compareIds.slice(0, n));
    } else if (compareIds.length < n) {
      const next = MODELS.find((m) => !compareIds.includes(m.id))?.id ?? MODELS[0].id;
      setCompareIds([...compareIds, next]);
    }
    onCompareMode(true);
  };

  const exportTranscript = async () => {
    if (!active) return;
    const lines = active.messages.map((m) => {
      const who = m.role === "user" ? "You" : modelLabel(m.modelId);
      return `${who}: ${m.text}`;
    });
    try {
      await navigator.clipboard?.writeText(
        `EchoGPT transcript — ${active.title}\n\n${lines.join("\n\n")}`,
      );
    } catch {
      /* clipboard unavailable in this browser */
    }
    setExported(true);
    window.setTimeout(() => setExported(false), 1600);
  };

  return (
    <header className="flex items-center gap-2 border-b border-sand bg-cream/90 px-3 py-2.5 backdrop-blur sm:px-5 dark:border-olive-deep dark:bg-olive-ink/90">
      <button
        ref={menuButtonRef}
        className="rounded-lg p-2 hover:bg-sand-soft md:hidden dark:hover:bg-olive-surface"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={18} aria-hidden="true" />
      </button>
      <Link
        href="/"
        className="rounded-lg p-2 hover:bg-sand-soft dark:hover:bg-olive-surface"
        aria-label="Back to landing"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>

      <span className="hidden items-center gap-1.5 text-sm font-bold sm:flex" title="EchoGPT arena workspace">
        EchoGPT Studio
      </span>
      <span className="chip hidden xl:inline-flex">
        <span className="h-2 w-2 rounded-full bg-olive dark:bg-brass-bright" aria-hidden="true" />
        {MODELS.length} models ready
      </span>

      <div className="ml-auto flex items-center gap-1.5">
        <div
          className="hidden items-center gap-0.5 rounded-xl border border-sand-deep p-0.5 sm:flex dark:border-olive-deep"
          role="group"
          aria-label="Compare layout"
        >
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              aria-pressed={compareMode && compareIds.length === n}
              aria-label={`Compare ${n} models`}
              title={compareMode && compareIds.length === n ? "Back to single model" : `Compare ${n} models`}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold transition",
                compareMode && compareIds.length === n
                  ? "bg-olive text-cream dark:bg-brass dark:text-olive-ink"
                  : "text-olive-deep/70 hover:text-olive-ink dark:text-cream/60 dark:hover:text-cream",
              )}
            >
              ×{n}
            </button>
          ))}
        </div>

        <span
          className="chip hidden !py-1 font-mono text-[11px] lg:inline-flex"
          title="Estimated from message length (mock telemetry)"
        >
          {formatTokens(sessionTokens)} tokens
        </span>

        <button
          onClick={exportTranscript}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sand-deep px-3 py-1.5 text-xs font-bold text-olive-deep transition hover:border-brass dark:border-olive-deep dark:text-cream/80"
        >
          {exported ? <Check size={14} aria-hidden="true" /> : <Share size={14} aria-hidden="true" />}
          <span className="hidden sm:inline">{exported ? "Copied" : "Export"}</span>
        </button>
        <span className="sr-only" role="status">
          {exported ? "Transcript copied to clipboard." : ""}
        </span>
        <ThemeToggle />
        <span
          className="grid h-9 w-9 place-items-center rounded-full bg-olive text-cream dark:bg-brass dark:text-olive-ink"
          title="Local demo session"
          role="img"
          aria-label="Signed in as demo user"
        >
          <User size={16} aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}

function modelLabel(modelId?: string): string {
  return MODELS.find((m) => m.id === modelId)?.name ?? "AI";
}
