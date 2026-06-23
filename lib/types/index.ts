/**
 * Core domain types for BondFlow.
 *
 * These interfaces model the fixed-income trading domain and are shared across
 * the market data engine, the global store, and every UI panel. Keeping them in
 * one place enforces strict, consistent typing end-to-end.
 */

/** Standard maturity buckets used to build the yield curve. */
export type Maturity = "2Y" | "5Y" | "10Y" | "30Y"

export type Side = "BUY" | "SELL"

export type OrderType = "MARKET" | "LIMIT"

export type VolatilityMode = "LOW" | "MEDIUM" | "HIGH"

export type PriceDirection = "up" | "down" | "flat"

/** A tradable bond instrument and its current, live market state. */
export interface BondInstrument {
  /** Stable identifier, e.g. "UST10Y". */
  id: string
  /** Human-readable name, e.g. "US 10Y Gov Bond". */
  name: string
  /** Short ticker label for compact display, e.g. "US 10Y". */
  ticker: string
  /** Maturity bucket this instrument maps onto for the yield curve. */
  maturity: Maturity
  /** Coupon rate (%) — static reference data. */
  coupon: number

  /** Live two-sided market. */
  bid: number
  ask: number
  mid: number
  /** Yield to maturity (%) derived from price. */
  yield: number

  /** Session reference price used to compute change. */
  prevClose: number
  /** Absolute price change vs prevClose. */
  change: number
  /** Percentage price change vs prevClose. */
  changePct: number
  /** Direction of the most recent tick, for flash/arrow cues. */
  direction: PriceDirection
}

/** A single point-in-time market update for one instrument. */
export interface MarketTick {
  instrumentId: string
  timestamp: number
  bid: number
  ask: number
  mid: number
  yield: number
  direction: PriceDirection
}

/** A user-submitted order before/at execution. */
export interface Order {
  id: string
  instrumentId: string
  side: Side
  type: OrderType
  quantity: number
  /** Limit price; undefined for market orders. */
  limitPrice?: number
  createdAt: number
}

/** An executed fill recorded in the blotter. */
export interface Trade {
  id: string
  instrumentId: string
  instrumentName: string
  side: Side
  quantity: number
  price: number
  yield: number
  timestamp: number
}

/** Net position summary per instrument. */
export interface Position {
  instrumentId: string
  instrumentName: string
  /** Net quantity (positive = long, negative = short). */
  netQuantity: number
  /** Volume-weighted average entry price. */
  avgPrice: number
}

/** Single maturity point on the yield curve. */
export interface YieldPoint {
  maturity: Maturity
  yield: number
  instrumentId: string
}
