# EchoGPT Redesign — AppifyDevs Frontend Internship

Live demo (deploy to Vercel) · ` / ` landing · `/app` web app · `/extension` Chrome extension concept.

A complete redesign concept for the EchoGPT ecosystem: multi-AI chat workspace with
side-by-side model comparison, a single-page marketing site, and an interactive
Chrome extension prototype — all in one Next.js repo, one deploy.

## Routes

| Route | Task | What's inside |
|---|---|---|
| `/` | 2 — Landing | Glass hero, proof band, auto-playing Featured tour, divider-grid Features, model index (Sept 2026 lineup), tabbed live Preview, Why, animated Pricing, marquee Testimonials, tabbed FAQ, CTA, Footer |
| `/app` | 1 — Web app redesign | Sidebar + history search/pin/delete, model switcher, **Compare ×3**, streaming mock, prompt enhancer, quick actions, follow-ups, `?cat=` deep-links |
| `/extension` | 3 — Extension concept | Interactive 400px popup (Chat/Tools/History/Settings tabs), model picker, quick actions, page-context toggle, side-panel flow + settings spec |

## Tech

- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS
- Framer Motion (reveals, drawer, tab transitions) · custom theme provider (dark/light, persisted + reduced-motion aware) · zustand + persist (chat store) · lucide-react (icons)
- Landing hero: refractive glass headline (vendored WebGL, `components/ui/`) over a brand-palette field, plus a lightweight canvas flow-gradient for ambient moments
- Pricing extras: canvas-confetti + @number-flow/react · shadcn primitives in `components/ui/` (button, card, switch, carousel/panel/faq/marquee building blocks) on CSS-var theme tokens
- No UI kit by default — reusable primitives in `components/site.tsx` (`.btn-primary`, `.card`, `.chip`, `.input-shell`)

## Palette (as specified)

- `#F5EFE3` cream — light bg · `#4F5B2A` olive — primary/brand
- `#B8892D` brass — accent · `#D8C9A8` sand — borders/muted
- Dark mode derives olive-ink `#15180E` + surface `#1E2414`, brass brightened to `#D2A44A` for contrast.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production check
npm run lint
```

No env vars needed — the demo streams mock responses locally.

## Architecture

```text
app/
  page.tsx            landing (single-page)
  app/page.tsx        chat workspace (client, streaming)
  extension/page.tsx  extension concept (client, interactive)
  layout.tsx          fonts + theme provider + skip link
components/
  site.tsx            Logo, SiteNav, SiteFooter, ThemeToggle, SectionHeading
  providers.tsx       next-themes wrapper
  flow-gradient.tsx   lightweight brand-palette canvas gradient
  preview-showcase.tsx tabbed live Preview (self-typing chat + extension panes)
  ui/                 glass-headline-hero, features-with-panel, pricing,
                      testimonial-columns, faq-tabs, button, card, switch
hooks/
  use-media-query.ts  SSR-safe matchMedia hook
public/
  icon.svg            custom EchoGPT favicon (+ favicon.ico fallback)
lib/
  data.ts             MODELS (6, Sept 2026 lineup), CATEGORIES (9), QUICK_ACTIONS
  mock-ai.ts          mockAnswer() + streamText() + enhancePrompt()
  store.ts            zustand chat store (persisted as echogpt-chats-v1)
  utils.ts            cn()
```

### Going live later

Swap `lib/mock-ai.ts` for a fetch to your backend — the UI already handles
token streaming via `updateMsg(chatId, msgId, partial)`. Suggested contract:
`POST /api/chat { modelId, messages[] } → SSE/ndjson tokens`.
Endpoint field is already in the extension Settings tab.

## Assumptions

- Mock AI (no keys, no backend) so the Vercel demo works instantly; personalities differ per model to make Compare meaningful.
- No auth — history in `localStorage`; extension uses `chrome.storage` in the real build.
- Screenshots/product previews are CSS-built live mockups (sharper than images, zero weight).
- Extension is an interactive web concept + flow spec, not a packaged `.zip` (manifest notes inline).
- Pricing/testimonials are concept copy to complete the brief.

## Extra features

- Compare up to 3 models with "vote clearest" · prompt enhancer (wand button)
- `?cat=` deep-links from landing cards · follow-up chips · copy/regenerate
- Featured tour auto-plays every 3.5s with progress rail (pauses on hover/focus)
- Interactive panel mockups: copy-to-clipboard "Copied!" toast, winner voting
- Animated pricing (monthly/annual toggle, NumberFlow prices, confetti), marquee testimonials with Load-more, tabbed FAQ
- Mobile drawer, 44px targets, skip link, `aria-live`, focus rings, `prefers-reduced-motion`
- Optimistic streaming UI, skeletons via "thinking…" state, persistent pins
- Old saved chats survive model-lineup refreshes (graceful id fallback)

## Evaluation mapping

Architecture (App Router + store/adapter split) · Quality (TS strict, small modules) ·
UI/UX (one palette, one input, one model switcher everywhere) · Responsive (drawer + grids) ·
Performance (no images, Server landing + dynamic chat, streaming without WS) ·
Creativity (compare voting, page-context toggle, enhancer) · Detail (shortcuts, toasts, votes) · Problem-solving (mock → real API path documented).
