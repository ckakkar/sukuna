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
      {/* Phase 1: Inverted Flash (Impact Frame) */}
      {phase === "flash" && (
        <div className="absolute inset-0 bg-white invert animate-flash-invert z-50 mix-blend-difference" />
      )}

      {/* Phase 2: Sketchy Impact Lines */}
      {phase === "lightning" && (
        <div className="absolute inset-0 z-40 bg-white">
          {/* Jagged sketchy lines */}
          <div className="absolute inset-0 bg-[url('/speed-lines.png')] bg-cover opacity-50 contrast-200" />
          <div className="absolute inset-0 border-[40px] border-black clip-path-jagged" />
        </div>
      )}

      {/* Phase 3 & 4: Impact Text (Bold Kanji) */}
      {(phase === "freeze" || phase === "impact") && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div
            className="text-[12rem] sm:text-[16rem] font-black tracking-tighter leading-none"
            style={{
              color: "#000000",
              WebkitTextStroke: "4px white",
              animation: phase === "impact" ? "impact-shake 0.1s cubic-bezier(.36,.07,.19,.97) both" : "none",
              transform: "scale(1.2)",
              filter: "contrast(1.5)",
            }}
          >
            黒閃
          </div>
          {/* Rough ink splatters behind text */}
          <div className="absolute w-[600px] h-[600px] bg-black rounded-full opacity-20 blur-xl -z-10 animate-pulse-fast" />
        </div>
      )}

      <style jsx>{`
        .clip-path-jagged {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%, 5% 25%, 0% 30%, 5% 35%, 0% 40%, 0% 0%);
        }

        @keyframes flash-invert {
            0% { filter: invert(0); }
            50% { filter: invert(1); }
            100% { filter: invert(0); }
        }

        @keyframes impact-shake {
            10%, 90% { transform: translate3d(-4px, 0, 0) scale(1.2); }
            20%, 80% { transform: translate3d(8px, 0, 0) scale(1.2); }
            30%, 50%, 70% { transform: translate3d(-16px, 0, 0) scale(1.2); }
            40%, 60% { transform: translate3d(16px, 0, 0) scale(1.2); }
        }
        
        @keyframes pulse-fast {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

