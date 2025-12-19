"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"

export function DomainExpansion() {
  const { isDomainExpanding, selectedCharacter, currentTrack } = useSpotifyStore()
  const [show, setShow] = useState(false)
  const character = CHARACTERS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    if (isDomainExpanding) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isDomainExpanding])

  if (!show) return null

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Expanding circle effect */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${character.colors.glow}40 0%, transparent 70%)`,
          animation: "expandDomain 3s ease-out forwards",
        }}
      >
        <div
          className="absolute w-[200%] h-[200%] rounded-full border-4 opacity-0"
          style={{
            borderColor: textColor,
            animation: "expandCircle 2s ease-out forwards",
          }}
        />
        <div
          className="absolute w-[150%] h-[150%] rounded-full border-2 opacity-0"
          style={{
            borderColor: character.colors.secondary || character.colors.glow,
            animation: "expandCircle 2s ease-out 0.2s forwards",
          }}
        />
        <div
          className="absolute w-[100%] h-[100%] rounded-full border-2 opacity-0"
          style={{
            borderColor: character.colors.accent || character.colors.glow,
            animation: "expandCircle 2s ease-out 0.4s forwards",
          }}
        />
      </div>

      {/* Domain text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 opacity-0 animate-fadeInOut">
        <div
          className="text-8xl font-black tracking-widest"
          style={{
            color: textColor,
            textShadow: `0 0 30px ${character.colors.glow}, 0 0 60px ${character.colors.glow}`,
          }}
        >
          領域展開
        </div>
        <div className="h-1 w-64 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
          style={{ color: textColor }}
        />
        <div
          className="text-5xl font-bold tracking-[0.3em]"
          style={{
            color: character.colors.accent || character.colors.glow || textColor,
            textShadow: `0 0 20px ${character.colors.glow}`,
          }}
        >
          {character.domainJapanese}
        </div>
        <div
          className="text-2xl font-mono tracking-widest"
          style={{ color: character.colors.secondary || character.colors.glow || textColor }}
        >
          {character.domain}
        </div>
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: character.colors.glow || textColor,
              animation: `particle 2s ease-out ${i * 0.05}s forwards`,
              boxShadow: `0 0 10px ${character.colors.glow}`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes expandDomain {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        @keyframes expandCircle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
          70% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        @keyframes particle {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
                ${Math.random() * 200 - 100}px,
                ${Math.random() * 200 - 100}px
              )
              scale(1.5);
          }
        }
      `}</style>
    </div>
  )
}
