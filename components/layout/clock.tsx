"use client"

import { useEffect, useState } from "react"

export function Clock() {
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleTimeString("en-US", { hour12: false }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="tnum text-sm text-muted-foreground" suppressHydrationWarning aria-label="Current time">
      {now || "--:--:--"}
    </span>
  )
}
