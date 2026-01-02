"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

/**
 * HandSigns component - Displays character hand signs before domain expansion
 * Shows a freeze frame moment with the character's signature hand gesture
 */
export function HandSigns() {
  const { domainState, selectedCharacter } = useSpotifyStore()
  const [isVisible, setIsVisible] = useState(false)
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    // Show hand signs when domain expansion starts
    if (domainState === "expanding") {
      setIsVisible(true)
      // Hide after freeze frame moment (2 seconds)
      const timer = setTimeout(() => setIsVisible(false), 2000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [domainState])

  if (!isVisible) return null

  // Character-specific hand sign patterns (simplified visual representation)
  const getHandSignPattern = (characterId: string) => {
    switch (characterId) {
      case "sukuna":
        return "✋🤚" // Two hands - Malevolent Shrine
      case "gojo":
        return "🤏" // Pinch gesture - Unlimited Void
      case "yuji":
        return "✊" // Fist - Black Flash
      case "yuta":
        return "🤲" // Palms together - Copy
      case "toji":
        return "🗡️" // Katana grip
      case "todo":
        return "👏" // Clap - Boogie Woogie
      case "kinjihakari":
        return "🎰" // Casino gesture
      case "choso":
        return "🩸" // Blood manipulation
      default:
        return "✋"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Freeze frame overlay */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Hand sign display */}
          <motion.div
            className="relative text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 -inset-20 rounded-full blur-3xl opacity-50"
              style={{
                background: `radial-gradient(circle, ${character.colors.glow}, transparent)`,
              }}
            />

            {/* Hand sign symbol */}
            <motion.div
              className="text-8xl sm:text-9xl mb-4 relative z-10"
              style={{
                filter: `drop-shadow(0 0 30px ${character.colors.glow})`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {getHandSignPattern(character.id)}
            </motion.div>

            {/* Technique name */}
            <motion.div
              className="font-mono text-2xl sm:text-3xl font-bold tracking-widest relative z-10"
              style={{
                color: character.colors.glow,
                textShadow: `0 0 20px ${character.colors.glow}, 0 0 40px ${character.colors.glow}80`,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {character.techniqueJapanese}
            </motion.div>

            {/* Domain name */}
            <motion.div
              className="font-mono text-sm sm:text-base mt-2 opacity-80 relative z-10"
              style={{
                color: character.colors.accent || character.colors.glow,
                textShadow: `0 0 10px ${character.colors.glow}60`,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {character.domainJapanese}
            </motion.div>

            {/* Energy particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: character.colors.glow,
                  boxShadow: `0 0 10px ${character.colors.glow}`,
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 150,
                  y: Math.sin((i / 12) * Math.PI * 2) * 150,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 2,
                  delay: 0.8 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

