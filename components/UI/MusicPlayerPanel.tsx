"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { PlaybackControls } from "./PlaybackControls"
import { Search } from "./Search"
import { Playlists } from "./Playlists"
import { Favorites } from "./Favorites"
import { RecentlyPlayed } from "./RecentlyPlayed"
import { Queue } from "./Queue"
import { WaveformVisualization } from "./WaveformVisualization"
import { FrequencySpectrumBars } from "./FrequencySpectrumBars"
import { signOutAction } from "@/app/actions/auth"
import { Button } from "./shared/Button"
import { LoadingSpinner } from "./shared/LoadingSpinner"
import { cn } from "@/lib/utils/cn"

export function MusicPlayerPanel() {
  const {
    currentTrack,
    trackData,
    isLoadingAnalysis,
    selectedCharacter,
    accessToken,
    beatIntensity,
  } = useSpotifyStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-expand on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) setIsExpanded(true)
      else setIsExpanded(false)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const character = useMemo(() => CHARACTERS[selectedCharacter], [selectedCharacter])

  if (!accessToken) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto z-50 flex justify-center sm:block pointer-events-none"
      layoutRoot
    >
      <motion.div
        layout
        className={cn(
          "pointer-events-auto relative overflow-hidden",
          "w-full sm:w-auto rounded-2xl",
          "bg-white/95 backdrop-blur-xl border border-black/5",
          "shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
        style={{
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : "420px") : "100%",
          maxWidth: isExpanded ? "500px" : "none",
        }}
        initial={false}
        animate={{
          scale: (beatIntensity && beatIntensity > 0.8) ? 1.01 : 1,
          boxShadow: (beatIntensity && beatIntensity > 0.8)
            ? "0 8px 32px rgba(0,0,0,0.08)"
            : "0 4px 24px rgba(0,0,0,0.06)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <motion.div
          layout="position"
          className="relative px-5 py-4 flex items-center justify-between z-10 border-b border-black/5 bg-white/50"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden bg-manga-tone/50 relative"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(/characters/${selectedCharacter}.png)`,
                  backgroundSize: 'cover'
                }}
              />
            </motion.div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-manga-ink truncate">
                {character.japaneseName}
              </span>
              <span className="text-xs text-manga-ink/60 truncate">
                {character.name} · {character.technique}
              </span>
            </div>
          </div>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Collapsed (Mobile) */}
        {!isExpanded && currentTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-4 flex items-center gap-4 relative z-10"
          >
            <div className="flex-1 truncate">
              <div className="text-sm font-semibold truncate text-manga-ink">{currentTrack.name}</div>
              <div className="text-xs text-manga-ink/60 truncate">{currentTrack.artist}</div>
            </div>
          </motion.div>
        )}

        {/* Expanded Content */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Visualization */}
              <div className="h-36 sm:h-48 relative w-full bg-manga-tone/30 flex items-center justify-center overflow-hidden">
                <WaveformVisualization />

                {currentTrack ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{
                      scale: 1 + (beatIntensity || 0) * 0.03,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden shadow-lg z-10">
                      {currentTrack.image && (
                        <Image
                          src={currentTrack.image}
                          alt="Album Art"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-sm font-medium text-manga-ink/30">No track</div>
                )}
              </div>

              {/* Track Info */}
              <div className="px-6 py-5 space-y-4 relative">
                <div className="text-center">
                  {currentTrack ? (
                    <>
                      <motion.h3
                        className="text-lg sm:text-xl font-semibold text-manga-ink mb-1 truncate px-2"
                        layout
                      >
                        {currentTrack.name}
                      </motion.h3>
                      <p className="text-sm text-manga-ink/60">
                        {currentTrack.artist}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-manga-ink/40">No track playing</p>
                  )}
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center py-2">
                  <PlaybackControls />
                </div>

                {/* Metrics */}
                {trackData && !isLoadingAnalysis && (
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5">
                    <Metric label="BPM" value={Math.round(trackData.bpm)} />
                    <Metric label="Energy" value={`${Math.round(trackData.energy * 100)}%`} />
                    <Metric label="Valence" value={`${Math.round(trackData.valence * 100)}%`} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-manga-tone/20 border-t border-black/5 flex gap-2 overflow-x-auto items-center rounded-b-2xl">
                <Search />
                <div className="w-px h-5 bg-black/10" />
                <div className="flex gap-1">
                  <Playlists />
                  <Favorites />
                  <Queue />
                </div>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOutAction}
                  className="text-xs font-medium text-manga-ink/70 hover:text-manga-ink hover:bg-black/5 rounded-lg transition-colors"
                >
                  Sign out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Metric({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-medium text-manga-ink/50 mb-0.5">{label}</span>
      <span className="text-sm font-semibold text-manga-ink">{value}</span>
    </div>
  )
}