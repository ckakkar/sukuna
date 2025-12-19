"use client"

import { useEffect, useState, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CHARACTER_QUOTES, type CharacterQuote } from "@/lib/data/characterQuotes"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { Card } from "./shared/Card"
import { cn } from "@/lib/utils/cn"

export function BackgroundQuotes() {
  const { selectedCharacter, hasSelectedCharacter } = useSpotifyStore()
  const [currentQuote, setCurrentQuote] = useState<CharacterQuote | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    // Clear all existing timeouts when character changes
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []
    
    // Reset state immediately when character changes
    setIsVisible(false)
    setCurrentQuote(null)

    if (!hasSelectedCharacter) {
      return
    }

    // Get quotes for the CURRENT character (not from closure)
    const currentCharacter = selectedCharacter
    const quotes = CHARACTER_QUOTES[currentCharacter]
    if (!quotes || quotes.length === 0) return

    // Show a random quote
    const showQuote = () => {
      // Always use the current character's quotes
      const currentQuotes = CHARACTER_QUOTES[currentCharacter]
      if (!currentQuotes || currentQuotes.length === 0) return
      
      const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)]
      setCurrentQuote(randomQuote)
      setIsVisible(true)

      // Hide after 5-8 seconds
      const hideTimeout = setTimeout(() => {
        setIsVisible(false)
      }, 5000 + Math.random() * 3000)
      timeoutRefs.current.push(hideTimeout)

      // Show next quote after 10-15 seconds
      const nextQuoteTimeout = setTimeout(() => {
        showQuote()
      }, 10000 + Math.random() * 5000)
      timeoutRefs.current.push(nextQuoteTimeout)
    }

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showQuote()
    }, 3000)
    timeoutRefs.current.push(initialTimeout)

    return () => {
      // Clear all timeouts on cleanup
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [selectedCharacter, hasSelectedCharacter])

  if (!currentQuote || !isVisible) return null

  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none w-full px-3 sm:px-0">
      <Card
        variant="glass"
        glowColor={character.colors.glow}
        borderColor={getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6)}
        className={cn(
          "rounded-xl sm:rounded-2xl px-4 py-4 sm:px-8 sm:py-6 max-w-2xl mx-auto",
          "animate-fade-in-up"
        )}
        style={{
          boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px ${character.colors.glow}40, inset 0 0 20px ${character.colors.glow}10`,
        }}
      >
        {currentQuote.japanese && (
          <div
            className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-center"
            style={{
              color: character.colors.glow,
              textShadow: `0 0 20px ${character.colors.glow}60`,
            }}
          >
            「{currentQuote.japanese}」
          </div>
        )}
        <div
          className="text-sm sm:text-base md:text-lg font-mono text-center"
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
      </Card>
    </div>
  )
}
