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
        className="bg-black/50 backdrop-blur-3xl border-2 rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden"
        style={{
          borderColor: borderColor,
          boxShadow: `0 25px 80px rgba(0,0,0,0.4), 0 0 50px ${character.colors.glow}50, inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 30px ${character.colors.primary}15`,
          width: isExpanded ? "520px" : "auto",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ 
            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
            background: `linear-gradient(135deg, ${character.colors.primary}08 0%, ${character.colors.glow}05 50%, transparent 100%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
              style={{
                backgroundColor: character.colors.glow || character.colors.primary,
                boxShadow: `0 0 12px ${character.colors.glow}, 0 0 24px ${character.colors.glow}40`,
              }}
            />
            <div className="font-mono">
              <div 
                className="font-bold tracking-widest text-sm"
                style={{ 
                  color: textColor,
                  textShadow: `0 0 10px ${character.colors.glow}60, 0 2px 4px rgba(0,0,0,0.3)`,
                }}
              >
                {character.name.toUpperCase()}
              </div>
              <div 
                className="text-[11px] opacity-90 mt-0.5"
                style={{ 
                  color: character.colors.secondary || character.colors.glow,
                  textShadow: `0 0 6px ${character.colors.glow}40`,
                }}
              >
                {character.domain}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110"
            style={{
              color: textColor,
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              className="w-5 h-5 transition-transform duration-300"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Search Section */}
            <div 
              className="px-6 py-5 border-b space-y-4" 
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, ${character.colors.primary}04 0%, transparent 100%)`,
              }}
            >
              <Search />
              <div className="flex gap-2.5 flex-wrap">
                <Playlists />
                <Favorites />
                <RecentlyPlayed />
                <Queue />
              </div>
            </div>

            {/* Track Info */}
            {currentTrack ? (
              <div className="px-6 py-5">
                <div className="flex gap-5 items-start">
                  {currentTrack.image && (
                    <div
                      className="rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 relative w-24 h-24 group"
                      style={{
                        boxShadow: `0 12px 40px ${character.colors.glow}40, 0 0 0 3px ${character.colors.primary}30, inset 0 0 20px ${character.colors.glow}20`,
                      }}
                    >
                      <Image
                        src={currentTrack.image}
                        alt={currentTrack.album}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="96px"
                        unoptimized
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, transparent 0%, ${character.colors.glow}20 100%)`,
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <div 
                        className="text-white font-bold text-base truncate mb-2 leading-tight"
                        style={{
                          textShadow: `0 2px 8px rgba(0,0,0,0.5)`,
                        }}
                      >
                        {currentTrack.name}
                      </div>
                      <div 
                        className="text-gray-300 text-sm truncate mb-1.5 font-medium"
                        style={{
                          color: character.colors.secondary || "rgba(255,255,255,0.7)",
                        }}
                      >
                        {currentTrack.artist}
                      </div>
                      <div 
                        className="text-gray-500 text-xs truncate font-mono opacity-80"
                        style={{
                          color: character.colors.accent || "rgba(255,255,255,0.5)",
                        }}
                      >
                        {currentTrack.album}
                      </div>
                    </div>

                    {trackData && !isLoadingAnalysis && (
                      <div
                        className="flex gap-8 pt-5 border-t"
                        style={{ 
                          borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                          background: `linear-gradient(90deg, ${character.colors.primary}03 0%, transparent 100%)`,
                        }}
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}30`,
                            }}
                          >
                            BPM
                          </span>
                          <span
                            className="text-lg font-black font-mono"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 12px ${character.colors.glow}50, 0 2px 4px rgba(0,0,0,0.3)`,
                            }}
                          >
                            {Math.round(trackData.bpm)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}30`,
                            }}
                          >
                            ENERGY
                          </span>
                          <span
                            className="text-lg font-black font-mono"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 12px ${character.colors.glow}50, 0 2px 4px rgba(0,0,0,0.3)`,
                            }}
                          >
                            {(trackData.energy * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}30`,
                            }}
                          >
                            VALENCE
                          </span>
                          <span
                            className="text-lg font-black font-mono"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 12px ${character.colors.glow}50, 0 2px 4px rgba(0,0,0,0.3)`,
                            }}
                          >
                            {(trackData.valence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {isLoadingAnalysis && (
                      <div className="pt-4 flex items-center gap-3">
                        <div
                          className="w-5 h-5 border-2.5 rounded-full animate-spin"
                          style={{
                            borderColor: `${character.colors.glow || character.colors.primary}30`,
                            borderTopColor: character.colors.glow || character.colors.primary,
                            boxShadow: `0 0 10px ${character.colors.glow}40`,
                          }}
                        />
                        <span
                          className="text-xs font-mono font-semibold tracking-wider"
                          style={{ 
                            color: textColor,
                            textShadow: `0 0 8px ${character.colors.glow}40`,
                          }}
                        >
                          ANALYZING...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/30 border-2 backdrop-blur-sm"
                  style={{ 
                    borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
                    boxShadow: `0 0 20px ${character.colors.glow}30, inset 0 0 20px ${character.colors.primary}10`,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ 
                      backgroundColor: character.colors.glow || character.colors.primary,
                      boxShadow: `0 0 12px ${character.colors.glow}, 0 0 24px ${character.colors.glow}40`,
                    }}
                  />
                  <span 
                    className="text-sm font-mono font-semibold tracking-wider"
                    style={{ 
                      color: textColor,
                      textShadow: `0 0 8px ${character.colors.glow}40`,
                    }}
                  >
                    WAITING FOR TRACK...
                  </span>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div
              className="px-6 py-5 border-t flex justify-center"
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, transparent 0%, ${character.colors.primary}06 30%, ${character.colors.glow}04 70%, transparent 100%)`,
              }}
            >
              <PlaybackControls />
            </div>

            {/* Footer Actions */}
            <div
              className="px-6 py-4 border-t flex justify-end"
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, ${character.colors.primary}03 0%, transparent 100%)`,
              }}
            >
              <button
                onClick={handleSignOut}
                className="px-5 py-2 text-xs font-mono font-semibold tracking-wider bg-red-900/30 border-2 border-red-800/60 hover:border-red-500 hover:bg-red-900/40 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:scale-105 shadow-lg hover:shadow-red-900/30"
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
