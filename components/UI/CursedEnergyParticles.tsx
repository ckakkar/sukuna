"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export function CursedEnergyParticles() {
  const { selectedCharacter, beatIntensity, intensity } = useSpotifyStore()
  const [particles, setParticles] = useState<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const character = useMemo(() => CHARACTERS[selectedCharacter], [selectedCharacter])

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 2
      const distance = Math.random() * 100
      return {
        id: i,
        x: 50 + Math.cos(angle) * distance,
        y: 50 + Math.sin(angle) * distance,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: character.colors.glow,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 200,
      }
    })
    setParticles(initialParticles)
  }, [selectedCharacter, character.colors.glow])

  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY
          let newLife = particle.life + 1

          // Wrap around edges
          if (newX < 0) newX = 100
          if (newX > 100) newX = 0
          if (newY < 0) newY = 100
          if (newY > 100) newY = 0

          // Reset life when max is reached
          if (newLife > particle.maxLife) {
            newLife = 0
            newX = 50 + (Math.random() - 0.5) * 20
            newY = 50 + (Math.random() - 0.5) * 20
          }

          // Beat intensity affects speed and size
          const beatMultiplier = beatIntensity ? 1 + beatIntensity * 0.5 : 1
          const intensityMultiplier = intensity ? 1 + intensity * 0.3 : 1

          return {
            ...particle,
            x: newX,
            y: newY,
            life: newLife,
            speedX: particle.speedX * (1 + (beatIntensity ?? 0) * 0.1),
            speedY: particle.speedY * (1 + (beatIntensity ?? 0) * 0.1),
            size: particle.size * beatMultiplier,
            opacity: Math.min(
              1,
              particle.opacity * intensityMultiplier * (1 + (beatIntensity ?? 0) * 0.3)
            ),
          }
        })
      )

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [beatIntensity, intensity])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float will-animate"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}80`,
            filter: `blur(${particle.size * 0.5}px)`,
            transform: `translate(-50%, -50%) scale(${1 + (beatIntensity ?? 0) * 0.3})`,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
          }}
        />
      ))}
    </div>
  )
}

