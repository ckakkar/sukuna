"use client"

import { useRef, useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

export function WaveformVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const {
    trackData,
    playbackPosition,
    playbackDuration,
    beatIntensity,
    isPaused,
  } = useSpotifyStore()

  useEffect(() => {
    if (!canvasRef.current || !trackData || isPaused) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      // Need to account for pixel ratio in drawing coords if we scaled context,
      // but simpler to just use canvas dimensions directly relative to logic.
      // We will reset transform to ensure clean frame.
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      // Ensure canvas size matches display size
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
      }

      const width = rect.width
      const height = rect.height
      const currentTime = playbackPosition / 1000

      // Clear canvas with paper color (or transparent if parent handles bg)
      ctx.clearRect(0, 0, width, height)

      // Add noise texture overlay (simulated)
      if (Math.random() > 0.8) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`
        ctx.fillRect(0, 0, width, height)
      }

      // Draw waveform from segments
      if (trackData.segments && trackData.segments.length > 0) {
        const segments = trackData.segments
        // Limit number of bars for cleaner look
        const barCount = Math.floor(width / 6)
        const segmentStep = Math.ceil(segments.length / barCount)

        for (let i = 0; i < barCount; i++) {
          const segmentIndex = i * segmentStep
          if (segmentIndex >= segments.length) break

          const segment = segments[segmentIndex]

          // Calculate amplitude
          let amplitude = Math.abs(segment.loudness_max) / 60

          // Beat reaction
          if (beatIntensity && beatIntensity > 0.5) {
            amplitude *= (1 + (beatIntensity - 0.5))
          }

          const barHeight = amplitude * height * 0.8
          const x = i * 6
          const y = (height - barHeight) / 2

          // Current position playhead logic
          const segmentTime = segment.start
          const isPast = currentTime > segmentTime

          ctx.fillStyle = isPast ? "#0a0a0a" : "#d4d4d4"

          // Draw ragged/ink bar
          // Add slight random offset for hand-drawn feel
          const xOffset = (Math.random() - 0.5) * 1
          const hOffset = (Math.random() - 0.5) * 2

          ctx.fillRect(x + xOffset, y + hOffset, 4, barHeight)
        }
      }

      // Playhead Line
      /* 
      const progress = playbackDuration > 0 ? (playbackPosition / playbackDuration) * width : 0
      ctx.strokeStyle = "#0a0a0a"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progress, 0)
      ctx.lineTo(progress, height)
      ctx.stroke() 
      */

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    trackData,
    playbackPosition,
    playbackDuration,
    beatIntensity,
    isPaused,
  ])

  if (!trackData) return null

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  )
}

