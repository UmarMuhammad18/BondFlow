import { create } from "zustand"
import type { OrderType, Side } from "@/lib/types"
import { SEED_INSTRUMENTS } from "@/lib/marketData/instruments"

/**
 * OrderDraftStore
 * ---------------
 * Holds the in-progress order-ticket form so it can be driven from two places:
 * the Order Ticket panel itself and the global keyboard-shortcut handler
 * (B/S to set side, M/L to set type, arrow keys to cycle instruments).
 * Keeping the draft in a tiny dedicated store avoids prop-drilling and keeps
 * the Order Ticket component free of cross-cutting keyboard concerns.
 */
interface OrderDraftState {
  side: Side
  type: OrderType
  instrumentId: string
  quantity: string
  limitPrice: string

  setSide: (side: Side) => void
  setType: (type: OrderType) => void
  setInstrument: (id: string) => void
  setQuantity: (q: string) => void
  setLimitPrice: (p: string) => void
  /** Move selection to the previous/next instrument in a given order list. */
  cycleInstrument: (order: string[], dir: 1 | -1) => void
}

export const useOrderStore = create<OrderDraftState>((set) => ({
  side: "BUY",
  type: "MARKET",
  instrumentId: SEED_INSTRUMENTS[0]?.id ?? "",
  quantity: "1000000",
  limitPrice: "",

  setSide: (side) => set({ side }),
  setType: (type) => set({ type }),
  setInstrument: (instrumentId) => set({ instrumentId }),
  setQuantity: (quantity) => set({ quantity }),
  setLimitPrice: (limitPrice) => set({ limitPrice }),
  cycleInstrument: (order, dir) =>
    set((s) => {
      if (order.length === 0) return s
      const idx = Math.max(0, order.indexOf(s.instrumentId))
      const next = (idx + dir + order.length) % order.length
      return { instrumentId: order[next] }
    }),
}))
