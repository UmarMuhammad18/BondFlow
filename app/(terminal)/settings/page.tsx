"use client"

import { useMarketStore } from "@/lib/store/marketStore"
import type { VolatilityMode } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const running = useMarketStore((s) => s.running)
  const setRunning = useMarketStore((s) => s.setRunning)
  const volatility = useMarketStore((s) => s.volatility)
  const setVolatility = useMarketStore((s) => s.setVolatility)
  const intervalMs = useMarketStore((s) => s.intervalMs)
  const setIntervalMs = useMarketStore((s) => s.setIntervalMs)

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Configure the simulation engine. Changes apply instantly across every panel.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Market Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Feed status</Label>
              <p className="text-xs text-muted-foreground">Pause or resume live price updates.</p>
            </div>
            <Button variant={running ? "down" : "up"} size="sm" onClick={() => setRunning(!running)}>
              {running ? "Pause feed" : "Resume feed"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Volatility mode</Label>
              <p className="text-xs text-muted-foreground">Controls the magnitude of price shocks.</p>
            </div>
            <Select value={volatility} onValueChange={(v) => setVolatility(v as VolatilityMode)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Update interval</Label>
              <p className="text-xs text-muted-foreground">How often the engine emits new ticks.</p>
            </div>
            <Select value={String(intervalMs)} onValueChange={(v) => setIntervalMs(Number(v))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200 ms</SelectItem>
                <SelectItem value="350">350 ms</SelectItem>
                <SelectItem value="500">500 ms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
