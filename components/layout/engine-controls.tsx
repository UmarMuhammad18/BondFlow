"use client"

import { Pause, Play, Radio, Wifi } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import type { VolatilityMode } from "@/lib/types"
import type { FeedMode } from "@/lib/marketData/feed"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function EngineControls() {
  const running = useMarketStore((s) => s.running)
  const setRunning = useMarketStore((s) => s.setRunning)
  const volatility = useMarketStore((s) => s.volatility)
  const setVolatility = useMarketStore((s) => s.setVolatility)
  const intervalMs = useMarketStore((s) => s.intervalMs)
  const setIntervalMs = useMarketStore((s) => s.setIntervalMs)
  const feedMode = useMarketStore((s) => s.feedMode)
  const setFeedMode = useMarketStore((s) => s.setFeedMode)

  const isWebSocket = feedMode === "WEBSOCKET"

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setRunning(!running)}
        disabled={isWebSocket}
        className="gap-1.5"
        aria-pressed={running}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {running ? "Pause" : "Resume"}
      </Button>

      <Select
        value={volatility}
        onValueChange={(v) => setVolatility(v as VolatilityMode)}
        disabled={isWebSocket}
      >
        <SelectTrigger className="h-8 w-[112px] text-xs" aria-label="Volatility mode">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Low Vol</SelectItem>
          <SelectItem value="MEDIUM">Medium Vol</SelectItem>
          <SelectItem value="HIGH">High Vol</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={String(intervalMs)}
        onValueChange={(v) => setIntervalMs(Number(v))}
        disabled={isWebSocket}
      >
        <SelectTrigger className="h-8 w-[104px] text-xs" aria-label="Update interval">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="150">Fast · 150ms</SelectItem>
          <SelectItem value="400">Normal · 400ms</SelectItem>
          <SelectItem value="800">Slow · 800ms</SelectItem>
        </SelectContent>
      </Select>

      <Select value={feedMode} onValueChange={(v) => setFeedMode(v as FeedMode)}>
        <SelectTrigger className="h-8 w-[128px] text-xs" aria-label="Data feed source">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SIMULATION">Simulated Feed</SelectItem>
          <SelectItem value="WEBSOCKET">Live Feed (WS)</SelectItem>
        </SelectContent>
      </Select>

      <span
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        aria-live="polite"
      >
        {isWebSocket ? (
          <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Radio className={cn("h-3.5 w-3.5", running && "text-up")} />
        )}
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isWebSocket ? "bg-muted-foreground" : running ? "animate-pulse bg-up" : "bg-muted-foreground",
          )}
        />
        {isWebSocket ? "Awaiting WS" : running ? "Live" : "Paused"}
      </span>
    </div>
  )
}
