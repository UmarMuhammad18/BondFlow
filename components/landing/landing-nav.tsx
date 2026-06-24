"use client"

import Link from "next/link"
import { CandlestickChart } from "lucide-react"
import { Button } from "@/components/ui/button"

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#architecture", label: "Architecture" },
  { href: "#tradeweb", label: "Institutional" },
  { href: "/about", label: "Docs" },
]

export function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="BondFlow home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CandlestickChart className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">BondFlow</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/about">Documentation</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/terminal">Launch Terminal</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
