"use client"

import { useState } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
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
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-manga-paper/95 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-y-auto safe-area-inset-top safe-area-inset-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-selection-title"
      >
        
        {/* Selection Screen */}
        {!isAnimating && (
          <div className="w-full max-w-6xl px-4 py-4 sm:py-6 sm:px-8 sm:py-12 min-h-full flex flex-col relative z-10">
            <div className="text-center mb-4 sm:mb-6 md:mb-12 flex-shrink-0">
              <h1 
                id="character-selection-title"
                className="text-3xl sm:text-4xl font-semibold mb-2 text-manga-ink font-jp"
              >
                呪術廻戦
              </h1>
              <p className="text-sm text-manga-ink/60 mb-6">
                Choose your sorcerer
              </p>
            </div>

            {/* Character Grid - Manga panel cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 flex-1 overflow-y-auto pb-4 sm:pb-0 overscroll-contain">
              {Object.values(CHARACTERS).map((character) => {
                const isSelected = selectedId === character.id

                return (
                  <button
                    key={character.id}
                    onClick={() => handleSelect(character.id)}
                    aria-label={`Select ${character.name} (${character.japaneseName})`}
                    className={cn(
                      "group relative rounded-2xl p-4 overflow-hidden touch-manipulation",
                      "bg-white/80 backdrop-blur-sm border transition-all duration-300",
                      "min-h-[120px] sm:min-h-[130px] animate-scale-in",
                      isSelected ? "border-manga-ink ring-2 ring-manga-ink/20 shadow-lg" : "border-black/5 hover:border-black/10"
                    )}
                  >
                    {/* Manga screentone on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(10,10,10,0.03) 4px, rgba(10,10,10,0.03) 8px)',
                      }}
                    />

                    {/* Character Image */}
                    <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-xl">
                      {character.imagePath ? (
                        <Image
                          src={character.imagePath}
                          alt={character.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl font-black bg-manga-tone text-manga-ink"
                        >
                          {character.japaneseName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Character Info - manga typography */}
                    <div className="relative z-10">
                      <div className="text-sm sm:text-base md:text-xl font-manga font-black mb-0.5 sm:mb-1 tracking-wider text-manga-ink">
                        {character.japaneseName}
                      </div>
                      <div className="text-xs sm:text-sm font-mono mb-1 sm:mb-2 text-manga-ink/80">
                        {character.name}
                      </div>
                      <div className="text-[10px] sm:text-xs font-mono text-manga-ink/60">
                        {character.domainJapanese}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-manga-ink flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-manga-paper">
      {/* Manga panel frame */}
      <div className="absolute inset-8 border-4 border-manga-ink pointer-events-none" />

      {/* Character Image - manga panel */}
      {character.imagePath && (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mb-4 sm:mb-6 md:mb-8 overflow-hidden z-10 border-4 border-manga-ink shadow-[8px_8px_0px_0px_#0a0a0a]">
          <Image
            src={character.imagePath}
            alt={character.name}
            fill
            className="object-cover animate-scaleIn grayscale"
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}

      {/* Quote Display - manga speech bubble style */}
      <div className="text-center z-10 max-w-3xl px-4 sm:px-6 md:px-8">
        <div
          className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-manga font-black mb-2 sm:mb-3 md:mb-4 tracking-widest animate-fadeInUp text-manga-ink"
          style={{
            textShadow: "3px 3px 0px #d4d4d4, 6px 6px 0px #a3a3a3",
            WebkitTextStroke: "2px #0a0a0a",
          }}
        >
          {character.japaneseName}
        </div>
        
        {randomQuote.japanese && (
          <div
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fadeInUp text-manga-ink font-jp"
            style={{ animationDelay: "0.3s" }}
          >
            「{randomQuote.japanese}」
          </div>
        )}
        
        <div
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono animate-fadeInUp text-manga-ink/90"
          style={{ animationDelay: "0.6s" }}
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
