"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function RealityCrack() {
  const { selectedCharacter, domainState } = useSpotifyStore()
  const [cracks, setCracks] = useState<Array<{ id: number; path: string; delay: number }>>([])
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (domainState === "expanding") {
      // Generate crack paths
      const newCracks = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        path: generateCrackPath(),
        delay: i * 0.1,
      }))
      setCracks(newCracks)

      // Remove cracks after animation
      const timer = setTimeout(() => {
        setCracks([])
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setCracks([])
    }
  }, [domainState])

  const generateCrackPath = () => {
    // Generate a random crack path from center outward
    const startX = 50
    const startY = 50
    const segments = 5 + Math.floor(Math.random() * 5)
    let path = `M ${startX} ${startY}`

    for (let i = 0; i < segments; i++) {
      const angle = Math.random() * Math.PI * 2
      const length = 10 + Math.random() * 20
      const x = startX + Math.cos(angle) * length * (i + 1)
      const y = startY + Math.sin(angle) * length * (i + 1)
      path += ` L ${x} ${y}`
    }

    return path
  }

  if (cracks.length === 0) return null

  return (
    <div className="fixed inset-0 z-[46] pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="crack-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {cracks.map((crack) => (
          <path
            key={crack.id}
            d={crack.path}
            fill="none"
            stroke={character.colors.glow}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#crack-glow)"
            style={{
              opacity: 0,
              strokeDasharray: "1000",
              strokeDashoffset: "1000",
              animation: `crack-appear 1.5s ease-out ${crack.delay}s forwards`,
            }}
          />
        ))}
      </svg>

      {/* Shatter particles */}
      {cracks.map((crack, i) => {
        const angle = (i / cracks.length) * Math.PI * 2
        const distance = 30 + Math.random() * 20
        const endX = Math.cos(angle) * distance
        const endY = Math.sin(angle) * distance
        
        return (
          <div
            key={`particle-${crack.id}`}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "4px",
              height: "4px",
              background: character.colors.glow,
              borderRadius: "50%",
              boxShadow: `0 0 8px ${character.colors.glow}`,
              animation: `shatter-particle 1s ease-out ${crack.delay + 0.5}s forwards`,
              transform: `translate(-50%, -50%)`,
              "--end-x": `${endX}px`,
              "--end-y": `${endY}px`,
            } as React.CSSProperties}
          />
        )
      })}

      <style jsx>{`
        @keyframes crack-appear {
          0% {
            opacity: 0;
            stroke-dashoffset: 1000;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
            stroke-dashoffset: 0;
          }
        }

        @keyframes shatter-particle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--end-x)),
              calc(-50% + var(--end-y))
            ) scale(1.5) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

