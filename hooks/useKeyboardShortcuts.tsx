"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * Global keyboard shortcuts for the application
 * Space: Play/Pause
 * Arrow Right: Next track
 * Arrow Left: Previous track
 * Arrow Up: Volume up
 * Arrow Down: Volume down
 */
export function useKeyboardShortcuts() {
  const { playerInstance, isPaused, accessToken, deviceId } = useSpotifyStore()

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      // Prevent default for our shortcuts
      switch (event.code) {
        case "Space":
          event.preventDefault()
          if (playerInstance) {
            try {
              await playerInstance.togglePlay()
            } catch (error) {
              console.error("Error toggling play:", error)
            }
          }
          break

        case "ArrowRight":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            if (playerInstance) {
              try {
                await playerInstance.nextTrack()
              } catch (error) {
                console.error("Error skipping to next:", error)
              }
            }
          }
          break

        case "ArrowLeft":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            if (playerInstance) {
              try {
                await playerInstance.previousTrack()
              } catch (error) {
                console.error("Error skipping to previous:", error)
              }
            }
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playerInstance, isPaused, accessToken, deviceId])
}

