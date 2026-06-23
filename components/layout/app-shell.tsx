"use client"

import { MarketEngineProvider } from "@/components/trading/market-engine-provider"
import { Toaster } from "@/components/shared/toaster"
import { FeedBanner } from "@/components/trading/feed-banner"
import { KeyboardShortcuts } from "@/components/trading/keyboard-shortcuts"
import { ShortcutsModal } from "@/components/trading/shortcuts-modal"
import { useUiStore } from "@/lib/store/uiStore"
import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const shortcutsOpen = useUiStore((s) => s.shortcutsOpen)
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen)
  const toggleShortcuts = useUiStore((s) => s.toggleShortcuts)

  return (
    <MarketEngineProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <TopBar />
        <FeedBanner />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="min-h-0 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster />
      <KeyboardShortcuts onToggleHelp={toggleShortcuts} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </MarketEngineProvider>
  )
}
