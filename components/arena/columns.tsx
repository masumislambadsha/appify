"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import {
  estimateTokens,
  formatCost,
  mockCostUsd,
  mockTelemetry,
  modelColor,
  modelName,
  modelVendor,
} from "@/lib/arena";
import type { Msg } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ArenaColumnsProps {
  models: string[];
  answers: Msg[];
  busy: boolean;
  votes: Record<string, number>;
  onVote: (msgId: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onRegenerate: (modelId: string) => void;
}

function ColumnActions({
  busy,
  voted,
  copied,
  onVote,
  onCopy,
  onRegenerate,
}: {
  busy: boolean;
  voted: boolean;
  copied: boolean;
  onVote: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-sand px-4 py-2.5 dark:border-olive-deep">
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-olive-deep/75 transition hover:bg-sand-soft hover:text-olive-ink dark:text-cream/65 dark:hover:bg-olive-deep"
      >
        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={onRegenerate}
        disabled={busy}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-olive-deep/75 transition enabled:hover:bg-sand-soft disabled:opacity-40 dark:text-cream/65 dark:enabled:hover:bg-olive-deep"
      >
        <RotateCcw size={13} aria-hidden="true" /> Regenerate
      </button>
      <button
        onClick={onVote}
        aria-pressed={voted}
        className={cn(
          "ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition",
          voted
            ? "bg-brass text-olive-ink"
            : "bg-olive text-cream hover:bg-olive-deep dark:bg-olive-deep dark:text-cream dark:hover:bg-brass dark:hover:text-olive-ink",
        )}
      >
        {voted ? "★ Preferred winner" : "Pick as winner"}
      </button>
    </div>
  );
}

export function ArenaColumns({
  models,
  answers,
  busy,
  votes,
  onVote,
  onCopy,
  copiedId,
  onRegenerate,
}: ArenaColumnsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-4",
        models.length > 1 && "md:grid-cols-2",
        models.length > 2 && "xl:grid-cols-3",
      )}
      role="group"
      aria-label="Model responses"
    >
      {models.map((mid) => {
        const answer = [...answers].reverse().find((a) => a.modelId === mid);
        const tele = mockTelemetry(mid);
        const tokens = answer ? estimateTokens(answer.text) : 0;
        return (
          <article
            key={mid}
            className="flex flex-col overflow-hidden rounded-2xl border border-sand bg-cream-card shadow-card dark:border-olive-deep dark:bg-olive-surface"
            aria-label={`${modelName(mid)} response`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-sand bg-cream-dim/50 px-4 py-2.5 dark:border-olive-deep dark:bg-olive-ink/60">
              <p className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: modelColor(mid) }}
                  aria-hidden="true"
                />
                <span className="truncate text-[13px] font-bold">{modelName(mid)}</span>
                <span className="hidden truncate font-mono text-[10px] text-olive-deep/75 sm:inline dark:text-cream/60">
                  {modelVendor(mid)}
                </span>
              </p>
              <p
                className="shrink-0 font-mono text-[10px] text-olive-deep/75 dark:text-cream/60"
                title="Mock latency figures"
              >
                {tele.totalS}s · {tele.tokPerS} tok/s
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pt-2.5" role="group" aria-label="Mock metrics">
              <span className="chip !py-0.5 font-mono !text-[10px]">TTFT {tele.ttftMs}ms</span>
              <span className="chip !py-0.5 font-mono !text-[10px]">
                {tokens} tok · {formatCost(mockCostUsd(tokens))}
              </span>
            </div>

            {/* Deliberately non-live: answers stream token-by-token and a
                live region here would announce every chunk. Turn state is
                announced once via the workspace status line instead. */}
            <div className="min-h-[120px] flex-1 px-4 py-3 text-[14px] leading-relaxed">
              {!answer || (answer.text === "" && (
                <span className="animate-blink text-olive-deep/60 dark:text-cream/50">thinking…</span>
              ))}
              {answer && answer.text !== "" && (
                <p className="whitespace-pre-wrap">{answer.text}</p>
              )}
            </div>

            {answer && answer.text !== "" && !busy && (
              <ColumnActions
                busy={busy}
                voted={!!votes[answer.id]}
                copied={copiedId === answer.id}
                onVote={() => onVote(answer.id)}
                onCopy={() => onCopy(answer.text, answer.id)}
                onRegenerate={() => onRegenerate(mid)}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}
