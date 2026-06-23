"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PanelProps {
  title: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}

/** Standard trading panel: titled, bordered, animated mount. */
export function Panel({ title, icon, actions, className, bodyClassName, children }: PanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card", className)}
    >
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h2>
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </header>
      <div className={cn("min-h-0 flex-1 overflow-auto", bodyClassName)}>{children}</div>
    </motion.section>
  )
}
