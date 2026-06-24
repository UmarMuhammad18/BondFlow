import type { Metadata } from "next"
import { AppShell } from "@/components/layout/app-shell"

export const metadata: Metadata = {
  title: "Terminal — BondFlow",
  description: "Live fixed-income trading terminal: market overview, yield curve, order entry, blotter, and positions.",
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
