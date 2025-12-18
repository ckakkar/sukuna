"use client"

import dynamic from "next/dynamic"

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
  return <Scene />
}

