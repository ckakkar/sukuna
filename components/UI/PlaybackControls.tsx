"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { useEffect, useState } from "react"
import { setVolume } from "@/lib/spotify-actions"

export function PlaybackControls() {
  const { accessToken, isPaused, deviceId, playerInstance } = useSpotifyStore()
  const [canControl, setCanControl] = useState(false)
  const [volume, setVolumeState] = useState(50)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  useEffect(() => {
    setCanControl(!!accessToken && !!deviceId)
  }, [accessToken, deviceId])

  const handlePlayPause = async () => {
    if (!playerInstance) return
    
    try {
      await playerInstance.togglePlay()
    } catch (error) {
      console.error("Error controlling playback:", error)
    }
  }

  const handlePrevious = async () => {
    if (!playerInstance) return
    
    try {
      await playerInstance.previousTrack()
    } catch (error) {
      console.error("Error skipping to previous:", error)
    }
  }

  const handleNext = async () => {
    if (!playerInstance) return
    
    try {
      await playerInstance.nextTrack()
    } catch (error) {
      console.error("Error skipping to next:", error)
    }
  }

  const handleVolumeChange = async (newVolume: number) => {
    if (!accessToken || !deviceId) return
    
    setVolumeState(newVolume)
    try {
      // Update volume via API and player instance
      if (playerInstance) {
        await playerInstance.setVolume(newVolume / 100)
      }
      await setVolume(newVolume, deviceId, accessToken)
    } catch (error) {
      console.error("Error setting volume:", error)
    }
  }

  if (!canControl) return null

  return (
    <div className="flex items-center gap-4 pointer-events-auto relative">
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

      <div className="relative">
        <button
          onClick={() => setShowVolumeControl(!showVolumeControl)}
          className="p-2 rounded-full bg-black/50 border border-gray-800 hover:border-jujutsu-energy hover:bg-jujutsu-energy/10 transition-all duration-200"
          aria-label="Volume control"
        >
          <svg
            className="w-5 h-5 text-gray-400 hover:text-jujutsu-energy transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            {volume === 0 ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : volume < 50 ? (
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
        </button>
        {showVolumeControl && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-32 accent-jujutsu-energy"
              />
              <span className="text-xs text-gray-400 w-8">{volume}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
