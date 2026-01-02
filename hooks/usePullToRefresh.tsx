"use client"

import { useEffect, useRef, useState } from "react"

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  enabled?: boolean
}

/**
 * Pull-to-refresh hook for mobile devices
 * Provides iOS-style pull-to-refresh functionality
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef<number>(0)
  const isPullingRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        isPullingRef.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault()
        setPullDistance(distance)
        setIsPulling(distance > 10)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return

      if (pullDistance >= threshold) {
        await onRefresh()
      }

      setIsPulling(false)
      setPullDistance(0)
      isPullingRef.current = false
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [enabled, onRefresh, pullDistance, threshold])

  return {
    isPulling,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
  }
}

