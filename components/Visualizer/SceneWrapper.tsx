"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useCursedSpeech } from "@/hooks/useCursedSpeech"
import { useBeatDetector } from "@/hooks/useBeatDetector"
import { useFrequencySpectrum } from "@/hooks/useFrequencySpectrum"
import { useMoodDetection } from "@/hooks/useMoodDetection"
import { useTempoSync } from "@/hooks/useTempoSync"

const Scene = dynamic(
  () => import("./Scene").then((mod) => ({ default: mod.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-manga-tone/30 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-manga-ink/20 rounded-full" />
            <div 
              className="absolute inset-0 border-2 border-transparent border-t-manga-ink/60 rounded-full"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
          </div>
          <div className="text-sm font-medium text-manga-ink/60">Loading...</div>
        </div>
        <style jsx>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    ),
  }
)

export function SceneWrapper() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Mount cursed speech system
  useCursedSpeech()
  
  // Mount beat detection system
  useBeatDetector()
  
  // Mount frequency spectrum analysis
  useFrequencySpectrum()
  
  // Mount mood detection
  useMoodDetection()
  
  // Mount tempo sync
  useTempoSync()

  useEffect(() => {
    // Add a slight delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Scene />
    </div>
  )
}