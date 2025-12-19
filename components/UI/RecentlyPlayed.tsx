"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { getRecentlyPlayed, playTrack, addToQueue, type SearchTrack } from "@/lib/spotify-actions"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"

export function RecentlyPlayed() {
  const { accessToken, deviceId, selectedCharacter } = useSpotifyStore()
  const [tracks, setTracks] = useState<SearchTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    if (accessToken && isOpen) {
      loadRecentlyPlayed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isOpen])

  const loadRecentlyPlayed = async () => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await getRecentlyPlayed(accessToken)
      setTracks(data)
    } catch (error) {
      console.error("Error loading recently played:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrackSelect = async (track: SearchTrack) => {
    if (!accessToken || !deviceId) return
    try {
      await playTrack(track.uri, deviceId, accessToken)
    } catch (error) {
      console.error("Error playing track:", error)
    }
  }

  const handleAddToQueue = async (track: SearchTrack) => {
    if (!accessToken || !deviceId) return
    try {
      await addToQueue(track.uri, deviceId, accessToken)
    } catch (error) {
      console.error("Error adding to queue:", error)
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-black/20 backdrop-blur-md border-2 rounded-lg transition-all duration-300 flex items-center gap-2"
        style={{
          borderColor: isOpen ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.8) : "rgba(255,255,255,0.2)",
          boxShadow: isOpen ? `0 0 20px ${character.colors.glow}40` : "none",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: textColor }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          className="text-sm font-mono font-bold"
          style={{ color: textColor }}
        >
          RECENT
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-96 bg-black/60 backdrop-blur-2xl border-2 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col overflow-hidden"
          style={{
            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6),
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${character.colors.glow}30`,
          }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3) }}
          >
            <div
              className="font-bold text-sm"
              style={{ color: textColor }}
            >
              RECENTLY PLAYED
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {tracks.length} tracks
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {isLoading ? (
              <div className="p-8 text-center">
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin mx-auto"
                  style={{
                    borderColor: `${character.colors.primary}40`,
                    borderTopColor: character.colors.primary,
                  }}
                />
              </div>
            ) : tracks.length > 0 ? (
              tracks.map((track) => (
                <div key={track.id} className="group mb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTrackSelect(track)}
                      className="flex-1 p-3 hover:bg-white/5 rounded-lg transition-all duration-200 text-left"
                      style={{
                        border: `1px solid transparent`,
                      }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                    >
                      <div className="flex items-center gap-3">
                        {track.image && (
                          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={track.image}
                              alt={track.album}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate text-sm">
                            {track.name}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {track.artist}
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs font-mono">
                          {formatDuration(track.duration)}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAddToQueue(track)}
                      className="p-2 rounded-lg bg-black/30 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      style={{
                        borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
                      }}
                      aria-label="Add to queue"
                    >
                      <svg
                        className="w-4 h-4"
                        style={{ color: textColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No recently played tracks
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
