"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useCursedSpeech } from "@/hooks/useCursedSpeech"
import { useBeatDetector } from "@/hooks/useBeatDetector"

const Scene = dynamic(
  () => import("./Scene").then((mod) => ({ default: mod.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Hexagonal loader */}
          <div className="relative w-24 h-24 mx-auto">
            <div 
              className="absolute inset-0 border-4 border-purple-500/30"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                animation: 'spin 2s linear infinite',
              }}
            />
            <div 
              className="absolute inset-2 border-4 border-purple-500/50"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                animation: 'spin 1.5s linear infinite reverse',
              }}
            />
            <div 
              className="absolute inset-4 border-4 border-purple-500"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                animation: 'spin 1s linear infinite',
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="text-jujutsu-energy font-mono text-xl animate-pulse font-bold tracking-[0.4em]">
              領域展開
            </div>
            <div className="text-gray-400 font-mono text-sm animate-pulse tracking-wider">
              Expanding Domain...
            </div>
          </div>

          {/* Cursed energy particles */}
          <div className="flex gap-2 justify-center">
            <div 
              className="w-3 h-3 bg-jujutsu-energy rounded-full animate-bounce" 
              style={{ 
                animationDelay: "0ms",
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.8)',
              }} 
            />
            <div 
              className="w-3 h-3 bg-jujutsu-energy rounded-full animate-bounce" 
              style={{ 
                animationDelay: "150ms",
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.8)',
              }} 
            />
            <div 
              className="w-3 h-3 bg-jujutsu-energy rounded-full animate-bounce" 
              style={{ 
                animationDelay: "300ms",
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.8)',
              }} 
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
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