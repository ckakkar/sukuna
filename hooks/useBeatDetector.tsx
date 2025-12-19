"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * useBeatDetector
 * 
 * Detects beats in real-time using Spotify's audio analysis segments
 * and updates the store with beat intensity for visualizations
 */
export function useBeatDetector() {
  const { trackData, playbackPosition, isPaused, bpm, setBeatIntensity, registerBeat } = useSpotifyStore()
  const lastBeatTimeRef = useRef(0)
  const beatIntensityRef = useRef(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!trackData || isPaused) {
      setBeatIntensity(0)
      return
    }

    const detectBeat = () => {
      const currentTime = playbackPosition / 1000 // Convert to seconds
      const currentBPM = bpm || trackData.bpm
      const beatInterval = 60 / currentBPM

      // Find current segment
      const segment = trackData.segments.find(
        (seg) => currentTime >= seg.start && currentTime < seg.start + seg.duration
      )

      if (segment) {
        // Calculate beat timing
        const segmentTime = currentTime - segment.start
        const beatPhase = (segmentTime % beatInterval) / beatInterval

        // Detect beat at the start of each interval
        if (beatPhase < 0.1 && Date.now() - lastBeatTimeRef.current > beatInterval * 800) {
          // Strong beat detected
          const loudness = Math.abs(segment.loudness_max) / 60 // Normalize
          const confidence = segment.confidence
          const intensity = Math.min(loudness * confidence * 2, 1)
          
          beatIntensityRef.current = intensity
          setBeatIntensity(intensity)
          registerBeat()
          lastBeatTimeRef.current = Date.now()
        } else {
          // Decay beat intensity
          beatIntensityRef.current *= 0.92
          setBeatIntensity(Math.max(beatIntensityRef.current, 0))
        }
      } else {
        // No segment, gentle decay
        beatIntensityRef.current *= 0.95
        setBeatIntensity(Math.max(beatIntensityRef.current, 0))
      }

      animationFrameRef.current = requestAnimationFrame(detectBeat)
    }

    animationFrameRef.current = requestAnimationFrame(detectBeat)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [trackData, playbackPosition, isPaused, bpm, setBeatIntensity, registerBeat])
}