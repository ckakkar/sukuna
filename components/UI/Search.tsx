"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-black/50 border border-gray-800 hover:border-jujutsu-energy hover:bg-jujutsu-energy/10 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-300 hover:text-jujutsu-energy"
      >
        <svg
          className="w-5 h-5"
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
        <span className="text-sm font-mono">Search</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col">
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
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className="w-full p-3 hover:bg-jujutsu-energy/10 rounded-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      {track.image && (
                        <img
                          src={track.image}
                          alt={track.album}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate group-hover:text-jujutsu-energy transition-colors">
                          {track.name}
                        </div>
                        <div className="text-gray-400 text-sm truncate">
                          {track.artist}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {track.album}
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {formatDuration(track.duration)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : debouncedQuery.trim() && !isSearching ? (
              <div className="p-8 text-center text-gray-500">
                <p>No results found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : !debouncedQuery.trim() ? (
              <div className="p-8 text-center text-gray-500">
                <p>Start typing to search...</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
