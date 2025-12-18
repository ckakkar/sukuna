"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { useEffect, useState } from "react"

export function PlaybackControls() {
  const { accessToken, isPaused } = useSpotifyStore()
  const [canControl, setCanControl] = useState(false)

  useEffect(() => {
    setCanControl(!!accessToken)
  }, [accessToken])

  const handlePlayPause = async () => {
    if (!accessToken) return
    
    try {
      const endpoint = isPaused
        ? "https://api.spotify.com/v1/me/player/play"
        : "https://api.spotify.com/v1/me/player/pause"
      
      await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error("Error controlling playback:", error)
    }
  }

  const handlePrevious = async () => {
    if (!accessToken) return
    
    try {
      await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error("Error skipping to previous:", error)
    }
  }

  const handleNext = async () => {
    if (!accessToken) return
    
    try {
      await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error("Error skipping to next:", error)
    }
  }

  if (!canControl) return null

  return (
    <div className="flex items-center gap-4 pointer-events-auto">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-full bg-black/50 border border-gray-800 hover:border-jujutsu-energy hover:bg-jujutsu-energy/10 transition-all duration-200"
        aria-label="Previous track"
      >
        <svg
          className="w-5 h-5 text-gray-400 hover:text-jujutsu-energy transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        onClick={handlePlayPause}
        className="p-3 rounded-full bg-jujutsu-energy hover:bg-jujutsu-domain transition-all duration-200 shadow-lg shadow-jujutsu-energy/30"
        aria-label={isPaused ? "Play" : "Pause"}
      >
        {isPaused ? (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
          </svg>
        )}
      </button>

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-black/50 border border-gray-800 hover:border-jujutsu-energy hover:bg-jujutsu-energy/10 transition-all duration-200"
        aria-label="Next track"
      >
        <svg
          className="w-5 h-5 text-gray-400 hover:text-jujutsu-energy transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
        </svg>
      </button>
    </div>
  )
}
