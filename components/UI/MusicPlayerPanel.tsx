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
          "pointer-events-auto relative overflow-hidden bg-manga-paper",
          "rounded-none w-full sm:w-auto border-3 border-black",
          "transition-all duration-300"
        )}
        style={{
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : "480px") : "100%",
          maxWidth: isExpanded ? "580px" : "none",
          boxShadow: `8px 8px 0px 0px #0a0a0a`,
        }}
        initial={false}
        animate={{
          scale: (beatIntensity && beatIntensity > 0.8) ? 1.01 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Manga Halftone Background Pattern */}
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />

        {/* Speed Lines Overlay on Beat */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 48%, rgba(10,10,10,0.05) 50%, transparent 52%)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPositionX: (beatIntensity && beatIntensity > 0.6) ? ['0%', '100%'] : '0%',
            opacity: (beatIntensity && beatIntensity > 0.6) ? 1 : 0
          }}
          transition={{ duration: 0.2, repeat: (beatIntensity && beatIntensity > 0.6) ? Infinity : 0 }}
        />

        {/* Header Section */}
        <motion.div
          layout="position"
          className="relative px-5 py-4 flex items-center justify-between z-10 border-b-3 border-black bg-white"
        >
          <div className="flex items-center gap-4">
            {/* Character Orb - Manga Style */}
            <div className="relative group">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-black bg-white relative z-10"
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="w-full h-full bg-cover bg-center grayscale contrast-125"
                  style={{
                    backgroundImage: `url(/characters/${selectedCharacter}.png)`,
                    backgroundSize: 'cover'
                  }}
                />
              </motion.div>
              {/* Offset shadow circle */}
              <div className="absolute top-1 left-1 w-12 h-12 rounded-full bg-black -z-0" />
            </div>

            <div className="flex flex-col">
              <motion.span
                className="font-black text-lg font-manga tracking-widest uppercase italic translate-y-1"
                style={{ color: '#0a0a0a' }}
              >
                {character.japaneseName}
              </motion.span>
              <span className="text-xs font-bold font-mono text-black uppercase tracking-tighter">
                {character.name} <span className="mx-1 text-xs">///</span> {character.technique}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-black hover:text-white transition-colors border-2 border-black rounded-none"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
            className="px-5 py-4 flex items-center gap-4 bg-white relative z-10"
          >
            {/* Minimal controls for collapsed state */}
            <div className="flex-1 truncate">
              <div className="text-sm font-black font-manga truncate text-black uppercase">{currentTrack.name}</div>
              <div className="text-xs font-mono font-bold uppercase truncate text-gray-500">{currentTrack.artist}</div>
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
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col bg-manga-paper"
            >
              {/* Visualization Area - Framed Panel */}
              <div className="h-40 sm:h-56 relative w-full bg-white border-b-3 border-black flex items-center justify-center overflow-hidden">
                <WaveformVisualization />

                {currentTrack ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{
                      scale: 1 + (beatIntensity || 0) * 0.05,
                      rotate: (beatIntensity || 0) * 2
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-10 p-1">
                      {currentTrack.image && (
                        <Image
                          src={currentTrack.image}
                          alt="Album Art"
                          fill
                          className="object-cover grayscale contrast-125 border border-black"
                          unoptimized
                        />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xl font-black font-manga tracking-widest opacity-20 text-black rotate-[-15deg]">
                    NO SIGNAL
                  </div>
                )}
              </div>

              {/* Track Info Panel */}
              <div className="px-6 py-6 space-y-5 relative">
                {/* Background Text Overlay */}
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none z-0">
                  <h1 className="text-8xl font-black font-manga italic">MUSIC</h1>
                </div>

                <div className="text-center relative z-10">
                  {currentTrack ? (
                    <>
                      <motion.h3
                        className="text-xl sm:text-3xl font-black font-manga leading-none tracking-tight mb-2 text-black uppercase"
                        layout
                      >
                        <span className="bg-black text-white px-2 py-1 inline-block transform -skew-x-6">{currentTrack.name}</span>
                      </motion.h3>
                      <p className="text-sm sm:text-lg font-bold font-mono text-black uppercase tracking-widest border-b-2 border-black inline-block pb-1">
                        {currentTrack.artist}
                      </p>
                    </>
                  ) : (
                    <p className="opacity-50 text-sm font-bold text-black font-mono">WAITING FOR PLAYBACK...</p>
                  )}
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center py-2">
                  <PlaybackControls />
                </div>

                {/* Analysis Metrics */}
                {trackData && !isLoadingAnalysis && (
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-3 border-black">
                    <Metric label="BPM" value={Math.round(trackData.bpm)} />
                    <Metric label="NRG" value={`${Math.round(trackData.energy * 100)}%`} />
                    <Metric label="VAL" value={`${Math.round(trackData.valence * 100)}%`} />
                  </div>
                )}
              </div>

              {/* Footer / Quick Actions */}
              <div className="px-6 py-4 bg-black text-white border-t-2 border-black flex gap-2 overflow-x-auto no-scrollbar items-center">
                <Search />
                <div className="w-[2px] h-6 bg-white mx-1" />
                <div className="flex gap-2 filter invert">
                  <Playlists />
                  <Favorites />
                  <Queue />
                </div>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOutAction}
                  className="text-[10px] uppercase font-bold font-mono tracking-widest text-white hover:bg-white hover:text-black border-2 border-white transition-colors rounded-none"
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

function Metric({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1 text-gray-500">{label}</span>
      <span
        className="text-lg font-black font-manga text-black"
      >
        {value}
      </span>
    </div>
  )
}