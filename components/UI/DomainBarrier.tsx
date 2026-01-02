"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function DomainBarrier() {
  const { isDomainExpanding, selectedCharacter, domainState } = useSpotifyStore()
  const [isVisible, setIsVisible] = useState(false)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (domainState === "expanding" || domainState === "active") {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [domainState])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[45] pointer-events-none overflow-hidden">
      {/* Hexagonal barrier pattern */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern
              id="hexagon-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="50,0 100,25 100,75 50,100 0,75 0,25"
                fill="none"
                stroke={character.colors.glow}
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
        </svg>
      </div>

      {/* Expanding barrier sphere */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2"
            style={{
              width: "200%",
              height: "200%",
              borderColor: character.colors.glow,
              opacity: 0.4 - i * 0.1,
              animation: `barrier-expand ${2 + i * 0.5}s ease-out ${i * 0.3}s infinite`,
              boxShadow: `0 0 ${30 + i * 10}px ${character.colors.glow}, inset 0 0 ${30 + i * 10}px ${character.colors.glow}40`,
            }}
          />
        ))}
      </div>

      {/* Distortion effect overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${character.colors.glow}10 50%, transparent 100%)`,
          animation: "distortion-pulse 2s ease-in-out infinite",
          mixBlendMode: "overlay",
        }}
      />

      <style jsx>{`
        @keyframes barrier-expand {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes distortion-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

