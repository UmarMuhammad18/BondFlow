import type { BondInstrument, MarketTick, VolatilityMode, PriceDirection } from "@/lib/types"

/**
 * MarketDataEngine
 * ----------------
 * A self-contained, client-side simulation of a live fixed-income market.
 *
 * It maintains an internal price state per instrument, applies a small
 * mean-reverting random walk on each interval, derives a fresh bid/ask/mid and
 * yield, and emits a batch of {@link MarketTick}s to a subscriber callback.
 *
 * Design notes / extension hooks:
 *  - The engine is transport-agnostic: today it uses setInterval, but the same
 *    `subscribe`/`emit` contract could be backed by a WebSocket feed. Swapping
 *    `start()` to attach a socket listener instead of a timer is the only change
 *    needed for real-time streaming (see FUTURE: WebSocket below).
 *  - Ticks are emitted in batches so the store can apply one update per frame
 *    instead of one per instrument, minimizing re-renders.
 */

const VOL_FACTOR: Record<VolatilityMode, number> = {
  LOW: 0.012,
  MEDIUM: 0.03,
  HIGH: 0.07,
}

// Modified-duration approximations per maturity bucket. Used to convert a price
// change into a yield change (dy ≈ -dP / (P * duration)).
const DURATION: Record<string, number> = {
  "2Y": 1.9,
  "5Y": 4.6,
  "10Y": 8.4,
  "30Y": 17.5,
}

type TickListener = (ticks: MarketTick[]) => void

interface EngineState {
  mid: number
  yield: number
  prevClose: number
}

export interface EngineOptions {
  intervalMs?: number
  volatility?: VolatilityMode
}

export class MarketDataEngine {
  private instruments: BondInstrument[]
  private state = new Map<string, EngineState>()
  private listeners = new Set<TickListener>()
  private timer: ReturnType<typeof setInterval> | null = null
  private intervalMs: number
  private volatility: VolatilityMode

  constructor(instruments: BondInstrument[], options: EngineOptions = {}) {
    this.instruments = instruments
    this.intervalMs = options.intervalMs ?? 350
    this.volatility = options.volatility ?? "MEDIUM"
    for (const inst of instruments) {
      this.state.set(inst.id, { mid: inst.mid, yield: inst.yield, prevClose: inst.prevClose })
    }
  }

  subscribe(listener: TickListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  setVolatility(mode: VolatilityMode) {
    this.volatility = mode
  }

  setInterval(ms: number) {
    this.intervalMs = ms
    if (this.timer) {
      this.stop()
      this.start()
    }
  }

  start() {
    if (this.timer) return
    // FUTURE: WebSocket — replace this timer with a socket subscription and call
    // `this.emit(parsedTicks)` from the message handler instead.
    this.timer = setInterval(() => this.emit(this.step()), this.intervalMs)
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  isRunning() {
    return this.timer !== null
  }

  /** Advance the simulation by one step and return the resulting ticks. */
  private step(): MarketTick[] {
    const vol = VOL_FACTOR[this.volatility]
    const now = Date.now()
    const ticks: MarketTick[] = []

    for (const inst of this.instruments) {
      const s = this.state.get(inst.id)!
      // Mean-reverting random walk: pull gently toward prevClose, add noise.
      const reversion = (s.prevClose - s.mid) * 0.02
      const shock = (Math.random() - 0.5) * 2 * vol
      const newMid = +(s.mid + reversion + shock).toFixed(3)

      const dP = newMid - s.mid
      const duration = DURATION[inst.maturity] ?? 5
      // Price up => yield down.
      const dy = -dP / (newMid * duration)
      const newYield = +(s.yield + dy).toFixed(4)

      let direction: PriceDirection = "flat"
      if (dP > 0.0005) direction = "up"
      else if (dP < -0.0005) direction = "down"

      s.mid = newMid
      s.yield = newYield

      const spread = 0.03 + Math.random() * 0.02
      ticks.push({
        instrumentId: inst.id,
        timestamp: now,
        bid: +(newMid - spread / 2).toFixed(3),
        ask: +(newMid + spread / 2).toFixed(3),
        mid: newMid,
        yield: newYield,
        direction,
      })
    }

    return ticks
  }

  private emit(ticks: MarketTick[]) {
    for (const listener of this.listeners) listener(ticks)
  }
}
