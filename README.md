# BondFlow — Fixed-Income Trading Terminal

A real-time fixed-income (bond) trading terminal built with Next.js App Router. BondFlow
pairs a polished marketing site with a Bloomberg-style trading cockpit: streaming quotes,
a live yield curve, an order ticket with market/limit execution, a trade blotter, a
positions & P&L panel, keyboard shortcuts, and a pluggable market-data feed.

> All market data is **simulated client-side** by default — no external feed or backend is
> required. Look for the `SIMULATION` badge in the terminal header. A `Live Feed (WS)` mode
> demonstrates exactly where a real WebSocket venue feed would plug in.

## Routes

- **`/`** — marketing landing page (hero, features, animated live preview, architecture,
  Tradeweb alignment, project background).
- **`/terminal`** — the live trading terminal.
- **`/about`** — project background, design goals, and how the simulation maps to a real
  fixed-income venue.
- **`/settings`** — engine/display settings.

## Features

### Terminal
- **Live Market Overview** — streaming bid/ask/mid quotes for US 2Y, 5Y, 10Y, and 30Y
  Treasuries, with price-flash animations, per-row sparklines, and click-to-load into the
  order ticket. Loading skeletons show until the first tick lands.
- **Yield Curve** — an always-current curve (2s–30s) with the 10Y–2Y spread and average
  yield, rendered with Recharts.
- **Order Ticket** — Buy/Sell, Market or Limit orders, with an estimated fill price.
  Driven by a shared draft store so keyboard shortcuts and the watchlist stay in sync.
- **Trade Blotter** — every execution, searchable and filterable by instrument and side.
- **Positions & P&L** — nets your fills (VWAP entry), marks them to the live market in
  real time, and shows a per-position sparkline plus aggregate net P&L.
- **Engine Controls** — pause/resume, volatility (Low/Medium/High), tick interval
  (Fast/Normal/Slow), and a feed-mode switch (Simulation ↔ WebSocket placeholder).
- **Keyboard shortcuts** — `B`/`S` set side, `↑`/`↓` cycle instruments, `Enter` submits,
  `Space` pauses, `?` opens the shortcuts reference.
- **Responsive** — panels stack on mobile and engine controls move into a slide-out drawer.

### Landing
- Animated hero with a live yield-curve motif, scroll-reveal sections, an interactive
  mock terminal preview, a stack/architecture diagram, and a Tradeweb-alignment section.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** with a custom dark trading theme
- **Zustand** for global market/order/UI state
- **Recharts** for the yield curve
- **Framer Motion** for reveals, blotter, and toast animations
- **lucide-react** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or
[http://localhost:3000/terminal](http://localhost:3000/terminal) for the terminal.

## Architecture

```
app/
  layout.tsx                Root layout, fonts, metadata
  page.tsx                  Marketing landing page
  (terminal)/
    layout.tsx              Terminal chrome (app shell + market engine)
    terminal/page.tsx       The trading dashboard (assembles all panels)
    about/page.tsx          Project background
    settings/page.tsx       Engine/display settings
components/
  landing/                  Hero, nav, feature grid, live preview, architecture, footer
  layout/                   Top bar, sidebar, clock, engine controls, app shell, mobile drawer
  trading/                  Watchlist, yield curve, order ticket, blotter, positions,
                            keyboard shortcuts, feed banner, shortcuts modal, engine provider
  shared/                   Panel wrapper, sparkline, toaster
  ui/                       Button, card, input, label, select, skeleton, modal
lib/
  marketData/
    instruments.ts          Seed Treasury instruments
    engine.ts               Random-walk price/yield simulation (implements MarketFeed)
    feed.ts                 MarketFeed interface + FeedMode
    websocketFeed.ts        Placeholder WebSocket feed (integration point)
  store/
    marketStore.ts          Instruments, orders, trades, positions, price history
    orderStore.ts           Shared order-ticket draft
    uiStore.ts              Shortcuts modal + mobile drawer state
    toastStore.ts           Lightweight toast notifications
  types/                    Shared domain types
  format.ts                 Number/price/time formatting helpers
```

### Pluggable market data feed

Both data sources implement a single `MarketFeed` interface (`lib/marketData/feed.ts`):

```ts
interface MarketFeed {
  start(): void
  stop(): void
  setVolatility(mode: VolatilityMode): void
  setIntervalMs(ms: number): void
  subscribe(listener: (ticks: MarketTick[]) => void): () => void
}
```

`MarketEngineProvider` selects the active feed from `feedMode` in the store and pipes ticks
into `applyTicks(...)`. The default `MarketDataEngine` runs a random-walk over each bond's
mid price (scaled by volatility), derives a bid/ask spread, and converts price moves into
yield moves. To connect a real venue, implement `MarketFeed` against a WebSocket (see the
stubbed `websocketFeed.ts`) — no UI changes required.

### Why renders stay cheap and SSR-safe

Components subscribe to **stable** raw state slices and derive lists/curves locally with
`useMemo`, rather than returning freshly-allocated arrays from inside a selector. This keeps
React 19's `getServerSnapshot` stable and avoids render loops.

## Notes

This is a front-end simulation intended for demos and UI work. The `Live Feed (WS)` toggle
intentionally freezes the simulation and surfaces the integration point rather than faking
a connection.
