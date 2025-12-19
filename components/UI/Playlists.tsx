"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { getUserPlaylists, getPlaylistTracks, playTrack, type Playlist, type SearchTrack } from "@/lib/spotify-actions"
import { CHARACTERS } from "@/lib/types/character"

export function Playlists() {
  const { accessToken, deviceId, selectedCharacter } = useSpotifyStore()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<SearchTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (accessToken && isOpen) {
      loadPlaylists()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isOpen])

  const loadPlaylists = async () => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await getUserPlaylists(accessToken)
      setPlaylists(data)
    } catch (error) {
      console.error("Error loading playlists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPlaylistTracks = async (playlist: Playlist) => {
    if (!accessToken) return
    setIsLoading(true)
    try {
      const data = await getPlaylistTracks(playlist.id, accessToken)
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
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <span 
          className="text-sm font-mono font-bold"
          style={{ color: character.colors.primary }}
        >
          PLAYLISTS
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
          {selectedPlaylist ? (
            <>
              <div
                className="px-4 py-3 border-b flex items-center gap-3"
                style={{ borderColor: `${character.colors.primary}30` }}
              >
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
                    style={{ color: character.colors.primary }}
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
                className="px-4 py-3 border-b"
                style={{ borderColor: `${character.colors.primary}30` }}
              >
                <div
                  className="font-bold text-sm"
                  style={{ color: character.colors.primary }}
                >
                  YOUR PLAYLISTS
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
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => loadPlaylistTracks(playlist)}
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
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No playlists found
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
