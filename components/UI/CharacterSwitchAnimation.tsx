"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CHARACTER_QUOTES } from "@/lib/data/characterQuotes"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

export function CharacterSwitchAnimation() {
  const { selectedCharacter, hasSelectedCharacter } = useSpotifyStore()
  const [prevCharacter, setPrevCharacter] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showQuote, setShowQuote] = useState(false)

  useEffect(() => {
    if (!hasSelectedCharacter) return

    const currentCharId = selectedCharacter
    if (prevCharacter && prevCharacter !== currentCharId) {
      // Character changed - trigger animation
      setIsAnimating(true)
      setShowQuote(true)

      // Hide animation after 2 seconds
      const timeout = setTimeout(() => {
        setIsAnimating(false)
        setShowQuote(false)
      }, 2500)

      return () => clearTimeout(timeout)
    }

    setPrevCharacter(currentCharId)
  }, [selectedCharacter, hasSelectedCharacter, prevCharacter])

  if (!isAnimating || !prevCharacter) return null

  const character = CHARACTERS[selectedCharacter]
  const quotes = CHARACTER_QUOTES[selectedCharacter]
  const randomQuote = quotes?.[Math.floor(Math.random() * quotes.length)]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Background flash */}
      <div
        className="absolute inset-0 animate-flash"
        style={{
          background: `radial-gradient(circle at center, ${character.colors.glow}60, transparent 70%)`,
        }}
      />

      {/* Character reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Character image */}
        {character.imagePath && (
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden animate-characterReveal">
            <Image
              src={character.imagePath}
              alt={character.name}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${character.colors.glow}80, transparent)`,
              }}
            />
          </div>
        )}

        {/* Character name */}
        <div
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-2 sm:mb-3 md:mb-4 tracking-widest animate-fadeInUp"
          style={{
            color: textColor,
            textShadow: `0 0 40px ${character.colors.glow}80, 0 0 80px ${character.colors.glow}60`,
          }}
        >
          {character.japaneseName}
        </div>

        {/* Quote */}
        {showQuote && randomQuote && (
          <div className="text-center max-w-2xl px-4 sm:px-6 md:px-8 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            {randomQuote.japanese && (
              <div
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3"
                style={{
                  color: character.colors.glow,
                  textShadow: `0 0 20px ${character.colors.glow}60`,
                }}
              >
                「{randomQuote.japanese}」
              </div>
            )}
            <div
              className="text-sm sm:text-base md:text-lg lg:text-xl font-mono"
              style={{
                color: character.colors.secondary || character.colors.glow,
                textShadow: `0 0 15px ${character.colors.glow}40`,
              }}
            >
              {randomQuote.text}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flash {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes characterReveal {
          from {
            transform: scale(0.5) rotateY(90deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-flash {
          animation: flash 0.8s ease-out;
        }
        .animate-characterReveal {
          animation: characterReveal 1s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
