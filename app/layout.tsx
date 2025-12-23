import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sukuna - Cursed Energy Visualizer",
  description: "High-performance 3D audio-reactive visualization",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover", // For safe area insets on iOS
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ viewTransitionName: "root" }}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

