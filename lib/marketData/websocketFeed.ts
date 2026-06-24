import type { MarketFeed, TickListener } from "./feed"
import type { VolatilityMode } from "@/lib/types"

/** Where a real venue feed URL would be read from once integrated. */
export const WS_PLACEHOLDER_URL = "NEXT_PUBLIC_FEED_URL"

/**
 * WebSocketFeed (placeholder)
 * ---------------------------
 * A stub implementation of {@link MarketFeed} that reserves the integration
 * surface for a real-time exchange/venue feed. It deliberately emits nothing:
 * selecting the WebSocket source today simply freezes the simulation and shows
 * a "coming soon" state in the UI.
 *
 * To go live, connect a socket in {@link start} and forward parsed messages to
 * the registered listeners — the store, panels, and the rest of the app require
 * no changes because they only depend on the {@link MarketFeed} contract.
 *
 * @example
 *   start() {
 *     this.socket = new WebSocket(process.env.NEXT_PUBLIC_FEED_URL!)
 *     this.socket.onmessage = (e) => this.emit(parseTicks(e.data))
 *     this.running = true
 *   }
 */
export class WebSocketFeed implements MarketFeed {
  private listeners = new Set<TickListener>()
  private running = false
  // private socket: WebSocket | null = null  // wire up when integrating

  subscribe(listener: TickListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  start(): void {
    // FUTURE: open the WebSocket connection here and stream real ticks.
    this.running = true
  }

  stop(): void {
    // FUTURE: close the socket and clean up handlers.
    this.running = false
  }

  isRunning(): boolean {
    return this.running
  }

  // No client-side model: volatility/interval are governed by the venue.
  setVolatility(_mode: VolatilityMode): void {}
  setInterval(_ms: number): void {}

  /** Reserved for the future message handler. */
  // private emit(ticks: MarketTick[]) {
  //   for (const listener of this.listeners) listener(ticks)
  // }
}
