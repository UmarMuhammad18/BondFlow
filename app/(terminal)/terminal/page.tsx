"use client"

import { Watchlist } from "@/components/trading/watchlist"
import { YieldCurve } from "@/components/trading/yield-curve"
import { OrderTicket } from "@/components/trading/order-ticket"
import { PositionsPanel } from "@/components/trading/positions-panel"
import { Blotter } from "@/components/trading/blotter"

export default function TerminalPage() {
  return (
    <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-12">
      {/* Primary column */}
      <div className="flex flex-col gap-3 lg:col-span-8">
        <div className="h-[300px]">
          <Watchlist />
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <div className="h-[320px]">
            <YieldCurve />
          </div>
          <div className="h-[320px]">
            <PositionsPanel />
          </div>
        </div>
        <div className="h-[380px]">
          <Blotter />
        </div>
      </div>

      {/* Order entry rail */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-3">
          <OrderTicket />
        </div>
      </div>
    </div>
  )
}
