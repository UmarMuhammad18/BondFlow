import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { FeatureGrid } from "@/components/landing/feature-grid"
import { LivePreview } from "@/components/landing/live-preview"
import { ArchitectureSection } from "@/components/landing/architecture-section"
import { TradewebSection } from "@/components/landing/tradeweb-section"
import { AboutProject } from "@/components/landing/about-project"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "BondFlow — Real-Time Fixed-Income Trading Terminal",
  description:
    "A professional-grade simulation of institutional bond trading workflows: live market data, yield curve analytics, order execution, a streaming blotter, and positions & P&L tracking.",
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />
      <main>
        <Hero />
        <FeatureGrid />
        <LivePreview />
        <ArchitectureSection />
        <TradewebSection />
        <AboutProject />
      </main>
      <LandingFooter />
    </div>
  )
}
