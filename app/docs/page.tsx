import type { Metadata } from "next"
import { Activity, Database, Gauge, LayoutGrid, Receipt, Ticket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Docs — BondFlow",
  description: "Architecture and feature documentation for the BondFlow fixed-income trading terminal.",
}

const FEATURES = [
  { icon: Database, title: "Real-Time Market Simulation", body: "A client-side engine applies a mean-reverting random walk to derive live bid/ask/mid prices and yields, with configurable interval and volatility." },
  { icon: Activity, title: "Yield Curve Visualization", body: "An interactive Recharts curve across 2Y/5Y/10Y/30Y maturities with hover tooltips, smooth transitions, and a live 10Y–2Y spread." },
  { icon: Receipt, title: "Trade Blotter", body: "A live, filterable log of executed fills with search, instrument and side filters, and animated row entry." },
  { icon: Ticket, title: "Order Management", body: "Market and limit order entry with validation, simulated execution against the live two-sided market, and instant toast feedback." },
  { icon: LayoutGrid, title: "Professional Trading UI", body: "A dark, multi-panel terminal layout that is responsive and keyboard accessible." },
  { icon: Gauge, title: "Performance-Conscious State", body: "A centralized Zustand store with per-row selectors so a tick only re-renders the rows that changed." },
]

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">BondFlow Documentation</h1>
      <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
        BondFlow is a real-time fixed-income trading terminal that simulates the workflow of a professional bond
        trader: live market data, yield curve visualization, order management, and a trade blotter.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Core Features</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Architecture</h2>
        <Card className="mt-3">
          <CardContent className="space-y-3 p-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Market data engine</span> (<code className="text-primary">lib/marketData/engine.ts</code>):
              a transport-agnostic class that emits batches of ticks. It is wired to the store by a single provider, so
              swapping the local simulation for a WebSocket feed touches exactly one file.
            </p>
            <p>
              <span className="font-medium text-foreground">Global store</span> (<code className="text-primary">lib/store/marketStore.ts</code>):
              a Zustand store holding instruments, trades, and positions, plus derived selectors for the yield curve,
              10Y–2Y spread, and average yield.
            </p>
            <p>
              <span className="font-medium text-foreground">Subscriptions</span>: each watchlist row subscribes to a
              single instrument via a selector, and panels read derived state — minimizing re-renders under frequent
              updates.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Relevance to Tradeweb</h2>
        <Card className="mt-3 border-primary/30">
          <CardContent className="p-4 text-sm leading-relaxed text-muted-foreground">
            BondFlow was designed as a simplified, educational version of an institutional fixed-income trading UI. It
            showcases real-time market simulation, yield curve visualization, trade blotter management, and a
            professional trading interface — similar to the challenges faced by engineers building electronic trading
            platforms like Tradeweb. It demonstrates real-time systems, data visualization, frontend architecture, state
            management, performance optimization, and UX for institutional trading interfaces.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
