"use client"

import { useEffect, useRef } from "react"
import type { MarketFeed } from "@/lib/marketData/feed"
import { MarketDataEngine } from "@/lib/marketData/engine"
import { WebSocketFeed } from "@/lib/marketData/websocketFeed"
import { SEED_INSTRUMENTS } from "@/lib/marketData/instruments"
import { useMarketStore } from "@/lib/store/marketStore"

/**
 * MarketEngineProvider
 * --------------------
 * Bridges a {@link MarketFeed} implementation to the global store. It owns a
 * single feed instance and recreates it when the active source (`feedMode`)
 * changes, reacting to the UI-controlled settings (running / volatility /
 * interval) held in the store.
 *
 * This is the single integration point for market data: the rest of the app
 * only ever reads from the store, so switching between the local simulation and
 * a future live WebSocket feed never touches any panel.
 */
function createFeed(mode: string): MarketFeed {
  if (mode === "WEBSOCKET") return new WebSocketFeed()
  return new MarketDataEngine(SEED_INSTRUMENTS, {
    intervalMs: useMarketStore.getState().intervalMs,
    volatility: useMarketStore.getState().volatility,
  })
}

export function MarketEngineProvider({ children }: { children: React.ReactNode }) {
  const feedRef = useRef<MarketFeed | null>(null)
  const applyTicks = useMarketStore((s) => s.applyTicks)
  const running = useMarketStore((s) => s.running)
  const volatility = useMarketStore((s) => s.volatility)
  const intervalMs = useMarketStore((s) => s.intervalMs)
  const feedMode = useMarketStore((s) => s.feedMode)

  // (Re)create the feed whenever the active source changes.
  useEffect(() => {
    const feed = createFeed(feedMode)
    feedRef.current = feed
    const unsubscribe = feed.subscribe(applyTicks)
    if (useMarketStore.getState().running) feed.start()

    return () => {
      unsubscribe()
      feed.stop()
      feedRef.current = null
    }
  }, [applyTicks, feedMode])

  // React to play/pause.
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    if (running) feed.start()
    else feed.stop()
  }, [running])

  // React to volatility changes.
  useEffect(() => {
    feedRef.current?.setVolatility(volatility)
  }, [volatility])

  // React to update-interval changes.
  useEffect(() => {
    feedRef.current?.setInterval(intervalMs)
  }, [intervalMs])

  return <>{children}</>
}
