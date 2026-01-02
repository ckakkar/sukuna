"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * Accessibility enhancements:
 * - Screen reader announcements for state changes
 * - Reduced motion support
 * - Focus management
 * - Keyboard navigation hints
 */
export function useAccessibility() {
  const {
    currentTrack,
    isPaused,
    selectedCharacter,
    domainState,
    currentTechnique,
  } = useSpotifyStore()

  // Screen reader announcements
  useEffect(() => {
    const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
      const announcement = document.createElement("div")
      announcement.setAttribute("role", "status")
      announcement.setAttribute("aria-live", priority)
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = message
      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }

    // Announce track changes
    if (currentTrack) {
      announce(
        `Now playing: ${currentTrack.name} by ${currentTrack.artist}`,
        "polite"
      )
    }
  }, [currentTrack?.id])

  // Announce playback state changes
  useEffect(() => {
    if (currentTrack) {
      const announcement = document.createElement("div")
      announcement.setAttribute("role", "status")
      announcement.setAttribute("aria-live", "polite")
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = isPaused
        ? `Playback paused: ${currentTrack.name}`
        : `Playback resumed: ${currentTrack.name}`
      document.body.appendChild(announcement)

      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 1000)
    }
  }, [isPaused, currentTrack?.id])

  // Announce character changes
  useEffect(() => {
    const characterNames: Record<string, string> = {
      sukuna: "Ryomen Sukuna",
      gojo: "Satoru Gojo",
      yuji: "Yuji Itadori",
      yuta: "Yuta Okkotsu",
      toji: "Toji Fushiguro",
      todo: "Aoi Todo",
      kinjihakari: "Kinji Hakari",
      choso: "Choso",
    }

    const announcement = document.createElement("div")
    announcement.setAttribute("role", "status")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = `Character switched to ${characterNames[selectedCharacter] || selectedCharacter}`
    document.body.appendChild(announcement)

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }, [selectedCharacter])

  // Announce domain expansion
  useEffect(() => {
    if (domainState === "expanding") {
      const announcement = document.createElement("div")
      announcement.setAttribute("role", "status")
      announcement.setAttribute("aria-live", "assertive")
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = "Domain expansion activated"
      document.body.appendChild(announcement)

      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 2000)
    }
  }, [domainState])

  // Respect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("reduce-motion")
      } else {
        document.documentElement.classList.remove("reduce-motion")
      }
    }

    if (mediaQuery.matches) {
      document.documentElement.classList.add("reduce-motion")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Add keyboard shortcuts hint
  useEffect(() => {
    const showShortcutsHint = () => {
      const hint = document.querySelector("[data-keyboard-hints]")
      if (hint) {
        hint.setAttribute("aria-label", "Press ? to view keyboard shortcuts")
      }
    }

    showShortcutsHint()
  }, [])
}

