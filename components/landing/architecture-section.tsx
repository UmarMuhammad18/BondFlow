"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

const STACK = [
  { name: "Next.js 16", role: "App Router & RSC" },
  { name: "TypeScript", role: "End-to-end types" },
  { name: "Zustand", role: "Global market state" },
  { name: "Recharts", role: "Yield curve charts" },
  { name: "Tailwind CSS", role: "Design system" },
  { name: "Framer Motion", role: "Micro-interactions" },
]

const FLOW = [
  { label: "Pricing Engine", sub: "MarketFeed interface" },
  { label: "Zustand Store", sub: "Single source of truth" },
  { label: "Memoized Selectors", sub: "Derived curve & P&L" },
  { label: "Panels", sub: "Per-row subscriptions" },
]

export function ArchitectureSection() {
  return (
    <section id="architecture" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Architecture</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built on a modular, swappable data layer
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The pricing engine hides behind a single <code className="text-primary">MarketFeed</code> interface, so the
            local simulation can be replaced by a live WebSocket stream without touching a single panel.
          </p>
        </Reveal>

        {/* Data flow diagram */}
        <Reveal delay={0.1} className="mt-14">
          <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-center">
            {FLOW.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center gap-3 lg:flex-row">
                <div className="w-full rounded-xl border border-border bg-card px-5 py-4 text-center lg:w-44">
                  <div className="text-sm font-semibold text-foreground">{node.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{node.sub}</div>
                </div>
                {i < FLOW.length - 1 && (
                  <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-primary lg:rotate-0" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Stack grid */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STACK.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/40">
                <div className="text-sm font-semibold text-foreground">{s.name}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{s.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
