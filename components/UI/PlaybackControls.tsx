"use client"

import { useSpotifyStore } from "@/store/useSpotifyStore"
import { useEffect, useState, useRef, useCallback } from "react"
import { setVolume, seekToPosition, setRepeatMode, setShuffleMode } from "@/lib/spotify-actions"
import { checkSavedTrack, saveTrack, removeSavedTrack } from "@/lib/spotify-actions"
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
    volume,
    isLiked,
    currentTrack,
    beatIntensity,
    setRepeatMode: setStoreRepeatMode,
    setShuffleMode: setStoreShuffleMode,
    setVolume: setStoreVolume,
    setIsLiked: setStoreIsLiked,
  } = useSpotifyStore()

  const [canControl, setCanControl] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)
  const [buttonPulse, setButtonPulse] = useState<string | null>(null)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [isVolumeHovered, setIsVolumeHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    setCanControl(!!accessToken && !!deviceId)
  }, [accessToken, deviceId])

  useEffect(() => {
    if (!isSeeking && playbackPosition !== undefined) {
      setSeekPosition(playbackPosition)
    }
  }, [playbackPosition, isSeeking])

  // Check if current track is liked
  useEffect(() => {
    if (currentTrack?.id && accessToken) {
      checkSavedTrack(currentTrack.id, accessToken).then(setStoreIsLiked)
    } else {
      setStoreIsLiked(false)
    }
  }, [currentTrack?.id, accessToken, setStoreIsLiked])



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

  const handleVolumeChange = useCallback(async (newVolume: number, saveToStorage = true) => {
    if (!accessToken || !deviceId) return
    setStoreVolume(newVolume)

    if (saveToStorage) {
      localStorage.setItem('spotify-volume', newVolume.toString())
    }

    try {
      if (playerInstance) {
        await playerInstance.setVolume(newVolume / 100)
      }
      await setVolume(newVolume, deviceId, accessToken)
    } catch (error) {
      console.error("Error setting volume:", error)
    }

    // Reset hover timeout
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    volumeTimeoutRef.current = setTimeout(() => {
      setIsVolumeHovered(false)
    }, 2000)
  }, [accessToken, deviceId, playerInstance, setStoreVolume])

  // Sync volume from player on mount
  useEffect(() => {
    if (playerInstance && accessToken) {
      playerInstance.getVolume().then((vol: number) => {
        setStoreVolume(Math.round(vol * 100))
      }).catch(() => {
        // Fallback to stored volume
        const savedVolume = localStorage.getItem('spotify-volume')
        if (savedVolume) {
          const vol = parseInt(savedVolume, 10)
          setStoreVolume(vol)
          handleVolumeChange(vol, false)
        }
      })
    }
  }, [playerInstance, accessToken, setStoreVolume, handleVolumeChange])

  // Handle volume wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isVolumeHovered && e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -5 : 5
        const newVolume = Math.max(0, Math.min(100, volume + delta))
        handleVolumeChange(newVolume)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isVolumeHovered, volume, handleVolumeChange])

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

  const handleLikeToggle = async () => {
    if (!currentTrack?.id || !accessToken || isLoadingLike) return

    setIsLoadingLike(true)
    try {
      if (isLiked) {
        const success = await removeSavedTrack(currentTrack.id, accessToken)
        if (success) {
          setStoreIsLiked(false)
        }
      } else {
        const success = await saveTrack(currentTrack.id, accessToken)
        if (success) {
          setStoreIsLiked(true)
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoadingLike(false)
    }
  }

  if (!canControl) return null

  const progress = playbackDuration > 0 ? (seekPosition / playbackDuration) * 100 : 0

  return (
    <div className="w-full pointer-events-auto max-w-2xl px-2 sm:px-0">
      {/* Progress Bar - Flat Ink Style */}
      {playbackDuration > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <span className="text-black bg-white px-1 border border-black">{formatTime(seekPosition)}</span>
            <span className="text-black bg-white px-1 border border-black">{formatTime(playbackDuration)}</span>
          </div>

          <div className="relative group h-4">
            {/* Track background */}
            <div
              className="absolute inset-0 bg-white border-2 border-black"
            >
              {/* Pattern texture overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />

              {/* Progress fill - Solid Black */}
              <div
                className="h-full bg-black transition-all duration-100 ease-linear relative"
                style={{ width: `${progress}%` }}
              >
                {/* Diagonal stripe pattern for active bar */}
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)' }}
                />
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
              aria-label="Seek position"
            />
          </div>
        </div>
      )}

      {/* Controls - Manga Panel Buttons */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 relative bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

        {/* Like Button */}
        {currentTrack && (
          <button
            onClick={handleLikeToggle}
            disabled={isLoadingLike}
            className={cn(
              "p-2 border-2 border-black transition-transform active:scale-95",
              isLiked ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            )}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            {isLiked ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            )}
          </button>
        )}

        {/* Shuffle */}
        <button
          onClick={handleShuffleToggle}
          className={cn(
            "p-2 border-2 border-black transition-transform active:scale-95",
            shuffleMode ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
          )}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
        </button>

        {/* Previous */}
        <button
          onClick={handlePrevious}
          className="p-3 border-2 border-black bg-white text-black hover:bg-gray-100 active:bg-black active:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
        </button>

        {/* Play/Pause - Larger Impact Button */}
        <button
          onClick={handlePlayPause}
          className="p-4 border-2 border-black bg-black text-white hover:bg-gray-900 active:scale-95 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
        >
          {isPaused ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          className="p-3 border-2 border-black bg-white text-black hover:bg-gray-100 active:bg-black active:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
        </button>

        {/* Repeat */}
        <button
          onClick={handleRepeatToggle}
          className={cn(
            "p-2 border-2 border-black transition-transform active:scale-95",
            repeatMode !== "off" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
          )}
        >
          {repeatMode === "track" ? (
            <div className="relative">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
              <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-white text-black border border-black px-0.5 rounded-full">1</span>
            </div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
          )}
        </button>

        {/* Volume */}
        <div
          className="relative flex items-center group"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <button
            onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
            className="p-2 border-2 border-black bg-white text-black hover:bg-gray-100"
          >
            {volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
            )}
          </button>

          {/* Pop-up vertical volume slider for cleaner look */}
          <div className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white border-2 border-black transition-all duration-200 shadow-lg",
            isVolumeHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="h-24 w-4 appearance-none slider-vertical bg-transparent"
              style={{ writingMode: 'vertical-lr', WebkitAppearance: 'slider-vertical' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}