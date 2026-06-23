import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "BondFlow — Fixed-Income Trading Terminal",
  description:
    "BondFlow is a real-time fixed-income trading terminal simulating institutional bond trading workflows: live market data, yield curve visualization, order management, and a trade blotter.",
  keywords: ["fixed income", "bond trading", "yield curve", "trade blotter", "Tradeweb", "trading terminal"],
  authors: [{ name: "BondFlow" }],
}

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
