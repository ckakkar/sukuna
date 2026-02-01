"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
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
  const textColor = useMemo(
    () => getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary),
    [character.colors.primary, character.colors.glow, character.colors.secondary]
  )
  const borderColor = useMemo(
    () => getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.6),
    [character.colors.primary, character.colors.glow]
  )

  if (!accessToken) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto z-50 flex justify-center sm:block pointer-events-none"
      layoutRoot
    >
      <motion.div
        layout
        className={cn(
          "pointer-events-auto relative overflow-hidden backdrop-blur-3xl",
          "rounded-t-3xl sm:rounded-[2rem] w-full sm:w-auto",
          "transition-colors duration-500"
        )}
        style={{
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : "480px") : "100%",
          maxWidth: isExpanded ? "580px" : "none",
          backgroundColor: `${character.colors.primary}10`,
          borderColor: borderColor,
          borderWidth: "1px",
          boxShadow: `
            0 -10px 40px rgba(0,0,0,0.4),
            0 0 50px ${character.colors.glow}20,
            inset 0 0 0 1px rgba(255,255,255,0.05)
          `,
        }}
        initial={false}
        animate={{
          scale: (beatIntensity && beatIntensity > 0.8) ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(circle at 50% 100%, ${character.colors.glow}30, transparent 70%)`,
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Header Section */}
        <motion.div
          layout="position"
          className="relative px-5 py-4 flex items-center justify-between z-10 border-b border-white/5"
        >
          <div className="flex items-center gap-4">
            {/* Character Orb */}
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10"
                style={{ backgroundColor: character.colors.primary }}
                animate={{
                  boxShadow: `0 0 ${10 + (beatIntensity || 0) * 20}px ${character.colors.glow}`,
                }}
              >
                {/* Character Icon/Image could go here */}
                <div
                  className="w-full h-full bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage: `url(/characters/${selectedCharacter}.png)`,
                    backgroundSize: 'cover'
                  }}
                />
              </motion.div>
              {(beatIntensity || 0) > 0.5 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ borderColor: character.colors.glow, borderWidth: 2 }}
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>

            <div className="flex flex-col">
              <motion.span
                className="font-mono font-black text-sm tracking-widest uppercase"
                style={{ color: textColor, textShadow: `0 0 10px ${character.colors.glow}` }}
              >
                {character.japaneseName}
              </motion.span>
              <span className="text-xs font-medium opacity-70" style={{ color: textColor }}>
                {character.name} <span className="mx-1">•</span> {character.technique}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </button>
        </motion.div>

        {/* Collapsed Player (Mobile) */}
        {!isExpanded && currentTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-4 flex items-center gap-4"
          >
            {/* Minimal controls for collapsed state */}
            <div className="flex-1 truncate">
              <div className="text-sm font-bold truncate" style={{ color: textColor }}>{currentTrack.name}</div>
              <div className="text-xs opacity-70 truncate" style={{ color: textColor }}>{currentTrack.artist}</div>
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
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {/* Visualization Area */}
              <div className="h-32 sm:h-48 relative w-full bg-black/20 flex items-center justify-center overflow-hidden">
                <WaveformVisualization />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                {currentTrack ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{
                      scale: 1 + (beatIntensity || 0) * 0.1,
                      rotate: (beatIntensity || 0) * 2 - 1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 shadow-2xl rounded-lg overflow-hidden border border-white/10">
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
                  <div className="text-xs font-mono opacity-50" style={{ color: textColor }}>
                    NO SIGNAL
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="px-6 py-5 space-y-4">
                <div className="text-center">
                  {currentTrack ? (
                    <>
                      <motion.h3
                        className="text-lg sm:text-2xl font-black leading-tight tracking-tight mb-1"
                        style={{ color: textColor }}
                        layout
                      >
                        {currentTrack.name}
                      </motion.h3>
                      <p className="text-sm sm:text-base opacity-75 font-medium" style={{ color: textColor }}>
                        {currentTrack.artist}
                      </p>
                    </>
                  ) : (
                    <p className="opacity-50 text-sm" style={{ color: textColor }}>Waiting for playback...</p>
                  )}
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center py-2">
                  <PlaybackControls />
                </div>

                {/* Analysis Metrics */}
                {trackData && !isLoadingAnalysis && (
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                    <Metric label="BPM" value={Math.round(trackData.bpm)} color={character.colors.glow} />
                    <Metric label="ENERGY" value={`${Math.round(trackData.energy * 100)}%`} color={character.colors.glow} />
                    <Metric label="VALENCE" value={`${Math.round(trackData.valence * 100)}%`} color={character.colors.glow} />
                  </div>
                )}
              </div>

              {/* Footer / Quick Actions */}
              <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                <Search />
                <div className="w-[1px] bg-white/10 mx-1" />
                <Playlists />
                <Favorites />
                <Queue />
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOutAction}
                  className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
                >
                  Eject
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Metric({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono opacity-50 tracking-widest mb-1">{label}</span>
      <span
        className="text-lg font-black font-mono"
        style={{ color: color, textShadow: `0 0 10px ${color}60` }}
      >
        {value}
      </span>
    </div>
  )
}