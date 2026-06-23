"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Activity } from "lucide-react"
import { useMarketStore, computeYieldCurve, computeSpread10s2s, computeAvgYield } from "@/lib/store/marketStore"
import { Panel } from "@/components/shared/panel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CurveDatum {
  maturity: string
  yield: number
}

function CurveTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CurveDatum }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold text-foreground">{d.maturity} Maturity</div>
      <div className="mt-1 tnum text-primary">Yield: {d.yield.toFixed(3)}%</div>
    </div>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" | "neutral" }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tnum text-sm font-semibold",
          tone === "up" && "text-up",
          tone === "down" && "text-down",
          (!tone || tone === "neutral") && "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function YieldCurve() {
  // Subscribe to the derived curve; selectors keep this panel decoupled from raw state.
  // Subscribe to raw, stable state and derive locally to avoid creating new
  // references inside the store selector (which breaks SSR getServerSnapshot).
  const instruments = useMarketStore((s) => s.instruments)
  const order = useMarketStore((s) => s.order)
  const volatility = useMarketStore((s) => s.volatility)
  const ready = useMarketStore((s) => s.ready)

  const curve = useMemo(() => computeYieldCurve(instruments, order), [instruments, order])
  const spread = useMemo(() => computeSpread10s2s(instruments), [instruments])
  const avgYield = useMemo(() => computeAvgYield(instruments), [instruments])

  const data = useMemo<CurveDatum[]>(
    () => curve.map((p) => ({ maturity: p.maturity, yield: p.yield })),
    [curve],
  )

  const yields = data.map((d) => d.yield)
  const min = Math.floor(Math.min(...yields) * 10) / 10 - 0.1
  const max = Math.ceil(Math.max(...yields) * 10) / 10 + 0.1

  if (!ready) {
    return (
      <Panel title="Yield Curve" icon={<Activity className="h-4 w-4" />}>
        <div className="flex h-full flex-col p-3">
          <div className="mb-3 flex gap-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="min-h-0 flex-1" />
        </div>
      </Panel>
    )
  }

  return (
    <Panel title="Yield Curve" icon={<Activity className="h-4 w-4" />}>
      <div className="flex h-full flex-col p-3">
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Metric
            label="10Y–2Y Spread"
            value={spread === null ? "—" : `${spread > 0 ? "+" : ""}${spread.toFixed(1)} bps`}
            tone={spread === null ? "neutral" : spread >= 0 ? "up" : "down"}
          />
          <Metric label="Avg Yield" value={`${avgYield.toFixed(3)}%`} />
          <Metric label="Volatility" value={volatility} />
        </div>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="maturity"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[min, max]}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v: number) => `${v.toFixed(2)}%`}
              />
              <Tooltip content={<CurveTooltip />} cursor={{ stroke: "var(--color-primary)", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="yield"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#curveFill)"
                dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--color-primary)" }}
                isAnimationActive
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  )
}
