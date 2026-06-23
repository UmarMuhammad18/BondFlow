import type { BondInstrument } from "@/lib/types"

/**
 * Seed reference data for the simulated fixed-income universe.
 *
 * Prices are quoted per 100 face value (clean price convention). Yields are
 * approximate real-world levels chosen to produce a realistic, upward-sloping
 * yield curve. The engine mutates the live fields (bid/ask/mid/yield/...) on
 * each tick; the static fields (coupon/name/maturity) stay constant.
 */
function seed(
  id: string,
  name: string,
  ticker: string,
  maturity: BondInstrument["maturity"],
  coupon: number,
  price: number,
  yld: number,
): BondInstrument {
  const spread = 0.04
  const bid = +(price - spread / 2).toFixed(3)
  const ask = +(price + spread / 2).toFixed(3)
  return {
    id,
    name,
    ticker,
    maturity,
    coupon,
    bid,
    ask,
    mid: price,
    yield: yld,
    prevClose: price,
    change: 0,
    changePct: 0,
    direction: "flat",
  }
}

export const SEED_INSTRUMENTS: BondInstrument[] = [
  seed("UST2Y", "US 2Y Treasury Note", "US 2Y", "2Y", 4.25, 99.84, 4.34),
  seed("UST5Y", "US 5Y Treasury Note", "US 5Y", "5Y", 4.0, 98.92, 4.12),
  seed("UST10Y", "US 10Y Treasury Note", "US 10Y", "10Y", 4.0, 96.41, 4.28),
  seed("UST30Y", "US 30Y Treasury Bond", "US 30Y", "30Y", 4.25, 92.18, 4.51),
]
