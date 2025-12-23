"use client"

import { useCallback } from "react"

/**
 * Hook for haptic feedback on supported devices
 * Provides tactile feedback for better user experience
 */
export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: "light" | "medium" | "heavy" = "medium") => {
    if (typeof window === "undefined") return

    // Check if Vibration API is available
    if ("vibrate" in navigator) {
      const patterns: Record<"light" | "medium" | "heavy", number | number[]> = {
        light: 10,
        medium: 20,
        heavy: [30, 50, 30],
      }
      navigator.vibrate(patterns[type])
    }

    // For iOS devices, try to trigger haptic feedback
    if (window.DeviceMotionEvent) {
      // iOS haptic feedback can be triggered through touch events
      // This is a fallback for devices that support it
    }
  }, [])

  const triggerBeatHaptic = useCallback(() => {
    triggerHaptic("light")
  }, [triggerHaptic])

  const triggerButtonHaptic = useCallback(() => {
    triggerHaptic("medium")
  }, [triggerHaptic])

  const triggerHeavyHaptic = useCallback(() => {
    triggerHaptic("heavy")
  }, [triggerHaptic])

  return {
    triggerHaptic,
    triggerBeatHaptic,
    triggerButtonHaptic,
    triggerHeavyHaptic,
  }
}

