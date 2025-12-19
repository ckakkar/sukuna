"use client"

import { useState } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { PlaybackControls } from "./PlaybackControls"
import { Search } from "./Search"
import { Playlists } from "./Playlists"
import { Favorites } from "./Favorites"
import { RecentlyPlayed } from "./RecentlyPlayed"
import { Queue } from "./Queue"
import { signOutAction } from "@/app/actions/auth"

export function MusicPlayerPanel() {
  const {
    currentTrack,
    trackData,
    isLoadingAnalysis,
    selectedCharacter,
    accessToken,
  } = useSpotifyStore()
  const [isExpanded, setIsExpanded] = useState(true)
  
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)
  const borderColor = getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6)

  const handleSignOut = async () => {
    await signOutAction()
  }

  if (!accessToken) return null

  return (
    <div className="absolute bottom-6 left-6 pointer-events-auto z-20">
      <div
        className="bg-black/40 backdrop-blur-2xl border-2 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden"
        style={{
          borderColor: borderColor,
          boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${character.colors.glow}40, inset 0 0 20px ${character.colors.primary}10`,
          width: isExpanded ? "480px" : "auto",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{ 
            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
            background: `linear-gradient(90deg, ${character.colors.primary}05 0%, transparent 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: character.colors.glow || character.colors.primary,
                boxShadow: `0 0 10px ${character.colors.glow}`,
              }}
            />
            <div className="font-mono text-xs">
              <div 
                className="font-bold tracking-wider"
                style={{ 
                  color: textColor,
                  textShadow: `0 0 8px ${character.colors.glow}60`,
                }}
              >
                {character.name.toUpperCase()}
              </div>
              <div 
                className="text-[10px] opacity-80"
                style={{ color: character.colors.secondary || character.colors.glow }}
              >
                {character.domain}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isExpanded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              )}
            </svg>
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Search Section */}
            <div 
              className="px-5 py-4 border-b space-y-3" 
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
                background: `linear-gradient(90deg, ${character.colors.primary}03 0%, transparent 100%)`,
              }}
            >
              <Search />
              <div className="flex gap-2 flex-wrap">
                <Playlists />
                <Favorites />
                <RecentlyPlayed />
                <Queue />
              </div>
            </div>

            {/* Track Info */}
            {currentTrack ? (
              <div className="px-5 py-4">
                <div className="flex gap-4 items-start">
                  {currentTrack.image && (
                    <div
                      className="rounded-xl overflow-hidden shadow-lg flex-shrink-0 relative w-20 h-20"
                      style={{
                        boxShadow: `0 8px 32px ${character.colors.glow}30, 0 0 0 2px ${character.colors.primary}40`,
                      }}
                    >
                      <Image
                        src={currentTrack.image}
                        alt={currentTrack.album}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <div className="text-white font-semibold text-sm truncate mb-1.5">
                        {currentTrack.name}
                      </div>
                      <div className="text-gray-400 text-xs truncate mb-1">
                        {currentTrack.artist}
                      </div>
                      <div className="text-gray-600 text-[10px] truncate font-mono">
                        {currentTrack.album}
                      </div>
                    </div>

                    {trackData && !isLoadingAnalysis && (
                      <div
                        className="flex gap-6 pt-4 border-t"
                        style={{ borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3) }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: textColor }}
                          >
                            BPM
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: textColor }}
                          >
                            {Math.round(trackData.bpm)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: textColor }}
                          >
                            ENERGY
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: textColor }}
                          >
                            {(trackData.energy * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: textColor }}
                          >
                            VALENCE
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: textColor }}
                          >
                            {(trackData.valence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {isLoadingAnalysis && (
                      <div className="pt-3 flex items-center gap-2">
                        <div
                          className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{
                            borderColor: `${character.colors.primary}40`,
                            borderTopColor: character.colors.primary,
                          }}
                        />
                        <span
                          className="text-xs font-mono"
                          style={{ color: textColor }}
                        >
                          ANALYZING...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border-2"
                  style={{ 
                    borderColor: `${character.colors.primary}40`,
                    boxShadow: `0 0 15px ${character.colors.glow}30`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ 
                      backgroundColor: character.colors.primary,
                      boxShadow: `0 0 8px ${character.colors.glow}`,
                    }}
                  />
                  <span 
                    className="text-xs font-mono"
                    style={{ color: character.colors.secondary }}
                  >
                    Waiting for track...
                  </span>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div
              className="px-5 py-4 border-t flex justify-center"
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
                background: `linear-gradient(90deg, transparent 0%, ${character.colors.primary}05 50%, transparent 100%)`,
              }}
            >
              <PlaybackControls />
            </div>

            {/* Footer Actions */}
            <div
              className="px-5 py-3 border-t flex justify-end"
              style={{ borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3) }}
            >
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 text-xs font-mono bg-red-900/20 border border-red-800/50 hover:border-red-600 hover:bg-red-900/30 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300"
              >
                DISCONNECT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
