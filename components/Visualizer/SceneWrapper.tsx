"use client"

import dynamic from "next/dynamic"
import { useCursedSpeech } from "@/hooks/useCursedSpeech"

// Dynamically import the Scene component with no SSR
// This prevents Three.js from trying to render on the server
const Scene = dynamic(
  () => import("./Scene").then((mod) => ({ default: mod.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-jujutsu-energy font-mono text-sm animate-pulse">
          Loading Domain...
        </div>
      </div>
    ),
  }
)

export function SceneWrapper() {
  // Mount cursed speech system at the app level so it can\n  // react to global Spotify/Zustand state while the scene is active.\n  useCursedSpeech()
  return <Scene />
}

