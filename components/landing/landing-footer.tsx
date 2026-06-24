import Link from "next/link"
import { CandlestickChart, Github } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CandlestickChart className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold tracking-tight text-foreground">BondFlow</span>
          <span className="text-xs text-muted-foreground">Fixed-Income Trading Terminal</span>
        </div>

        <nav className="flex items-center gap-6 text-sm" aria-label="Footer">
          <Link href="/terminal" className="text-muted-foreground transition-colors hover:text-foreground">
            Terminal
          </Link>
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </Link>
          <a
            href="https://github.com/UmarMuhammad18/BondFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <p className="text-xs text-muted-foreground">
          {"\u00A9"} {new Date().getFullYear()} BondFlow. Simulation only — not financial advice.
        </p>
      </div>
    </footer>
  )
}
