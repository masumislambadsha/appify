import { MODELS } from "@/lib/data";
import type { Chat, Msg } from "@/lib/store";

/** Display name for a model id, safe for stale/persisted ids. */
export function modelName(id?: string): string {
  return MODELS.find((m) => m.id === id)?.name ?? "AI";
}

/** Brand dot color for a model id, safe for stale/persisted ids. */
export function modelColor(id?: string): string {
  return MODELS.find((m) => m.id === id)?.color ?? "#B8892D";
}

/** Vendor for a model id, safe for stale/persisted ids. */
export function modelVendor(id?: string): string {
  return MODELS.find((m) => m.id === id)?.vendor ?? "";
}

/** Rough token estimate (mock telemetry): ~4 chars per token. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}

/** Total estimated tokens across a chat's messages. */
export function chatTokens(chat: Chat): number {
  return chat.messages.reduce((n, m) => n + estimateTokens(m.text), 0);
}

/**
 * Deterministic per-model telemetry (stable across renders — never random,
 * so SSR and hydration always agree). Clearly mock figures for the demo.
 */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface ModelTelemetry {
  ttftMs: number;
  totalS: number;
  tokPerS: number;
}

export function mockTelemetry(modelId: string): ModelTelemetry {
  const h = hashStr(modelId || "ai");
  return {
    ttftMs: 14 + (h % 15),
    totalS: Math.round((0.9 + ((h >> 3) % 13) / 10) * 10) / 10,
    tokPerS: 78 + ((h >> 6) % 21),
  };
}

/** Blended mock rate card ($/1M tokens) for cost estimates. */
export function mockCostUsd(tokens: number): number {
  return (tokens / 1_000_000) * 2.4;
}

export function formatCost(usd: number): string {
  return `$${usd < 0.01 ? usd.toFixed(4) : usd.toFixed(2)}`;
}

export function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/** Distinct assistant model ids used in a chat, in first-seen order. */
export function distinctModels(chat: Chat): string[] {
  const seen: string[] = [];
  for (const m of chat.messages) {
    if (m.role === "assistant" && m.modelId && !seen.includes(m.modelId)) {
      seen.push(m.modelId);
    }
  }
  return seen;
}

export interface Exchange {
  user?: Msg;
  answers: Msg[];
}

/** Latest user question plus the assistant answers that followed it. */
export function latestExchange(chat: Chat): Exchange {
  const msgs = chat.messages;
  let lastUser = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === "user") {
      lastUser = i;
      break;
    }
  }
  if (lastUser < 0) return { answers: [] };
  return {
    user: msgs[lastUser],
    answers: msgs.slice(lastUser + 1).filter((m) => m.role === "assistant"),
  };
}
