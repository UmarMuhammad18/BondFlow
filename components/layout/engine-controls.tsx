"use client"

import { Pause, Play } from "lucide-react"
import { useMarketStore } from "@/lib/store/marketStore"
import type { VolatilityMode } from "@/lib/types"
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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setRunning(!running)}
        className="gap-1.5"
        aria-pressed={running}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {running ? "Pause" : "Resume"}
      </Button>

      <Select value={volatility} onValueChange={(v) => setVolatility(v as VolatilityMode)}>
        <SelectTrigger className="h-8 w-[112px] text-xs" aria-label="Volatility mode">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Low Vol</SelectItem>
          <SelectItem value="MEDIUM">Medium Vol</SelectItem>
          <SelectItem value="HIGH">High Vol</SelectItem>
        </SelectContent>
      </Select>

      <Select value={String(intervalMs)} onValueChange={(v) => setIntervalMs(Number(v))}>
        <SelectTrigger className="h-8 w-[96px] text-xs" aria-label="Update interval">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="200">200 ms</SelectItem>
          <SelectItem value="350">350 ms</SelectItem>
          <SelectItem value="500">500 ms</SelectItem>
        </SelectContent>
      </Select>

      <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            running ? "animate-pulse bg-up" : "bg-muted-foreground",
          )}
        />
        {running ? "Live" : "Paused"}
      </span>
    </div>
  )
}
