"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * useTempoSync
 * 
 * Syncs animation speeds with track tempo
 * Applies tempo-based timing to animations throughout the app
 */
export function useTempoSync() {
  const { trackData, bpm } = useSpotifyStore()
  const tempoRef = useRef(120)

  useEffect(() => {
    if (trackData?.bpm) {
      tempoRef.current = trackData.bpm
    } else if (bpm) {
      tempoRef.current = bpm
    }

    // Apply tempo to CSS custom property for use in animations
    const root = document.documentElement
    const normalizedTempo = tempoRef.current / 120 // Normalize to 120 BPM baseline
    root.style.setProperty("--tempo-multiplier", `${normalizedTempo}`)
    root.style.setProperty("--beat-interval", `${60 / tempoRef.current}s`)

    // Update animation durations based on tempo
    // Faster tempo = faster animations
    root.style.setProperty("--animation-speed", `${normalizedTempo}`)
  }, [trackData?.bpm, bpm])

  return tempoRef.current
}

