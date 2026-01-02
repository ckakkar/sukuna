"use client"

import { useEffect, useState, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

// JJK-related kanji symbols
const KANJI_SYMBOLS = [
  "呪", // Curse
  "力", // Power
  "術", // Technique
  "式", // Style
  "域", // Domain
  "展", // Expansion
  "開", // Open
  "闘", // Battle
  "戦", // War
  "霊", // Spirit
  "気", // Energy
  "血", // Blood
  "魂", // Soul
  "斬", // Slash
  "滅", // Destruction
]

interface KanjiDrop {
  id: number
  symbol: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
}

export function KanjiRain() {
  const { selectedCharacter, beatIntensity } = useSpotifyStore()
  const [drops, setDrops] = useState<KanjiDrop[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const dropIdRef = useRef(0)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    // Create initial drops
    const initialDrops: KanjiDrop[] = Array.from({ length: 15 }, () => ({
      id: dropIdRef.current++,
      symbol: KANJI_SYMBOLS[Math.floor(Math.random() * KANJI_SYMBOLS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.1 + Math.random() * 0.2,
      size: 14 + Math.random() * 8,
    }))
    setDrops(initialDrops)

    const animate = () => {
      setDrops((prev) => {
        return prev
          .map((drop) => {
            let newY = drop.y + drop.speed * (1 + (beatIntensity ?? 0) * 0.3)
            let newX = drop.x

            // Add slight horizontal drift
            newX += (Math.sin(drop.id * 0.1) * 0.1)

            // Reset if off screen
            if (newY > 100) {
              return {
                ...drop,
                id: dropIdRef.current++,
                symbol: KANJI_SYMBOLS[Math.floor(Math.random() * KANJI_SYMBOLS.length)],
                x: Math.random() * 100,
                y: -5,
                speed: 0.3 + Math.random() * 0.4,
                opacity: 0.1 + Math.random() * 0.2,
                size: 14 + Math.random() * 8,
              }
            }

            return {
              ...drop,
              x: newX,
              y: newY,
            }
          })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Occasionally add new drops
    const addDropInterval = setInterval(() => {
      setDrops((prev) => {
        if (prev.length < 20) {
          return [
            ...prev,
            {
              id: dropIdRef.current++,
              symbol: KANJI_SYMBOLS[Math.floor(Math.random() * KANJI_SYMBOLS.length)],
              x: Math.random() * 100,
              y: -5,
              speed: 0.3 + Math.random() * 0.4,
              opacity: 0.1 + Math.random() * 0.2,
              size: 14 + Math.random() * 8,
            },
          ]
        }
        return prev
      })
    }, 2000)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearInterval(addDropInterval)
    }
  }, [beatIntensity])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute font-serif select-none"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            fontSize: `${drop.size}px`,
            opacity: drop.opacity,
            color: character.colors.glow,
            textShadow: `0 0 ${4 + (beatIntensity ?? 0) * 8}px ${character.colors.glow}60`,
            transform: `translateX(-50%) rotate(${Math.sin(drop.id) * 5}deg)`,
            transition: "opacity 0.3s ease-out",
            willChange: "transform",
          }}
        >
          {drop.symbol}
        </div>
      ))}
    </div>
  )
}

