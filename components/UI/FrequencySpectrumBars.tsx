"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

export function FrequencySpectrumBars() {
  const { frequencySpectrum, selectedCharacter, beatIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  if (!frequencySpectrum) return null

  const { bass, mid, treble } = frequencySpectrum
  const beat = beatIntensity ?? 0

  return (
    <div className="flex items-end gap-2 sm:gap-3 h-16 sm:h-20">
      {/* Bass Bar */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-full rounded-t transition-all duration-100 relative overflow-hidden"
          style={{
            height: `${bass * 100}%`,
            background: `linear-gradient(to top, ${character.colors.primary}, ${character.colors.glow})`,
            boxShadow: bass > 0.5
              ? `0 0 ${10 + beat * 15}px ${character.colors.primary}80, inset 0 0 10px ${character.colors.glow}40`
              : `0 0 5px ${character.colors.primary}40`,
            minHeight: bass > 0 ? "4px" : "0",
          }}
        >
          {bass > 0.6 && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(to top, transparent, ${character.colors.glow}60)`,
              }}
            />
          )}
        </div>
        <span
          className="text-[8px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider"
          style={{ color: textColor }}
        >
          BASS
        </span>
      </div>

      {/* Mid Bar */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-full rounded-t transition-all duration-100 relative overflow-hidden"
          style={{
            height: `${mid * 100}%`,
            background: `linear-gradient(to top, ${character.colors.glow}, ${character.colors.secondary || character.colors.glow})`,
            boxShadow: mid > 0.5
              ? `0 0 ${10 + beat * 15}px ${character.colors.glow}80, inset 0 0 10px ${character.colors.secondary || character.colors.glow}40`
              : `0 0 5px ${character.colors.glow}40`,
            minHeight: mid > 0 ? "4px" : "0",
          }}
        >
          {mid > 0.6 && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(to top, transparent, ${character.colors.secondary || character.colors.glow}60)`,
              }}
            />
          )}
        </div>
        <span
          className="text-[8px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider"
          style={{ color: textColor }}
        >
          MID
        </span>
      </div>

      {/* Treble Bar */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-full rounded-t transition-all duration-100 relative overflow-hidden"
          style={{
            height: `${treble * 100}%`,
            background: `linear-gradient(to top, ${character.colors.secondary || character.colors.glow}, ${character.colors.accent || character.colors.glow})`,
            boxShadow: treble > 0.5
              ? `0 0 ${10 + beat * 15}px ${character.colors.secondary || character.colors.glow}80, inset 0 0 10px ${character.colors.accent || character.colors.glow}40`
              : `0 0 5px ${character.colors.secondary || character.colors.glow}40`,
            minHeight: treble > 0 ? "4px" : "0",
          }}
        >
          {treble > 0.6 && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(to top, transparent, ${character.colors.accent || character.colors.glow}60)`,
              }}
            />
          )}
        </div>
        <span
          className="text-[8px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider"
          style={{ color: textColor }}
        >
          TREBLE
        </span>
      </div>
    </div>
  )
}

