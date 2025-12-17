"use client"

import { useEffect, useState } from "react"
import type React from "react"

export function SceneWrapper() {
  const [SceneComponent, setSceneComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Only import on client side, after mount
    if (typeof window !== "undefined") {
      import("./Scene")
        .then((mod) => {
          setSceneComponent(() => mod.Scene)
        })
        .catch((err) => {
          console.error("Failed to load Scene:", err)
        })
    }
  }, [])

  // Show loading state until Scene is loaded
  if (!SceneComponent) {
    return <div className="absolute inset-0 bg-black" />
  }

  const Scene = SceneComponent
  return <Scene />
}

