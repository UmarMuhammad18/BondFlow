import { create } from "zustand"
import type {
  BondInstrument,
  MarketTick,
  Order,
  Trade,
  Position,
  VolatilityMode,
  YieldPoint,
  Maturity,
} from "@/lib/types"
import { SEED_INSTRUMENTS } from "@/lib/marketData/instruments"

const MATURITY_ORDER: Maturity[] = ["2Y", "5Y", "10Y", "30Y"]

export interface OrderResult {
  ok: boolean
  message: string
  trade?: Trade
}

interface MarketState {
  /** Instruments keyed by id for O(1) tick application. */
  instruments: Record<string, BondInstrument>
  /** Stable ordering for rendering lists/curves. */
  order: string[]
  trades: Trade[]
  positions: Record<string, Position>

  // Engine settings (UI-controlled, consumed by the engine provider).
  volatility: VolatilityMode
  intervalMs: number
  running: boolean

  // Actions
  applyTicks: (ticks: MarketTick[]) => void
  submitOrder: (order: Omit<Order, "id" | "createdAt">) => OrderResult
  setVolatility: (mode: VolatilityMode) => void
  setIntervalMs: (ms: number) => void
  setRunning: (running: boolean) => void
}

function buildInitial() {
  const instruments: Record<string, BondInstrument> = {}
  const order: string[] = []
  for (const inst of SEED_INSTRUMENTS) {
    instruments[inst.id] = { ...inst }
    order.push(inst.id)
  }
  return { instruments, order }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export const useMarketStore = create<MarketState>((set, get) => ({
  ...buildInitial(),
  trades: [],
  positions: {},
  volatility: "MEDIUM",
  intervalMs: 350,
  running: true,

  applyTicks: (ticks) =>
    set((state) => {
      // Apply all ticks in a single immutable update so subscribers re-render once.
      const next = { ...state.instruments }
      for (const tick of ticks) {
        const prev = next[tick.instrumentId]
        if (!prev) continue
        const change = +(tick.mid - prev.prevClose).toFixed(3)
        const changePct = +((change / prev.prevClose) * 100).toFixed(3)
        next[tick.instrumentId] = {
          ...prev,
          bid: tick.bid,
          ask: tick.ask,
          mid: tick.mid,
          yield: tick.yield,
          change,
          changePct,
          direction: tick.direction,
        }
      }
      return { instruments: next }
    }),

  submitOrder: (input) => {
    const state = get()
    const inst = state.instruments[input.instrumentId]
    if (!inst) return { ok: false, message: "Unknown instrument." }
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
      return { ok: false, message: "Quantity must be a positive number." }
    }

    let fillPrice: number
    if (input.type === "MARKET") {
      // Market orders cross the spread immediately.
      fillPrice = input.side === "BUY" ? inst.ask : inst.bid
    } else {
      if (!input.limitPrice || input.limitPrice <= 0) {
        return { ok: false, message: "Limit orders require a valid limit price." }
      }
      // Limit executes only when the market is favorable.
      if (input.side === "BUY") {
        if (inst.ask > input.limitPrice) {
          return { ok: false, message: `Not filled: ask ${inst.ask.toFixed(3)} above limit ${input.limitPrice.toFixed(3)}. Order would rest.` }
        }
        fillPrice = input.limitPrice
      } else {
        if (inst.bid < input.limitPrice) {
          return { ok: false, message: `Not filled: bid ${inst.bid.toFixed(3)} below limit ${input.limitPrice.toFixed(3)}. Order would rest.` }
        }
        fillPrice = input.limitPrice
      }
    }

    const trade: Trade = {
      id: uid("trd"),
      instrumentId: inst.id,
      instrumentName: inst.name,
      side: input.side,
      quantity: input.quantity,
      price: +fillPrice.toFixed(3),
      yield: inst.yield,
      timestamp: Date.now(),
    }

    set((s) => {
      // Update positions (net quantity + VWAP entry).
      const signed = input.side === "BUY" ? input.quantity : -input.quantity
      const prevPos = s.positions[inst.id]
      let newPos: Position
      if (!prevPos || prevPos.netQuantity === 0) {
        newPos = {
          instrumentId: inst.id,
          instrumentName: inst.name,
          netQuantity: signed,
          avgPrice: trade.price,
        }
      } else {
        const newQty = prevPos.netQuantity + signed
        const addingToSameSide = Math.sign(prevPos.netQuantity) === Math.sign(signed)
        const avgPrice =
          addingToSameSide && newQty !== 0
            ? +(
                (prevPos.avgPrice * Math.abs(prevPos.netQuantity) + trade.price * Math.abs(signed)) /
                Math.abs(newQty)
              ).toFixed(3)
            : prevPos.avgPrice
        newPos = { ...prevPos, netQuantity: newQty, avgPrice }
      }

      return {
        trades: [trade, ...s.trades].slice(0, 200),
        positions: { ...s.positions, [inst.id]: newPos },
      }
    })

    return { ok: true, message: `${input.side} ${input.quantity} ${inst.ticker} @ ${trade.price.toFixed(3)}`, trade }
  },

  setVolatility: (mode) => set({ volatility: mode }),
  setIntervalMs: (ms) => set({ intervalMs: ms }),
  setRunning: (running) => set({ running }),
}))

/* ----------------------------- Derived helpers ----------------------------- *
 * These are pure functions over raw state slices. Components subscribe to the
 * stable `instruments`/`order` references and memoize these locally, so we never
 * return freshly-allocated arrays from inside a zustand selector (which would
 * break SSR's getServerSnapshot and cause render loops).                       */

type InstrumentMap = Record<string, BondInstrument>

/** Stable, ordered list of instruments. */
export function computeInstrumentList(instruments: InstrumentMap, order: string[]): BondInstrument[] {
  return order.map((id) => instruments[id])
}

/** Build the yield curve points in maturity order. */
export function computeYieldCurve(instruments: InstrumentMap, order: string[]): YieldPoint[] {
  const byMaturity = new Map<Maturity, BondInstrument>()
  for (const id of order) {
    const inst = instruments[id]
    byMaturity.set(inst.maturity, inst)
  }
  return MATURITY_ORDER.filter((m) => byMaturity.has(m)).map((m) => {
    const inst = byMaturity.get(m)!
    return { maturity: m, yield: inst.yield, instrumentId: inst.id }
  })
}

/** 10Y–2Y spread in basis points. */
export function computeSpread10s2s(instruments: InstrumentMap): number | null {
  const list = Object.values(instruments)
  const tenY = list.find((i) => i.maturity === "10Y")
  const twoY = list.find((i) => i.maturity === "2Y")
  if (!tenY || !twoY) return null
  return +((tenY.yield - twoY.yield) * 100).toFixed(1)
}

export function computeAvgYield(instruments: InstrumentMap): number {
  const list = Object.values(instruments)
  if (list.length === 0) return 0
  return +(list.reduce((acc, i) => acc + i.yield, 0) / list.length).toFixed(3)
}
