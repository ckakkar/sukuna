"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { cn } from "@/lib/utils/cn"
import { Card } from "./shared/Card"

export function CharacterSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCharacter, setSelectedCharacter, beatIntensity } = useSpotifyStore()
  const currentChar = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(currentChar.colors.primary, currentChar.colors.glow, currentChar.colors.secondary)
  const wheelRef = useRef<HTMLDivElement>(null)

  const handleCharacterChange = (charId: CharacterType) => {
    setSelectedCharacter(charId)
    setIsOpen(false)
  }

  // Calculate positions for circular wheel layout
  const characterArray = Object.values(CHARACTERS)
  const centerX = 50 // percentage
  const centerY = 50 // percentage
  const radius = 35 // percentage from center

  return (
    <div className="relative pointer-events-auto">
      {/* Current Character Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select character. Current: ${currentChar.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="group relative px-3 py-2.5 sm:px-4 sm:py-2.5 glass-modern border-2 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 hover:scale-105 active:scale-95 touch-manipulation min-h-[44px] will-animate"
        style={{
          borderColor: isOpen ? getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.9) : "rgba(255,255,255,0.15)",
          boxShadow: isOpen 
            ? `0 0 30px ${currentChar.colors.glow}50, 0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px ${currentChar.colors.glow}10, 0 0 0 1px ${currentChar.colors.glow}30`
            : "0 4px 16px rgba(0,0,0,0.2)",
          transform: isOpen ? 'scale(1.02)' : 'scale(1)',
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

      {/* Technique Wheel - Circular Character Selection */}
      {isOpen && (
        <div 
          className={cn(
            "absolute top-full mt-2 sm:mt-3 right-0 overflow-visible",
            "w-[90vw] sm:w-[500px] sm:max-w-[500px] h-[90vw] sm:h-[500px] z-50",
            "animate-spring-in"
          )}
          style={{
            borderColor: getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.7),
          }}
        >
          <Card
            variant="glass"
            className="rounded-full relative w-full h-full overflow-visible"
            borderColor={getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.7)}
            glowColor={currentChar.colors.glow}
          >
            {/* Center circle with current character */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                width: '30%',
                height: '30%',
              }}
            >
              <div
                className="w-full h-full rounded-full border-2 flex items-center justify-center relative overflow-hidden"
                style={{
                  borderColor: getVisibleBorderColor(currentChar.colors.primary, currentChar.colors.glow, 0.9),
                  background: `radial-gradient(circle, ${currentChar.colors.primary}30, ${currentChar.colors.glow}20)`,
                  boxShadow: `0 0 ${20 + (beatIntensity ?? 0) * 30}px ${currentChar.colors.glow}60, inset 0 0 20px ${currentChar.colors.glow}20`,
                }}
              >
                {currentChar.imagePath && (
                  <Image
                    src={currentChar.imagePath}
                    alt={currentChar.name}
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-xs sm:text-sm font-bold font-mono text-center"
                    style={{
                      color: textColor,
                      textShadow: `0 0 10px ${currentChar.colors.glow}`,
                    }}
                  >
                    {currentChar.japaneseName}
                  </div>
                </div>
              </div>
            </div>

            {/* Character slots arranged in circle */}
            <div 
              ref={wheelRef}
              className="absolute inset-0"
              role="listbox"
              aria-label="Character technique wheel"
            >
              {characterArray.map((char, index) => {
                const angle = (index * 360) / characterArray.length - 90 // Start from top
                const radian = (angle * Math.PI) / 180
                const x = centerX + radius * Math.cos(radian)
                const y = centerY + radius * Math.sin(radian)
                const charTextColor = getVisibleTextColor(char.colors.primary, char.colors.glow, char.colors.secondary)
                const isSelected = selectedCharacter === char.id

                return (
                  <button
                    key={char.id}
                    onClick={() => handleCharacterChange(char.id)}
                    aria-label={`Select ${char.name} (${char.japaneseName})`}
                    aria-selected={isSelected}
                    role="option"
                    className="absolute group transition-all duration-300 touch-manipulation will-animate"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'}`,
                      zIndex: isSelected ? 15 : 10,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = isSelected 
                        ? 'translate(-50%, -50%) scale(1.15)' 
                        : 'translate(-50%, -50%) scale(1)'
                    }}
                  >
                    {/* Cursed energy aura */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{
                        background: `radial-gradient(circle, ${char.colors.glow}60, transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                        width: '150%',
                        height: '150%',
                      }}
                    />
                    
                    {/* Character slot */}
                    <div
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 overflow-hidden transition-all duration-300"
                      style={{
                        borderColor: isSelected 
                          ? getVisibleBorderColor(char.colors.primary, char.colors.glow, 1)
                          : getVisibleBorderColor(char.colors.primary, char.colors.glow, 0.4),
                        backgroundColor: isSelected 
                          ? `${char.colors.glow}30` 
                          : `${char.colors.primary}20`,
                        boxShadow: isSelected
                          ? `0 0 ${15 + (beatIntensity ?? 0) * 20}px ${char.colors.glow}80, inset 0 0 15px ${char.colors.glow}20`
                          : `0 0 8px ${char.colors.glow}40`,
                      }}
                    >
                      {char.imagePath ? (
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
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-lg font-bold"
                          style={{
                            color: char.colors.glow,
                          }}
                        >
                          {char.japaneseName.charAt(0)}
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(to top, ${char.colors.glow}60, transparent)`,
                        }}
                      />
                    </div>

                    {/* Domain name on hover */}
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 rounded glass-modern opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                      style={{
                        borderColor: getVisibleBorderColor(char.colors.primary, char.colors.glow, 0.6),
                        boxShadow: `0 4px 12px rgba(0,0,0,0.5), 0 0 8px ${char.colors.glow}50`,
                      }}
                    >
                      <div
                        className="text-[10px] font-mono font-semibold"
                        style={{
                          color: charTextColor,
                          textShadow: `0 0 6px ${char.colors.glow}`,
                        }}
                      >
                        {char.domainJapanese}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Connecting lines (optional decorative element) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {characterArray.map((char, index) => {
                const angle = (index * 360) / characterArray.length - 90
                const radian = (angle * Math.PI) / 180
                const x1 = centerX + radius * 0.3 * Math.cos(radian)
                const y1 = centerY + radius * 0.3 * Math.sin(radian)
                const x2 = centerX + radius * 0.9 * Math.cos(radian)
                const y2 = centerY + radius * 0.9 * Math.sin(radian)

                return (
                  <line
                    key={`line-${char.id}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={char.colors.glow}
                    strokeWidth="1"
                    opacity="0.2"
                  />
                )
              })}
            </svg>
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
