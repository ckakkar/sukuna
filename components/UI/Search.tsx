"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { searchTracks, playTrack, type SearchTrack } from "@/lib/spotify-actions"
import { useDebounce } from "@/hooks/useDebounce"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleBorderColor } from "@/lib/utils/colorUtils"

export function Search() {
  const { accessToken, deviceId, selectedCharacter } = useSpotifyStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const character = CHARACTERS[selectedCharacter]

  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim() || !accessToken) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      // Handle token update if refresh happens
      const handleTokenUpdate = (newToken: string) => {
        useSpotifyStore.getState().setToken(newToken)
      }

      const response = await searchTracks(debouncedQuery, accessToken, 20, handleTokenUpdate)
      if (response) {
        setResults(response.tracks)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      // Could add toast notification for network errors
    } finally {
      setIsSearching(false)
    }
  }, [debouncedQuery, accessToken])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        setQuery("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen])

  const handleTrackSelect = async (track: SearchTrack) => {
    if (!accessToken || !deviceId) {
      console.error("Missing access token or device ID")
      return
    }

    try {
      const success = await playTrack(track.uri, deviceId, accessToken)
      if (success) {
        setIsOpen(false)
        setQuery("")
        setResults([])
      } else {
        // Show error feedback
        console.error("Failed to play track")
      }
    } catch (error) {
      console.error("Error playing track:", error)
      // Could add toast notification here
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div ref={searchRef} className="relative pointer-events-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="SEARCH TRACKS..."
          className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-none focus:outline-none text-black placeholder-gray-500 text-sm font-black font-mono tracking-wider transition-all duration-200"
          style={{
            boxShadow: isOpen ? `4px 4px 0px 0px ${character.colors.primary}` : "none",
          }}
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div
              className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
            />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black z-50 max-h-[400px] flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {/* Manga Halftone Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-0"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '4px 4px'
            }}
          />

          <div className="p-4 border-b-2 border-black z-10 bg-white">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH..."
                className="w-full px-4 py-2 bg-gray-50 border-2 border-black rounded-none focus:outline-none text-black placeholder-gray-400 font-bold uppercase"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 z-10">
            <div className="p-2 space-y-1">
              {results.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="w-full p-2 hover:bg-black hover:text-white transition-all duration-100 text-left group border border-transparent hover:border-black flex items-center gap-3 relative overflow-hidden"
                >
                  {track.image && (
                    <div className="relative w-10 h-10 border border-black flex-shrink-0 bg-gray-200">
                      <Image
                        src={track.image}
                        alt={track.album}
                        fill
                        className="object-cover grayscale contrast-125 group-hover:grayscale-0"
                        sizes="40px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-black uppercase truncate text-sm">
                      {track.name}
                    </div>
                    <div className="text-xs font-bold truncate opacity-70 group-hover:opacity-100">
                      {track.artist}
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold opacity-50 group-hover:opacity-100">
                    {formatDuration(track.duration)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {isOpen && debouncedQuery.trim() && results.length === 0 && !isSearching && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black p-4 text-center text-black font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          No results found
        </div>
      )}
    </div>
  )
}
