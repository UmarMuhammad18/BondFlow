"use client"

import { MarketEngineProvider } from "@/components/trading/market-engine-provider"
import { Toaster } from "@/components/shared/toaster"
import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MarketEngineProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="min-h-0 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </MarketEngineProvider>
  )
}
