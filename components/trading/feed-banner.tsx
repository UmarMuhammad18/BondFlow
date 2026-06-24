"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Wifi, X } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import { WS_PLACEHOLDER_URL } from "@/lib/marketData/websocketFeed"

/**
 * Shown when the user switches to the (not-yet-wired) live WebSocket feed.
 * Documents exactly where to plug a real endpoint in.
 */
export function FeedBanner() {
  const feedMode = useMarketStore((s) => s.feedMode)
  const setFeedMode = useMarketStore((s) => s.setFeedMode)

  return (
    <AnimatePresence>
      {feedMode === "WEBSOCKET" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b border-warn/40 bg-warn/10 px-4 py-2 text-xs text-warn">
            <Wifi className="h-4 w-4 shrink-0" />
            <p className="flex-1">
              Live feed selected. No WebSocket endpoint is configured, so prices are frozen. Point{" "}
              <code className="rounded bg-warn/15 px-1 py-0.5 font-mono">{WS_PLACEHOLDER_URL}</code> at a real
              server in <code className="rounded bg-warn/15 px-1 py-0.5 font-mono">lib/marketData/websocketFeed.ts</code>{" "}
              to stream real data.
            </p>
            <button
              onClick={() => setFeedMode("SIMULATION")}
              className="flex items-center gap-1 rounded-md border border-warn/40 px-2 py-1 font-medium transition-colors hover:bg-warn/20"
            >
              <X className="h-3 w-3" /> Back to simulation
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
