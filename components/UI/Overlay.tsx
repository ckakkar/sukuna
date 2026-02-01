"use client"

import { useMemo, memo } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"
import { MusicPlayerPanel } from "./MusicPlayerPanel"
import { CharacterSelector } from "./CharacterSelector"

// Speed lines component that activates on high intensity
const SpeedLines = memo(function SpeedLines({ intensity }: { intensity: number }) {
  if (intensity < 0.6) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="speed-lines opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="speed-line"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.1 + Math.random() * 0.2}s`,
              animationDelay: `${Math.random()}s`,
              height: '50vh',
              opacity: Math.random()
            }}
          />
        ))}
      </div>
    </div>
  )
})

export const Overlay = memo(function Overlay() {
  const { selectedCharacter, beatIntensity, intensity, trackData } = useSpotifyStore()
  const character = useMemo(() => CHARACTERS[selectedCharacter], [selectedCharacter])
  const textColor = useMemo(
    () => getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary),
    [character.colors.primary, character.colors.glow, character.colors.secondary]
  )

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

      {/* 3. Top Left - Vertical Domain Text */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-4 pointer-events-none z-20">
        <div className="writing-vertical text-4xl sm:text-6xl font-black text-transparent text-stroke opacity-30 select-none">
          呪術廻戦
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <div
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: character.colors.glow, textShadow: `0 0 10px ${character.colors.glow}` }}
          >
            Domain Expansion
          </div>

          <div
            className="text-2xl sm:text-4xl font-black italic uppercase leading-none transform -skew-x-6 origin-left"
            style={{
              color: textColor,
              textShadow: isDrop ? `4px 4px 0px ${character.colors.glow}` : "none",
              transform: isDrop ? "scale(1.1) skewX(-12deg)" : "skewX(-6deg)",
              transition: "all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          >
            {character.domain}
          </div>

          <div
            className="text-sm font-jp font-bold opacity-80"
            style={{ color: character.colors.secondary || textColor }}
          >
            {character.domainJapanese}
          </div>
        </div>
      </div>

      {/* 4. Center - Impact Words on Beat Drop */}
      {isDrop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div
            className="text-manga-impact text-6xl sm:text-9xl animate-scale-in"
            style={{
              color: 'white',
              textShadow: `0 0 50px ${character.colors.glow}`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`
            }}
          >
            ド
            <span className="text-4xl align-top">ン</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Right - Character Signature */}
      <div className="absolute bottom-20 right-4 sm:bottom-8 sm:right-8 text-right pointer-events-none z-20">
        <div
          className="text-6xl sm:text-8xl font-black opacity-10 absolute bottom-0 right-0 whitespace-nowrap"
          style={{
            WebkitTextStroke: `2px ${character.colors.primary}`,
            color: 'transparent'
          }}
        >
          {character.name.split(' ')[0]}
        </div>

        <div className="relative">
          <div
            className="text-xl sm:text-3xl font-black uppercase tracking-tighter"
            style={{ color: textColor }}
          >
            {character.name}
          </div>
          <div
            className="text-xs sm:text-sm font-bold bg-black text-white inline-block px-2 py-1 transform -skew-x-12 mt-1"
            style={{ backgroundColor: character.colors.glow }}
          >
            {character.technique}
          </div>
        </div>
      </div>

      {/* 6. Music Player */}
      <MusicPlayerPanel />

      {/* 7. Vignette/Cinematic Bars Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[20px] sm:border-[40px] border-transparent"
        style={{
          boxShadow: isHighEnergy ? `inset 0 0 100px ${character.colors.glow}40` : 'none',
          transition: 'box-shadow 0.5s ease'
        }}
      />
    </div>
  )
})