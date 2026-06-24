import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Activity,
  Layers,
  Gauge,
  Wifi,
  KeyRound,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About — BondFlow",
  description:
    "BondFlow is a real-time fixed-income trading terminal: yield curves, order entry, blotter, and live P&L, built to mirror Tradeweb-style electronic bond trading.",
}

const STACK = [
  { label: "Framework", value: "Next.js 16 · App Router · React 19" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "State", value: "Zustand with per-row selectors" },
  { label: "Charts", value: "Recharts + hand-rolled SVG sparklines" },
  { label: "Motion", value: "Framer Motion" },
  { label: "Styling", value: "Tailwind CSS v4 design tokens" },
]

const CONCEPTS = [
  {
    icon: Activity,
    title: "Live market simulation",
    body: "A random-walk pricing engine ticks bid/ask/mid and yields for the on-the-run UST curve, emitting batched updates many times per second.",
  },
  {
    icon: Layers,
    title: "Decoupled feed contract",
    body: "Every data source implements a single MarketFeed interface, so the simulation and a future WebSocket venue feed are interchangeable.",
  },
  {
    icon: Gauge,
    title: "Surgical re-renders",
    body: "Each watchlist row subscribes to one instrument, so a tick that moves one bond never re-renders the whole grid.",
  },
  {
    icon: Wifi,
    title: "Live-feed ready",
    body: "Switch the feed source to WebSocket and the UI freezes the model, awaiting a real endpoint — drop in a socket and go live.",
  },
  {
    icon: KeyRound,
    title: "Keyboard-first entry",
    body: "B/S set side, M/L set order type, arrow keys cycle instruments, and Space pauses the feed — built for trader muscle memory.",
  },
  {
    icon: ShieldCheck,
    title: "Realistic order handling",
    body: "Market and limit orders validate, fill against live quotes, update VWAP positions, and stream into the blotter with live P&L.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        About the project
      </span>
      <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground">
        A trader-grade terminal for electronic fixed-income markets
      </h1>
      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
        BondFlow is a front-end engineering demonstration that recreates the core surfaces of a
        professional bond trading terminal — the kind of real-time, latency-sensitive interface used
        on electronic venues like Tradeweb. It pairs a live market data engine with a responsive,
        keyboard-driven trading workflow.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="up">
          <Link href="/terminal">
            Launch the terminal <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to overview</Link>
        </Button>
      </div>

      <h2 className="mt-12 text-lg font-semibold text-foreground">How it works</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONCEPTS.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.title}>
              <CardContent className="flex gap-3 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-foreground">Technology</h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {STACK.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-right text-sm font-medium text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Why Tradeweb?</h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Tradeweb pioneered electronic trading for rates, credit, and money markets — domains where
          milliseconds, clean data visualization, and dense-but-legible interfaces matter enormously.
          BondFlow is built to demonstrate exactly those front-end disciplines: streaming data without
          jank, a thoughtful component architecture, and an interface a trader could actually scan at a
          glance.
        </p>
      </div>
    </div>
  )
}
