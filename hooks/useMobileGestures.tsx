"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * Mobile gesture controls for the application
 * Swipe up: Open character selector
 * Swipe down: Close modals
 * Swipe left: Next track
 * Swipe right: Previous track
 * Two-finger pinch: Zoom 3D scene (future)
 * Long press: Show track options (future)
 * Double tap: Like/unlike track (future)
 */
export function useMobileGestures() {
  const { playerInstance, setSelectedCharacter } = useSpotifyStore()
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const minSwipeDistance = 50
  const maxSwipeTime = 300 // ms

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length !== 1) {
        touchStartRef.current = null
        return
      }

      touchEndRef.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      }

      const swipeTime = touchEndRef.current.time - touchStartRef.current.time
      if (swipeTime > maxSwipeTime) {
        touchStartRef.current = null
        touchEndRef.current = null
        return
      }

      const deltaX = touchEndRef.current.x - touchStartRef.current.x
      const deltaY = touchEndRef.current.y - touchStartRef.current.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Determine if horizontal or vertical swipe
      if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right - Previous track
          if (playerInstance) {
            playerInstance.previousTrack().catch((error: unknown) => {
              console.error("Error going to previous track:", error)
            })
          }
        } else {
          // Swipe left - Next track
          if (playerInstance) {
            playerInstance.nextTrack().catch((error: unknown) => {
              console.error("Error going to next track:", error)
            })
          }
        }
      } else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
        // Vertical swipe
        if (deltaY < 0) {
          // Swipe up - Open character selector
          const characterButton = document.querySelector('[aria-label*="character" i], [aria-label*="Character" i], button[data-character-selector]')
          if (characterButton instanceof HTMLElement) {
            characterButton.click()
          } else {
            // Fallback: trigger character selector modal
            const event = new CustomEvent("openCharacterSelector")
            window.dispatchEvent(event)
          }
        } else {
          // Swipe down - Close modals
          const modals = document.querySelectorAll('[role="dialog"], [data-modal="true"]')
          modals.forEach((modal) => {
            const closeButton = modal.querySelector('button[aria-label*="close" i], button[aria-label*="Close" i]')
            if (closeButton instanceof HTMLElement) {
              closeButton.click()
            }
          })
        }
      }

      touchStartRef.current = null
      touchEndRef.current = null
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [playerInstance, setSelectedCharacter])
}

