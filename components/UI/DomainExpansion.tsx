"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

export function DomainExpansion() {
  const { isDomainExpanding, selectedCharacter } = useSpotifyStore()
  const [show, setShow] = useState(false)
  const [phase, setPhase] = useState<"pre" | "main" | "post">("pre")
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

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
      {/* Background energy surge */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${character.colors.glow}60 0%, ${character.colors.primary}40 30%, transparent 70%)`,
          animation: phase === "main" ? "expandPulse 1.7s ease-out forwards" : "none",
          opacity: phase === "post" ? 0 : 1,
        }}
      />

      {/* Expanding barrier circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-4"
            style={{
              width: "200%",
              height: "200%",
              borderColor: i % 2 === 0 ? character.colors.glow : character.colors.secondary || character.colors.glow,
              opacity: 0,
              animation: phase === "main" 
                ? `expandCircle ${1.5 + i * 0.3}s ease-out ${i * 0.15}s forwards`
                : "none",
              boxShadow: `0 0 30px ${character.colors.glow}, inset 0 0 30px ${character.colors.glow}40`,
            }}
          />
        ))}
      </div>

      {/* Kanji characters burst */}
      {phase === "pre" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {["呪", "術", "式", "領", "域"].map((kanji, i) => (
            <div
              key={kanji}
              className="absolute text-6xl font-black opacity-0"
              style={{
                color: character.colors.glow,
                textShadow: `0 0 40px ${character.colors.glow}, 0 0 80px ${character.colors.glow}`,
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
        className="absolute inset-0 flex flex-col items-center justify-center space-y-8"
        style={{
          opacity: phase === "main" ? 1 : 0,
          transform: phase === "main" ? "scale(1)" : "scale(0.8)",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Domain Expansion text */}
        <div
          className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-widest relative"
          style={{
            color: textColor,
            textShadow: `0 0 40px ${character.colors.glow}, 0 0 80px ${character.colors.glow}, 0 0 120px ${character.colors.glow}80`,
            animation: "textGlow 1s ease-in-out infinite alternate",
          }}
        >
          領域展開
          
          {/* Glitch effect overlay */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              color: character.colors.secondary || character.colors.glow,
              animation: "glitchText 0.3s infinite",
            }}
          >
            領域展開
          </div>
        </div>

        {/* Divider line with particles */}
        <div className="relative w-96 h-2">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent"
            style={{ 
              color: textColor,
              boxShadow: `0 0 20px ${character.colors.glow}`,
            }}
          />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${(i / 11) * 100}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: character.colors.glow,
                boxShadow: `0 0 15px ${character.colors.glow}`,
                animation: `particleBounce 0.6s ease-in-out ${i * 0.05}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Domain name - Japanese */}
        <div
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] relative"
          style={{
            color: character.colors.accent || character.colors.glow || textColor,
            textShadow: `0 0 30px ${character.colors.glow}, 0 0 60px ${character.colors.glow}70`,
            animation: "slideUp 0.8s ease-out 0.3s both",
          }}
        >
          {character.domainJapanese}
          
          {/* Underline animation */}
          <div
            className="absolute -bottom-4 left-0 right-0 h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${character.colors.glow}, transparent)`,
              animation: "expandWidth 1s ease-out 0.5s both",
            }}
          />
        </div>

        {/* Domain name - English */}
        <div
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono tracking-widest uppercase"
          style={{ 
            color: character.colors.secondary || character.colors.glow || textColor,
            textShadow: `0 0 20px ${character.colors.glow}80`,
            animation: "slideUp 0.8s ease-out 0.6s both",
          }}
        >
          {character.domain}
        </div>

        {/* Technique name */}
        <div
          className="text-sm font-mono tracking-[0.3em] uppercase opacity-80"
          style={{ 
            color: character.colors.accent || textColor,
            animation: "fadeInUp 0.6s ease-out 0.9s both",
          }}
        >
          {character.techniqueJapanese} ・ {character.technique}
        </div>
      </div>

      {/* Particle explosion effect */}
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
              className="absolute w-1 h-1 rounded-full opacity-0"
              style={{
                left: "50%",
                top: "50%",
                backgroundColor: i % 3 === 0 ? character.colors.glow : character.colors.secondary || character.colors.glow,
                animation: `explodeParticle ${duration}s ease-out forwards`,
                "--end-x": `${endX}vw`,
                "--end-y": `${endY}vw`,
                boxShadow: `0 0 10px ${character.colors.glow}`,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Shockwave rings */}
      {phase === "main" && [...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            borderColor: character.colors.glow,
            transform: "translate(-50%, -50%)",
            animation: `shockwave 1.5s ease-out ${i * 0.3}s forwards`,
            boxShadow: `0 0 40px ${character.colors.glow}`,
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

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 40px currentColor, 0 0 80px currentColor;
          }
          100% {
            text-shadow: 0 0 60px currentColor, 0 0 120px currentColor, 0 0 180px currentColor;
          }
        }

        @keyframes glitchText {
          0%, 100% {
            transform: translate(0);
            opacity: 0.7;
          }
          25% {
            transform: translate(-3px, 3px);
            opacity: 0.5;
          }
          50% {
            transform: translate(3px, -3px);
            opacity: 0.8;
          }
          75% {
            transform: translate(-2px, -2px);
            opacity: 0.6;
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