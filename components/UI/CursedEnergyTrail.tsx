
"use client"

import { useEffect, useRef, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

interface TrailPoint {
  x: number
  y: number
  timestamp: number
  opacity: number
  width: number
}

interface CursorState {
  x: number
  y: number
  targetX: number
  targetY: number
  hoverTarget: "default" | "button" | "character" | null
}

export function CursedEnergyTrail() {
  const { beatIntensity } = useSpotifyStore()
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

  // Calculate brush width based on speed
  const getBrushWidth = (speed: number) => {
    // Faster = Thinner, Slower = Thicker (like a real brush)
    const baseWidth = 8
    const minWidth = 2
    return Math.max(minWidth, baseWidth - speed * 0.2)
  }

  useEffect(() => {
    // Magnetic cursor effect - smooth interpolation
    const updateCursor = () => {
      setCursor((prev) => {
        const dx = prev.targetX - prev.x
        const dy = prev.targetY - prev.y
        return {
          ...prev,
          x: prev.x + dx * 0.2, // Snappier ink feel
          y: prev.y + dy * 0.2,
        }
      })
      animationFrameRef.current = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()

      // Calculate speed
      let speed = 0
      if (lastMousePosRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x
        const dy = e.clientY - lastMousePosRef.current.y
        speed = Math.sqrt(dx * dx + dy * dy)
      }

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
        width: getBrushWidth(speed),
      }

      setTrail((prev) => {
        // Keep points short for ink trail feel
        const filtered = prev.filter((p) => now - p.timestamp < 300)
        return [...filtered, newPoint].slice(-40)
      })

      // Update cursor target
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

    // Animate trail fade / ink drying
    const animate = () => {
      setTrail((prev) => {
        const now = performance.now()
        return prev
          .map((point) => ({
            ...point,
            // Ink dries/fades
            opacity: Math.max(0, 1 - (now - point.timestamp) / 300),
          }))
          .filter((point) => point.opacity > 0)
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    animationFrameRef.current = requestAnimationFrame(updateCursor)

    const trailInterval = setInterval(animate, 16)

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

  // Generate SVG path for smooth ink stroke
  const getPath = (points: TrailPoint[]) => {
    if (points.length < 2) return ""

    // Simple line connection for now, could be catmull-rom splines for smoother curves
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`
    }
    return d
  }

  // We render individual segments to support variable width (simulated pressure)
  // Or simply render points as circles for a "splatter brush" look

  return (
    <div className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply">
      <svg className="absolute inset-0 w-full h-full">
        {/* Ink Trail */}
        {trail.map((point, index) => {
          if (index === 0) return null
          const prev = trail[index - 1]
          return (
            <line
              key={point.timestamp}
              x1={prev.x}
              y1={prev.y}
              x2={point.x}
              y2={point.y}
              stroke="black"
              strokeWidth={point.width}
              strokeLinecap="round"
              opacity={point.opacity}
            />
          )
        })}
      </svg>

      {/* Custom Ink Cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
          transition: "none",
        }}
      >
        {/* Cursor nib */}
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: cursor.hoverTarget === "button" ? "8px" : "12px",
            height: cursor.hoverTarget === "button" ? "8px" : "12px",
            transition: "all 0.1s ease-out",
            // Simulating a fountain pen tip angle
            transform: 'rotate(-45deg) scale(1, 0.8)'
          }}
        />

        {/* Ink splatter on click/beat could be added here */}
      </div>
    </div>
  )
}

