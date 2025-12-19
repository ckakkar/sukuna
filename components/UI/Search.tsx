"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { searchTracks, playTrack, type SearchTrack } from "@/lib/spotify-actions"
import { useDebounce } from "@/hooks/useDebounce"

export function Search() {
  const { accessToken, deviceId } = useSpotifyStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim() || !accessToken) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await searchTracks(debouncedQuery, accessToken, 20)
      if (response) {
        setResults(response.tracks)
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
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
      }
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
    <div ref={searchRef} className="relative pointer-events-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for tracks..."
          className="w-full px-4 py-2.5 bg-black/30 border rounded-lg focus:outline-none text-white placeholder-gray-500 text-sm font-mono transition-all duration-200"
          style={{
            borderColor: isOpen ? "#9333ea" : "rgba(255,255,255,0.1)",
          }}
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-jujutsu-energy border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-2xl z-50 max-h-[400px] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tracks..."
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-jujutsu-energy focus:outline-none text-white placeholder-gray-500"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-jujutsu-energy border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-2">
              {results.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="w-full p-3 hover:bg-jujutsu-energy/10 rounded-lg transition-all duration-200 text-left group"
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
                      <div className="text-white font-medium truncate group-hover:text-jujutsu-energy transition-colors text-sm">
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
              ))}
            </div>
          </div>
        </div>
      )}
      {isOpen && debouncedQuery.trim() && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-2xl z-50 p-4 text-center text-gray-500 text-xs">
          No results found
        </div>
      )}
    </div>
  )
}
