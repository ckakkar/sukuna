"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { useEffect, useState } from "react"
import { setVolume, seekToPosition, setRepeatMode, setShuffleMode } from "@/lib/spotify-actions"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { cn } from "@/lib/utils/cn"
import { formatTime } from "@/lib/utils/format"

export function PlaybackControls() {
  const { 
    accessToken, 
    isPaused, 
    deviceId, 
    playerInstance, 
    playbackPosition, 
    playbackDuration, 
    selectedCharacter, 
    repeatMode, 
    shuffleMode, 
    beatIntensity,
    setRepeatMode: setStoreRepeatMode, 
    setShuffleMode: setStoreShuffleMode 
  } = useSpotifyStore()
  
  const [canControl, setCanControl] = useState(false)
  const [volume, setVolumeState] = useState(50)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)
  const [buttonPulse, setButtonPulse] = useState<string | null>(null)
  
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    setCanControl(!!accessToken && !!deviceId)
  }, [accessToken, deviceId])

  useEffect(() => {
    if (!isSeeking && playbackPosition !== undefined) {
      setSeekPosition(playbackPosition)
    }
  }, [playbackPosition, isSeeking])

  // Beat pulse animation
  useEffect(() => {
    if (beatIntensity && beatIntensity > 0.7) {
      const timeout = setTimeout(() => setButtonPulse(null), 150)
      return () => clearTimeout(timeout)
    }
  }, [beatIntensity])


  const handleSeek = async (newPosition: number) => {
    if (!accessToken || !deviceId || !playerInstance) return
    setIsSeeking(true)
    setSeekPosition(newPosition)
    try {
      await seekToPosition(newPosition, deviceId, accessToken)
      if (playerInstance) {
        await playerInstance.seek(newPosition)
      }
    } catch (error) {
      console.error("Error seeking:", error)
      // Reset position on error
      setSeekPosition(playbackPosition ?? 0)
    } finally {
      setIsSeeking(false)
    }
  }

  const handlePlayPause = async () => {
    if (!playerInstance) return
    setButtonPulse("play")
    try {
      await playerInstance.togglePlay()
    } catch (error) {
      console.error("Error controlling playback:", error)
      // Could show toast notification here
    }
  }

  const handlePrevious = async () => {
    if (!playerInstance) return
    setButtonPulse("prev")
    try {
      await playerInstance.previousTrack()
    } catch (error) {
      console.error("Error skipping to previous:", error)
    }
  }

  const handleNext = async () => {
    if (!playerInstance) return
    setButtonPulse("next")
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
      if (playerInstance) {
        await playerInstance.setVolume(newVolume / 100)
      }
      await setVolume(newVolume, deviceId, accessToken)
    } catch (error) {
      console.error("Error setting volume:", error)
    }
  }

  const handleRepeatToggle = async () => {
    if (!accessToken || !deviceId) return
    const modes: Array<"off" | "track" | "context"> = ["off", "context", "track"]
    const currentIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    try {
      await setRepeatMode(nextMode, deviceId, accessToken)
      setStoreRepeatMode(nextMode)
    } catch (error) {
      console.error("Error setting repeat mode:", error)
    }
  }

  const handleShuffleToggle = async () => {
    if (!accessToken || !deviceId) return
    const newShuffle = !shuffleMode
    try {
      await setShuffleMode(newShuffle, deviceId, accessToken)
      setStoreShuffleMode(newShuffle)
    } catch (error) {
      console.error("Error setting shuffle mode:", error)
    }
  }

  if (!canControl) return null

  const progress = playbackDuration > 0 ? (seekPosition / playbackDuration) * 100 : 0

  return (
    <div className="w-full pointer-events-auto max-w-2xl px-2 sm:px-0">
      {/* Progress Bar */}
      {playbackDuration > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2 sm:mb-3 font-mono">
            <span 
              className="font-semibold tracking-wider"
              style={{ 
                color: textColor,
                textShadow: `0 0 8px ${character.colors.glow}40`,
              }}
            >
              {formatTime(seekPosition)}
            </span>
            <span 
              className="font-semibold tracking-wider"
              style={{ 
                color: textColor,
                textShadow: `0 0 8px ${character.colors.glow}40`,
              }}
            >
              {formatTime(playbackDuration)}
            </span>
          </div>
          
          <div className="relative">
            {/* Track background */}
            <div 
              className="h-2 bg-black/50 rounded-full overflow-visible backdrop-blur-sm border"
              style={{
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
                boxShadow: `inset 0 0 10px ${character.colors.primary}20`,
              }}
            >
              {/* Progress fill with glow */}
              <div
                className="h-full rounded-full transition-all duration-100 relative overflow-visible"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${character.colors.primary}, ${character.colors.glow}, ${character.colors.secondary || character.colors.glow})`,
                  boxShadow: `0 0 ${20 + (beatIntensity ?? 0) * 20}px ${character.colors.glow}90, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              >
                {/* Progress head indicator */}
                <div
                  className="absolute right-0 top-1/2 w-4 h-4 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{
                    background: character.colors.glow,
                    boxShadow: `0 0 ${15 + (beatIntensity ?? 0) * 15}px ${character.colors.glow}, 0 0 ${30 + (beatIntensity ?? 0) * 20}px ${character.colors.glow}70`,
                    border: `2px solid ${character.colors.primary}`,
                  }}
                />
                
                {/* Beat pulse on progress bar */}
                {(beatIntensity ?? 0) > 0.5 && (
                  <div
                    className="absolute right-0 top-1/2 w-8 h-8 rounded-full -translate-y-1/2 translate-x-1/2 animate-ping"
                    style={{
                      background: character.colors.glow,
                      opacity: beatIntensity * 0.6,
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Seek input */}
            <input
              type="range"
              min="0"
              max={playbackDuration}
              value={seekPosition}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{ touchAction: "none" }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 relative">
        {/* Shuffle */}
        <button
          onClick={handleShuffleToggle}
          aria-label={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
          className={cn(
            "p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation",
            shuffleMode ? "bg-black/60 border-2" : "bg-black/40 hover:bg-white/10 border border-white/10"
          )}
          style={{
            borderColor: shuffleMode ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 1) : "rgba(255,255,255,0.1)",
            color: shuffleMode ? textColor : "rgba(255,255,255,0.7)",
            boxShadow: shuffleMode ? `0 0 20px ${character.colors.glow}60, inset 0 0 15px ${character.colors.glow}20` : "none",
          }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={handlePrevious}
          aria-label="Previous track"
          className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group relative touch-manipulation"
          style={{
            borderColor: buttonPulse === "prev" ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.9) : "rgba(255,255,255,0.1)",
            boxShadow: buttonPulse === "prev" ? `0 0 20px ${character.colors.glow}60` : "none",
            transform: buttonPulse === "prev" ? "scale(1.1)" : "scale(1)",
          }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm8.5 6L6 18V6l8.5 6z" />
          </svg>
        </button>

        {/* Play/Pause - Main button */}
        <button
          onClick={handlePlayPause}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 relative overflow-hidden group touch-manipulation will-animate domain-border"
          style={{
            background: isPaused
              ? `linear-gradient(135deg, ${character.colors.primary} 0%, ${character.colors.glow} 50%, ${character.colors.secondary || character.colors.glow} 100%)`
              : `linear-gradient(135deg, ${character.colors.secondary || character.colors.glow} 0%, ${character.colors.glow} 50%, ${character.colors.primary} 100%)`,
            backgroundSize: '200% 200%',
            boxShadow: `0 10px 40px ${character.colors.glow}${(beatIntensity ?? 0) > 0.5 ? 'AA' : '70'}, 0 0 0 2px rgba(255,255,255,0.1), inset 0 2px 0 rgba(255,255,255,0.3)`,
            transform: buttonPulse === "play" || ((beatIntensity ?? 0) > 0.7) ? "scale(1.15)" : "scale(1)",
            animation: 'cursed-energy-flow 3s ease infinite',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {/* Glow effect on beat */}
          {(beatIntensity ?? 0) > 0.6 && (
            <div
              className="absolute inset-0 rounded-2xl opacity-70"
              style={{
                background: `radial-gradient(circle, ${character.colors.glow}80, transparent)`,
                animation: "pulse 0.5s ease-out",
              }}
            />
          )}
          
          {isPaused ? (
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next track"
          className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group relative touch-manipulation"
          style={{
            borderColor: buttonPulse === "next" ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.9) : "rgba(255,255,255,0.1)",
            boxShadow: buttonPulse === "next" ? `0 0 20px ${character.colors.glow}60` : "none",
            transform: buttonPulse === "next" ? "scale(1.1)" : "scale(1)",
          }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          onClick={handleRepeatToggle}
          aria-label={`Repeat mode: ${repeatMode}`}
          className={cn(
            "p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 relative touch-manipulation",
            repeatMode !== "off" ? "bg-black/60 border-2" : "bg-black/40 hover:bg-white/10 border border-white/10"
          )}
          style={{
            borderColor: repeatMode !== "off" ? getVisibleBorderColor(character.colors.primary, character.colors.glow, 1) : "rgba(255,255,255,0.1)",
            color: repeatMode !== "off" ? textColor : "rgba(255,255,255,0.7)",
            boxShadow: repeatMode !== "off" ? `0 0 20px ${character.colors.glow}60, inset 0 0 15px ${character.colors.glow}20` : "none",
          }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
          {repeatMode === "track" && (
            <span 
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse" 
              style={{ 
                backgroundColor: character.colors.glow,
                boxShadow: `0 0 10px ${character.colors.glow}`,
              }}
            />
          )}
        </button>

        {/* Volume */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            className="p-3 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:scale-110"
            aria-label="Volume control"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
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
            <div 
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/95 backdrop-blur-md border-2 rounded-xl p-4 shadow-2xl z-50"
              style={{
                borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.7),
                boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px ${character.colors.glow}50`,
              }}
            >
              <div className="flex items-center gap-4">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-28 accent-jujutsu-energy"
                  style={{
                    accentColor: character.colors.glow,
                  }}
                />
                <span 
                  className="text-sm w-8 font-mono font-semibold"
                  style={{ color: textColor }}
                >
                  {volume}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}