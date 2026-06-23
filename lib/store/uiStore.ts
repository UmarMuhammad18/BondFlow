import { create } from "zustand"

/** Small store for cross-cutting terminal UI state (modals, drawers). */
interface UiState {
  shortcutsOpen: boolean
  mobileControlsOpen: boolean
  setShortcutsOpen: (open: boolean) => void
  toggleShortcuts: () => void
  setMobileControlsOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  shortcutsOpen: false,
  mobileControlsOpen: false,
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
  toggleShortcuts: () => set((s) => ({ shortcutsOpen: !s.shortcutsOpen })),
  setMobileControlsOpen: (mobileControlsOpen) => set({ mobileControlsOpen }),
}))
