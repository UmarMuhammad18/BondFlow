"use client"

import Link from "next/link"
import { CandlestickChart, SlidersHorizontal } from "lucide-react"
import { useUiStore } from "@/lib/store/uiStore"
import { Clock } from "./clock"
import { EngineControls } from "./engine-controls"
import { MobileControls } from "./mobile-controls"

export function TopBar() {
  const setMobileControlsOpen = useUiStore((s) => s.setMobileControlsOpen)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="BondFlow home"
        >
          <CandlestickChart className="h-5 w-5" />
        </Link>
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

      {/* Mobile / tablet: open controls in a drawer */}
      <button
        onClick={() => setMobileControlsOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent lg:hidden"
        aria-label="Open engine controls"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Controls
      </button>

      <MobileControls />
    </header>
  )
}
