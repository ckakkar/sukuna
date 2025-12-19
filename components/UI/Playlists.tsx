"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { getUserPlaylists, getPlaylistTracks, playTrack, playPlaylist, type Playlist, type SearchTrack } from "@/lib/spotify-actions"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"

export function Playlists() {
  const { accessToken, deviceId, selectedCharacter } = useSpotifyStore()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<SearchTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    if (accessToken && isOpen && playlists.length === 0 && !isLoading) {
      loadPlaylists()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isOpen])

  const loadPlaylists = async () => {
    if (!accessToken) {
      setError("No access token available. Please reconnect to Spotify.")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      console.log("Loading playlists with token:", accessToken.substring(0, 20) + "...")
      const data = await getUserPlaylists(accessToken, 50)
      console.log("Playlists loaded:", data.length, "playlists found")
      
      if (data.length === 0) {
        setError("No playlists found. Make sure you have playlists in your Spotify account and that you've granted playlist access permissions.")
      } else {
        setPlaylists(data)
        setError(null)
      }
    } catch (error) {
      console.error("Error loading playlists:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load playlists"
      setError(`${errorMessage}. Please check your Spotify connection and permissions.`)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPlaylistTracks = async (playlist: Playlist) => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await getPlaylistTracks(playlist.id, accessToken, 100)
      setTracks(data)
      setSelectedPlaylist(playlist)
    } catch (error) {
      console.error("Error loading playlist tracks:", error)
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

  const handlePlayPlaylist = async (playlist: Playlist) => {
    if (!accessToken || !deviceId) {
      setError("Device not connected. Please ensure Spotify is open.")
      return
    }
    try {
      setError(null)
      await playPlaylist(playlist.uri, deviceId, accessToken)
      setIsOpen(false)
    } catch (error) {
      console.error("Error playing playlist:", error)
      setError(error instanceof Error ? error.message : "Failed to play playlist")
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
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen && accessToken && playlists.length === 0) {
            // Load playlists when opening for the first time
            loadPlaylists()
          }
        }}
        className="px-4 py-2 bg-black/20 backdrop-blur-md border-2 rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 touch-manipulation"
        style={{
          borderColor: isOpen ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.8) : "rgba(255,255,255,0.2)",
          boxShadow: isOpen ? `0 0 20px ${character.colors.glow}40` : "none",
        }}
        aria-label="Open playlists"
        aria-expanded={isOpen}
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
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <span 
          className="text-sm font-mono font-bold"
          style={{ color: textColor }}
        >
          PLAYLISTS
        </span>
        {playlists.length > 0 && (
          <span 
            className="text-xs font-mono px-1.5 py-0.5 rounded bg-black/40"
            style={{ 
              color: character.colors.glow,
              backgroundColor: `${character.colors.glow}20`,
            }}
          >
            {playlists.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-black/60 backdrop-blur-2xl border-2 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col overflow-hidden animate-fade-in-up"
          style={{
            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6),
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${character.colors.glow}30`,
          }}
        >
          {selectedPlaylist ? (
            <>
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: `${character.colors.primary}30` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => {
                      setSelectedPlaylist(null)
                      setTracks([])
                    }}
                    className="p-1 hover:bg-white/5 rounded transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: textColor }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-bold text-sm truncate"
                      style={{ color: character.colors.primary }}
                    >
                      {selectedPlaylist.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedPlaylist.trackCount} tracks
                    </div>
                  </div>
                </div>
                {selectedPlaylist.description && (
                  <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {selectedPlaylist.description}
                  </div>
                )}
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
                ) : (
                  tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className="w-full p-3 hover:bg-white/5 rounded-lg transition-all duration-200 text-left group mb-1"
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
                          <div
                            className="text-white font-medium truncate group-hover:text-sm transition-colors text-sm"
                            style={{
                              color: "white",
                            }}
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
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: `${character.colors.primary}30` }}
              >
                <div
                  className="font-bold text-sm"
                  style={{ color: textColor }}
                >
                  YOUR PLAYLISTS
                </div>
                {playlists.length > 0 && (
                  <button
                    onClick={loadPlaylists}
                    className="p-1.5 hover:bg-white/5 rounded transition-colors"
                    aria-label="Refresh playlists"
                    title="Refresh playlists"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
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
                ) : error ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="text-red-400 text-sm font-mono">
                      {error}
                    </div>
                    <button
                      onClick={loadPlaylists}
                      className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-mono"
                      style={{
                        borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
                        color: textColor,
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group mb-1"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadPlaylistTracks(playlist)}
                          className="flex-1 p-3 hover:bg-white/5 rounded-lg transition-all duration-200 text-left touch-manipulation"
                          style={{
                            border: `1px solid transparent`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${character.colors.primary}40`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "transparent"
                          }}
                          aria-label={`View tracks in ${playlist.name}`}
                        >
                          <div className="flex items-center gap-3">
                            {playlist.image && (
                              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={playlist.image}
                                  alt={playlist.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                  unoptimized
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium truncate text-sm"
                                style={{ color: "white" }}
                              >
                                {playlist.name}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {playlist.trackCount} tracks
                              </div>
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePlayPlaylist(playlist)}
                          className="p-2 rounded-lg bg-black/30 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 touch-manipulation active:scale-95"
                          style={{
                            borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
                          }}
                          aria-label={`Play playlist ${playlist.name}`}
                          title={`Play ${playlist.name}`}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: textColor }}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="text-gray-400 text-sm font-mono">
                      No playlists found
                    </div>
                    <button
                      onClick={loadPlaylists}
                      className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-xs font-mono"
                      style={{
                        borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.4),
                        color: textColor,
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
