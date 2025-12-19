"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CHARACTER_QUOTES, type CharacterQuote } from "@/lib/data/characterQuotes"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"

export function BackgroundQuotes() {
  const { selectedCharacter, hasSelectedCharacter } = useSpotifyStore()
  const [currentQuote, setCurrentQuote] = useState<CharacterQuote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!hasSelectedCharacter) {
      setIsVisible(false)
      return
    }

    const quotes = CHARACTER_QUOTES[selectedCharacter]
    if (!quotes || quotes.length === 0) return

    // Show a random quote
    const showQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
      setIsVisible(true)

      // Hide after 5-8 seconds
      const hideTimeout = setTimeout(() => {
        setIsVisible(false)
      }, 5000 + Math.random() * 3000)

      // Show next quote after 10-15 seconds
      const nextQuoteTimeout = setTimeout(() => {
        showQuote()
      }, 10000 + Math.random() * 5000)

      return () => {
        clearTimeout(hideTimeout)
        clearTimeout(nextQuoteTimeout)
      }
    }

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showQuote()
    }, 3000)

    return () => {
      clearTimeout(initialTimeout)
    }
  }, [selectedCharacter, hasSelectedCharacter])

  if (!currentQuote || !isVisible) return null

  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
      <div
        className="bg-black/70 backdrop-blur-2xl border-2 rounded-2xl px-8 py-6 max-w-2xl animate-quoteSlideIn"
        style={{
          borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6),
          boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px ${character.colors.glow}40, inset 0 0 20px ${character.colors.glow}10`,
        }}
      >
        {currentQuote.japanese && (
          <div
            className="text-2xl font-bold mb-2 text-center"
            style={{
              color: character.colors.glow,
              textShadow: `0 0 20px ${character.colors.glow}60`,
            }}
          >
            「{currentQuote.japanese}」
          </div>
        )}
        <div
          className="text-lg font-mono text-center"
          style={{
            color: textColor,
            textShadow: `0 0 10px ${character.colors.glow}40`,
          }}
        >
          {currentQuote.text}
        </div>
        {currentQuote.context && (
          <div
            className="text-xs font-mono text-center mt-2 opacity-70"
            style={{
              color: character.colors.secondary || character.colors.glow,
            }}
          >
            — {currentQuote.context}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes quoteSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-quoteSlideIn {
          animation: quoteSlideIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
