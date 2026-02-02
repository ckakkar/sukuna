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
      <ToriiGates character={character} beatIntensity={beatIntensity} />
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
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="text-manga-ink/10"
          >
            <rect x="20" y="40" width="3" height="50" fill="currentColor" opacity="0.2" />
            <rect x="76" y="40" width="3" height="50" fill="currentColor" opacity="0.2" />
            <rect x="15" y="40" width="70" height="5" fill="currentColor" opacity="0.25" />
            <rect x="10" y="35" width="80" height="3" fill="currentColor" opacity="0.2" />
            
            {/* Decorative elements */}
            <circle cx="30" cy="42" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="70" cy="42" r="2" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
      ))}
    </div>
  )
}

