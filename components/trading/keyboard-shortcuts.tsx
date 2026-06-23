"use client"

import { useEffect } from "react"
import { useMarketStore } from "@/lib/store/marketStore"
import { useOrderStore } from "@/lib/store/orderStore"

/** Shortcut definitions shared with the help modal so they never drift. */
export const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["B"], label: "Set order side to Buy" },
  { keys: ["S"], label: "Set order side to Sell" },
  { keys: ["M"], label: "Market order type" },
  { keys: ["L"], label: "Limit order type" },
  { keys: ["↑", "↓"], label: "Cycle selected instrument" },
  { keys: ["Space"], label: "Pause / resume the feed" },
  { keys: ["?"], label: "Toggle this shortcuts panel" },
]

/**
 * Headless component that wires global keyboard shortcuts to the order draft and
 * engine stores. Ignores keystrokes while the user is typing in a field so the
 * Quantity / Limit inputs keep working normally.
 */
export function KeyboardShortcuts({ onToggleHelp }: { onToggleHelp: () => void }) {
  const order = useMarketStore((s) => s.order)
  const running = useMarketStore((s) => s.running)
  const setRunning = useMarketStore((s) => s.setRunning)
  const feedMode = useMarketStore((s) => s.feedMode)
  const setSide = useOrderStore((s) => s.setSide)
  const setType = useOrderStore((s) => s.setType)
  const cycleInstrument = useOrderStore((s) => s.cycleInstrument)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case "b":
        case "B":
          setSide("BUY")
          break
        case "s":
        case "S":
          setSide("SELL")
          break
        case "m":
        case "M":
          setType("MARKET")
          break
        case "l":
        case "L":
          setType("LIMIT")
          break
        case "ArrowUp":
          e.preventDefault()
          cycleInstrument(order, -1)
          break
        case "ArrowDown":
          e.preventDefault()
          cycleInstrument(order, 1)
          break
        case " ":
          if (feedMode === "SIMULATION") {
            e.preventDefault()
            setRunning(!running)
          }
          break
        case "?":
          onToggleHelp()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [order, running, feedMode, setRunning, setSide, setType, cycleInstrument, onToggleHelp])

  return null
}
