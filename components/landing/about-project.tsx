"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"

export function AboutProject() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">About the project</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built to make real-time trading UX tangible
          </h2>
          <div className="mt-5 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              BondFlow began as an exploration of a deceptively hard problem: rendering a dense, constantly-updating
              market without dropping frames. Every design decision — from per-row store subscriptions to batched tick
              application — exists to keep the interface fluid under a relentless stream of updates.
            </p>
            <p>
              It solves the gap between a static portfolio piece and a living product, showing not just what a trading
              terminal looks like, but how it behaves: validation on every order, accurate position math, and a curve
              that responds instantly to the market.
            </p>
            <p>
              The result demonstrates fluency in real-time systems, state architecture, data visualization, performance
              profiling, and accessible, professional UI — the skills that ship electronic-trading platforms.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/terminal">
                Launch the Terminal
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Read the docs</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
