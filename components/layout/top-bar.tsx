"use client"

import { CandlestickChart } from "lucide-react"
import { Clock } from "./clock"
import { EngineControls } from "./engine-controls"

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <CandlestickChart className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-tight text-foreground">BondFlow</span>
          <span className="hidden text-[11px] text-muted-foreground sm:block">Fixed-Income Trading Terminal</span>
        </div>
        <span className="ml-2 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Simulation
        </span>
      </div>

      <div className="hidden items-center gap-4 lg:flex">
        <EngineControls />
        <div className="h-6 w-px bg-border" />
        <Clock />
      </div>
    </header>
  )
}
