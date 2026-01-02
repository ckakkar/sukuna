"use client"

import { useEffect, useState } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

const TECHNIQUE_ANIMATIONS: Record<CharacterType, {
  name: string
  japanese: string
  effect: "cleave" | "blue" | "punch" | "mirror" | "slash" | "swap" | "jackpot" | "blood"
}> = {
  sukuna: { name: "Cleave", japanese: "解", effect: "cleave" },
  gojo: { name: "Blue", japanese: "蒼", effect: "blue" },
  yuji: { name: "Divergent Fist", japanese: "黒閃", effect: "punch" },
  yuta: { name: "Copy", japanese: "模倣", effect: "mirror" },
  toji: { name: "Soul Split Katana", japanese: "天逆鉾", effect: "slash" },
  todo: { name: "Boogie Woogie", japanese: "不義遊戯", effect: "swap" },
  kinjihakari: { name: "Jackpot", japanese: "大当たり", effect: "jackpot" },
  choso: { name: "Blood Manipulation", japanese: "赤血操術", effect: "blood" },
}

export function TechniqueActivation() {
  const { selectedCharacter, intensity, beatIntensity } = useSpotifyStore()
  const [isActive, setIsActive] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const character = CHARACTERS[selectedCharacter]
  const technique = TECHNIQUE_ANIMATIONS[selectedCharacter]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  useEffect(() => {
    // Auto-trigger technique on high intensity peaks
    if (intensity && intensity > 0.8 && beatIntensity && beatIntensity > 0.7 && !isActive && !cooldown) {
      setIsActive(true)
      setCooldown(true)

      // Animation duration
      setTimeout(() => {
        setIsActive(false)
      }, 2000)

      // Cooldown period (5 seconds)
      setTimeout(() => {
        setCooldown(false)
      }, 5000)
    }
  }, [intensity, beatIntensity, isActive, cooldown, selectedCharacter])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      {/* Technique-specific effects */}
      {technique.effect === "cleave" && <CleaveEffect character={character} />}
      {technique.effect === "blue" && <BlueEffect character={character} />}
      {technique.effect === "punch" && <PunchEffect character={character} />}
      {technique.effect === "mirror" && <MirrorEffect character={character} />}
      {technique.effect === "slash" && <SlashEffect character={character} />}
      {technique.effect === "swap" && <SwapEffect character={character} />}
      {technique.effect === "jackpot" && <JackpotEffect character={character} />}
      {technique.effect === "blood" && <BloodEffect character={character} />}

      {/* Technique name display */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-widest mb-2"
          style={{
            color: textColor,
            textShadow: `0 0 30px ${character.colors.glow}, 0 0 60px ${character.colors.glow}80`,
            animation: "technique-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {technique.japanese}
        </div>
        <div
          className="text-lg sm:text-xl font-mono tracking-widest uppercase"
          style={{
            color: character.colors.secondary || character.colors.glow,
            textShadow: `0 0 15px ${character.colors.glow}60`,
            animation: "technique-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards",
            opacity: 0,
          }}
        >
          {technique.name}
        </div>
      </div>

      <style jsx>{`
        @keyframes technique-reveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Cleave Effect (Sukuna)
function CleaveEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <>
      {/* Slash lines across screen */}
      {[...Array(5)].map((_, i) => {
        const angle = -15 + Math.random() * 30
        const delay = i * 0.1
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${angle}deg, transparent 0%, ${character.colors.glow}80 50%, transparent 100%)`,
              animation: `cleave-slash 0.6s ease-out ${delay}s forwards`,
              opacity: 0,
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes cleave-slash {
          0% {
            opacity: 0;
            transform: translateX(-100%) translateY(-50%);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(100%) translateY(-50%);
          }
        }
      `}</style>
    </>
  )
}

// Blue Effect (Gojo)
function BlueEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, ${character.colors.glow}60, transparent 70%)`,
          animation: "blue-implosion 1s ease-out forwards",
          boxShadow: `0 0 100px ${character.colors.glow}, inset 0 0 50px ${character.colors.glow}40`,
        }}
      />
      <style jsx>{`
        @keyframes blue-implosion {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Punch Effect (Yuji)
function PunchEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Impact rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-32 h-32 rounded-full border-4"
          style={{
            borderColor: character.colors.glow,
            animation: `punch-impact ${0.8 + i * 0.2}s ease-out ${i * 0.1}s forwards`,
            boxShadow: `0 0 30px ${character.colors.glow}`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes punch-impact {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Mirror Effect (Yuta)
function MirrorEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${character.colors.glow}30 50%, transparent 100%)`,
        animation: "mirror-flash 0.8s ease-out forwards",
        mixBlendMode: "screen",
      }}
    />
  )
}

// Slash Effect (Toji)
function SlashEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full">
        <line
          x1="20%"
          y1="30%"
          x2="80%"
          y2="70%"
          stroke={character.colors.glow}
          strokeWidth="4"
          style={{
            filter: `drop-shadow(0 0 10px ${character.colors.glow})`,
            animation: "slash-draw 0.5s ease-out forwards",
            strokeDasharray: "1000",
            strokeDashoffset: "1000",
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes slash-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Swap Effect (Todo)
function SwapEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0">
      {/* Screen split and swap */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          background: character.colors.glow + "20",
          animation: "swap-left 0.6s ease-out forwards",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
          background: character.colors.glow + "20",
          animation: "swap-right 0.6s ease-out forwards",
        }}
      />
      <style jsx>{`
        @keyframes swap-left {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes swap-right {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

// Jackpot Effect (Hakari)
function JackpotEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {["7", "7", "7"].map((num, i) => (
        <div
          key={i}
          className="text-9xl font-black mx-4"
          style={{
            color: character.colors.glow,
            textShadow: `0 0 40px ${character.colors.glow}`,
            animation: `jackpot-spin 0.8s ease-out ${i * 0.1}s forwards`,
            transform: "scale(0)",
          }}
        >
          {num}
        </div>
      ))}
      <style jsx>{`
        @keyframes jackpot-spin {
          0% {
            transform: scale(0) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

// Blood Effect (Choso)
function BloodEffect({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => {
        const x = Math.random() * 100
        const y = Math.random() * 100
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: character.colors.glow,
              boxShadow: `0 0 10px ${character.colors.glow}`,
              animation: `blood-drip 1s ease-out ${i * 0.05}s forwards`,
              transform: "translateY(-100px)",
            }}
          />
        )
      })}
      <style jsx>{`
        @keyframes blood-drip {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

