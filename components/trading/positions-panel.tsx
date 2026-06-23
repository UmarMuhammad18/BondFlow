"use client"

import { useMemo } from "react"
import { Wallet } from "lucide-react"
import { useMarketStore, computeUnrealizedPnl } from "@/lib/store/marketStore"
import { Panel } from "@/components/shared/panel"
import { Sparkline } from "@/components/shared/sparkline"
import { fmtPrice, fmtQty } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * Positions & P&L
 * ---------------
 * Net position per instrument with VWAP entry, the live market mark, a price
 * trend sparkline, and color-coded unrealized P&L. Recomputed on every tick via
 * memoized selectors over the store's positions + instruments slices.
 */
export function PositionsPanel() {
  const positions = useMarketStore((s) => s.positions)
  const instruments = useMarketStore((s) => s.instruments)
  const priceHistory = useMarketStore((s) => s.priceHistory)

  const rows = useMemo(
    () => Object.values(positions).filter((p) => p.netQuantity !== 0),
    [positions],
  )

  const totalPnl = useMemo(
    () =>
      rows.reduce((acc, p) => {
        const mark = instruments[p.instrumentId]?.mid ?? p.avgPrice
        return acc + computeUnrealizedPnl(p.netQuantity, p.avgPrice, mark)
      }, 0),
    [rows, instruments],
  )

  return (
    <Panel
      title="Positions & P&L"
      icon={<Wallet className="h-4 w-4" />}
      actions={
        rows.length > 0 ? (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            Net P&L
            <span className={cn("tnum font-semibold", totalPnl >= 0 ? "text-up" : "text-down")}>
              {totalPnl >= 0 ? "+" : ""}
              {totalPnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </span>
        ) : null
      }
    >
      {rows.length === 0 ? (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 p-6 text-center">
          <p className="text-sm text-muted-foreground">No open positions</p>
          <p className="text-xs text-muted-foreground/70">Execute an order to start tracking P&L.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">Instrument</th>
              <th className="px-3 py-2 text-right font-medium">Net Qty</th>
              <th className="px-3 py-2 text-right font-medium">Avg Entry</th>
              <th className="px-3 py-2 text-right font-medium">Mark</th>
              <th className="hidden px-3 py-2 text-center font-medium sm:table-cell">Trend</th>
              <th className="px-3 py-2 text-right font-medium">Unrealized P&L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const inst = instruments[p.instrumentId]
              const mark = inst?.mid ?? p.avgPrice
              const long = p.netQuantity > 0
              const pnl = computeUnrealizedPnl(p.netQuantity, p.avgPrice, mark)
              const pnlUp = pnl >= 0
              const series = priceHistory[p.instrumentId] ?? []
              return (
                <tr key={p.instrumentId} className="border-b border-border/60 transition-colors hover:bg-accent/40">
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-foreground">{inst?.ticker}</div>
                    <div className="text-[11px] text-muted-foreground">{inst?.maturity}</div>
                  </td>
                  <td className={cn("px-3 py-2.5 text-right tnum font-semibold", long ? "text-up" : "text-down")}>
                    {long ? "+" : ""}
                    {fmtQty(p.netQuantity)}
                  </td>
                  <td className="px-3 py-2.5 text-right tnum text-muted-foreground">{fmtPrice(p.avgPrice)}</td>
                  <td className="px-3 py-2.5 text-right tnum text-foreground">{fmtPrice(mark)}</td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <div className="flex justify-center">
                      <Sparkline data={series} tone={pnlUp ? "up" : "down"} />
                    </div>
                  </td>
                  <td className={cn("px-3 py-2.5 text-right tnum font-semibold", pnlUp ? "text-up" : "text-down")}>
                    {pnlUp ? "+" : ""}
                    {pnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Panel>
  )
}
