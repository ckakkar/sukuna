"use client"

import { useState, useEffect } from "react"

interface JJKLoginScreenProps {
  onLogin: () => Promise<void>
}

export function JJKLoginScreen({ onLogin }: JJKLoginScreenProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Generate cursed energy particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-white text-black">
      {/* Manga Halftone Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '8px 8px'
        }}
      />

      {/* Animated Speed Lines (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="speed-lines" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pointer-events-none">
        <div className="w-full max-w-md space-y-12 text-center pointer-events-auto">

          {/* Title Section */}
          <div className="relative mb-8">
            <h1
              className="relative text-7xl sm:text-8xl font-black tracking-tighter mb-4 will-animate"
              style={{
                color: 'black',
                textShadow: '4px 4px 0px #d4d4d4, 8px 8px 0px #a3a3a3',
                WebkitTextStroke: '2px black'
              }}
            >
              両面宿儺
            </h1>

            <h2
              className="text-4xl sm:text-5xl font-black italic tracking-widest uppercase bg-black text-white px-4 py-2 inline-block transform -skew-x-12"
              style={{
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.3)'
              }}
            >
              SUKUNA
            </h2>

            <div className="mt-6 flex justify-center">
              <div className="w-24 h-2 bg-black" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-3 font-mono">
            <p className="text-lg font-bold tracking-widest uppercase">
              Cursed Energy Visualizer
            </p>
            <p className="text-sm font-black opacity-60">
              呪力ビジュアライザー
            </p>
          </div>

          {/* Login button - Manga Action Button */}
          <div className="relative pt-8">
            <button
              onClick={onLogin}
              type="button"
              className="relative group w-full px-12 py-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none bg-white border-4 border-black"
              style={{
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
              }}
              aria-label="Connect with Spotify"
            >
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-2xl font-black uppercase tracking-tight group-hover:scale-105 transition-transform">
                  Connect Spotify
                </span>
                <span className="text-xs font-bold bg-black text-white px-2 py-0.5">
                  領域展開 (Domain Expansion)
                </span>
              </div>

              {/* Halftone hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                  backgroundSize: '4px 4px'
                }}
              />
            </button>
          </div>

          <div className="mt-12 opacity-60">
            <p className="font-mono text-xs uppercase tracking-widest">
              Ryomen Sukuna // King of Curses
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

