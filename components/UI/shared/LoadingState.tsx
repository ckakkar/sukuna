"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
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
  const { isLoadingAnalysis } = useSpotifyStore()
  
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
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-manga-ink/70", className)}>
      <div className="text-center space-y-6 bg-manga-panel border-4 border-manga-ink p-8 shadow-[8px_8px_0px_0px_#0a0a0a]">
        {/* Manga ink spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-manga-tone border-t-manga-ink"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-manga-ink border-l-manga-ink"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="font-mono text-sm sm:text-base font-bold text-manga-ink"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loadingMessages}
        </motion.div>

        {/* Manga ink dots */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-manga-ink"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

