"use client"

import { useMemo, memo } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { MusicPlayerPanel } from "./MusicPlayerPanel"
import { CharacterSelector } from "./CharacterSelector"

const SpeedLines = memo(function SpeedLines({ intensity }: { intensity: number }) {
  if (intensity < 0.75) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-20 transition-opacity duration-500">
      <div className="speed-lines" />
    </div>
  )
})

export const Overlay = memo(function Overlay() {
  const { selectedCharacter, beatIntensity, intensity } = useSpotifyStore()
  const character = useMemo(() => CHARACTERS[selectedCharacter], [selectedCharacter])

  const isHighEnergy = (intensity || 0) > 0.7
  const isDrop = (beatIntensity || 0) > 0.8

  return (
    <div className="absolute inset-0 pointer-events-none z-10 safe-area-inset-top overflow-hidden">
      {/* 1. Dynamic Background Elements */}
      <SpeedLines intensity={intensity || 0} />

      {/* 2. Top Right - Character Selector (Roster Style) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-auto z-50">
        <CharacterSelector />
      </div>

      {/* 3. Top Left - Domain info */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-4 pointer-events-none z-20">
        <div className="writing-vertical text-2xl sm:text-4xl font-medium text-manga-ink/15 select-none font-jp">
          呪術廻戦
        </div>

        <div className="flex flex-col gap-1 pt-1">
          <div className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-manga-ink/50">
            Domain Expansion
          </div>
          <div
            className="text-xl sm:text-3xl font-semibold text-manga-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: isDrop ? "scale(1.03)" : "scale(1)",
              opacity: isDrop ? 1 : 0.9
            }}
          >
            {character.domain}
          </div>
          <div className="text-xs font-jp text-manga-ink/50">
            {character.domainJapanese}
          </div>
        </div>
      </div>

      {/* 4. Center - Beat impact */}
      {isDrop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-scale-in">
          <span className="text-5xl sm:text-8xl font-semibold text-manga-ink/20 tracking-tighter">
            ドン
          </span>
        </div>
      )}

      {/* 5. Bottom Right - Character signature */}
      <div className="absolute bottom-20 right-4 sm:bottom-8 sm:right-8 text-right pointer-events-none z-20">
        <div className="text-5xl sm:text-7xl font-medium opacity-[0.06] absolute bottom-0 right-0 whitespace-nowrap text-manga-ink">
          {character.name.split(' ')[0]}
        </div>
        <div className="relative">
          <div className="text-lg sm:text-2xl font-semibold text-manga-ink">
            {character.name}
          </div>
          <div className="text-xs font-medium text-manga-ink/60 mt-0.5">
            {character.technique}
          </div>
        </div>
      </div>

      {/* 6. Music Player */}
      <MusicPlayerPanel />

      {/* 7. Manga panel border - no vignette glow */}
    </div>
  )
})