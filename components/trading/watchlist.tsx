"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, List } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import { useOrderStore } from "@/lib/store/orderStore"
import { Panel } from "@/components/shared/panel"
import { Sparkline } from "@/components/shared/sparkline"
import { Skeleton } from "@/components/ui/skeleton"
import { fmtPrice, fmtYield, fmtChange, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * WatchlistRow subscribes to a SINGLE instrument via a Zustand selector, so a
 * tick that only moves one bond re-renders only that row — not the whole table.
 */
function WatchlistRow({ id }: { id: string }) {
  const inst = useMarketStore((s) => s.instruments[id])
  const history = useMarketStore((s) => s.priceHistory[id])
  const setInstrument = useOrderStore((s) => s.setInstrument)
  const selectedId = useOrderStore((s) => s.instrumentId)
  const [flash, setFlash] = useState<"up" | "down" | null>(null)
  const lastMid = useRef(inst.mid)

  useEffect(() => {
    if (inst.mid === lastMid.current) return
    setFlash(inst.mid > lastMid.current ? "up" : "down")
    lastMid.current = inst.mid
    const t = setTimeout(() => setFlash(null), 250)
    return () => clearTimeout(t)
  }, [inst.mid])

  const up = inst.change >= 0
  const selected = selectedId === id

  return (
    <tr
      onClick={() => setInstrument(id)}
      className={cn(
        "cursor-pointer border-b border-border/60 transition-colors hover:bg-accent/40",
        selected && "bg-primary/5",
      )}
    >
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {selected && <span className="h-3 w-0.5 rounded-full bg-primary" aria-hidden />}
          <div>
            <div className="font-medium text-foreground">{inst.ticker}</div>
            <div className="text-[11px] text-muted-foreground">
              {inst.maturity} · {inst.coupon.toFixed(2)}%
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-2 sm:table-cell">
        <Sparkline data={history ?? []} tone={up ? "up" : "down"} className="ml-auto" />
      </td>
      <td className="px-3 py-2 text-right tnum text-down">{fmtPrice(inst.bid)}</td>
      <td className="px-3 py-2 text-right tnum text-up">{fmtPrice(inst.ask)}</td>
      <td
        className={cn(
          "px-3 py-2 text-right tnum font-medium transition-colors duration-200",
          flash === "up" && "bg-up/20 text-up",
          flash === "down" && "bg-down/20 text-down",
        )}
      >
        {fmtPrice(inst.mid)}
      </td>
      <td className="px-3 py-2 text-right tnum text-foreground">{fmtYield(inst.yield)}</td>
      <td className={cn("px-3 py-2 text-right tnum", up ? "text-up" : "text-down")}>
        <div className="flex items-center justify-end gap-1">
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          <span>{fmtChange(inst.change)}</span>
        </div>
        <div className="text-[11px]">{fmtPct(inst.changePct)}</div>
      </td>
    </tr>
  )
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-border/60">
          <td className="px-3 py-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1.5 h-2 w-20" />
          </td>
          <td className="hidden px-3 py-3 sm:table-cell">
            <Skeleton className="ml-auto h-5 w-[64px]" />
          </td>
          {[0, 1, 2, 3, 4].map((j) => (
            <td key={j} className="px-3 py-3">
              <Skeleton className="ml-auto h-3 w-12" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function Watchlist() {
  const order = useMarketStore((s) => s.order)
  const ready = useMarketStore((s) => s.ready)

  return (
    <Panel title="Market Overview" icon={<List className="h-4 w-4" />}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Instrument</th>
            <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Trend</th>
            <th className="px-3 py-2 text-right font-medium">Bid</th>
            <th className="px-3 py-2 text-right font-medium">Ask</th>
            <th className="px-3 py-2 text-right font-medium">Mid</th>
            <th className="px-3 py-2 text-right font-medium">Yield</th>
            <th className="px-3 py-2 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {ready ? order.map((id) => <WatchlistRow key={id} id={id} />) : <SkeletonRows />}
        </tbody>
      </table>
    </Panel>
  )
}
