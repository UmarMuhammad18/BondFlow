"use client"

import { Building2, Workflow, GraduationCap } from "lucide-react"
import { Reveal } from "./reveal"

const POINTS = [
  {
    icon: Building2,
    title: "Institutional Relevance",
    body: "Fixed-income e-trading platforms like Tradeweb live and die by latency, data density, and clarity under load. BondFlow is modeled on those same constraints.",
  },
  {
    icon: Workflow,
    title: "Mirrors Real Workflows",
    body: "Two-sided quotes, market and limit execution, position keeping, and curve analytics map directly onto how a real rates desk operates.",
  },
  {
    icon: GraduationCap,
    title: "Demonstrates Readiness",
    body: "Real-time state, data visualization, performance tuning, and accessible UX — the exact surface area of an electronic-trading UI engineering role.",
  },
]

export function TradewebSection() {
  return (
    <section id="tradeweb" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Institutional alignment</span>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Why BondFlow matters for fixed-income trading
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          BondFlow is a focused demonstration of the engineering behind institutional bond-trading interfaces.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {POINTS.map((p, i) => {
          const Icon = p.icon
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
