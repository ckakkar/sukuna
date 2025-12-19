"use client"

import { useState, useEffect } from "react"
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
    beatIntensity,
  } = useSpotifyStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [pulseScale, setPulseScale] = useState(1)
  
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)
  const borderColor = getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6)

  // Beat pulse animation
  useEffect(() => {
    if (beatIntensity && beatIntensity > 0.5) {
      setPulseScale(1 + beatIntensity * 0.05)
      const timeout = setTimeout(() => setPulseScale(1), 100)
      return () => clearTimeout(timeout)
    }
  }, [beatIntensity])

  const handleSignOut = async () => {
    await signOutAction()
  }

  if (!accessToken) return null

  return (
    <div 
      className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto pointer-events-auto z-20 transition-transform duration-100 ease-out"
      style={{ transform: `scale(${pulseScale})` }}
    >
      <div
        className="bg-black/60 backdrop-blur-3xl border-2 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden relative w-full sm:w-auto"
        style={{
          borderColor: borderColor,
          boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${character.colors.glow}${(beatIntensity ?? 0) > 0.5 ? 'AA' : '50'}, inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 40px ${character.colors.primary}20`,
          width: isExpanded ? "100%" : "auto",
          maxWidth: isExpanded ? "580px" : "none",
        }}
      >
        {/* Animated glow border on beat */}
        {(beatIntensity ?? 0) > 0.3 && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${character.colors.glow}40, transparent)`,
              opacity: beatIntensity,
            }}
          />
        )}

        {/* Header with character info */}
        <div
          className="px-3 py-3 sm:px-6 sm:py-4 border-b flex items-center justify-between relative overflow-hidden"
          style={{ 
            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
            background: `linear-gradient(135deg, ${character.colors.primary}15 0%, ${character.colors.glow}08 50%, transparent 100%)`,
          }}
        >
          {/* Animated background on beat */}
          {(beatIntensity ?? 0) > 0.4 && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${character.colors.glow}60, transparent 70%)`,
                animation: "pulse 0.3s ease-out",
              }}
            />
          )}
          
          <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 relative"
              style={{
                backgroundColor: character.colors.glow || character.colors.primary,
                boxShadow: `0 0 ${12 + (beatIntensity ?? 0) * 20}px ${character.colors.glow}, 0 0 ${24 + (beatIntensity ?? 0) * 30}px ${character.colors.glow}60`,
                animation: (beatIntensity ?? 0) > 0.3 ? "ping 0.5s ease-out" : "pulse 2s ease-in-out infinite",
              }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: character.colors.glow,
                  animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            </div>
            <div className="font-mono min-w-0 flex-1">
              <div 
                className="text-sm sm:text-lg font-black tracking-widest mb-0.5 truncate"
                style={{ 
                  color: textColor,
                  textShadow: `0 0 ${15 + (beatIntensity ?? 0) * 25}px ${character.colors.glow}80, 0 2px 4px rgba(0,0,0,0.5)`,
                }}
              >
                {character.japaneseName}
              </div>
              <div 
                className="text-[10px] sm:text-xs font-semibold tracking-wide truncate flex items-center gap-2"
                style={{ 
                  color: character.colors.secondary || character.colors.glow || textColor,
                  textShadow: `0 0 8px ${character.colors.glow}60`,
                }}
              >
                <span>{character.name}</span>
                {(beatIntensity ?? 0) > 0.6 && (
                  <span className="text-xs opacity-70 animate-pulse flex-shrink-0">
                    ⚡
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 relative z-10 group flex-shrink-0"
            style={{
              color: textColor,
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 8px ${character.colors.glow}80)`,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 8px ${character.colors.glow}80)`,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Search and Quick Actions */}
            <div 
              className="px-3 py-3 sm:px-6 sm:py-5 border-b space-y-3 sm:space-y-4" 
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, ${character.colors.primary}06 0%, transparent 100%)`,
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

            {/* Now Playing */}
            {currentTrack ? (
              <div className="px-3 py-4 sm:px-6 sm:py-6 relative">
                {/* Beat pulse background */}
                {(beatIntensity ?? 0) > 0.5 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${character.colors.glow}20, transparent 70%)`,
                      opacity: beatIntensity * 0.5,
                    }}
                  />
                )}
                
                <div className="flex gap-5 items-start relative z-10">
                  {currentTrack.image && (
                    <div
                      className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 relative w-20 h-20 sm:w-28 sm:h-28 group"
                      style={{
                        boxShadow: `0 12px 50px ${character.colors.glow}${(beatIntensity ?? 0) > 0.5 ? 'AA' : '50'}, 0 0 0 3px ${character.colors.primary}30, inset 0 0 30px ${character.colors.glow}30`,
                        transform: (beatIntensity ?? 0) > 0.7 ? `scale(${1 + (beatIntensity ?? 0) * 0.05})` : "scale(1)",
                        transition: "transform 0.1s ease-out",
                      }}
                    >
                      <Image
                        src={currentTrack.image}
                        alt={currentTrack.album}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="112px"
                        unoptimized
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, transparent 0%, ${character.colors.glow}30 100%)`,
                        }}
                      />
                      
                      {/* Beat indicator overlay */}
                      {(beatIntensity ?? 0) > 0.6 && (
                        <div
                          className="absolute inset-0 bg-white animate-pulse"
                          style={{
                            opacity: beatIntensity * 0.2,
                            mixBlendMode: "overlay",
                          }}
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="mb-5">
                      <div 
                        className="text-white font-bold text-sm sm:text-lg truncate mb-2 sm:mb-2.5 leading-tight tracking-wide"
                        style={{
                          textShadow: `0 2px 10px rgba(0,0,0,0.7), 0 0 ${(beatIntensity ?? 0) > 0.5 ? 15 : 0}px ${character.colors.glow}`,
                        }}
                      >
                        {currentTrack.name}
                      </div>
                      <div 
                        className="text-sm sm:text-base truncate mb-1.5 sm:mb-2 font-medium tracking-wide"
                        style={{
                          color: character.colors.secondary || "rgba(255,255,255,0.8)",
                        }}
                      >
                        {currentTrack.artist}
                      </div>
                      <div 
                        className="text-sm truncate font-mono opacity-70"
                        style={{
                          color: character.colors.accent || "rgba(255,255,255,0.5)",
                        }}
                      >
                        {currentTrack.album}
                      </div>
                    </div>

                    {/* Audio Analysis Stats */}
                    {trackData && !isLoadingAnalysis && (
                      <div
                        className="grid grid-cols-3 gap-6 pt-5 border-t"
                        style={{ 
                          borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.25),
                          background: `linear-gradient(90deg, ${character.colors.primary}05 0%, transparent 100%)`,
                        }}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80 font-semibold"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}40`,
                            }}
                          >
                            BPM
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span
                              className="text-xl sm:text-2xl font-black font-mono"
                              style={{ 
                                color: textColor,
                                textShadow: `0 0 ${12 + (beatIntensity ?? 0) * 20}px ${character.colors.glow}70, 0 2px 4px rgba(0,0,0,0.5)`,
                              }}
                            >
                              {Math.round(trackData.bpm)}
                            </span>
                            {(beatIntensity ?? 0) > 0.5 && (
                              <span 
                                className="text-sm animate-pulse"
                                style={{ color: character.colors.glow }}
                              >
                                ♪
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80 font-semibold"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}40`,
                            }}
                          >
                            ENERGY
                          </span>
                          <div className="relative">
                            <span
                              className="text-2xl font-black font-mono block"
                              style={{ 
                                color: textColor,
                                textShadow: `0 0 ${12 + trackData.energy * 20}px ${character.colors.glow}70, 0 2px 4px rgba(0,0,0,0.5)`,
                              }}
                            >
                              {(trackData.energy * 100).toFixed(0)}%
                            </span>
                            {/* Energy bar */}
                            <div 
                              className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300"
                              style={{
                                width: `${trackData.energy * 100}%`,
                                background: `linear-gradient(90deg, ${character.colors.primary}, ${character.colors.glow})`,
                                boxShadow: `0 0 10px ${character.colors.glow}`,
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <span
                            className="text-[10px] font-mono uppercase tracking-widest opacity-80 font-semibold"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 6px ${character.colors.glow}40`,
                            }}
                          >
                            VALENCE
                          </span>
                          <span
                            className="text-xl sm:text-2xl font-black font-mono"
                            style={{ 
                              color: textColor,
                              textShadow: `0 0 ${12 + trackData.valence * 15}px ${character.colors.glow}70, 0 2px 4px rgba(0,0,0,0.5)`,
                            }}
                          >
                            {(trackData.valence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Loading state */}
                    {isLoadingAnalysis && (
                      <div className="pt-5 flex items-center gap-3">
                        <div
                          className="w-6 h-6 border-3 rounded-full animate-spin"
                          style={{
                            borderColor: `${character.colors.glow || character.colors.primary}30`,
                            borderTopColor: character.colors.glow || character.colors.primary,
                            boxShadow: `0 0 15px ${character.colors.glow}60`,
                          }}
                        />
                        <span
                          className="text-sm font-mono font-semibold tracking-wider"
                          style={{ 
                            color: textColor,
                            textShadow: `0 0 10px ${character.colors.glow}50`,
                          }}
                        >
                          ANALYZING CURSED ENERGY...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 py-8 sm:px-6 sm:py-14 text-center">
                <div
                  className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-black/40 border-2 backdrop-blur-sm"
                  style={{ 
                    borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.5),
                    boxShadow: `0 0 30px ${character.colors.glow}40, inset 0 0 30px ${character.colors.primary}15`,
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: character.colors.glow || character.colors.primary,
                        boxShadow: `0 0 15px ${character.colors.glow}, 0 0 30px ${character.colors.glow}60`,
                      }}
                    />
                    <span 
                      className="text-base font-mono font-semibold tracking-wider"
                      style={{ 
                        color: textColor,
                        textShadow: `0 0 10px ${character.colors.glow}50`,
                      }}
                    >
                      AWAITING SUMMONING...
                    </span>
                  </div>
                  <div 
                    className="text-xs font-mono opacity-70 tracking-wide"
                    style={{ color: character.colors.secondary || textColor }}
                  >
                    Play a track to expand domain
                  </div>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div
              className="px-3 py-4 sm:px-6 sm:py-5 border-t flex justify-center"
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, transparent 0%, ${character.colors.primary}08 30%, ${character.colors.glow}06 70%, transparent 100%)`,
              }}
            >
              <PlaybackControls />
            </div>

            {/* Footer */}
            <div
              className="px-3 py-3 sm:px-6 sm:py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0"
              style={{ 
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.2),
                background: `linear-gradient(135deg, ${character.colors.primary}04 0%, transparent 100%)`,
              }}
            >
              <div 
                className="text-xs font-mono opacity-60 tracking-wide"
                style={{ color: textColor }}
              >
                {character.techniqueJapanese}
              </div>
              <button
                onClick={handleSignOut}
                className="px-5 py-2 text-xs font-mono font-semibold tracking-wider bg-red-900/30 border-2 border-red-800/60 hover:border-red-500 hover:bg-red-900/50 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:scale-105 shadow-lg hover:shadow-red-900/40"
              >
                DISCONNECT
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
} 