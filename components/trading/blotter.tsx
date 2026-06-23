"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Receipt, Search } from "lucide-react"
import { useMarketStore, computeInstrumentList } from "@/lib/store/marketStore"
import type { Side } from "@/lib/types"
import { Panel } from "@/components/shared/panel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fmtPrice, fmtQty, fmtYield, fmtTime } from "@/lib/format"
import { cn } from "@/lib/utils"

type SideFilter = "ALL" | Side

export function Blotter() {
  const trades = useMarketStore((s) => s.trades)
  const instrumentMap = useMarketStore((s) => s.instruments)
  const order = useMarketStore((s) => s.order)
  const instruments = useMemo(() => computeInstrumentList(instrumentMap, order), [instrumentMap, order])

  const [search, setSearch] = useState("")
  const [instrumentFilter, setInstrumentFilter] = useState("ALL")
  const [sideFilter, setSideFilter] = useState<SideFilter>("ALL")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return trades.filter((t) => {
      if (instrumentFilter !== "ALL" && t.instrumentId !== instrumentFilter) return false
      if (sideFilter !== "ALL" && t.side !== sideFilter) return false
      if (q && !t.instrumentName.toLowerCase().includes(q)) return false
      return true
    })
  }, [trades, search, instrumentFilter, sideFilter])

  return (
    <Panel
      title="Trade Blotter"
      icon={<Receipt className="h-4 w-4" />}
      actions={<span className="text-[11px] text-muted-foreground tnum">{filtered.length} fills</span>}
    >
      <div className="flex h-full flex-col">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-2">
          <div className="relative min-w-[140px] flex-1">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search instrument..."
              className="h-8 pl-7 text-xs"
              aria-label="Search trades by instrument"
            />
          </div>
          <Select value={instrumentFilter} onValueChange={setInstrumentFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Filter by instrument">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All instruments</SelectItem>
              {instruments.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.ticker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Filter by side">
            {(["ALL", "BUY", "SELL"] as SideFilter[]).map((s) => (
              <Button
                key={s}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSideFilter(s)}
                aria-pressed={sideFilter === s}
                className={cn(
                  "h-8 rounded-none border-0 text-xs",
                  sideFilter === s && s === "BUY" && "bg-up/20 text-up",
                  sideFilter === s && s === "SELL" && "bg-down/20 text-down",
                  sideFilter === s && s === "ALL" && "bg-accent text-accent-foreground",
                )}
              >
                {s === "ALL" ? "All" : s === "BUY" ? "Buy" : "Sell"}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Instrument</th>
                <th className="px-3 py-2 text-center font-medium">Side</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Yield</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((t) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0, backgroundColor: "rgba(125,125,125,0.15)" }}
                    animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                    transition={{ duration: 0.4 }}
                    className="border-b border-border/60 odd:bg-secondary/20"
                  >
                    <td className="px-3 py-2 text-left tnum text-muted-foreground">{fmtTime(t.timestamp)}</td>
                    <td className="px-3 py-2 text-left text-foreground">{t.instrumentName}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold",
                          t.side === "BUY" ? "bg-up/15 text-up" : "bg-down/15 text-down",
                        )}
                      >
                        {t.side}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tnum text-foreground">{fmtQty(t.quantity)}</td>
                    <td className="px-3 py-2 text-right tnum text-foreground">{fmtPrice(t.price)}</td>
                    <td className="px-3 py-2 text-right tnum text-muted-foreground">{fmtYield(t.yield)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No trades yet. Submit an order to populate the blotter.
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
