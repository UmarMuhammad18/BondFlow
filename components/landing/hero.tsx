"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28">
      {/* Animated grid + glow background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute -top-24 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full glow-primary opacity-20 blur-2xl" />
        <div className="absolute -top-10 right-1/4 h-72 w-72 translate-x-1/2 rounded-full glow-accent opacity-20 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-up" />
          Real-time fixed-income simulation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          BondFlow — Real-Time Fixed-Income Trading Terminal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A professional-grade simulation of institutional bond trading workflows — live market data, yield curve
          analytics, order execution, and a streaming blotter, built for speed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.19 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group w-full sm:w-auto">
            <Link href="/terminal">
              Launch Terminal
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/about">
              <BookOpen />
              View Documentation
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Animated yield curve flourish */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="mx-auto mt-16 max-w-3xl"
      >
        <div className="glass flex items-center gap-2 rounded-t-xl border border-b-0 border-border px-4 py-2.5 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-primary" />
          US Treasury Yield Curve
          <span className="ml-auto tnum text-up">+2.3 bps</span>
        </div>
        <div className="overflow-hidden rounded-b-xl border border-border bg-card/40">
          <HeroCurve />
        </div>
      </motion.div>
    </section>
  )
}

/** A looping, self-drawing SVG yield curve with glowing nodes. */
function HeroCurve() {
  const points = [
    { x: 40, y: 150 },
    { x: 200, y: 120 },
    { x: 360, y: 95 },
    { x: 520, y: 70 },
    { x: 680, y: 48 },
  ]
  const path = `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
  const area = `${path} L 680 200 L 40 200 Z`

  return (
    <svg viewBox="0 0 720 200" className="h-44 w-full sm:h-52" role="img" aria-label="Animated yield curve">
      <defs>
        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {[40, 90, 140, 190].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
      ))}

      <motion.path
        d={area}
        fill="url(#heroFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="var(--color-primary)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.12 }}
        />
      ))}
    </svg>
  )
}
