export function mockAnswer(modelId: string, prompt: string, salt = 0): string {
  const p = prompt.slice(0, 140);
  const base: Record<string, string> = {
    "gpt-6-astra": `Here's my take on "${p}${prompt.length > 140 ? "…" : ""}", worked end to end.\n\n**Plan → result**\n- Agentic answer with trade-offs and next steps\n- Concrete example you can copy-paste\n- Follow-up: want it shorter, or as slides?`,
    "opus-5-5": `Thanks — let me work through "${p}${prompt.length > 140 ? "…" : ""}" carefully.\n\n**Analysis**\n- Context and assumptions stated plainly\n- Fable-class answer at a fraction of the cost\n- Suggested follow-ups to go deeper`,
    "gemini-3-8": `Fast, sharp answer for "${p}${prompt.length > 140 ? "…" : ""}".\n\n- Workhorse summary: 3 bullets + sources you'd verify\n- Reasoning quality near flagships, Flash speed\n- Ask me to fetch a live URL to verify`,
    "grok-4-7": `Real talk on "${p}${prompt.length > 140 ? "…" : ""}" — at 2× speed:\n\n- Blunt summary, self-checked, no fluff\n- Counter-take you might be missing\n- Want the meme version or the boardroom version?`,
    "deepseek-v4-1": `Reasoning through "${p}${prompt.length > 140 ? "…" : ""}" step by step:\n\n1. Decompose (8B active on read, 16B on write)\n2. Solve with minimal assumptions\n3. Verify with an example\n\nOpen weights, 1M context — paste code or numbers and I'll go deeper.`,
    "nano-banana-2": `Visual-first answer for "${p}${prompt.length > 140 ? "…" : ""}":\n\n- Image create & edit, slide-ready structure\n- Title → 3 visuals → caption\n- Say "make slides" and I'll outline a 10-slide deck.`,
  };
  const body =
    base[modelId] ??
    `Answer for "${p}". This is a local mock — wire NEXT_PUBLIC_API_URL to go live.`;
  // Retries stream a visibly fresh pass instead of byte-identical text.
  return salt > 0 ? `${body}\n\n*(Take ${salt + 1} — same question, fresh pass.)*` : body;
}

export async function* streamText(
  full: string,
  chunkSize = 14,
  delayMs = 18
): AsyncGenerator<string> {
  for (let i = 0; i < full.length; i += chunkSize) {
    await new Promise((r) => setTimeout(r, delayMs));
    yield full.slice(0, i + chunkSize);
  }
}

export function enhancePrompt(raw: string): string {
  const t = raw.trim() || "Explain this topic";
  return `Goal: ${t}\n\nContext: Assume a smart beginner audience.\nFormat: 1) 2-sentence TL;DR 2) 5 bullets 3) Example 4) Next step.\nTone: confident, friendly, concrete. Avoid jargon.`;
}
