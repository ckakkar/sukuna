"use client"

import { useRef, useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, hexToRgb } from "@/lib/utils/colorUtils"

export function WaveformVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const {
    trackData,
    playbackPosition,
    playbackDuration,
    frequencySpectrum,
    beatIntensity,
    selectedCharacter,
    isPaused,
  } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (!canvasRef.current || !trackData || isPaused) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const currentTime = playbackPosition / 1000
      const duration = playbackDuration / 1000

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Draw waveform from segments
      if (trackData.segments && trackData.segments.length > 0) {
        const segments = trackData.segments
        const segmentWidth = width / segments.length

        segments.forEach((segment, index) => {
          const x = (index / segments.length) * width
          const segmentTime = segment.start
          const isCurrent = currentTime >= segmentTime && currentTime < segmentTime + segment.duration

          // Calculate amplitude from loudness
          const amplitude = Math.abs(segment.loudness_max) / 60 // Normalize
          const barHeight = amplitude * height * 0.8

          // Color based on frequency spectrum if available
          let color = character.colors.glow
          if (frequencySpectrum && isCurrent) {
            // Mix colors based on frequency bands
            const { bass, mid, treble } = frequencySpectrum
            // Convert hex to RGB for mixing
            const primaryRgb = hexToRgb(character.colors.primary)
            const glowRgb = hexToRgb(character.colors.glow)
            const secondaryRgb = hexToRgb(character.colors.secondary || character.colors.glow)
            
            if (primaryRgb && glowRgb && secondaryRgb) {
              const r = Math.floor(primaryRgb.r * bass + glowRgb.r * mid + secondaryRgb.r * treble)
              const g = Math.floor(primaryRgb.g * bass + glowRgb.g * mid + secondaryRgb.g * treble)
              const b = Math.floor(primaryRgb.b * bass + glowRgb.b * mid + secondaryRgb.b * treble)
              color = `rgb(${r}, ${g}, ${b})`
            }
          }

          // Draw waveform bar
          ctx.fillStyle = isCurrent
            ? character.colors.glow
            : `${character.colors.glow}40`
          ctx.fillRect(x, height / 2 - barHeight / 2, segmentWidth * 0.8, barHeight)

          // Beat pulse effect
          if (isCurrent && beatIntensity && beatIntensity > 0.5) {
            ctx.fillStyle = character.colors.glow
            ctx.globalAlpha = beatIntensity
            ctx.fillRect(x, height / 2 - barHeight / 2, segmentWidth * 0.8, barHeight)
            ctx.globalAlpha = 1
          }
        })
      }

      // Draw progress indicator
      if (duration > 0) {
        const progress = (currentTime / duration) * width
        ctx.strokeStyle = character.colors.glow
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(progress, 0)
        ctx.lineTo(progress, height)
        ctx.stroke()

        // Glow effect on progress line
        ctx.shadowBlur = 10
        ctx.shadowColor = character.colors.glow
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    // Set canvas size
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    trackData,
    playbackPosition,
    playbackDuration,
    frequencySpectrum,
    beatIntensity,
    character,
    isPaused,
  ])

  if (!trackData) return null

  return (
    <div className="w-full h-20 sm:h-24 rounded-lg overflow-hidden glass-modern">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${character.colors.primary}10, ${character.colors.glow}05)`,
        }}
      />
    </div>
  )
}

