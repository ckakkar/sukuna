"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { CHARACTER_QUOTES } from "@/lib/data/characterQuotes"
import { cn } from "@/lib/utils/cn"
import { useFocusTrap } from "@/hooks/useFocusTrap"

export function CharacterSelectionModal() {
  const { hasSelectedCharacter, setSelectedCharacter, accessToken } = useSpotifyStore()
  const [selectedId, setSelectedId] = useState<CharacterType | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useFocusTrap(!hasSelectedCharacter && !!accessToken)

  // Only show if user is logged in and hasn't selected a character
  if (!accessToken || hasSelectedCharacter) return null

  const handleSelect = (characterId: CharacterType) => {
    setSelectedId(characterId)
    setIsAnimating(true)
    
    // Show animation, then confirm selection
    setTimeout(() => {
      setSelectedCharacter(characterId)
      setIsAnimating(false)
    }, 1500)
  }

  const selectedChar = selectedId ? CHARACTERS[selectedId] : null

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center overflow-y-auto safe-area-inset-top safe-area-inset-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-selection-title"
      >
        {/* Selection Screen */}
        {!isAnimating && (
          <div className="w-full max-w-6xl px-4 py-4 sm:py-6 sm:px-8 sm:py-12 min-h-full flex flex-col">
            <div className="text-center mb-4 sm:mb-6 md:mb-12 flex-shrink-0">
              <h1 
                id="character-selection-title"
                className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-4 tracking-widest"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #a855f7, #c026d3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(147, 51, 234, 0.5)",
                }}
              >
                呪術廻戦
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-mono text-gray-300 mb-1 sm:mb-2 tracking-wider">
                SELECT YOUR SORCERER
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">
                Choose your cursed energy wielder
              </p>
            </div>

            {/* Character Grid - Scrollable on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 flex-1 overflow-y-auto pb-4 sm:pb-0 overscroll-contain">
              {Object.values(CHARACTERS).map((character) => {
                const textColor = getVisibleTextColor(
                  character.colors.primary,
                  character.colors.glow,
                  character.colors.secondary
                )
                const isSelected = selectedId === character.id

                return (
                  <button
                    key={character.id}
                    onClick={() => handleSelect(character.id)}
                    aria-label={`Select ${character.name} (${character.japaneseName})`}
                    className={cn(
                      "group relative border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6",
                      "transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden touch-manipulation",
                      "glass animate-scale-in",
                      "min-h-[120px] sm:min-h-[140px]"
                    )}
                    style={{
                      borderColor: isSelected
                        ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 1)
                        : "rgba(255,255,255,0.1)",
                      boxShadow: isSelected
                        ? `0 0 40px ${character.colors.glow}60, 0 8px 32px rgba(0,0,0,0.5), inset 0 0 30px ${character.colors.glow}20`
                        : "0 4px 16px rgba(0,0,0,0.3)",
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${character.colors.glow}20, transparent 70%)`,
                      }}
                    />

                    {/* Character Image */}
                    <div className="relative w-full aspect-square mb-2 sm:mb-3 md:mb-4 rounded-lg sm:rounded-xl overflow-hidden">
                      {character.imagePath ? (
                        <Image
                          src={character.imagePath}
                          alt={character.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl font-black"
                          style={{
                            background: `linear-gradient(135deg, ${character.colors.primary}40, ${character.colors.glow}40)`,
                            color: character.colors.glow,
                          }}
                        >
                          {character.japaneseName.charAt(0)}
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(to top, ${character.colors.glow}80, transparent)`,
                        }}
                      />
                    </div>

                    {/* Character Info */}
                    <div className="relative z-10">
                      <div
                        className="text-sm sm:text-base md:text-xl font-black font-mono mb-0.5 sm:mb-1 tracking-wider"
                        style={{
                          color: textColor,
                          textShadow: `0 0 10px ${character.colors.glow}60`,
                        }}
                      >
                        {character.japaneseName}
                      </div>
                      <div
                        className="text-xs sm:text-sm font-mono mb-1 sm:mb-2"
                        style={{
                          color: character.colors.secondary || character.colors.glow,
                        }}
                      >
                        {character.name}
                      </div>
                      <div
                        className="text-[10px] sm:text-xs font-mono opacity-70"
                        style={{
                          color: character.colors.accent || character.colors.glow,
                        }}
                      >
                        {character.domainJapanese}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: character.colors.glow,
                          boxShadow: `0 0 20px ${character.colors.glow}`,
                        }}
                      >
                        <span className="text-white font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Selection Animation */}
        {isAnimating && selectedChar && (
          <CharacterSelectionAnimation character={selectedChar} />
        )}
      </div>
    </>
  )
}

function CharacterSelectionAnimation({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  const quotes = CHARACTER_QUOTES[character.id]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${character.colors.glow}40, transparent 70%)`,
          animation: "pulse 2s ease-in-out infinite",
        }}
      />

      {/* Character Image */}
      {character.imagePath && (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden z-10">
          <Image
            src={character.imagePath}
            alt={character.name}
            fill
            className="object-cover animate-scaleIn"
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${character.colors.glow}60, transparent)`,
            }}
          />
        </div>
      )}

      {/* Quote Display */}
      <div className="text-center z-10 max-w-3xl px-4 sm:px-6 md:px-8">
        <div
          className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-2 sm:mb-3 md:mb-4 tracking-widest animate-fadeInUp"
          style={{
            color: textColor,
            textShadow: `0 0 30px ${character.colors.glow}80, 0 0 60px ${character.colors.glow}60`,
          }}
        >
          {character.japaneseName}
        </div>
        
        {randomQuote.japanese && (
          <div
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fadeInUp"
            style={{
              color: character.colors.glow,
              textShadow: `0 0 20px ${character.colors.glow}60`,
              animationDelay: "0.3s",
            }}
          >
            「{randomQuote.japanese}」
          </div>
        )}
        
        <div
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono animate-fadeInUp"
          style={{
            color: character.colors.secondary || character.colors.glow,
            textShadow: `0 0 15px ${character.colors.glow}40`,
            animationDelay: "0.6s",
          }}
        >
          {randomQuote.text}
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
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
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
