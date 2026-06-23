import { Positions } from "@/components/trading/positions"
import { Watchlist } from "@/components/trading/watchlist"
import { YieldCurve } from "@/components/trading/yield-curve"
import { OrderTicket } from "@/components/trading/order-ticket"
import { Blotter } from "@/components/trading/blotter"

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <Positions />
      {/*
        Trading grid: on large screens a 12-col / 2-row layout
        (overview + curve on top, ticket + blotter below). Stacks vertically on
        small screens for responsiveness.
      */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto p-3 lg:grid-cols-12 lg:grid-rows-2 lg:overflow-hidden">
        <div className="min-h-[300px] lg:col-span-7 lg:row-span-1 lg:min-h-0">
          <Watchlist />
        </div>
        <div className="min-h-[300px] lg:col-span-5 lg:row-span-1 lg:min-h-0">
          <YieldCurve />
        </div>
        <div className="min-h-[420px] lg:col-span-4 lg:row-span-1 lg:min-h-0">
          <OrderTicket />
        </div>
        <div className="min-h-[420px] lg:col-span-8 lg:row-span-1 lg:min-h-0">
          <Blotter />
        </div>
      </div>
    </div>
  )
}
