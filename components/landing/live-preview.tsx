"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

interface Row {
  ticker: string
  maturity: string
  mid: number
  yield: number
  dir: "up" | "down" | "flat"
}

const INITIAL: Row[] = [
  { ticker: "US 2Y", maturity: "2Y", mid: 99.84, yield: 4.34, dir: "flat" },
  { ticker: "US 5Y", maturity: "5Y", mid: 98.92, yield: 4.12, dir: "flat" },
  { ticker: "US 10Y", maturity: "10Y", mid: 96.41, yield: 4.28, dir: "flat" },
  { ticker: "US 30Y", maturity: "30Y", mid: 92.18, yield: 4.51, dir: "flat" },
]

/** A faux, self-contained terminal that ticks on its own — no engine, no store. */
export function LivePreview() {
  const [rows, setRows] = useState<Row[]>(INITIAL)

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const shock = (Math.random() - 0.5) * 0.06
          const mid = +(r.mid + shock).toFixed(3)
          return {
            ...r,
            mid,
            yield: +(r.yield - shock * 0.05).toFixed(3),
            dir: shock > 0.005 ? "up" : shock < -0.005 ? "down" : "flat",
          }
        }),
      )
    }, 900)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Live preview</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A terminal that feels alive
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Prices flash on every update, the curve re-shapes in real time, and fills land in the blotter instantly.
            The full experience is one click away — this is just a taste.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {["Color-coded price flashes", "Two-sided live quotes", "Sub-second tick cadence"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <TiltCard>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-down/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-up/70" />
                <span className="ml-3 text-xs text-muted-foreground">BondFlow — Market Overview</span>
                <span className="ml-auto flex items-center gap-1.5 text-[11px] text-up">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up" />
                  Live
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">Instrument</th>
                    <th className="px-4 py-2 text-right font-medium">Mid</th>
                    <th className="px-4 py-2 text-right font-medium">Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <PreviewRow key={r.ticker} row={r} />
                  ))}
                </tbody>
              </table>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}

function PreviewRow({ row }: { row: Row }) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null)
  const last = useRef(row.mid)

  useEffect(() => {
    if (row.mid === last.current) return
    setFlash(row.mid > last.current ? "up" : "down")
    last.current = row.mid
    const t = setTimeout(() => setFlash(null), 400)
    return () => clearTimeout(t)
  }, [row.mid])

  const up = row.dir !== "down"

  return (
    <tr className="border-b border-border/60">
      <td className="px-4 py-2.5">
        <div className="font-medium text-foreground">{row.ticker}</div>
        <div className="text-[11px] text-muted-foreground">{row.maturity} Treasury</div>
      </td>
      <td
        className={cn(
          "px-4 py-2.5 text-right tnum font-medium transition-colors duration-300",
          flash === "up" && "bg-up/20 text-up",
          flash === "down" && "bg-down/20 text-down",
          !flash && "text-foreground",
        )}
      >
        {row.mid.toFixed(3)}
      </td>
      <td className={cn("px-4 py-2.5 text-right tnum", up ? "text-up" : "text-down")}>
        <span className="inline-flex items-center justify-end gap-1">
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {row.yield.toFixed(3)}%
        </span>
      </td>
    </tr>
  )
}

/** Pointer-tracking 3D tilt wrapper. */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  )
}
