"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { analyzeFrequencySpectrum } from "@/lib/utils/audioAnalysis"

/**
 * useFrequencySpectrum
 * 
 * Analyzes frequency spectrum in real-time from audio segments
 * Updates store with bass, mid, and treble levels
 */
export function useFrequencySpectrum() {
  const {
    trackData,
    playbackPosition,
    isPaused,
    setFrequencySpectrum,
  } = useSpotifyStore()
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!trackData || isPaused || !trackData.segments) {
      setFrequencySpectrum(null)
      return
    }

    const analyze = () => {
      const currentTime = playbackPosition / 1000 // Convert to seconds
      const spectrum = analyzeFrequencySpectrum(trackData.segments, currentTime)
      setFrequencySpectrum(spectrum)

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    animationFrameRef.current = requestAnimationFrame(analyze)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [trackData, playbackPosition, isPaused, setFrequencySpectrum])
}

