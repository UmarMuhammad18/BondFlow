# BondFlow — Fixed-Income Trading Terminal

A real-time fixed-income (bond) trading terminal built with Next.js App Router. BondFlow
simulates a live US Treasury market and gives you a Bloomberg-style cockpit: streaming
quotes, a live yield curve, an order ticket with market/limit execution, a trade blotter,
and a running positions/P&L bar.

> All market data is **simulated client-side** — no external feed or backend is required.
> Look for the `SIMULATION` badge in the header.

## Features

- **Live Market Overview** — streaming bid/ask/mid quotes for US 2Y, 5Y, 10Y, and 30Y
  Treasuries, with price-flash animations and per-instrument change tracking.
- **Yield Curve** — an always-current curve (2s through 30s) with the 10Y–2Y spread and
  average yield, rendered with Recharts.
- **Order Ticket** — Buy/Sell, Market or Limit orders, with an estimated fill price.
  Market orders cross the spread; limit orders only fill when the market is favorable.
- **Trade Blotter** — every execution, searchable and filterable by instrument and side.
- **Positions & P&L** — a header bar that nets your fills (VWAP entry) and marks them to
  the live market in real time.
- **Engine Controls** — pause/resume the feed, change volatility (Low/Medium/High), and
  adjust the tick interval.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** with a custom dark trading theme
- **Zustand** for global market/order state
- **Recharts** for the yield curve
- **Framer Motion** for blotter/toast animations
- **lucide-react** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
app/
  layout.tsx              Root layout, fonts, metadata, app shell
  page.tsx                Dashboard (assembles all panels)
  docs/                   How-it-works reference
  settings/               Engine/display settings
components/
  layout/                 Top bar, sidebar, clock, engine controls, app shell
  trading/                Watchlist, yield curve, order ticket, blotter, positions
  shared/                 Panel wrapper, toaster
  ui/                     Button, card, input, label, select primitives
lib/
  marketData/
    instruments.ts        Seed Treasury instruments
    engine.ts             Random-walk price/yield simulation
  store/
    marketStore.ts        Zustand store: instruments, orders, trades, positions
    toastStore.ts         Lightweight toast notifications
  types/                  Shared domain types
  format.ts               Number/price/time formatting helpers
```

### How the simulation works

`lib/marketData/engine.ts` runs a random-walk over each bond's mid price (scaled by the
selected volatility mode), derives a bid/ask spread, and converts price moves into yield
moves. On each tick the engine pushes a batch of updates into the Zustand store, which
re-renders only the subscribed panels. Components subscribe to **stable** raw state slices
and derive lists/curves locally with `useMemo`, keeping renders cheap and SSR-safe.

## Notes

This is a front-end simulation intended for demos and UI work. To wire it to a real feed,
replace the engine in `lib/marketData/engine.ts` with a WebSocket subscription and feed
ticks into `useMarketStore.getState().applyTicks(...)`.
