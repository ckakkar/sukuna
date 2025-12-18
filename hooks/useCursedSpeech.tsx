"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

const playSound = (src: string, volume = 1) => {
  try {
    const audio = new Audio(src)
    audio.volume = volume
    // Fire and forget – we don't need to await
    void audio.play().catch((error) => {
      console.error("Failed to play cursed speech audio", src, error)
    })
  } catch (error) {
    console.error("Error creating audio element for", src, error)
  }
}

const ANNOYED_LINES = [
  "/audio/voices/annoyed_1.mp3",
  "/audio/voices/annoyed_2.mp3",
  "/audio/voices/annoyed_3.mp3",
]

/**
 * useCursedSpeech
 *
 * Listens to global cursed state (Zustand) and triggers voice lines / SFX
 * for domain expansion, black flashes, and track skips.
 */
export function useCursedSpeech() {
  const {
    selectedCharacter,
    isDomainExpanding,
    trackData,
    intensity,
    skipEventId,
    triggerImpactFrame,
  } = useSpotifyStore((state) => ({
    selectedCharacter: state.selectedCharacter,
    isDomainExpanding: state.isDomainExpanding,
    trackData: state.trackData,
    intensity: state.intensity,
    skipEventId: state.skipEventId,
    triggerImpactFrame: state.triggerImpactFrame,
  }))

  const prevDomainExpandingRef = useRef(isDomainExpanding)
  const prevEnergyRef = useRef<number>(intensity ?? 0)
  const prevSkipEventIdRef = useRef<number>(skipEventId)

  // Domain expansion voice lines
  useEffect(() => {
    const wasExpanding = prevDomainExpandingRef.current

    if (!wasExpanding && isDomainExpanding) {
      if (selectedCharacter === "sukuna") {
        playSound("/audio/voices/sukuna_domain.mp3", 1)
      } else if (selectedCharacter === "gojo") {
        playSound("/audio/voices/gojo_domain.mp3", 1)
      }
    }

    prevDomainExpandingRef.current = isDomainExpanding
  }, [isDomainExpanding, selectedCharacter])

  // Black Flash – triggered on large energy spikes
  useEffect(() => {
    const previous = prevEnergyRef.current
    const current = intensity ?? trackData?.energy ?? 0

    const threshold = 0.8
    const delta = current - previous

    if (current > threshold && delta > 0.15) {
      playSound("/audio/sfx/black_flash.mp3", 0.9)
      triggerImpactFrame()
    }

    prevEnergyRef.current = current
  }, [intensity, trackData, triggerImpactFrame])

  // Track skip – play a random annoyed line
  useEffect(() => {
    if (skipEventId === 0 || skipEventId === prevSkipEventIdRef.current) return

    prevSkipEventIdRef.current = skipEventId

    const pool = ANNOYED_LINES
    const choice = pool[Math.floor(Math.random() * pool.length)]

    playSound(choice, 0.9)
  }, [skipEventId])
}
