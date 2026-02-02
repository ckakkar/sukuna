"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { cn } from "@/lib/utils/cn"

export function DomainExpansion() {
  const { isDomainExpanding, selectedCharacter, songDomainExpansionName } = useSpotifyStore()
  const [show, setShow] = useState(false)
  const [phase, setPhase] = useState<"pre" | "main" | "post">("pre")
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (isDomainExpanding) {
      setShow(true)
      setPhase("pre")
      
      // Phase 1: Pre-expansion (0-800ms)
      const preTimer = setTimeout(() => setPhase("main"), 800)
      
      // Phase 2: Main expansion (800-2500ms)
      const mainTimer = setTimeout(() => setPhase("post"), 2500)
      
      // Phase 3: Fade out (2500-3000ms)
      const endTimer = setTimeout(() => {
        setShow(false)
        setPhase("pre")
      }, 3000)
      
      return () => {
        clearTimeout(preTimer)
        clearTimeout(mainTimer)
        clearTimeout(endTimer)
      }
    }
  }, [isDomainExpanding])

  if (!show) return null

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Background - manga ink wash */}
      <div
        className="absolute inset-0 bg-manga-ink/20"
        style={{
          animation: phase === "main" ? "expandPulse 1.7s ease-out forwards" : "none",
          opacity: phase === "post" ? 0 : 1,
        }}
      />

      {/* Expanding barrier circles - manga ink rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-4 border-manga-ink"
            style={{
              width: "200%",
              height: "200%",
              opacity: 0,
              animation: phase === "main" 
                ? `expandCircle ${1.5 + i * 0.3}s ease-out ${i * 0.15}s forwards`
                : "none",
            }}
          />
        ))}
      </div>

      {/* Kanji characters burst - manga style */}
      {phase === "pre" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {["呪", "術", "式", "領", "域"].map((kanji, i) => (
            <div
              key={kanji}
              className="absolute text-6xl font-jp font-black opacity-0 text-manga-ink"
              style={{
                animation: `burstKanji 0.8s ease-out ${i * 0.1}s forwards`,
                transform: `rotate(${i * 72}deg) translateY(-100px)`,
              }}
            >
              {kanji}
            </div>
          ))}
        </div>
      )}

      {/* Main domain text */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center space-y-8 will-animate"
        style={{
          opacity: phase === "main" ? 1 : 0,
          transform: phase === "main" ? "scale(1)" : "scale(0.8)",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Domain Expansion text */}
        <div
          className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-manga font-black tracking-widest relative text-manga-ink"
          style={{
            textShadow: "4px 4px 0px #d4d4d4, 8px 8px 0px #a3a3a3",
            WebkitTextStroke: "2px #0a0a0a",
          }}
        >
          領域展開
          
        </div>

        {/* Divider line - manga ink */}
        <div className="relative w-96 h-2">
          <div className="absolute inset-0 bg-manga-ink" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-manga-paper border-2 border-manga-ink"
              style={{
                left: `${(i / 11) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                animation: `particleBounce 0.6s ease-in-out ${i * 0.05}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Domain name - Japanese */}
        <div
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-jp font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] relative text-manga-ink"
          style={{ animation: "slideUp 0.8s ease-out 0.3s both" }}
        >
          {character.domainJapanese}
          
          {/* Underline */}
          <div
            className="absolute -bottom-4 left-0 right-0 h-1 bg-manga-ink"
            style={{ animation: "expandWidth 1s ease-out 0.5s both" }}
          />
        </div>

        {/* Domain name - English */}
        <div
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono tracking-widest uppercase text-manga-ink/90"
          style={{ animation: "slideUp 0.8s ease-out 0.6s both" }}
        >
          {songDomainExpansionName || character.domain}
        </div>

        {/* Technique name */}
        <div
          className="text-sm font-mono tracking-[0.3em] uppercase text-manga-ink/80"
          style={{ animation: "fadeInUp 0.6s ease-out 0.9s both" }}
        >
          {character.techniqueJapanese} ・ {character.technique}
        </div>
      </div>

      {/* Manga ink particle explosion */}
      <div className="absolute inset-0">
        {phase === "main" && [...Array(60)].map((_, i) => {
          const angle = (i / 60) * Math.PI * 2
          const distance = 50 + Math.random() * 50
          const duration = 1.5 + Math.random() * 0.5
          const endX = Math.cos(angle) * distance
          const endY = Math.sin(angle) * distance
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-0 bg-manga-ink"
              style={{
                left: "50%",
                top: "50%",
                animation: `explodeParticle ${duration}s ease-out forwards`,
                "--end-x": `${endX}vw`,
                "--end-y": `${endY}vw`,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Shockwave rings - manga ink */}
      {phase === "main" && [...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-manga-ink"
          style={{
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%)",
            animation: `shockwave 1.5s ease-out ${i * 0.3}s forwards`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes expandPulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2.5);
          }
        }

        @keyframes expandCircle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          30% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes burstKanji {
          0% {
            opacity: 0;
            transform: rotate(var(--rotation, 0deg)) translateY(0) scale(0.5);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotation, 0deg)) translateY(-200px) scale(1.5);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes particleBounce {
          from {
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        @keyframes explodeParticle {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--end-x)),
              calc(-50% + var(--end-y))
            ) scale(2);
          }
        }

        @keyframes shockwave {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 200vw;
            height: 200vw;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}