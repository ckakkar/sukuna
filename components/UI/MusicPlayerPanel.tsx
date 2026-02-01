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
          "pointer-events-auto relative overflow-hidden bg-white",
          "rounded-none w-full sm:w-auto border-4 border-black",
          "transition-colors duration-500"
        )}
        style={{
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : "480px") : "100%",
          maxWidth: isExpanded ? "580px" : "none",
          boxShadow: `8px 8px 0px 0px rgba(0,0,0,1)`,
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
        {/* Manga Halftone Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }}
        />

        {/* Header Section */}
        <motion.div
          layout="position"
          className="relative px-5 py-4 flex items-center justify-between z-10 border-b-2 border-black"
        >
          <div className="flex items-center gap-4">
            {/* Character Orb - Black & White Style */}
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-black bg-white"
                animate={{
                  boxShadow: `4px 4px 0px 0px ${character.colors.primary}`,
                }}
              >
                {/* Character Icon/Image could go here */}
                <div
                  className="w-full h-full bg-cover bg-center grayscale contrast-125"
                  style={{
                    backgroundImage: `url(/characters/${selectedCharacter}.png)`,
                    backgroundSize: 'cover'
                  }}
                />
              </motion.div>
            </div>

            <div className="flex flex-col">
              <motion.span
                className="font-black text-sm tracking-widest uppercase italic"
                style={{ color: 'black' }}
              >
                {character.japaneseName}
              </motion.span>
              <span className="text-xs font-bold text-black opacity-100">
                {character.name} <span className="mx-1">•</span> {character.technique}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-transparent hover:border-black"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
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
              {/* Visualization Area - Framed Panel */}
              <div className="h-32 sm:h-48 relative w-full bg-white border-b-2 border-black flex items-center justify-center overflow-hidden">
                <WaveformVisualization />
                {/* Removed gradient overlay */}

                {currentTrack ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{
                      scale: 1 + (beatIntensity || 0) * 0.05,
                      rotate: (beatIntensity || 0)
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                      {currentTrack.image && (
                        <Image
                          src={currentTrack.image}
                          alt="Album Art"
                          fill
                          className="object-cover grayscale contrast-125"
                          unoptimized
                        />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs font-black tracking-widest opacity-50 text-black">
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
                        className="text-lg sm:text-2xl font-black leading-tight tracking-tight mb-1 text-black"
                        layout
                      >
                        {currentTrack.name}
                      </motion.h3>
                      <p className="text-sm sm:text-base font-bold text-gray-600">
                        {currentTrack.artist}
                      </p>
                    </>
                  ) : (
                    <p className="opacity-50 text-sm font-bold text-black">Waiting for playback...</p>
                  )}
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center py-2">
                  <PlaybackControls />
                </div>

                {/* Analysis Metrics */}
                {trackData && !isLoadingAnalysis && (
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-2 border-black">
                    <Metric label="BPM" value={Math.round(trackData.bpm)} color="black" />
                    <Metric label="ENERGY" value={`${Math.round(trackData.energy * 100)}%`} color="black" />
                    <Metric label="VALENCE" value={`${Math.round(trackData.valence * 100)}%`} color="black" />
                  </div>
                )}
              </div>

              {/* Footer / Quick Actions */}
              <div className="px-6 py-4 bg-white border-t-2 border-black flex gap-2 overflow-x-auto no-scrollbar">
                <Search />
                <div className="w-[2px] bg-black mx-1" />
                <Playlists />
                <Favorites />
                <Queue />
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOutAction}
                  className="text-[10px] uppercase font-bold tracking-widest text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black"
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