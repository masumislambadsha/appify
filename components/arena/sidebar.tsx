"use client";

import Link from "next/link";
import {
  Code2,
  FileText,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  PenLine,
  Pin,
  Plus,
  Presentation,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/site";
import { CATEGORIES } from "@/lib/data";
import {
  chatTokens,
  distinctModels,
  formatTokens,
  modelName,
} from "@/lib/arena";
import { useChats, type Chat } from "@/lib/store";
import { cn } from "@/lib/utils";

const WORKFLOW_ICONS: Record<string, React.ReactNode> = {
  general: <MessageSquare size={16} aria-hidden="true" />,
  writing: <PenLine size={16} aria-hidden="true" />,
  pdf: <FileText size={16} aria-hidden="true" />,
  coding: <Code2 size={16} aria-hidden="true" />,
  research: <Search size={16} aria-hidden="true" />,
  image: <ImageIcon size={16} aria-hidden="true" />,
  ppt: <Presentation size={16} aria-hidden="true" />,
  prompt: <Sparkles size={16} aria-hidden="true" />,
  web: <Globe size={16} aria-hidden="true" />,
};

const QUOTA_TOKENS = 20000;

function QuotaCard() {
  const { chats } = useChats();
  const used = chats.reduce((n, c) => n + chatTokens(c), 0);
  const pct = Math.min(99.9, (used / QUOTA_TOKENS) * 100);
  return (
    <div className="rounded-xl border border-sand bg-cream-card p-3 dark:border-olive-deep dark:bg-olive-surface">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span>Demo token quota</span>
        <span className="font-mono text-brass-deep dark:text-brass-bright">
          {pct.toFixed(1)}%
        </span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-olive/10 dark:bg-cream/10"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Demo token quota used"
      >
        <div className="h-full rounded-full bg-olive dark:bg-brass" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-olive-deep/60 dark:text-cream/50">
        <span>{formatTokens(used)} / 20k used</span>
        <Link href="/#pricing" className="font-bold text-brass-deep hover:underline dark:text-brass-bright">
          Top up
        </Link>
      </div>
    </div>
  );
}

function HistoryRow({
  chat,
  active,
  onSelect,
  onPin,
  onRemove,
}: {
  chat: Chat;
  active: boolean;
  onSelect: () => void;
  onPin: () => void;
  onRemove: () => void;
}) {
  const models = distinctModels(chat).slice(0, 2);
  return (
    <div
      className={cn(
        "group rounded-xl px-2.5 py-2 transition focus-within:opacity-100",
        active ? "bg-olive text-cream dark:bg-brass dark:text-olive-ink" : "hover:bg-sand-soft dark:hover:bg-olive-surface",
      )}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={onSelect}
          className="min-w-0 flex-1 truncate text-left text-[13px] font-medium"
          title={chat.title}
        >
          {chat.pinned ? <span aria-hidden="true">📌 </span> : ""}{chat.title}
        </button>
        {/* p-1.5 keeps targets ≥24px (WCAG 2.5.8); max-md keeps them
            visible where there is no hover to reveal them. */}
        <button
          onClick={onPin}
          aria-label={chat.pinned ? "Unpin chat" : "Pin chat"}
          aria-pressed={!!chat.pinned}
          className="rounded p-1.5 opacity-0 transition group-hover:opacity-100 focus:opacity-100 max-md:opacity-100"
        >
          <Pin size={13} aria-hidden="true" />
        </button>
        <button
          onClick={onRemove}
          aria-label="Delete chat"
          className="rounded p-1.5 opacity-0 transition hover:text-red-700 group-hover:opacity-100 focus:opacity-100 max-md:opacity-100"
        >
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-1 flex items-center gap-1 pl-0.5">
        {models.length === 0 && (
          <span
            className={cn(
              "text-[10px]",
              // Active rows sit on olive (light) / brass (dark) — the muted
              // inactive tone is unreadable there, so branch on the prop
              // (the `active:` variant is only the press state).
              active ? "text-cream/80 dark:text-olive-ink" : "text-olive-deep/50 dark:text-cream/40",
            )}
          >
            Draft — no answers yet
          </span>
        )}
        {models.map((m) => (
          <span
            key={m}
            className={cn(
              "rounded px-1.5 py-px font-mono text-[10px]",
              active ? "bg-white/20" : "bg-olive/10 dark:bg-cream/10",
            )}
          >
            {modelName(m)}
          </span>
        ))}
        {models.length > 1 && (
          <span className="font-mono text-[10px] opacity-60">vs</span>
        )}
      </div>
    </div>
  );
}

interface ArenaSidebarProps {
  query: string;
  onQuery: (v: string) => void;
  chats: Chat[];
  activeId: string | null;
  onNew: (cat?: string) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onRemove: (id: string) => void;
  onClose?: () => void;
}

export function ArenaSidebar({
  query,
  onQuery,
  chats,
  activeId,
  onNew,
  onSelect,
  onPin,
  onRemove,
  onClose,
}: ArenaSidebarProps) {
  return (
    <>
      <div className="flex items-center justify-between p-3">
        <Logo compact />
        <div className="flex items-center gap-1">
          <button onClick={() => onNew()} className="btn-primary !px-2.5 !py-1.5 text-xs" aria-label="New chat">
            <Plus size={14} aria-hidden="true" /> New
          </button>
          {onClose && (
            <button onClick={onClose} data-drawer-close aria-label="Close menu" className="rounded-lg p-2 hover:bg-sand-soft md:hidden dark:hover:bg-olive-surface">
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="px-3">
        <label className="input-shell flex items-center gap-2 px-3 py-2">
          <Search size={14} className="shrink-0 opacity-60" aria-hidden="true" />
          <span className="sr-only">Search chats</span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search history…"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-olive-deep/60 dark:placeholder:text-cream/60"
          />
        </label>
      </div>

      <div className="px-3 pt-3">
        <p className="px-1 text-[11px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
          Workflows
        </p>
        <nav className="mt-1.5 space-y-0.5" aria-label="Workflows">
          {CATEGORIES.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => onNew(c.id)}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition hover:bg-sand-soft dark:hover:bg-olive-surface"
            >
              <span className="text-olive-deep/70 dark:text-cream/60">
                {WORKFLOW_ICONS[c.id] ?? <Sparkles size={16} aria-hidden="true" />}
              </span>
              {c.title}
            </button>
          ))}
        </nav>
      </div>

      <nav className="slim-scroll mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3" aria-label="Chat history">
        <p className="px-2 pt-2 text-[11px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
          Recent
        </p>
        <ul className="mt-1 space-y-0.5">
          {chats.map((c) => (
            <li key={c.id}>
              <HistoryRow
                chat={c}
                active={c.id === activeId}
                onSelect={() => onSelect(c.id)}
                onPin={() => onPin(c.id)}
                onRemove={() => onRemove(c.id)}
              />
            </li>
          ))}
          {chats.length === 0 && (
            <li className="px-3 py-6 text-center text-xs opacity-60">
              No chats match “{query}”.
            </li>
          )}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-sand p-3 dark:border-olive-deep">
        <QuotaCard />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-olive text-cream dark:bg-brass dark:text-olive-ink">
              <User size={15} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-bold">Demo User</span>
              <span className="block text-[11px] opacity-60">Browser session</span>
            </span>
          </span>
          <Link
            href="/extension"
            aria-label="Extension settings concept"
            title="Extension settings concept"
            className="rounded-lg p-2 hover:bg-sand-soft dark:hover:bg-olive-surface"
          >
            <Settings2 size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
