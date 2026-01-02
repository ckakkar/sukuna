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
        // Enhanced beat detection using multiple factors
        const segmentTime = currentTime - segment.start
        const beatPhase = (segmentTime % beatInterval) / beatInterval

        // Calculate beat strength from multiple factors
        const loudness = Math.abs(segment.loudness_max) / 60 // Normalize to 0-1
        const confidence = segment.confidence
        const timbreEnergy = segment.timbre.reduce((sum, val) => sum + Math.abs(val), 0) / segment.timbre.length
        const normalizedTimbre = Math.min(timbreEnergy / 10, 1) // Normalize timbre energy

        // Enhanced intensity calculation
        const baseIntensity = loudness * confidence
        const timbreBoost = normalizedTimbre * 0.3
        const phaseBoost = beatPhase < 0.15 ? (1 - beatPhase / 0.15) * 0.2 : 0
        
        const intensity = Math.min((baseIntensity + timbreBoost + phaseBoost) * 1.5, 1)

        // Detect beat with improved timing
        const timeSinceLastBeat = Date.now() - lastBeatTimeRef.current
        const minBeatInterval = beatInterval * 700 // Slightly more lenient

        if (beatPhase < 0.15 && timeSinceLastBeat > minBeatInterval && intensity > 0.3) {
          // Strong beat detected
          beatIntensityRef.current = intensity
          setBeatIntensity(intensity)
          registerBeat()
          lastBeatTimeRef.current = Date.now()
        } else {
          // Smooth decay with momentum
          const decayRate = intensity > 0.5 ? 0.88 : 0.92 // Faster decay for high intensity
          beatIntensityRef.current *= decayRate
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