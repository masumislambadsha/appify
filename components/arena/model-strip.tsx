"use client";

import { useState } from "react";
import { ArrowLeftRight, Plus, SlidersHorizontal, X } from "lucide-react";
import { MODELS } from "@/lib/data";
import { modelColor, modelName, modelVendor } from "@/lib/arena";
import { useChats } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ModelStripProps {
  chatId: string;
  modelId: string;
  compareMode: boolean;
}

export function ModelStrip({ chatId, modelId, compareMode }: ModelStripProps) {
  const { compareIds, toggleCompare, setCompareIds, setModel, setTemperature, chats } = useChats();
  const [tuning, setTuning] = useState(false);
  const chat = chats.find((c) => c.id === chatId);
  const temperature = chat?.temperature ?? 0.7;

  const targets = compareMode ? compareIds : [modelId];
  const addable = MODELS.filter((m) => !targets.includes(m.id)).slice(
    0,
    Math.max(0, 3 - targets.length),
  );

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-sand bg-cream-dim/50 px-3 py-2 sm:px-5 dark:border-olive-deep dark:bg-olive-surface/50">
      <span className="text-[11px] font-bold uppercase tracking-widest text-brass-deep dark:text-brass-bright">
        Targets:
      </span>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Active models — click to remove">
        {compareMode ? (
          targets.map((id) => (
            <button
              key={id}
              onClick={() => toggleCompare(id)}
              title={compareIds.length > 1 ? `Remove ${modelName(id)} from comparison` : `${modelName(id)} is the last target`}
              aria-label={`Remove ${modelName(id)} from comparison`}
              className="inline-flex items-center gap-1.5 rounded-full bg-olive py-1 pl-2.5 pr-2 text-xs font-bold text-cream transition hover:ring-2 hover:ring-brass dark:bg-brass dark:text-olive-ink"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: modelColor(id) }} aria-hidden="true" />
              {modelName(id)}
              <span className="font-mono text-[10px] font-medium opacity-70">{modelVendor(id)}</span>
              {compareIds.length > 1 && <X size={12} strokeWidth={2.5} aria-hidden="true" />}
            </button>
          ))
        ) : (
          <label className="inline-flex items-center gap-1.5 text-xs font-bold">
            <span className="sr-only">Chat model</span>
            <select
              value={modelId}
              onChange={(e) => setModel(chatId, e.target.value)}
              title="Chat model — switch anytime"
              className="cursor-pointer rounded-full bg-olive py-1 pl-3 pr-2 text-xs font-bold text-cream outline-none transition hover:ring-2 hover:ring-brass dark:bg-brass dark:text-olive-ink"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.vendor}
                </option>
              ))}
            </select>
          </label>
        )}
        {addable.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleCompare(m.id)}
            aria-label={`Add ${m.name} to comparison`}
            className="inline-flex items-center gap-1 rounded-full border border-sand-deep px-2.5 py-1 text-xs font-semibold text-olive-deep/70 transition hover:border-brass hover:text-olive-ink dark:border-olive-deep dark:text-cream/60 dark:hover:text-cream"
          >
            <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
            {m.name}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setTuning((v) => !v)}
            aria-expanded={tuning}
            aria-controls={`tuning-${chatId}`}
            aria-label="Sampling hyperparameters"
            title="Sampling hyperparameters (stored per chat; mock engine)"
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] transition",
              tuning
                ? "bg-olive text-cream dark:bg-brass dark:text-olive-ink"
                : "text-olive-deep/70 hover:bg-sand-soft dark:text-cream/60 dark:hover:bg-olive-deep",
            )}
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
            {temperature.toFixed(1)}
          </button>
          {tuning && (
            <div
              id={`tuning-${chatId}`}
              onKeyDown={(e) => {
                if (e.key === "Escape") setTuning(false);
              }}
              className="absolute right-0 top-full z-30 mt-1.5 w-52 rounded-xl border border-sand bg-cream-card p-3 shadow-pop dark:border-olive-deep dark:bg-olive-surface"
            >
              <label className="block text-[11px] font-bold" htmlFor={`temp-${chatId}`}>
                Temperature · {temperature.toFixed(1)}
              </label>
              <input
                id={`temp-${chatId}`}
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(chatId, Number(e.target.value))}
                className="mt-2 w-full accent-[#B8892D]"
              />
              <p className="mt-1.5 text-[10px] leading-snug opacity-60">
                Stored per chat. The mock engine streams the same text regardless.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCompareIds([...compareIds].reverse())}
          aria-label="Swap column order"
          title="Swap column order"
          disabled={compareIds.length < 2}
          className="grid h-7 w-7 place-items-center rounded-lg text-olive-deep/70 transition hover:bg-sand-soft disabled:opacity-30 dark:text-cream/60 dark:hover:bg-olive-deep"
        >
          <ArrowLeftRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
