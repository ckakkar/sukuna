"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"
import { CHARACTER_QUOTES } from "@/lib/data/characterQuotes"
import { getVisibleTextColor } from "@/lib/utils/colorUtils"

type AnimationPhase = "exit" | "void" | "entrance" | null

export function CharacterSwitchAnimation() {
  const { selectedCharacter, hasSelectedCharacter } = useSpotifyStore()
  const [prevCharacter, setPrevCharacter] = useState<CharacterType | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [phase, setPhase] = useState<AnimationPhase>(null)
  const [showQuote, setShowQuote] = useState(false)

  useEffect(() => {
    if (!hasSelectedCharacter) return

    const currentCharId = selectedCharacter
    if (prevCharacter && prevCharacter !== currentCharId) {
      // Character changed - trigger enhanced animation sequence
      setIsAnimating(true)
      setPhase("exit")

      // Phase 1: Exit technique (800ms)
      const exitTimer = setTimeout(() => {
        setPhase("void")
      }, 800)

      // Phase 2: Transition void (400ms)
      const voidTimer = setTimeout(() => {
        setPhase("entrance")
        setShowQuote(true)
      }, 1200)

      // Phase 3: Entrance (1500ms)
      const entranceTimer = setTimeout(() => {
        setIsAnimating(false)
        setPhase(null)
        setShowQuote(false)
      }, 2700)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(voidTimer)
        clearTimeout(entranceTimer)
      }
    }

    // Update prevCharacter after checking, but only if it's different
    if (prevCharacter !== currentCharId) {
      setPrevCharacter(currentCharId)
    }
  }, [selectedCharacter, hasSelectedCharacter, prevCharacter])

  if (!isAnimating || !prevCharacter) return null

  const prevChar = CHARACTERS[prevCharacter]
  const character = CHARACTERS[selectedCharacter]
  const quotes = CHARACTER_QUOTES[selectedCharacter]
  const randomQuote = quotes?.[Math.floor(Math.random() * quotes.length)]
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {/* Phase 1: Exit Technique */}
        {phase === "exit" && (
          <motion.div
            key="exit"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExitTechnique character={prevChar} />
          </motion.div>
        )}

        {/* Phase 2: Transition Void */}
        {phase === "void" && (
          <motion.div
            key="void"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Energy particles in void */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: character.colors.glow,
                  boxShadow: `0 0 8px ${character.colors.glow}`,
                  animation: `void-particle ${1 + Math.random()}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Phase 3: Entrance with signature move */}
        {phase === "entrance" && (
          <motion.div
            key="entrance"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background flash with energy wave */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `radial-gradient(circle at center, ${character.colors.glow}60, transparent 70%)`,
              }}
            />
            
            {/* Speed lines radiating from center */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${(angle * 180) / Math.PI}deg, transparent 0%, ${character.colors.glow}40 50%, transparent 100%)`,
                    animation: `speed-line 0.8s ease-out forwards`,
                    transform: `rotate(${angle}rad)`,
                    transformOrigin: "center",
                  }}
                />
              )
            })}

            {/* Character reveal */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Character image with entrance animation */}
              {character.imagePath && (
                <motion.div
                  className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden domain-border"
                  initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                  animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8,
                  }}
                  style={{
                    boxShadow: `inset 0 0 30px ${character.colors.glow}60, 0 0 60px ${character.colors.glow}40`,
                  }}
                >
                  <Image
                    src={character.imagePath}
                    alt={character.name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${character.colors.glow}80, transparent)`,
                    }}
                  />
                </motion.div>
              )}

              {/* Character name with impact frame */}
              <motion.div
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-2 sm:mb-3 md:mb-4 tracking-widest"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.3,
                }}
                style={{
                  color: textColor,
                  textShadow: `0 0 40px ${character.colors.glow}80, 0 0 80px ${character.colors.glow}60`,
                }}
              >
                {character.japaneseName}
              </motion.div>

              {/* Quote */}
              {showQuote && randomQuote && (
                <motion.div
                  className="text-center max-w-2xl px-4 sm:px-6 md:px-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {randomQuote.japanese && (
                    <div
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3"
                      style={{
                        color: character.colors.glow,
                        textShadow: `0 0 20px ${character.colors.glow}60`,
                      }}
                    >
                      「{randomQuote.japanese}」
                    </div>
                  )}
                  <div
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-mono"
                    style={{
                      color: character.colors.secondary || character.colors.glow,
                      textShadow: `0 0 15px ${character.colors.glow}40`,
                    }}
                  >
                    {randomQuote.text}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes void-particle {
          0%, 100% {
            opacity: 0.3;
            transform: translate(0, 0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.5);
          }
        }
        @keyframes speed-line {
          0% {
            opacity: 0;
            transform: scale(0) rotate(var(--angle, 0deg));
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2) rotate(var(--angle, 0deg));
          }
        }
      `}</style>
    </div>
  )
}

// Exit Technique Component
function ExitTechnique({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  // Character-specific exit animations
  if (character.id === "sukuna") {
    return <CleaveExit character={character} />
  } else if (character.id === "gojo") {
    return <BlueExit character={character} />
  } else if (character.id === "todo") {
    return <ClapExit character={character} />
  }

  // Default exit
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at center, ${character.colors.glow}60, transparent 70%)`,
        animation: "fade-out 0.8s ease-out forwards",
      }}
    />
  )
}

function CleaveExit({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${-15 + i * 15}deg, transparent 0%, ${character.colors.glow}80 50%, transparent 100%)`,
            animation: `cleave-exit 0.6s ease-out ${i * 0.1}s forwards`,
            opacity: 0,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes cleave-exit {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

function BlueExit({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${character.colors.glow}60, transparent 70%)`,
          animation: "blue-implode 0.8s ease-out forwards",
          transform: "scale(2)",
        }}
      />
      <style jsx>{`
        @keyframes blue-implode {
          to {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

function ClapExit({ character }: { character: typeof CHARACTERS[CharacterType] }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${character.colors.glow}40 0%, transparent 50%, ${character.colors.glow}40 100%)`,
          animation: "clap-flash 0.4s ease-out forwards",
          opacity: 0,
        }}
      />
      <style jsx>{`
        @keyframes clap-flash {
          0% {
            opacity: 0;
            transform: scaleX(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  )
}
