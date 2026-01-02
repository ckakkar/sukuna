"use client"

import { useMemo, memo } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { MusicPlayerPanel } from "./MusicPlayerPanel"
import { CharacterSelector } from "./CharacterSelector"
import { cn } from "@/lib/utils/cn"

function HighEnergyIndicator({ character }: { character: typeof CHARACTERS[keyof typeof CHARACTERS] }) {
  const { currentTrack, trackData, isLoadingAnalysis, beatIntensity } = useSpotifyStore()
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  if (!currentTrack || !trackData || trackData.energy <= 0.75 || isLoadingAnalysis) {
    return null
  }

  return (
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono text-center pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) scale(${1 + (beatIntensity ?? 0) * 0.15})`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-16 rounded-full opacity-30 blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${character.colors.glow}, transparent 70%)`,
        }}
      />
      
      {/* Main text */}
      <div
        className="text-6xl font-black animate-glow tracking-widest relative z-10"
        style={{
          color: textColor,
          textShadow: `0 0 ${25 + (beatIntensity ?? 0) * 40}px ${character.colors.glow}, 0 0 ${50 + (beatIntensity ?? 0) * 70}px ${character.colors.glow}80, 0 0 ${100 + (beatIntensity ?? 0) * 100}px ${character.colors.glow}50`,
        }}
      >
        展開
      </div>
      
      {/* Subtitle */}
      <div 
        className="text-sm text-gray-400 mt-3 tracking-widest font-semibold"
        style={{
          textShadow: `0 0 10px ${character.colors.glow}50`,
        }}
      >
        MAXIMUM CURSED ENERGY
      </div>

      {/* Energy percentage */}
      <div 
        className="text-xs mt-2 font-bold tracking-wider"
        style={{ 
          color: character.colors.accent || character.colors.glow,
          textShadow: `0 0 15px ${character.colors.glow}`,
        }}
      >
        {(trackData.energy * 100).toFixed(0)}%
      </div>

      {/* Rotating accent rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-32 h-32 rounded-full border-2"
          style={{
            borderColor: `${character.colors.glow}60`,
            animation: "spin 4s linear infinite",
            boxShadow: `0 0 20px ${character.colors.glow}40`,
          }}
        />
        <div
          className="absolute w-40 h-40 rounded-full border-2"
          style={{
            borderColor: `${character.colors.secondary || character.colors.glow}40`,
            animation: "spin 6s linear infinite reverse",
            boxShadow: `0 0 15px ${character.colors.glow}30`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export const Overlay = memo(function Overlay() {
  const { selectedCharacter, beatIntensity, intensity } = useSpotifyStore()
  const character = useMemo(() => CHARACTERS[selectedCharacter], [selectedCharacter])
  const textColor = useMemo(
    () => getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary),
    [character.colors.primary, character.colors.glow, character.colors.secondary]
  )

  return (
    <div className="absolute inset-0 pointer-events-none z-10 safe-area-inset-top">
      {/* Top left - Domain info with beat animation */}
      <div className="absolute top-2 left-2 sm:top-6 sm:left-6 font-mono text-[10px] sm:text-xs space-y-1.5 sm:space-y-3 pointer-events-none will-animate">
        <div className="relative">
          {/* Glow effect on beat */}
          {beatIntensity && beatIntensity > 0.5 && (
            <div
              className="absolute -inset-2 rounded-lg opacity-40 blur-xl animate-barrier-pulse"
              style={{
                background: `radial-gradient(circle, ${character.colors.glow}, transparent)`,
                animation: "pulse 0.3s ease-out, barrier-pulse 2s ease-in-out infinite",
              }}
            />
          )}
          
          <div
            className="font-bold tracking-wider text-xs sm:text-sm md:text-base animate-glow relative animate-cursed-text-reveal"
            style={{
              color: textColor,
              textShadow: `0 0 ${15 + (beatIntensity ?? 0) * 25}px ${character.colors.glow}, 0 0 ${30 + (beatIntensity ?? 0) * 40}px ${character.colors.glow}50`,
              transform: beatIntensity && beatIntensity > 0.6 ? `scale(${1 + beatIntensity * 0.08})` : "scale(1)",
              transition: "transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            DOMAIN EXPANSION
          </div>
        </div>
        
        <div 
          className="text-xs tracking-widest font-semibold"
          style={{ 
            color: character.colors.secondary || character.colors.glow || textColor,
            textShadow: `0 0 10px ${character.colors.glow}60`,
          }}
        >
          領域展開
        </div>
        
        <div className="space-y-1.5 pt-2">
          <div 
            className="text-xs mt-1 opacity-90 font-medium"
            style={{ color: character.colors.accent || character.colors.glow || textColor }}
          >
            {character.domainJapanese}
          </div>
          <div 
            className="text-[10px] italic opacity-70"
            style={{ color: character.colors.secondary || character.colors.glow || textColor }}
          >
            {character.domain}
          </div>
        </div>

        {/* Energy/Beat indicator */}
        <div 
          className="flex items-center gap-2 pt-3"
          style={{
            opacity: intensity && intensity > 0.3 ? 1 : 0.5,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-3 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: (intensity ?? 0) > i * 0.2 ? character.colors.glow : "rgba(255,255,255,0.2)",
                  height: `${8 + ((beatIntensity ?? 0) > 0.3 && (intensity ?? 0) > i * 0.2 ? (beatIntensity ?? 0) * 8 : 0)}px`,
                  boxShadow: (intensity ?? 0) > i * 0.2 ? `0 0 8px ${character.colors.glow}` : "none",
                }}
              />
            ))}
          </div>
          <span 
            className="text-[9px] font-mono font-semibold tracking-wider"
            style={{ color: textColor }}
          >
            CURSED ENERGY
          </span>
        </div>
      </div>

      {/* Top right - Character selector */}
      <div className="absolute top-2 right-2 sm:top-6 sm:right-6 pointer-events-auto z-20">
        <CharacterSelector />
      </div>

      {/* Bottom right - Character branding with beat pulse - Hide on mobile when player is visible */}
      <div 
        className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 font-mono text-[10px] sm:text-xs space-y-1 sm:space-y-2 pointer-events-none hidden sm:block will-animate"
        style={{
          transform: beatIntensity && beatIntensity > 0.5 ? `scale(${1 + beatIntensity * 0.05})` : "scale(1)",
          transition: "transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="text-right space-y-1">
          {/* Beat pulse indicator */}
          {beatIntensity && beatIntensity > 0.5 && (
            <div className="flex justify-end items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: character.colors.glow,
                  boxShadow: `0 0 15px ${character.colors.glow}, 0 0 30px ${character.colors.glow}60`,
                }}
              />
              <span 
                className="text-[9px] font-semibold tracking-widest opacity-80"
                style={{ color: character.colors.glow }}
              >
                BEAT
              </span>
            </div>
          )}
          
          <div
            className="text-lg sm:text-xl md:text-2xl font-black mb-0.5 sm:mb-1 tracking-widest"
            style={{ 
              color: textColor,
              textShadow: `0 0 ${15 + (beatIntensity ?? 0) * 20}px ${character.colors.glow}, 0 0 ${30 + (beatIntensity ?? 0) * 35}px ${character.colors.glow}50`,
            }}
          >
            {character.japaneseName}
          </div>
          <div 
            className="text-sm sm:text-base font-bold mb-1 sm:mb-2"
            style={{ 
              color: character.colors.secondary || character.colors.glow || textColor,
              textShadow: `0 0 10px ${character.colors.glow}60`,
            }}
          >
            {character.name}
          </div>
          
          {/* Technique badge */}
          <div
            className="inline-block px-3 py-1.5 rounded-lg border backdrop-blur-sm glass-modern domain-border animate-spring-in"
            style={{
              color: character.colors.accent || character.colors.glow || textColor,
              borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
              background: `linear-gradient(135deg, ${character.colors.primary}20, ${character.colors.glow}10)`,
              backgroundSize: '200% 200%',
              boxShadow: `0 0 15px ${character.colors.glow}30, inset 0 0 15px ${character.colors.primary}15`,
              animation: 'cursed-energy-flow 3s ease infinite',
            }}
          >
            <div className="text-[9px] font-semibold tracking-widest">
              {character.techniqueJapanese}
            </div>
          </div>
          
          <div 
            className="text-[10px] border-t pt-2 mt-2 opacity-60"
            style={{ 
              color: character.colors.accent || character.colors.glow || textColor,
              borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
            }}
          >
            呪術廻戦
          </div>
        </div>
      </div>

      {/* Music Player Panel */}
      <MusicPlayerPanel />

      {/* Center - High energy domain activation */}
      <HighEnergyIndicator character={character} />
    </div>
  )
})