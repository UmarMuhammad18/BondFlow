"use client"

import { useEffect, useRef } from "react"
import { MarketDataEngine } from "@/lib/marketData/engine"
import { SEED_INSTRUMENTS } from "@/lib/marketData/instruments"
import { useMarketStore } from "@/lib/store/marketStore"

/**
 * MarketEngineProvider
 * --------------------
 * Bridges the client-side {@link MarketDataEngine} to the global store. It owns
 * a single engine instance for the lifetime of the app and reacts to the
 * UI-controlled settings (running / volatility / interval) held in the store.
 *
 * FUTURE: this is the single integration point to swap the local simulation for
 * a live WebSocket feed — the rest of the app only ever reads from the store.
 */
export function MarketEngineProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<MarketDataEngine | null>(null)
  const applyTicks = useMarketStore((s) => s.applyTicks)
  const running = useMarketStore((s) => s.running)
  const volatility = useMarketStore((s) => s.volatility)
  const intervalMs = useMarketStore((s) => s.intervalMs)

  // Create the engine once and pipe its ticks into the store.
  useEffect(() => {
    const engine = new MarketDataEngine(SEED_INSTRUMENTS, {
      intervalMs: useMarketStore.getState().intervalMs,
      volatility: useMarketStore.getState().volatility,
    })
    engineRef.current = engine
    const unsubscribe = engine.subscribe(applyTicks)
    if (useMarketStore.getState().running) engine.start()

    return () => {
      unsubscribe()
      engine.stop()
      engineRef.current = null
    }
  }, [applyTicks])

  // React to play/pause.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    if (running) engine.start()
    else engine.stop()
  }, [running])

  // React to volatility changes.
  useEffect(() => {
    engineRef.current?.setVolatility(volatility)
  }, [volatility])

  // React to update-interval changes.
  useEffect(() => {
    engineRef.current?.setInterval(intervalMs)
  }, [intervalMs])

  return <>{children}</>
}
