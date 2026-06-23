"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useUiStore } from "@/lib/store/uiStore"
import { EngineControls } from "./engine-controls"
import { Clock } from "./clock"

/** Slide-over drawer that exposes the engine controls on small screens. */
export function MobileControls() {
  const open = useUiStore((s) => s.mobileControlsOpen)
  const setOpen = useUiStore((s) => s.setMobileControlsOpen)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[300px] max-w-[85vw] flex-col gap-5 border-l border-border bg-card p-4 lg:hidden"
            role="dialog"
            aria-label="Engine controls"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Engine Controls</h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close controls"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* EngineControls is a flex row; on mobile we let it wrap into the column. */}
            <div className="[&>div]:flex-col [&>div]:items-stretch [&_button]:w-full [&_[role=combobox]]:w-full">
              <EngineControls />
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <Clock />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
