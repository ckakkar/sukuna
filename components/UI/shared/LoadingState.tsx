"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { cn } from "@/lib/utils/cn"

interface LoadingStateProps {
  message?: string
  type?: "domain" | "track" | "character" | "general"
  className?: string
}

export function LoadingState({ 
  message, 
  type = "general",
  className 
}: LoadingStateProps) {
  const { selectedCharacter, isLoadingAnalysis } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  
  const loadingMessages = useMemo(() => {
    switch (type) {
      case "domain":
        return message || "領域展開中... (Domain Expanding...)"
      case "track":
        return message || "呪力を分析中... (Analyzing Cursed Energy...)"
      case "character":
        return message || "術式を切り替え中... (Switching Technique...)"
      default:
        return message || "読み込み中... (Loading...)"
    }
  }, [type, message])

  const isActive = type === "track" ? isLoadingAnalysis : true

  if (!isActive) return null

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", className)}>
      <div className="text-center space-y-6">
        {/* Cursed Energy Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: character.colors.glow,
              borderRightColor: character.colors.glow,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent"
            style={{
              borderBottomColor: character.colors.accent,
              borderLeftColor: character.colors.accent,
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Pulsing core */}
          <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${character.colors.glow}, transparent)`,
              boxShadow: `0 0 20px ${character.colors.glow}`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="font-mono text-sm sm:text-base text-white/90"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loadingMessages}
        </motion.div>

        {/* Energy Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: character.colors.glow,
                boxShadow: `0 0 6px ${character.colors.glow}`,
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [
                  0,
                  Math.cos((i / 8) * Math.PI * 2) * 100,
                  Math.cos((i / 8) * Math.PI * 2) * 150,
                ],
                y: [
                  0,
                  Math.sin((i / 8) * Math.PI * 2) * 100,
                  Math.sin((i / 8) * Math.PI * 2) * 150,
                ],
                opacity: [1, 0.8, 0],
                scale: [1, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

