"use client"

import { useEffect, useState, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  type: 'ink' | 'line' | 'dot'
  rotation: number
  life: number
  maxLife: number
}

export function CursedEnergyParticles() {
  const { beatIntensity } = useSpotifyStore()
  const [particles, setParticles] = useState<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Generate initial ink particles
    const particleCount = 25

    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      type: Math.random() > 0.7 ? 'line' : (Math.random() > 0.5 ? 'ink' : 'dot'),
      rotation: Math.random() * 360,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
    }))
    setParticles(initialParticles)
  }, [])

  useEffect(() => {
    let lastTime = 0
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY
          let newLife = particle.life + 1

          // Beat impact
          const beatKick = (beatIntensity || 0) > 0.6 ? (beatIntensity || 0) * 2 : 1

          // Move particles faster on beat
          if (beatKick > 1) {
            newX += particle.speedX * 2
            newY += particle.speedY * 2
          }

          // Wrap around edges
          if (newX < -10) newX = 110
          if (newX > 110) newX = -10
          if (newY < -10) newY = 110
          if (newY > 110) newY = -10

          // Respawn logic
          if (newLife > particle.maxLife) {
            newLife = 0
            newX = Math.random() * 100
            newY = Math.random() * 100
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            life: newLife,
            rotation: particle.rotation + (particle.type === 'ink' ? 0.2 : 0),
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
  }, [beatIntensity])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute will-animate"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.type === 'line' ? `${particle.size * 4}px` : `${particle.size}px`,
            height: particle.type === 'line' ? '2px' : `${particle.size}px`,
            backgroundColor: '#0a0a0a',
            borderRadius: particle.type === 'dot' ? '50%' : '2px', // Ink shapes aren't perfect circles
            opacity: 0.25,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${1 + (beatIntensity || 0) * 0.2})`,
            clipPath: particle.type === 'ink' ? 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' : 'none', // Rough ink shape
          }}
        />
      ))}

      {/* Manga speed lines on beat */}
      {(beatIntensity || 0) > 0.8 && (
        <div className="absolute inset-0 speed-lines opacity-20" />
      )}
    </div>
  )
}

