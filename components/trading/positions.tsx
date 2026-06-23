"use client"

import { useMemo } from "react"
import { Wallet } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import { fmtPrice, fmtQty } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Compact net-position strip derived from executed trades + live marks. */
export function Positions() {
  const positions = useMarketStore((s) => s.positions)
  const instruments = useMarketStore((s) => s.instruments)

  const rows = useMemo(
    () => Object.values(positions).filter((p) => p.netQuantity !== 0),
    [positions],
  )

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-border bg-card px-4 py-2">
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Wallet className="h-4 w-4 text-primary" />
        Positions
      </div>
      {rows.length === 0 ? (
        <span className="text-xs text-muted-foreground">No open positions</span>
      ) : (
        rows.map((p) => {
          const mark = instruments[p.instrumentId]?.mid ?? p.avgPrice
          const long = p.netQuantity > 0
          const pnl = (mark - p.avgPrice) * (p.netQuantity / 100)
          return (
            <div
              key={p.instrumentId}
              className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1 text-xs"
            >
              <span className="font-medium text-foreground">{instruments[p.instrumentId]?.ticker}</span>
              <span className={cn("tnum font-semibold", long ? "text-up" : "text-down")}>
                {long ? "+" : ""}
                {fmtQty(p.netQuantity)}
              </span>
              <span className="tnum text-muted-foreground">@ {fmtPrice(p.avgPrice)}</span>
              <span className={cn("tnum", pnl >= 0 ? "text-up" : "text-down")}>
                {pnl >= 0 ? "+" : ""}
                {pnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
