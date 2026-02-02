import type { Metadata, Viewport } from "next"
import "./globals.css"

const SITE_URL = process.env.NEXTAUTH_URL || "https://sukuna.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sukuna — Cursed Energy Visualizer",
    template: "%s | Sukuna",
  },
  description:
    "3D audio-reactive music visualizer with Spotify. Experience your music through immersive cursed energy effects and domain expansions.",
  keywords: ["music visualizer", "Spotify", "3D", "audio reactive", "Jujutsu Kaisen"],
  authors: [{ name: "Sukuna" }],
  creator: "Sukuna",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Sukuna",
    title: "Sukuna — Cursed Energy Visualizer",
    description: "3D audio-reactive music visualizer with Spotify. Experience your music through immersive cursed energy effects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sukuna — Cursed Energy Visualizer",
    description: "3D audio-reactive music visualizer with Spotify.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#1c1917",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}

