"use client";

import { GitFork, Pencil, Copy, Check, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import {
  distinctModels,
  estimateTokens,
  formatCost,
  formatTokens,
  mockCostUsd,
  mockTelemetry,
  modelName,
} from "@/lib/arena";
import type { Chat, Msg } from "@/lib/store";

export function TelemetryHeader({ chat, models }: { chat: Chat; models: string[] }) {
  const answers = chat.messages.filter((m) => m.role === "assistant");
  const answerTokens = answers.reduce((n, m) => n + estimateTokens(m.text), 0);
  const ttfts = models.map((id) => mockTelemetry(id).ttftMs);
  const category = CATEGORIES.find((c) => c.id === chat.category)?.title ?? "General";

  return (
    <div className="flex flex-col gap-2 border-b border-sand px-3 py-3 sm:px-5 dark:border-olive-deep">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 truncate font-mono text-[11px] text-olive-deep/60 dark:text-cream/50">
          <span className="hover:text-olive-ink dark:hover:text-cream">{category}</span>
          <span aria-hidden="true"> / </span>
          <span className="font-bold text-olive-ink dark:text-cream">{chat.title}</span>
        </p>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Session telemetry (mock figures)">
          <span className="chip !py-1 font-mono !text-[11px]" title="Live target count">
            <span className="h-2 w-2 animate-pulse rounded-full bg-olive dark:bg-brass-bright" aria-hidden="true" />
            Broadcasting ×{models.length}
          </span>
          <span className="chip hidden !py-1 font-mono !text-[11px] sm:inline-flex" title="Mock time-to-first-token range">
            TTFT {Math.min(...ttfts)}–{Math.max(...ttfts)}ms
          </span>
          <span className="chip hidden !py-1 font-mono !text-[11px] md:inline-flex" title="Mock blended cost for answer tokens">
            {formatTokens(answerTokens)} tok · {formatCost(mockCostUsd(answerTokens))}
          </span>
        </div>
      </div>
    </div>
  );
}

interface QueryCardProps {
  chat: Chat;
  user: Msg;
  onEdit: (text: string) => void;
  onBranch: () => void;
  onCopy: (text: string, id: string) => void;
  copied: boolean;
}

export function QueryCard({ chat, user, onEdit, onBranch, onCopy, copied }: QueryCardProps) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold">
          Benchmark query{" "}
          <span className="font-mono text-[11px] font-medium text-olive-deep/75 dark:text-cream/60">
            · {estimateTokens(user.text)} prompt tokens · streaming mock
          </span>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(user.text)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] text-olive-deep/70 transition hover:bg-sand-soft dark:text-cream/60 dark:hover:bg-olive-deep"
          >
            <Pencil size={12} aria-hidden="true" /> Edit
          </button>
          <button
            onClick={onBranch}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] text-olive-deep/70 transition hover:bg-sand-soft dark:text-cream/60 dark:hover:bg-olive-deep"
          >
            <GitFork size={12} aria-hidden="true" /> Branch
          </button>
          <button
            onClick={() => onCopy(user.text, `q-${user.id}`)}
            aria-label="Copy query"
            className="rounded-lg p-1.5 text-olive-deep/70 transition hover:bg-sand-soft dark:text-cream/60 dark:hover:bg-olive-deep"
          >
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <blockquote className="input-shell mt-3 px-4 py-3 text-[14px] leading-relaxed">
        {user.text}
      </blockquote>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Query context">
        <span className="chip !text-[11px]">{CATEGORIES.find((c) => c.id === chat.category)?.title ?? "General"}</span>
        <span className="chip !text-[11px]">{distinctModels(chat).length || "No"} answers yet</span>
        {chat.webSearch && <span className="chip !text-[11px]">Web-grounded</span>}
      </div>
    </div>
  );
}

export function ConsensusBanner({ chat, votes }: { chat: Chat; votes: Record<string, number> }) {
  const answers = chat.messages.filter((m) => m.role === "assistant" && m.text !== "");
  if (answers.length < 2) return null;
  const voted = answers.find((a) => votes[a.id]);
  const names = [...new Set(answers.map((a) => modelName(a.modelId)))];
  return (
    <div
      className="flex items-start gap-2.5 rounded-2xl border border-brass/50 bg-brass-soft/40 p-4 dark:bg-olive-surface"
      aria-live="polite"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brass text-olive-ink">
        <Sparkles size={16} aria-hidden="true" />
      </span>
      <div className="text-[13px] leading-relaxed">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
          Consensus · mock synthesis
        </p>
        <p className="mt-0.5">
          {names.join(" + ")} converge on the same core answer with different depth.{" "}
          {voted ? (
            <span className="font-bold">Preferred: {modelName(voted.modelId)}.</span>
          ) : (
            <span className="opacity-75">Vote a column to crown a preferred winner.</span>
          )}
        </p>
      </div>
    </div>
  );
}
