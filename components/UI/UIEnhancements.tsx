"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

/**
 * UI Enhancements component
 * Adds visual polish: torii gates, scanline effect, and other atmospheric elements
 */
export function UIEnhancements() {
  const { selectedCharacter, beatIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  return (
    <>
      {/* Scanline effect - retro anime feel */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.03) 2px,
            rgba(255,255,255,0.03) 4px
          )`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Torii gates - floating in background */}
      <ToriiGates character={character} beatIntensity={beatIntensity} />

      {/* Cursed energy fog at screen edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse at top, ${character.colors.primary}10 0%, transparent 50%),
                      radial-gradient(ellipse at bottom, ${character.colors.glow}08 0%, transparent 50%),
                      radial-gradient(ellipse at left, ${character.colors.secondary}06 0%, transparent 50%),
                      radial-gradient(ellipse at right, ${character.colors.glow}06 0%, transparent 50%)`,
          opacity: 0.6 + (beatIntensity ?? 0) * 0.2,
        }}
      />
    </>
  )
}

function ToriiGates({ character, beatIntensity }: { character: typeof CHARACTERS[keyof typeof CHARACTERS]; beatIntensity?: number }) {
  const [gates, setGates] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])

  useEffect(() => {
    // Create 3-5 torii gates at random positions
    const newGates = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.2,
    }))
    setGates(newGates)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {gates.map((gate) => (
        <div
          key={gate.id}
          className="absolute"
          style={{
            left: `${gate.x}%`,
            top: `${gate.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: gate.opacity + (beatIntensity ?? 0) * 0.1,
            transition: "opacity 0.3s ease-out",
          }}
        >
          {/* Simplified torii gate SVG */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 10px ${character.colors.glow}40)`,
            }}
          >
            {/* Vertical posts */}
            <rect x="20" y="40" width="4" height="50" fill={character.colors.primary} opacity="0.6" />
            <rect x="76" y="40" width="4" height="50" fill={character.colors.primary} opacity="0.6" />
            
            {/* Horizontal beam */}
            <rect x="15" y="40" width="70" height="6" fill={character.colors.glow} opacity="0.5" />
            
            {/* Top beam */}
            <rect x="10" y="35" width="80" height="4" fill={character.colors.secondary} opacity="0.4" />
            
            {/* Decorative elements */}
            <circle cx="30" cy="42" r="2" fill={character.colors.glow} opacity="0.6" />
            <circle cx="70" cy="42" r="2" fill={character.colors.glow} opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  )
}

