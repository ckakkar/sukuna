"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { MusicPlayerPanel } from "./MusicPlayerPanel"

export function Overlay() {
  const { selectedCharacter } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top left - Domain info */}
      <div className="absolute top-6 left-6 font-mono text-xs space-y-2 pointer-events-none">
        <div
          className="font-bold tracking-wider text-sm animate-glow"
          style={{
            color: character.colors.primary,
            textShadow: `0 0 10px ${character.colors.glow}`,
          }}
        >
          DOMAIN EXPANSION
        </div>
        <div className="text-gray-400 text-[11px] tracking-widest font-semibold">
          領域展開
        </div>
        <div className="text-gray-600 text-[10px] mt-1">
          {character.domainJapanese}
        </div>
        <div className="text-gray-500 text-[9px] italic">
          {character.domain}
        </div>
      </div>

      {/* Bottom right - Character branding */}
      <div className="absolute bottom-6 right-6 font-mono text-xs space-y-1 pointer-events-none">
        <div className="text-right">
          <div
            className="text-lg font-black mb-0.5 tracking-widest"
            style={{ color: character.colors.primary }}
          >
            {character.japaneseName}
          </div>
          <div className="text-white text-sm font-bold mb-1">{character.name}</div>
          <div className="text-gray-500 text-[10px] border-t border-gray-800 pt-1 mt-1">
            呪術廻戦
          </div>
        </div>
      </div>

      {/* Music Player Panel - Bottom Left */}
      <MusicPlayerPanel />

      {/* Center - High energy indicator */}
      <HighEnergyIndicator character={character} />
    </div>
  )
}

function HighEnergyIndicator({ character }: { character: typeof CHARACTERS[keyof typeof CHARACTERS] }) {
  const { currentTrack, trackData, isLoadingAnalysis } = useSpotifyStore()

  if (!currentTrack || !trackData || trackData.energy <= 0.7 || isLoadingAnalysis) {
    return null
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono text-center pointer-events-none">
      <div
        className="text-4xl font-black animate-glow tracking-widest"
        style={{
          color: character.colors.primary,
          textShadow: `0 0 20px ${character.colors.glow}, 0 0 40px ${character.colors.glow}`,
        }}
      >
        展開
      </div>
      <div className="text-gray-600 text-xs mt-1">DOMAIN EXPANSION</div>
    </div>
  )
}
