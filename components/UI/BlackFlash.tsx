"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

export function BlackFlash() {
  const { beatIntensity, selectedCharacter } = useSpotifyStore()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"flash" | "lightning" | "freeze" | "impact" | "shake" | null>(null)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    // Trigger black flash on high beat intensity peaks
    if (beatIntensity && beatIntensity > 0.85 && !isActive) {
      setIsActive(true)
      setPhase("flash")

      // Phase 1: Black flash (1 frame ~16ms)
      const flashTimer = setTimeout(() => {
        setPhase("lightning")
      }, 16)

      // Phase 2: White lightning cracks
      const lightningTimer = setTimeout(() => {
        setPhase("freeze")
      }, 100)

      // Phase 3: Freeze frame (3 frames ~48ms)
      const freezeTimer = setTimeout(() => {
        setPhase("impact")
      }, 48)

      // Phase 4: Impact text appears
      const impactTimer = setTimeout(() => {
        setPhase("shake")
      }, 300)

      // Phase 5: Screen shake
      const shakeTimer = setTimeout(() => {
        setPhase(null)
        setIsActive(false)
      }, 500)

      return () => {
        clearTimeout(flashTimer)
        clearTimeout(lightningTimer)
        clearTimeout(freezeTimer)
        clearTimeout(impactTimer)
        clearTimeout(shakeTimer)
      }
    }
  }, [beatIntensity, isActive])

  if (!isActive || !phase) return null

  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{
        transform: phase === "shake" ? "translate(2px, -2px)" : "translate(0, 0)",
        transition: phase === "shake" ? "transform 0.05s linear" : "none",
      }}
    >
      {/* Phase 1: Black flash */}
      {phase === "flash" && (
        <div className="absolute inset-0 bg-black animate-black-flash" />
      )}

      {/* Phase 2: White lightning cracks */}
      {phase === "lightning" && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const length = 30 + Math.random() * 20
            const startX = 50 + Math.cos(angle) * 20
            const startY = 50 + Math.sin(angle) * 20
            const endX = startX + Math.cos(angle) * length
            const endY = startY + Math.sin(angle) * length

            return (
              <svg
                key={i}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: 0.9,
                  animation: `lightning-crack 0.2s ease-out ${i * 0.02}s forwards`,
                }}
              >
                <line
                  x1={`${startX}%`}
                  y1={`${startY}%`}
                  x2={`${endX}%`}
                  y2={`${endY}%`}
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#glow)"
                />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            )
          })}
        </div>
      )}

      {/* Phase 3 & 4: Impact text */}
      {(phase === "freeze" || phase === "impact") && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-8xl sm:text-9xl md:text-[12rem] font-black tracking-widest"
            style={{
              color: "#ffffff",
              textShadow: `0 0 40px #ffffff, 0 0 80px #ffffff, 0 0 120px ${character.colors.glow}`,
              animation: phase === "impact" ? "impact-zoom 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : "none",
              transform: phase === "freeze" ? "scale(0.8)" : "scale(1)",
              opacity: phase === "freeze" ? 0 : 1,
            }}
          >
            黒閃
          </div>
        </div>
      )}

      {/* Particle explosion */}
      {phase === "impact" && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2
            const distance = 20 + Math.random() * 30
            const endX = Math.cos(angle) * distance
            const endY = Math.sin(angle) * distance

            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: `0 0 10px #ffffff, 0 0 20px ${character.colors.glow}`,
                  animation: `particle-explode 0.4s ease-out forwards`,
                  transform: `translate(-50%, -50%)`,
                  "--end-x": `${endX}vw`,
                  "--end-y": `${endY}vw`,
                } as React.CSSProperties}
              />
            )
          })}
        </div>
      )}

      {/* Chromatic aberration overlay */}
      {phase === "shake" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, 
              rgba(255, 0, 0, 0.1) 0%, 
              transparent 50%, 
              rgba(0, 0, 255, 0.1) 100%)`,
            mixBlendMode: "screen",
            animation: "chromatic-aberration 0.2s ease-out",
          }}
        />
      )}

      <style jsx>{`
        @keyframes black-flash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes lightning-crack {
          0% {
            opacity: 0;
            stroke-dasharray: 0 1000;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
            stroke-dasharray: 1000 0;
          }
        }

        @keyframes impact-zoom {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes particle-explode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--end-x)),
              calc(-50% + var(--end-y))
            ) scale(1.5);
          }
        }

        @keyframes chromatic-aberration {
          0% {
            transform: translateX(-5px);
            opacity: 0.3;
          }
          50% {
            transform: translateX(5px);
            opacity: 0.5;
          }
          100% {
            transform: translateX(0);
            opacity: 0;
          }
        }

        .animate-black-flash {
          animation: black-flash 0.016s ease-out;
        }
      `}</style>
    </div>
  )
}

