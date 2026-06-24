interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  tone?: "up" | "down" | "neutral"
  className?: string
}

/**
 * A tiny, dependency-free SVG sparkline. Renders a normalized polyline from a
 * series of values; cheap enough to update on every tick.
 */
export function Sparkline({ data, width = 72, height = 24, tone = "neutral", className }: SparklineProps) {
  if (data.length < 2) {
    return <svg width={width} height={height} className={className} aria-hidden="true" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / range) * height
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")

  const stroke =
    tone === "up" ? "var(--color-up)" : tone === "down" ? "var(--color-down)" : "var(--color-primary)"

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Price trend sparkline"
      preserveAspectRatio="none"
    >
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
