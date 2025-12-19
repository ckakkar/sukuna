"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { useState } from "react"

export function CharacterSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCharacter, setSelectedCharacter } = useSpotifyStore()
  const currentChar = CHARACTERS[selectedCharacter]

  const handleCharacterChange = (charId: CharacterType) => {
    setSelectedCharacter(charId)
    setIsOpen(false)
  }

  return (
    <div className="relative pointer-events-auto">
      {/* Current Character Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative px-3 py-1.5 bg-black/20 backdrop-blur-md border-2 rounded-lg transition-all duration-300 flex items-center gap-2"
        style={{
          borderColor: isOpen ? `${currentChar.colors.primary}80` : "rgba(255,255,255,0.2)",
          boxShadow: isOpen ? `0 0 20px ${currentChar.colors.glow}40` : "none",
        }}
      >
        <div className="flex flex-col items-start min-w-0">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Sorcerer</div>
          <div
            className="text-xs font-bold font-mono tracking-wider truncate max-w-[120px]"
            style={{ color: currentChar.colors.primary }}
          >
            {currentChar.japaneseName}
          </div>
        </div>
        <div className="text-gray-600 text-[10px] flex-shrink-0">
          {isOpen ? "▲" : "▼"}
        </div>
      </button>

      {/* Character Selection Menu */}
      {isOpen && (
        <div 
          className="absolute top-full mt-2 left-0 bg-black/60 backdrop-blur-2xl border-2 border-gray-700 rounded-lg overflow-hidden min-w-[280px] z-50 shadow-2xl"
          style={{
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${currentChar.colors.glow}30`,
          }}
        >
          {Object.values(CHARACTERS).map((char) => (
            <button
              key={char.id}
              onClick={() => handleCharacterChange(char.id)}
              className="w-full px-4 py-3 flex flex-col items-start gap-1 hover:bg-white/5 transition-colors border-b border-gray-900 last:border-b-0"
              style={{
                backgroundColor:
                  selectedCharacter === char.id ? `${char.colors.primary}15` : undefined,
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className="text-sm font-bold font-mono tracking-wider"
                  style={{ color: char.colors.primary }}
                >
                  {char.japaneseName}
                </div>
                {selectedCharacter === char.id && (
                  <div className="text-xs" style={{ color: char.colors.primary }}>
                    ✓
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 font-mono">{char.name}</div>
              <div className="text-[10px] text-gray-600 font-mono mt-1">
                {char.domainJapanese}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
