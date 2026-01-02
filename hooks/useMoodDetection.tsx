"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { detectMood } from "@/lib/utils/audioAnalysis"

/**
 * useMoodDetection
 * 
 * Detects mood from track data and updates store
 * Triggers visual changes based on mood
 */
export function useMoodDetection() {
  const { trackData, setAudioMood } = useSpotifyStore()

  useEffect(() => {
    if (!trackData) {
      setAudioMood(null)
      return
    }

    const mood = detectMood(trackData)
    setAudioMood(mood)
  }, [trackData, setAudioMood])
}

