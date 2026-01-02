"use client"

import { useMobileGestures } from "@/hooks/useMobileGestures"
import { useAccessibility } from "@/hooks/useAccessibility"
import { LoadingState } from "@/components/UI/shared/LoadingState"
import { useSpotifyStore } from "@/store/useSpotifyStore"

/**
 * Component that integrates all Phase 5 enhancements:
 * - Mobile gesture controls
 * - Accessibility features
 * - Loading states
 */
export function AppEnhancements() {
  const { isLoadingAnalysis } = useSpotifyStore()
  
  // Initialize hooks
  useMobileGestures()
  useAccessibility()

  return (
    <>
      {/* Loading State - only show when actively loading */}
      {isLoadingAnalysis && (
        <LoadingState 
          type="track" 
          message="呪力を分析中... (Analyzing Cursed Energy...)"
        />
      )}
    </>
  )
}

