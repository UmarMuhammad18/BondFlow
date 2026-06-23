/** Formatting helpers for trading-grade numeric display. */

export function fmtPrice(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

export function fmtYield(n: number): string {
  return `${n.toFixed(3)}%`
}

export function fmtChange(n: number): string {
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(3)}`
}

export function fmtPct(n: number): string {
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(2)}%`
}

export function fmtQty(n: number): string {
  return n.toLocaleString("en-US")
}

export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", { hour12: false })
}
