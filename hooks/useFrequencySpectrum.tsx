"use client"

import { useEffect, useRef, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { analyzeFrequencySpectrum } from "@/lib/utils/audioAnalysis"
import { loadRustAudio } from "@/lib/wasm/rustAudio"

/**
 * useFrequencySpectrum
 *
 * Analyzes frequency spectrum in real-time from audio segments.
 * Uses Rust WASM when available for faster computation.
 */
export function useFrequencySpectrum() {
  const {
    trackData,
    playbackPosition,
    isPaused,
    setFrequencySpectrum,
  } = useSpotifyStore()
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [rustAnalyzer, setRustAnalyzer] = useState<Awaited<ReturnType<typeof loadRustAudio>>>(null)

  useEffect(() => {
    loadRustAudio().then(setRustAnalyzer)
  }, [])

  useEffect(() => {
    if (!trackData || isPaused || !trackData.segments) {
      setFrequencySpectrum(null)
      return
    }

    const analyze = () => {
      const currentTime = playbackPosition / 1000
      const segment = trackData.segments.find(
        (seg) => currentTime >= seg.start && currentTime < seg.start + seg.duration
      )

      if (segment?.timbre && rustAnalyzer && segment.timbre.length >= 12) {
        // Rust WASM - fast path
        const result = rustAnalyzer.analyze_frequency_spectrum(segment.timbre)
        setFrequencySpectrum({ bass: result.bass, mid: result.mid, treble: result.treble })
      } else {
        // JS fallback
        const spectrum = analyzeFrequencySpectrum(trackData.segments, currentTime)
        setFrequencySpectrum(spectrum)
      }

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    animationFrameRef.current = requestAnimationFrame(analyze)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [trackData, playbackPosition, isPaused, setFrequencySpectrum, rustAnalyzer])
}

