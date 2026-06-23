"use client"

import { motion } from "framer-motion"
import { Activity, LineChart, Receipt, Ticket, Wallet, Zap } from "lucide-react"
import { Reveal } from "./reveal"

const FEATURES = [
  {
    icon: Activity,
    title: "Real-Time Market Simulation",
    body: "A mean-reverting pricing engine streams live bid/ask/mid quotes and yields with configurable cadence and volatility.",
  },
  {
    icon: LineChart,
    title: "Live Yield Curve Analytics",
    body: "An interactive 2Y–30Y curve with hover tooltips, a live 10Y–2Y spread, and average-yield metrics.",
  },
  {
    icon: Ticket,
    title: "Market & Limit Execution",
    body: "Submit market or limit orders that cross the live two-sided book, with validation and instant fill feedback.",
  },
  {
    icon: Receipt,
    title: "Streaming Trade Blotter",
    body: "A searchable, filterable log of executed fills with animated row entry and side-aware highlighting.",
  },
  {
    icon: Wallet,
    title: "Positions & P&L Tracking",
    body: "Net positions with VWAP entry, live marks, sparklines, and color-coded unrealized P&L that updates on every tick.",
  },
  {
    icon: Zap,
    title: "Performance-Optimized",
    body: "Per-row Zustand subscriptions and memoized selectors mean a tick only re-renders the data that actually changed.",
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything a fixed-income desk needs
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          A complete trading workflow, recreated in the browser with institutional-grade attention to detail.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <Reveal key={f.title} delay={i * 0.06}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
