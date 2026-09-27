export type AIModel = {
  id: string;
  name: string;
  vendor: string;
  tagline: string;
  strengths: string[];
  color: string;
  badge?: string;
};

// Flagship lineup as of September 2026 (verified against vendor releases).
export const MODELS: AIModel[] = [
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    vendor: "OpenAI",
    tagline: "Flagship reasoning, coding & computer use",
    strengths: ["Reasoning", "Code", "Agents"],
    color: "#4F5B2A",
    badge: "New",
  },
  {
    id: "opus-5-5",
    name: "Claude Opus 5.5",
    vendor: "Anthropic",
    tagline: "Fable-class coding & agents at 40% less",
    strengths: ["Coding", "Agents", "Docs"],
    color: "#B8892D",
  },
  {
    id: "gemini-3-8",
    name: "Gemini 3.8 Flash",
    vendor: "Google",
    tagline: "Best reasoning-per-dollar workhorse",
    strengths: ["Speed", "Coding", "Value"],
    color: "#6B7648",
  },
  {
    id: "grok-4-7",
    name: "Grok 4.7",
    vendor: "xAI",
    tagline: "Twice-as-fast coding & knowledge work",
    strengths: ["Code", "Speed", "Realtime"],
    color: "#8A671F",
  },
  {
    id: "deepseek-v4-1",
    name: "DeepSeek V4.1 Flash",
    vendor: "DeepSeek",
    tagline: "Open-weight agent specialist, 1M context",
    strengths: ["Open", "Agents", "Value"],
    color: "#3A431F",
    badge: "Open weight",
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    vendor: "Google",
    tagline: "Fast image create & edit",
    strengths: ["Images", "Edits", "Speed"],
    color: "#C4B28C",
  },
];

export type Category = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  prompt: string;
};

export const CATEGORIES: Category[] = [
  { id: "general", title: "General Chat", desc: "Everyday Q&A, brainstorming & help", icon: "💬", prompt: "Brainstorm 5 startup names for a sustainable sneaker brand…" },
  { id: "writing", title: "Writing Assistant", desc: "Draft, rewrite & polish anything", icon: "✍️", prompt: "Rewrite this email to sound confident but friendly: …" },
  { id: "pdf", title: "PDF & Word Analysis", desc: "Summarize & query long documents", icon: "📄", prompt: "Summarize this 40-page report into 5 bullets + action items…" },
  { id: "coding", title: "Coding & Dev", desc: "Generate, debug & explain code", icon: "💻", prompt: "Debug this React hook — it re-renders infinitely: …" },
  { id: "research", title: "AI Research", desc: "Web-grounded analysis & fact-check", icon: "🔎", prompt: "Compare GLP-1 studies from 2024–2026 with citations…" },
  { id: "image", title: "Image Analysis", desc: "Understand charts, screenshots & photos", icon: "🖼️", prompt: "Describe this chart and flag anomalies…" },
  { id: "ppt", title: "AI PPT Generator", desc: "From prompt to pitch deck outline", icon: "📊", prompt: "Create a 10-slide pitch deck for a campus food app…" },
  { id: "prompt", title: "Prompt Enhancer", desc: "Turn rough ideas into pro prompts", icon: "✨", prompt: "Enhance: 'write about marketing' → detailed brief…" },
  { id: "web", title: "Web Search & Fetch", desc: "Real-time answers from live pages", icon: "🌐", prompt: "Fetch https://example.com/pricing and summarize…" },
];

export const QUICK_ACTIONS = [
  { id: "summarize", label: "Summarize page", desc: "TL;DR of the current tab" },
  { id: "explain", label: "Explain selection", desc: "Plain-English explainer" },
  { id: "rewrite", label: "Rewrite text", desc: "Shorter / friendlier / formal" },
  { id: "code", label: "Explain code", desc: "Line-by-line walkthrough" },
];
