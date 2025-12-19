"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { getSavedTracks, playTrack, type SearchTrack } from "@/lib/spotify-actions"
import { CHARACTERS } from "@/lib/types/character"

export function Favorites() {
  const { accessToken, deviceId, selectedCharacter } = useSpotifyStore()
  const [tracks, setTracks] = useState<SearchTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (accessToken && isOpen) {
      loadFavorites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isOpen])

  const loadFavorites = async () => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await getSavedTracks(accessToken)
      setTracks(data)
    } catch (error) {
      console.error("Error loading favorites:", error)
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
          borderColor: isOpen ? `${character.colors.primary}80` : "rgba(255,255,255,0.2)",
          boxShadow: isOpen ? `0 0 20px ${character.colors.glow}40` : "none",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: character.colors.primary }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span
          className="text-sm font-mono font-bold"
          style={{ color: character.colors.primary }}
        >
          FAVORITES
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-96 bg-black/60 backdrop-blur-2xl border-2 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col overflow-hidden"
          style={{
            borderColor: `${character.colors.primary}60`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${character.colors.glow}30`,
          }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: `${character.colors.primary}30` }}
          >
            <div
              className="font-bold text-sm"
              style={{ color: character.colors.primary }}
            >
              LIKED SONGS
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
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="w-full p-3 hover:bg-white/5 rounded-lg transition-all duration-200 text-left group mb-1"
                  style={{
                    border: `1px solid transparent`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${character.colors.primary}40`
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
                      <div
                        className="text-white font-medium truncate group-hover:text-sm transition-colors text-sm"
                      >
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
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No liked songs found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
