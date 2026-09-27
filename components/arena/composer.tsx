"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Globe, Paperclip, Wand2 } from "lucide-react";
import { enhancePrompt } from "@/lib/mock-ai";
import { modelColor, modelName } from "@/lib/arena";
import { useChats, type Chat } from "@/lib/store";
import { cn } from "@/lib/utils";

const FOLLOW_UPS = ["Make it shorter", "Add an example", "More formal", "Turn into bullets"];

const QUICK_PREFIXES = [
  { id: "summarize", label: "Summarize" },
  { id: "explain", label: "Explain" },
  { id: "rewrite", label: "Rewrite" },
  { id: "code", label: "Debug code" },
];

interface ComposerDockProps {
  chat: Chat;
  models: string[];
  compareMode: boolean;
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  busy: boolean;
  onNewChat: () => void;
}

export function ComposerDock({
  chat,
  models,
  compareMode,
  input,
  onInput,
  onSend,
  busy,
  onNewChat,
}: ComposerDockProps) {
  const { setWebSearch } = useChats();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [attachNote, setAttachNote] = useState(false);
  const webSearch = chat.webSearch ?? false;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [input]);

  useEffect(() => {
    if (!attachNote) return;
    const t = window.setTimeout(() => setAttachNote(false), 2200);
    return () => window.clearTimeout(t);
  }, [attachNote]);

  return (
    <div className="border-t border-sand bg-cream px-3 pb-3 pt-2 sm:px-6 dark:border-olive-deep dark:bg-olive-ink">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5" role="group" aria-label="Suggested follow-ups">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-olive-deep/50 dark:text-cream/40">
            Follow-up:
          </span>
          {FOLLOW_UPS.map((f) => (
            <button
              key={f}
              onClick={() => onInput(`${f}: `)}
              className="chip shrink-0 transition hover:border-brass"
            >
              + {f}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="input-shell flex items-end gap-2 p-2 pl-4"
        >
          <label htmlFor="prompt" className="sr-only">
            Message EchoGPT
          </label>
          <textarea
            id="prompt"
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
              if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                onNewChat();
              }
            }}
            placeholder={`Ask ${compareMode ? `${models.length} models` : modelName(models[0])} simultaneously…  (Shift + Enter for newline)`}
            className="max-h-36 min-h-[52px] flex-1 resize-none overflow-hidden bg-transparent text-[14px] outline-none placeholder:text-olive-deep/60 dark:placeholder:text-cream/60"
          />
          <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
            {QUICK_PREFIXES.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => onInput((input ? `${input} ` : "") + `[${q.label}] `)}
                title={`Prefix: ${q.label}`}
                className="hidden rounded-lg px-2 py-1.5 font-mono text-[10px] text-olive-deep/60 transition hover:bg-sand-soft md:block dark:text-cream/50 dark:hover:bg-olive-deep"
              >
                {q.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAttachNote(true)}
            title="Attach context (mocked in this concept)"
            aria-label="Attach context"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-sand-deep text-olive-deep/70 transition hover:border-brass dark:border-olive-deep dark:text-cream/60"
          >
            <Paperclip size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onInput(enhancePrompt(input))}
            title="Enhance prompt"
            aria-label="Enhance prompt"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-sand-deep text-brass-deep transition hover:border-brass dark:border-olive-deep dark:text-brass-bright"
          >
            <Wand2 size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setWebSearch(chat.id, !webSearch)}
            aria-pressed={webSearch}
            title={webSearch ? "Web search on — answers note live grounding" : "Turn on web search"}
            aria-label="Toggle web search"
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition",
              webSearch
                ? "border-brass bg-brass text-olive-ink"
                : "border-sand-deep text-olive-deep/70 hover:border-brass dark:border-olive-deep dark:text-cream/60",
            )}
          >
            <Globe size={16} aria-hidden="true" />
          </button>
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Broadcast to models"
            title="Broadcast (Shift + Enter)"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-olive px-3 text-cream transition enabled:hover:bg-olive-deep disabled:opacity-40 dark:bg-brass dark:text-olive-ink dark:enabled:hover:bg-brass-bright"
          >
            <span className="flex -space-x-1" aria-hidden="true">
              {models.slice(0, 3).map((id) => (
                <span
                  key={id}
                  className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold ring-2 ring-olive dark:ring-brass"
                  style={{ background: modelColor(id) }}
                >
                  {modelName(id).slice(0, 1)}
                </span>
              ))}
            </span>
            <ArrowUp size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-1.5 text-[11px] text-olive-deep/75 dark:text-cream/60" aria-live="polite">
          <span className="hidden font-mono sm:block">Shift + Enter to send · ⌘K new chat</span>
          <span>
            {attachNote
              ? "Attachments are mocked in this concept."
              : `EchoGPT concept · Mock endpoints · ${webSearch ? "Web-grounded" : "History stays in this browser"}`}
          </span>
        </div>
      </div>
    </div>
  );
}
