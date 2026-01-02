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

interface CursorState {
  x: number
  y: number
  targetX: number
  targetY: number
  hoverTarget: "default" | "button" | "character" | null
}

export function CursedEnergyTrail() {
  const { selectedCharacter, beatIntensity } = useSpotifyStore()
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    hoverTarget: null,
  })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    // Magnetic cursor effect - smooth interpolation
    const updateCursor = () => {
      setCursor((prev) => {
        const dx = prev.targetX - prev.x
        const dy = prev.targetY - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Magnetic strength based on hover target
        const magneticStrength = prev.hoverTarget === "button" ? 0.15 : prev.hoverTarget === "character" ? 0.25 : 0.05
        
        return {
          ...prev,
          x: prev.x + dx * magneticStrength,
          y: prev.y + dy * magneticStrength,
        }
      })
      animationFrameRef.current = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      
      // Detect hover target
      const target = e.target as HTMLElement
      const isButton = target.closest("button") || target.closest("[data-button]")
      const isCharacter = target.closest("[data-character]") || target.closest("[data-character-selector]")
      
      let hoverTarget: "default" | "button" | "character" | null = null
      if (isCharacter) hoverTarget = "character"
      else if (isButton) hoverTarget = "button"
      else hoverTarget = "default"

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

      // Update cursor target (magnetic effect)
      setCursor((prev) => ({
        ...prev,
        targetX: e.clientX,
        targetY: e.clientY,
        hoverTarget,
      }))

      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      setTrail([])
      lastMousePosRef.current = null
      setCursor((prev) => ({ ...prev, hoverTarget: null }))
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
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    animationFrameRef.current = requestAnimationFrame(updateCursor)
    
    // Also animate trail
    const trailInterval = setInterval(animate, 16) // ~60fps

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (trailInterval) {
        clearInterval(trailInterval)
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
      {/* Custom cursor with magnetic effect and hover states */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
          transition: "none", // Smooth but not CSS transition
        }}
      >
        {/* Cursor orb - changes size based on hover */}
        <div
          className="absolute rounded-full"
          style={{
            width: cursor.hoverTarget === "button" ? "32px" : cursor.hoverTarget === "character" ? "48px" : "16px",
            height: cursor.hoverTarget === "button" ? "32px" : cursor.hoverTarget === "character" ? "48px" : "16px",
            background: `radial-gradient(circle, ${character.colors.glow}, ${character.colors.primary})`,
            boxShadow: `0 0 ${cursor.hoverTarget === "character" ? 30 : cursor.hoverTarget === "button" ? 20 : 10}px ${character.colors.glow}`,
            opacity: 0.9,
            transition: "width 0.2s ease-out, height 0.2s ease-out",
          }}
        />
        
        {/* Technique icon on character hover */}
        {cursor.hoverTarget === "character" && (
          <div
            className="absolute -inset-4 flex items-center justify-center text-white text-xs font-bold"
            style={{
              textShadow: `0 0 10px ${character.colors.glow}`,
            }}
          >
            術
          </div>
        )}
        
        {/* Energy particles around cursor */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: "4px",
              height: "4px",
              background: character.colors.glow,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${(i * 60)}deg) translateY(${cursor.hoverTarget === "character" ? 30 : 20}px)`,
              opacity: 0.6,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
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

