"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRovingTabs } from "@/hooks/use-roving-tabs";

export interface FaqEntry {
  question: string;
  answer: string;
}

export type FaqGroups = Record<string, FaqEntry[]>;

const ECHO_CATEGORIES: Record<string, string> = {
  product: "Product",
  models: "Models",
  privacy: "Privacy & data",
};

const ECHO_FAQ: FaqGroups = {
  product: [
    {
      question: "Is this connected to the real EchoGPT backend?",
      answer:
        "No — this is a frontend redesign concept. Chats stream realistic mock responses locally with no API key, and history persists in your browser. The README documents a ChatProvider adapter for wiring a real API later.",
    },
    {
      question: "What does the Chrome extension do?",
      answer:
        "Sidebar chat, summarize-any-page, explain-selected-text, quick rewrites and a settings page (default model, endpoint, page-context toggle). Page content is attached only when you toggle it on. Shortcut: Ctrl/⌘ + Shift + E.",
    },
    {
      question: "Do I need an account or API keys?",
      answer:
        "No. Open /app and start typing — no signup, no keys. The extension concept signs in with an EchoGPT or Google account in the real build.",
    },
    {
      question: "Is it responsive and accessible?",
      answer:
        "Yes — mobile drawer navigation, 44px touch targets, skip link, aria-live streaming regions, visible focus rings, keyboard-first controls and reduced-motion support.",
    },
  ],
  models: [
    {
      question: "Which AI models are supported?",
      answer:
        "GPT-6 Astra, Claude Opus 5.5, Gemini 3.8 Flash, Grok 4.7, DeepSeek V4.1 Flash and Nano Banana 2 for visuals. Switch per-chat or compare up to three side by side.",
    },
    {
      question: "How does Compare mode work?",
      answer:
        "Ask once and up to three models answer in parallel columns. Vote for the clearest, then continue the thread with the winner — the others stay visible for reference.",
    },
    {
      question: "Can I plug in real APIs later?",
      answer:
        "Yes. Swap lib/mock-ai.ts for a fetch to your backend — the UI already streams partial tokens, and the extension settings already has an endpoint field waiting for it.",
    },
  ],
  privacy: [
    {
      question: "Where is my chat history stored?",
      answer:
        "In your browser (localStorage on the web; chrome.storage.local in the extension concept). Pin, rename or delete any thread at any time — nothing leaves the device in this demo.",
    },
    {
      question: "Does the demo phone home?",
      answer:
        "No trackers, no analytics. The mock engine runs entirely locally; only future real API calls would make network requests, and those go to an endpoint you configure.",
    },
    {
      question: "What page data does the extension read?",
      answer:
        "Only the text a feature needs — the current tab for summarise, your selection for explain — and only while the page-context toggle is on. Never sold, never shared.",
    },
  ],
};

interface FaqTabsProps {
  title?: string;
  subtitle?: string;
  categories?: Record<string, string>;
  faqData?: FaqGroups;
  className?: string;
}

export function FaqTabs({
  title = "Questions, answered",
  subtitle = "FAQ",
  categories = ECHO_CATEGORIES,
  faqData = ECHO_FAQ,
  className,
}: FaqTabsProps) {
  const categoryKeys = Object.keys(categories);
  const [selected, setSelected] = React.useState(0);
  const { getTabProps, getPanelProps } = useRovingTabs({
    idPrefix: "faq",
    count: categoryKeys.length,
    selected,
    onSelect: setSelected,
  });

  return (
    <div className={cn("relative", className)}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-kicker">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>

      <div
        role="tablist"
        aria-label="FAQ categories"
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        {Object.entries(categories).map(([key, label], i) => (
          <button
            key={key}
            role="tab"
            aria-selected={i === selected}
            onClick={() => setSelected(i)}
            {...getTabProps(i)}
            className={cn(
              "relative overflow-hidden whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-300",
              i === selected
                ? "border-primary text-background"
                : "border-sand-deep bg-transparent text-muted-foreground hover:border-brass hover:text-foreground dark:border-olive-deep",
            )}
          >
            <span className="relative z-10">{label}</span>
            <AnimatePresence>
              {i === selected && (
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.35, ease: "backIn" }}
                  className="absolute inset-0 z-0 bg-primary"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {categoryKeys.map((key, i) => {
            if (i !== selected) return null;
            const questions = faqData[key];
            if (!questions) return null;
            return (
              <motion.div
                key={key}
                role="tabpanel"
                {...getPanelProps(i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: "backIn" }}
                className="space-y-3"
              >
                {questions.map((faq) => (
                  <FaqItem key={faq.question} {...faq} />
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: FaqEntry) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelId = React.useId();
  const buttonId = React.useId();

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        isOpen ? "border-brass bg-card" : "border-sand bg-card dark:border-olive-deep",
      )}
    >
      <button
        id={buttonId}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span
          className={cn(
            "text-[15px] font-semibold transition-colors",
            isOpen ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {question}
        </span>
        <motion.span
          animate={isOpen ? "open" : "closed"}
          variants={{ open: { rotate: "45deg" }, closed: { rotate: "0deg" } }}
          transition={{ duration: 0.2 }}
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
            isOpen
              ? "border-brass bg-brass text-olive-ink"
              : "border-sand-deep text-muted-foreground dark:border-olive-deep",
          )}
          aria-hidden="true"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
        </motion.span>
      </button>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        // Collapsed panels are height:0/opacity:0 but stay in the DOM —
        // hide them from assistive tech and take them out of tab order.
        aria-hidden={!isOpen}
        inert={!isOpen}
        initial={false}
        animate={{
          height: isOpen ? "auto" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}
