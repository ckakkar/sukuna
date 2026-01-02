"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS, type CharacterType } from "@/lib/types/character"

/**
 * Global keyboard shortcuts for the application
 * Space: Play/Pause
 * Arrow Right (Cmd/Ctrl): Next track
 * Arrow Left (Cmd/Ctrl): Previous track
 * D: Trigger domain expansion
 * T: Activate character technique
 * Number keys (1-8): Quick character switch
 * F: Toggle fullscreen
 * M: Mute/unmute
 * R: Toggle repeat
 * S: Toggle shuffle
 * Q: Open queue
 * P: Open playlists
 * /: Focus search
 * Esc: Close all modals
 * Tab: Navigate between UI sections
 * Enter: Confirm selections
 */
export function useKeyboardShortcuts() {
  const {
    playerInstance,
    isPaused,
    accessToken,
    deviceId,
    selectedCharacter,
    setSelectedCharacter,
    domainState,
    setDomainState,
    currentTechnique,
    setCurrentTechnique,
    repeatMode,
    setRepeatMode,
    shuffleMode,
    setShuffleMode,
  } = useSpotifyStore()

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow '/' to focus search even in inputs
        if (event.key === "/" && target.tagName === "INPUT") {
          return
        }
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

        case "KeyD":
          event.preventDefault()
          // Toggle domain expansion
          if (domainState === "idle" || domainState === "collapsing") {
            setDomainState("expanding")
          } else if (domainState === "active" || domainState === "expanding") {
            setDomainState("collapsing")
          }
          break

        case "KeyT":
          event.preventDefault()
          // Activate character technique
          const character = CHARACTERS[selectedCharacter]
          const defaultTechnique = character.id === "sukuna" ? "cleave" : 
                                   character.id === "gojo" ? "blue" : 
                                   character.id === "todo" ? "boogie_woogie" : null
          if (defaultTechnique) {
            setCurrentTechnique(defaultTechnique)
            // Reset after animation
            setTimeout(() => setCurrentTechnique(null), 2000)
          }
          break

        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
          event.preventDefault()
          const characterIndex = parseInt(event.code.replace("Digit", "")) - 1
          const characterKeys: CharacterType[] = [
            "sukuna", "gojo", "yuji", "yuta", "toji", "todo", "kinjihakari", "choso"
          ]
          if (characterKeys[characterIndex]) {
            setSelectedCharacter(characterKeys[characterIndex])
          }
          break

        case "KeyF":
          event.preventDefault()
          // Toggle fullscreen
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
              console.error("Error entering fullscreen:", err)
            })
          } else {
            document.exitFullscreen().catch((err) => {
              console.error("Error exiting fullscreen:", err)
            })
          }
          break

        case "KeyM":
          event.preventDefault()
          // Toggle mute (volume to 0 or restore)
          if (playerInstance) {
            try {
              const currentVolume = await playerInstance.getVolume()
              const newVolume = currentVolume > 0 ? 0 : 0.5 // Restore to 50% if muted
              await playerInstance.setVolume(newVolume)
            } catch (error) {
              console.error("Error toggling mute:", error)
            }
          }
          break

        case "KeyR":
          event.preventDefault()
          // Toggle repeat mode
          const nextRepeatMode = repeatMode === "off" ? "context" : 
                                repeatMode === "context" ? "track" : "off"
          setRepeatMode(nextRepeatMode)
          if (playerInstance) {
            try {
              const repeatValue = nextRepeatMode === "off" ? 0 : 
                                 nextRepeatMode === "context" ? 1 : 2
              await playerInstance.setRepeat(repeatValue as 0 | 1 | 2)
            } catch (error) {
              console.error("Error setting repeat:", error)
            }
          }
          break

        case "KeyS":
          event.preventDefault()
          // Toggle shuffle
          const newShuffle = !shuffleMode
          setShuffleMode(newShuffle)
          if (playerInstance) {
            try {
              await playerInstance.setShuffle(newShuffle)
            } catch (error) {
              console.error("Error setting shuffle:", error)
            }
          }
          break

        case "KeyQ":
          event.preventDefault()
          // Open queue (trigger queue modal if exists)
          const queueButton = document.querySelector('[aria-label*="queue" i], [aria-label*="Queue" i]')
          if (queueButton instanceof HTMLElement) {
            queueButton.click()
          }
          break

        case "KeyP":
          event.preventDefault()
          // Open playlists (trigger playlists modal if exists)
          const playlistsButton = document.querySelector('[aria-label*="playlist" i], [aria-label*="Playlist" i]')
          if (playlistsButton instanceof HTMLElement) {
            playlistsButton.click()
          }
          break

        case "Slash":
          event.preventDefault()
          // Focus search
          const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]')
          if (searchInput instanceof HTMLElement) {
            searchInput.focus()
          }
          break

        case "Escape":
          // Close all modals
          const modals = document.querySelectorAll('[role="dialog"], [data-modal="true"]')
          modals.forEach((modal) => {
            const closeButton = modal.querySelector('button[aria-label*="close" i], button[aria-label*="Close" i]')
            if (closeButton instanceof HTMLElement) {
              closeButton.click()
            }
          })
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    playerInstance,
    isPaused,
    accessToken,
    deviceId,
    selectedCharacter,
    setSelectedCharacter,
    domainState,
    setDomainState,
    currentTechnique,
    setCurrentTechnique,
    repeatMode,
    setRepeatMode,
    shuffleMode,
    setShuffleMode,
  ])
}

