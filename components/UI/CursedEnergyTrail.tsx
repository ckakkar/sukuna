"use client"

import { useEffect, useRef, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

interface TrailPoint {
  x: number
  y: number
  timestamp: number
  opacity: number
}

export function CursedEnergyTrail() {
  const { selectedCharacter, beatIntensity } = useSpotifyStore()
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
        opacity: 1,
      }

      setTrail((prev) => {
        // Keep only recent points (last 20 points)
        const filtered = prev.filter((p) => now - p.timestamp < 500)
        return [...filtered, newPoint].slice(-20)
      })

      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      setTrail([])
      lastMousePosRef.current = null
    }

    // Animate trail fade
    const animate = () => {
      setTrail((prev) => {
        const now = performance.now()
        return prev
          .map((point) => ({
            ...point,
            opacity: Math.max(0, 1 - (now - point.timestamp) / 500),
          }))
          .filter((point) => point.opacity > 0)
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [beatIntensity])

  if (trail.length < 2) return null

  const glowIntensity = 0.5 + (beatIntensity ?? 0) * 0.5

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`trail-gradient-${selectedCharacter}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={character.colors.glow} stopOpacity="0.8" />
            <stop offset="50%" stopColor={character.colors.primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={character.colors.secondary} stopOpacity="0.4" />
          </linearGradient>
          <filter id={`glow-${selectedCharacter}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {trail.map((point, index) => {
          if (index === 0) return null
          const prevPoint = trail[index - 1]
          const distance = Math.sqrt(
            Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
          )
          const size = Math.min(8, Math.max(2, distance * 0.1)) * (1 + (beatIntensity ?? 0) * 0.3)

          return (
            <circle
              key={`${point.timestamp}-${index}`}
              cx={point.x}
              cy={point.y}
              r={size}
              fill={`url(#trail-gradient-${selectedCharacter})`}
              opacity={point.opacity * glowIntensity}
              filter={`url(#glow-${selectedCharacter})`}
              style={{
                transition: "opacity 0.1s ease-out",
              }}
            />
          )
        })}
        {/* Connect trail points with lines */}
        {trail.map((point, index) => {
          if (index === 0) return null
          const prevPoint = trail[index - 1]
          const midOpacity = (point.opacity + prevPoint.opacity) / 2

          return (
            <line
              key={`line-${point.timestamp}-${index}`}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke={`url(#trail-gradient-${selectedCharacter})`}
              strokeWidth={2}
              opacity={midOpacity * glowIntensity * 0.5}
              style={{
                transition: "opacity 0.1s ease-out",
              }}
            />
          )
        })}
      </svg>
      {/* Energy particles that follow cursor */}
      {lastMousePosRef.current && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: lastMousePosRef.current.x,
            top: lastMousePosRef.current.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: character.colors.glow,
              boxShadow: `0 0 ${8 + (beatIntensity ?? 0) * 12}px ${character.colors.glow}`,
              opacity: 0.8,
            }}
          />
        </div>
      )}
    </div>
  )
}

