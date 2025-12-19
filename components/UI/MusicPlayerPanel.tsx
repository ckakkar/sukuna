"use client"

import { useState } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { PlaybackControls } from "./PlaybackControls"
import { Search } from "./Search"
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

  const handleSignOut = async () => {
    await signOutAction()
  }

  if (!accessToken) return null

  return (
    <div className="absolute bottom-6 left-6 pointer-events-auto z-20">
      <div
        className="bg-black/80 backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden"
        style={{
          borderColor: `${character.colors.primary}40`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${character.colors.glow}20`,
          width: isExpanded ? "480px" : "auto",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor: `${character.colors.primary}20` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: character.colors.primary,
                boxShadow: `0 0 10px ${character.colors.glow}`,
              }}
            />
            <div className="font-mono text-xs">
              <div className="text-white font-bold tracking-wider">
                {character.name.toUpperCase()}
              </div>
              <div className="text-gray-500 text-[10px]">{character.domain}</div>
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
            <div className="px-5 py-4 border-b" style={{ borderColor: `${character.colors.primary}20` }}>
              <Search />
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
                        style={{ borderColor: `${character.colors.primary}20` }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: character.colors.primary }}
                          >
                            BPM
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: character.colors.primary }}
                          >
                            {Math.round(trackData.bpm)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: character.colors.primary }}
                          >
                            ENERGY
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: character.colors.primary }}
                          >
                            {(trackData.energy * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider opacity-70"
                            style={{ color: character.colors.primary }}
                          >
                            VALENCE
                          </span>
                          <span
                            className="text-base font-bold font-mono"
                            style={{ color: character.colors.primary }}
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
                          style={{ color: character.colors.primary }}
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30"
                  style={{ border: `1px solid ${character.colors.primary}20` }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: character.colors.primary }}
                  />
                  <span className="text-gray-400 text-xs font-mono">
                    Waiting for track...
                  </span>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div
              className="px-5 py-4 border-t flex justify-center"
              style={{ borderColor: `${character.colors.primary}20` }}
            >
              <PlaybackControls />
            </div>

            {/* Footer Actions */}
            <div
              className="px-5 py-3 border-t flex justify-end"
              style={{ borderColor: `${character.colors.primary}20` }}
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
