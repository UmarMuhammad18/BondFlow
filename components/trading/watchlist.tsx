"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, List } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import { Panel } from "@/components/shared/panel"
import { fmtPrice, fmtYield, fmtChange, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * WatchlistRow subscribes to a SINGLE instrument via a Zustand selector, so a
 * tick that only moves one bond re-renders only that row — not the whole table.
 */
function WatchlistRow({ id }: { id: string }) {
  const inst = useMarketStore((s) => s.instruments[id])
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

  return (
    <tr className="border-b border-border/60 transition-colors hover:bg-accent/40">
      <td className="px-3 py-2">
        <div className="font-medium text-foreground">{inst.ticker}</div>
        <div className="text-[11px] text-muted-foreground">{inst.maturity} · {inst.coupon.toFixed(2)}%</div>
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

export function Watchlist() {
  const order = useMarketStore((s) => s.order)

  return (
    <Panel title="Market Overview" icon={<List className="h-4 w-4" />}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Instrument</th>
            <th className="px-3 py-2 text-right font-medium">Bid</th>
            <th className="px-3 py-2 text-right font-medium">Ask</th>
            <th className="px-3 py-2 text-right font-medium">Mid</th>
            <th className="px-3 py-2 text-right font-medium">Yield</th>
            <th className="px-3 py-2 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {order.map((id) => (
            <WatchlistRow key={id} id={id} />
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
