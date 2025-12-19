"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CharacterSelector } from "./CharacterSelector"
import { PlaybackControls } from "./PlaybackControls"
import { Search } from "./Search"
import { signOutAction } from "@/app/actions/auth"

export function Overlay() {
  const {
    currentTrack,
    trackData,
    isLoadingAnalysis,
    selectedCharacter,
    accessToken,
  } = useSpotifyStore()
  
  const character = CHARACTERS[selectedCharacter]

  const handleSignOut = async () => {
    await signOutAction()
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top left - Domain info */}
      <div className="absolute top-6 left-6 font-mono text-xs space-y-2">
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

      {/* Top right - Character selector, search & logout */}
      <div className="absolute top-6 right-6 font-mono text-xs space-y-3">
        {accessToken && (
          <>
            <CharacterSelector />
            <Search />
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-red-900/30 border border-red-800 hover:border-red-600 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300 text-sm pointer-events-auto"
            >
              DISCONNECT
            </button>
          </>
        )}
      </div>

      {/* Bottom center - Playback controls */}
      {accessToken && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <PlaybackControls />
        </div>
      )}

      {/* Bottom left - Track info */}
      <div className="absolute bottom-6 left-6 font-mono text-sm space-y-2 pointer-events-auto max-w-md">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse-cursed shadow-lg"
            style={{
              backgroundColor: character.colors.primary,
              boxShadow: `0 0 10px ${character.colors.glow}`,
            }}
          />
          <div className="text-gray-300 font-semibold tracking-wide">
            <span className="text-gray-500">呪力活性:</span>{" "}
            <span style={{ color: character.colors.primary }}>
              {character.techniqueJapanese}
            </span>
          </div>
        </div>

        {currentTrack ? (
          <div className="space-y-1 mt-4 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
            <div className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-2">
              <span>NOW PLAYING</span>
              <span className="text-gray-600 text-[10px]">再生中</span>
              {isLoadingAnalysis && (
                <span
                  className="text-[10px] animate-pulse"
                  style={{ color: character.colors.primary }}
                >
                  [ANALYZING...]
                </span>
              )}
            </div>
            <div className="text-white font-medium truncate">
              {currentTrack.name}
            </div>
            {currentTrack.artist && (
              <div className="text-gray-400 text-xs truncate">
                {currentTrack.artist}
              </div>
            )}
            {trackData && !isLoadingAnalysis && (
              <div className="flex gap-6 mt-4 text-xs border-t border-gray-800 pt-3">
                <div>
                  <span className="text-gray-500 text-[10px]">BPM</span>
                  <div
                    className="font-bold text-sm"
                    style={{ color: character.colors.primary }}
                  >
                    {Math.round(trackData.bpm)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px]">エネルギー</span>
                  <div
                    className="font-bold text-sm"
                    style={{ color: character.colors.primary }}
                  >
                    {(trackData.energy * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px]">価値観</span>
                  <div
                    className="font-bold text-sm"
                    style={{ color: character.colors.primary }}
                  >
                    {(trackData.valence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-xs mt-4 space-y-1">
            <div>[呪力源を待機中...]]</div>
            <div className="text-gray-600 text-[10px]">Awaiting cursed energy source...</div>
          </div>
        )}
      </div>

      {/* Bottom right - Character branding */}
      <div className="absolute bottom-6 right-6 font-mono text-xs space-y-1">
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

      {/* Center - High energy indicator */}
      {currentTrack && trackData && trackData.energy > 0.7 && !isLoadingAnalysis && (
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
      )}
    </div>
  )
}
