"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Home, Info, Settings, Keyboard } from "lucide-react"
import { useUiStore } from "@/lib/store/uiStore"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/terminal", label: "Terminal", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/", label: "Home", icon: Home },
]

export function Sidebar() {
  const pathname = usePathname()
  const toggleShortcuts = useUiStore((s) => s.toggleShortcuts)

  return (
    <nav
      className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-3 md:flex"
      aria-label="Primary"
    >
      {NAV.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        )
      })}

      <button
        onClick={toggleShortcuts}
        title="Keyboard shortcuts (?)"
        className="mt-auto flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Keyboard className="h-5 w-5" />
        <span className="sr-only">Keyboard shortcuts</span>
      </button>
    </nav>
  )
}
