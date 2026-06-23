"use client"

import { useMemo, useState } from "react"
import { Ticket } from "lucide-react"
import { useMarketStore, selectInstrumentList } from "@/lib/store/marketStore"
import { useToastStore } from "@/lib/store/toastStore"
import type { OrderType, Side } from "@/lib/types"
import { Panel } from "@/components/shared/panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fmtPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function OrderTicket() {
  const instruments = useMarketStore(selectInstrumentList)
  const submitOrder = useMarketStore((s) => s.submitOrder)
  const push = useToastStore((s) => s.push)

  const [side, setSide] = useState<Side>("BUY")
  const [type, setType] = useState<OrderType>("MARKET")
  const [instrumentId, setInstrumentId] = useState(instruments[0]?.id ?? "")
  const [quantity, setQuantity] = useState("1000000")
  const [limitPrice, setLimitPrice] = useState("")
  const [error, setError] = useState<string | null>(null)

  const selected = useMarketStore((s) => s.instruments[instrumentId])
  const ref = useMemo(() => {
    if (!selected) return null
    return side === "BUY" ? selected.ask : selected.bid
  }, [selected, side])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const qty = Number(quantity)
    if (!instrumentId) return setError("Select an instrument.")
    if (!Number.isFinite(qty) || qty <= 0) return setError("Enter a valid quantity.")
    const lp = type === "LIMIT" ? Number(limitPrice) : undefined
    if (type === "LIMIT" && (!Number.isFinite(lp!) || lp! <= 0)) {
      return setError("Enter a valid limit price.")
    }

    const result = submitOrder({ instrumentId, side, type, quantity: qty, limitPrice: lp })
    if (result.ok) {
      push({ variant: "success", title: "Order executed", description: result.message })
    } else {
      setError(result.message)
      push({ variant: "error", title: "Order rejected", description: result.message })
    }
  }

  return (
    <Panel title="Order Ticket" icon={<Ticket className="h-4 w-4" />}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-3">
        {/* Side toggle */}
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Order side">
          <Button
            type="button"
            variant={side === "BUY" ? "up" : "outline"}
            onClick={() => setSide("BUY")}
            aria-pressed={side === "BUY"}
          >
            Buy
          </Button>
          <Button
            type="button"
            variant={side === "SELL" ? "down" : "outline"}
            onClick={() => setSide("SELL")}
            aria-pressed={side === "SELL"}
          >
            Sell
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ot-instrument">Instrument</Label>
          <Select value={instrumentId} onValueChange={setInstrumentId}>
            <SelectTrigger id="ot-instrument">
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              {instruments.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ot-type">Order Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as OrderType)}>
            <SelectTrigger id="ot-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MARKET">Market</SelectItem>
              <SelectItem value="LIMIT">Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ot-qty">Quantity (face value)</Label>
          <Input
            id="ot-qty"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1,000,000"
            className="tnum"
          />
        </div>

        {type === "LIMIT" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ot-limit">Limit Price</Label>
            <Input
              id="ot-limit"
              inputMode="decimal"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={selected ? fmtPrice(selected.mid) : "100.000"}
              className="tnum"
            />
          </div>
        )}

        {/* Reference market */}
        {selected && (
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">
              {type === "MARKET" ? "Est. fill" : side === "BUY" ? "Current ask" : "Current bid"}
            </span>
            <span className={cn("tnum font-semibold", side === "BUY" ? "text-up" : "text-down")}>
              {ref !== null ? fmtPrice(ref) : "—"}
            </span>
          </div>
        )}

        {error && (
          <p className="rounded-md border border-down/40 bg-down/10 px-3 py-2 text-xs text-down" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant={side === "BUY" ? "up" : "down"} className="mt-1">
          {side === "BUY" ? "Submit Buy Order" : "Submit Sell Order"}
        </Button>
      </form>
    </Panel>
  )
}
