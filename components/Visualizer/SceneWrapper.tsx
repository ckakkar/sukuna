"use client"

import dynamic from "next/dynamic"
import { useCursedSpeech } from "@/hooks/useCursedSpeech"
import { useBeatDetector } from "@/hooks/useBeatDetector"

const Scene = dynamic(
  () => import("./Scene").then((mod) => ({ default: mod.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-jujutsu-energy font-mono text-lg animate-pulse font-bold tracking-widest">
            領域展開
          </div>
          <div className="text-gray-400 font-mono text-sm animate-pulse">
            Loading Domain...
          </div>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-jujutsu-energy rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-jujutsu-energy rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-jujutsu-energy rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    ),
  }
)

export function SceneWrapper() {
  // Mount cursed speech system
  useCursedSpeech()
  
  // Mount beat detection system
  useBeatDetector()
  
  return <Scene />
}