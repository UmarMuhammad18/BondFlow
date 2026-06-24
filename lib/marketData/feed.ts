import type { MarketTick, VolatilityMode } from "@/lib/types"

/**
 * MarketFeed
 * ----------
 * The transport-agnostic contract every market data source must satisfy. The
 * rest of the application depends only on this interface, never on a concrete
 * implementation — so swapping the local {@link MarketDataEngine} simulation for
 * a live WebSocket stream is a one-line change in the engine provider.
 *
 * Implementations:
 *  - {@link MarketDataEngine}      — client-side mean-reverting simulation (default)
 *  - {@link WebSocketFeed}         — placeholder for a future real-time feed
 */
export type TickListener = (ticks: MarketTick[]) => void

export interface MarketFeed {
  /** Register a tick listener. Returns an unsubscribe function. */
  subscribe(listener: TickListener): () => void
  /** Begin streaming ticks. */
  start(): void
  /** Stop streaming and release any resources. */
  stop(): void
  /** Whether the feed is currently streaming. */
  isRunning(): boolean
  /** Adjust the volatility regime (no-op for feeds without a model). */
  setVolatility(mode: VolatilityMode): void
  /** Adjust the emit cadence in milliseconds (no-op for push feeds). */
  setInterval(ms: number): void
}

/** The available market data sources the UI can switch between. */
export type FeedMode = "SIMULATION" | "WEBSOCKET"
