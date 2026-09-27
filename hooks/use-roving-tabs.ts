"use client";

import * as React from "react";
export function useRovingTabs(options: {
  idPrefix: string;
  count: number;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const { idPrefix, count, selected, onSelect } = options;
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const tabId = (index: number) => `${idPrefix}-tab-${index}`;
  const panelId = (index: number) => `${idPrefix}-panel-${index}`;

  const getTabProps = (index: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      refs.current[index] = el;
    },
    id: tabId(index),
    tabIndex: selected === index ? 0 : -1,
    "aria-controls": panelId(index),
    onKeyDown: (e: React.KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (index + 1) % count;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (index - 1 + count) % count;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = count - 1;
      }
      if (next === null) return;
      e.preventDefault();
      onSelect(next);
      refs.current[next]?.focus();
    },
  });

  const getPanelProps = (index: number) => ({
    id: panelId(index),
    "aria-labelledby": tabId(index),
  });

  return { getTabProps, getPanelProps };
}
