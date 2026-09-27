"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** Client island: the only interactive piece of the site chrome. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // Hydration-safe mount flag without setState-in-effect.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) return <div className={cn("h-9 w-9 rounded-xl border border-sand-deep", className)} aria-hidden />;
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sand-deep bg-cream-card text-olive-deep transition hover:border-brass hover:text-brass-deep dark:border-olive-deep dark:bg-olive-surface dark:text-cream dark:hover:border-brass-bright",
        className
      )}
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
