"use client"

import { useState } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { cn } from "@/lib/utils/cn"
import { Card } from "./shared/Card"

export function CharacterSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCharacter, setSelectedCharacter } = useSpotifyStore()
  const currentChar = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(currentChar.colors.primary, currentChar.colors.glow, currentChar.colors.secondary)

  const handleCharacterChange = (charId: CharacterType) => {
    setSelectedCharacter(charId)
    setIsOpen(false)
  }

  return (
    <div className="relative pointer-events-auto">
      {/* Current Character Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select character. Current: ${currentChar.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-black/30 backdrop-blur-xl border-2 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 hover:scale-105 active:scale-95 touch-manipulation"
        style={{
          borderColor: isOpen ? getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.9) : "rgba(255,255,255,0.15)",
          boxShadow: isOpen 
            ? `0 0 30px ${currentChar.colors.glow}50, 0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px ${currentChar.colors.glow}10`
            : "0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{
              backgroundColor: currentChar.colors.glow || currentChar.colors.primary,
              boxShadow: `0 0 8px ${currentChar.colors.glow}`,
            }}
          />
          <div className="flex flex-col items-start min-w-0 flex-1">
            <div className="text-[8px] sm:text-[9px] text-gray-400 font-mono uppercase tracking-widest opacity-70">SORCERER</div>
            <div
              className="text-xs sm:text-sm font-bold font-mono tracking-wider truncate max-w-[100px] sm:max-w-[140px]"
              style={{ 
                color: textColor,
                textShadow: `0 0 8px ${currentChar.colors.glow}40`,
              }}
            >
              {currentChar.japaneseName}
            </div>
          </div>
        </div>
        <div 
          className="text-gray-400 text-xs flex-shrink-0 transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: textColor,
          }}
        >
          ▼
        </div>
      </button>

      {/* Character Selection Menu */}
      {isOpen && (
        <div 
          className={cn(
            "absolute top-full mt-2 sm:mt-3 right-0 overflow-hidden",
            "w-[calc(100vw-2rem)] sm:min-w-[320px] sm:max-w-[320px] z-50",
            "animate-fade-in-up"
          )}
          style={{
            borderColor: getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.7),
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${currentChar.colors.glow}40, inset 0 0 30px ${currentChar.colors.glow}10`,
          }}
        >
          <Card
            variant="glass"
            className="rounded-xl sm:rounded-2xl"
            borderColor={getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.7)}
          >
          <div className="px-3 py-2 border-b" style={{ borderColor: getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.2) }}>
            <div 
              className="text-xs font-mono uppercase tracking-widest px-2"
              style={{ color: textColor, opacity: 0.8 }}
            >
              SELECT CHARACTER
            </div>
          </div>
          <div 
            className="max-h-[500px] overflow-y-auto custom-scrollbar"
            role="listbox"
            aria-label="Character selection"
          >
            {Object.values(CHARACTERS).map((char, index) => {
              const charTextColor = getVisibleTextColor(char.colors.primary, char.colors.glow, char.colors.secondary)
              const isSelected = selectedCharacter === char.id
              return (
                <button
                  key={char.id}
                  onClick={() => handleCharacterChange(char.id)}
                  aria-label={`Select ${char.name} (${char.japaneseName})`}
                  aria-selected={isSelected}
                  role="option"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 flex items-center gap-2 sm:gap-3 hover:bg-white/5 active:bg-white/10 transition-all duration-200 border-b last:border-b-0 group relative overflow-hidden touch-manipulation"
                  style={{
                    backgroundColor: isSelected 
                      ? `${char.colors.glow || char.colors.primary}20` 
                      : "transparent",
                    borderColor: getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.1),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${char.colors.glow || char.colors.primary}15`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected 
                      ? `${char.colors.glow || char.colors.primary}20` 
                      : "transparent"
                  }}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${char.colors.glow || char.colors.primary}05 0%, transparent 100%)`,
                    }}
                  />
                  
                  {/* Character Image */}
                  {char.imagePath && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={char.imagePath}
                        alt={char.name}
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
                          background: `linear-gradient(to top, ${char.colors.glow}40, transparent)`,
                        }}
                      />
                    </div>
                  )}

                  {/* Character indicator dot (fallback if no image) */}
                  {!char.imagePath && (
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? (char.colors.glow || char.colors.primary) : "rgba(255,255,255,0.1)",
                        boxShadow: isSelected ? `0 0 12px ${char.colors.glow}60` : "none",
                        transform: isSelected ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  )}
                  
                  <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5 relative z-10">
                    <div className="flex items-center justify-between w-full">
                      <div
                        className="text-sm sm:text-base font-bold font-mono tracking-wider"
                        style={{ 
                          color: charTextColor,
                          textShadow: isSelected ? `0 0 8px ${char.colors.glow}40` : "none",
                        }}
                      >
                        {char.japaneseName}
                      </div>
                      {isSelected && (
                        <div 
                          className="text-sm transition-all duration-300"
                          style={{ 
                            color: charTextColor,
                            textShadow: `0 0 8px ${char.colors.glow}`,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                    <div 
                      className="text-xs font-mono"
                      style={{ 
                        color: char.colors.secondary || char.colors.glow || "rgba(255,255,255,0.6)",
                      }}
                    >
                      {char.name}
                    </div>
                    <div 
                      className="text-[10px] font-mono mt-0.5 opacity-70"
                      style={{ 
                        color: char.colors.accent || char.colors.glow || "rgba(255,255,255,0.5)",
                      }}
                    >
                      {char.domainJapanese}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
