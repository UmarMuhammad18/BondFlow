"use client"

import { Modal } from "@/components/ui/modal"
import { SHORTCUTS } from "./keyboard-shortcuts"

export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" description="Speed up order entry without leaving the keyboard.">
      <ul className="flex flex-col gap-2">
        {SHORTCUTS.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <span className="flex items-center gap-1">
              {s.keys.map((k) => (
                <kbd
                  key={k}
                  className="min-w-6 rounded border border-border bg-secondary px-1.5 py-0.5 text-center text-[11px] font-medium text-foreground"
                >
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
