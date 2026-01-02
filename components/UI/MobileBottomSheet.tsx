"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
import { cn } from "@/lib/utils/cn"

interface MobileBottomSheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}

/**
 * Mobile Bottom Sheet component
 * Provides iOS-style bottom sheet for mobile devices
 */
export function MobileBottomSheet({ children, isOpen, onClose, title }: MobileBottomSheetProps) {
  const { selectedCharacter } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const [isDragging, setIsDragging] = useState(false)
  const y = useMotionValue(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Detect if mobile
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const opacity = useTransform(y, [0, 300], [1, 0])
  const scale = useTransform(y, [0, 300], [1, 0.95])

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 150 || info.velocity.y > 500) {
      onClose()
    }
    y.set(0)
    setIsDragging(false)
  }

  if (!isMobile) {
    // Render normally on desktop
    return <>{children}</>
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-[9999] glass-modern rounded-t-3xl border-t-2 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ 
              y: isDragging ? undefined : 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{
              borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.7),
              background: `linear-gradient(135deg, ${character.colors.primary}25, ${character.colors.glow}15)`,
              boxShadow: `0 -10px 40px rgba(0,0,0,0.6), 0 0 30px ${character.colors.glow}60`,
              y,
              opacity,
              scale,
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                className="w-12 h-1 rounded-full"
                style={{
                  backgroundColor: character.colors.glow,
                  opacity: 0.5,
                }}
              />
            </div>

            {/* Header */}
            {title && (
              <div
                className="px-6 py-4 border-b"
                style={{
                  borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.3),
                }}
              >
                <h3
                  className="text-xl font-bold font-mono"
                  style={{
                    color: getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary),
                  }}
                >
                  {title}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

