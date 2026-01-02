"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

/**
 * MoodBasedVisuals
 * 
 * Applies visual changes based on detected mood
 * - Happy: Brighter colors, faster animations
 * - Sad: Desaturated colors, slower animations
 * - Energetic: High contrast, intense effects
 * - Calm: Soft colors, gentle animations
 */
export function MoodBasedVisuals() {
  const { audioMood, selectedCharacter, setIntensity } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]

  useEffect(() => {
    if (!audioMood) return

    // Apply mood-based visual adjustments via CSS variables
    const root = document.documentElement
    const { mood, confidence } = audioMood

    switch (mood) {
      case "happy":
        // Brighter, more saturated colors
        root.style.setProperty("--mood-saturation", `${1 + confidence * 0.3}`)
        root.style.setProperty("--mood-brightness", `${1 + confidence * 0.2}`)
        root.style.setProperty("--mood-animation-speed", `${1 + confidence * 0.2}`)
        break

      case "sad":
        // Desaturated, darker colors
        root.style.setProperty("--mood-saturation", `${1 - confidence * 0.4}`)
        root.style.setProperty("--mood-brightness", `${1 - confidence * 0.3}`)
        root.style.setProperty("--mood-animation-speed", `${1 - confidence * 0.3}`)
        break

      case "energetic":
        // High contrast, intense
        root.style.setProperty("--mood-saturation", `${1 + confidence * 0.5}`)
        root.style.setProperty("--mood-brightness", `${1 + confidence * 0.1}`)
        root.style.setProperty("--mood-animation-speed", `${1 + confidence * 0.4}`)
        root.style.setProperty("--mood-contrast", `${1 + confidence * 0.3}`)
        break

      case "calm":
        // Soft, gentle
        root.style.setProperty("--mood-saturation", `${1 - confidence * 0.2}`)
        root.style.setProperty("--mood-brightness", `${1 + confidence * 0.1}`)
        root.style.setProperty("--mood-animation-speed", `${1 - confidence * 0.2}`)
        root.style.setProperty("--mood-contrast", `${1 - confidence * 0.2}`)
        break

      default:
        // Reset to defaults
        root.style.setProperty("--mood-saturation", "1")
        root.style.setProperty("--mood-brightness", "1")
        root.style.setProperty("--mood-animation-speed", "1")
        root.style.setProperty("--mood-contrast", "1")
    }

    // Adjust intensity based on mood
    if (mood === "energetic") {
      setIntensity(Math.min(1, (audioMood.confidence + 0.3)))
    } else if (mood === "calm") {
      setIntensity(Math.max(0.2, audioMood.confidence * 0.6))
    }
  }, [audioMood, setIntensity])

  return null // This component only applies CSS variables
}

