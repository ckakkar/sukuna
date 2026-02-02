"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CHARACTER_QUOTES, type CharacterQuote } from "@/lib/data/characterQuotes"
import { cn } from "@/lib/utils/cn"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"

interface QuotePosition {
  x: number
  y: number
}

export function BackgroundQuotes() {
  const { selectedCharacter, hasSelectedCharacter } = useSpotifyStore()
  const [quotes, setQuotes] = useState<Array<{
    id: number
    quote: CharacterQuote
    position: QuotePosition
    isVisible: boolean
  }>>([])
  const quoteIdRef = useRef(0)
  const lastClickTimeRef = useRef(0)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 768px)")

  // Calculate safe area (avoid music player)
  const getSafePosition = useCallback((clickX: number, clickY: number): QuotePosition => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Music player area (bottom of screen)
    // On mobile: bottom ~220px, on tablet: bottom ~96px, on desktop: bottom ~80px
    const playerHeight = isMobile ? 220 : isTablet ? 96 : 80
    const safeBottom = viewportHeight - playerHeight
    
    // Also avoid top overlay area (character selector, domain info)
    const safeTop = isMobile ? 80 : 120
    
    // Calculate position relative to click, but ensure it's in safe area
    let x = clickX
    let y = clickY
    
    // If click is in unsafe area, move quote to safe area
    if (y > safeBottom - 100) {
      // Move above player
      y = safeBottom - 120
    }
    if (y < safeTop) {
      // Move below top overlay
      y = safeTop + 20
    }
    
    // Keep quote within viewport bounds (with padding)
    const padding = 16
    const quoteWidth = isMobile ? 280 : 320
    const quoteHeight = 110
    
    // Center the quote on the click position, but keep it in bounds
    x = Math.max(quoteWidth / 2 + padding, Math.min(x, viewportWidth - quoteWidth / 2 - padding))
    y = Math.max(safeTop + quoteHeight / 2 + padding, Math.min(y, safeBottom - quoteHeight / 2 - padding))
    
    return { x, y }
  }, [isMobile, isTablet])

  const showQuote = useCallback((clickX: number, clickY: number) => {
    if (!hasSelectedCharacter) return
    
    // Debounce: prevent too many quotes from appearing too quickly (min 300ms between quotes)
    const now = Date.now()
    if (now - lastClickTimeRef.current < 300) {
      return
    }
    lastClickTimeRef.current = now
    
    const quotes = CHARACTER_QUOTES[selectedCharacter]
    if (!quotes || quotes.length === 0) return
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    const position = getSafePosition(clickX, clickY)
    const id = quoteIdRef.current++
    
    setQuotes(prev => [...prev, {
      id,
      quote: randomQuote,
      position,
      isVisible: true,
    }])
    
    // Remove quote after 4-6 seconds
    setTimeout(() => {
      setQuotes(prev => prev.map(q => 
        q.id === id ? { ...q, isVisible: false } : q
      ))
      
      // Remove from array after fade out
      setTimeout(() => {
        setQuotes(prev => prev.filter(q => q.id !== id))
      }, 300)
    }, 4000 + Math.random() * 2000)
  }, [selectedCharacter, hasSelectedCharacter, getSafePosition])

  useEffect(() => {
    if (!hasSelectedCharacter) return

    const handleClick = (e: MouseEvent | TouchEvent) => {
      // Don't show quote if clicking on interactive elements or music player
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[role="dialog"]') ||
        target.closest('[role="menu"]') ||
        target.closest('[data-music-player]') || // Music player container
        target.closest('svg') || // SVG icons
        target.closest('[class*="MusicPlayerPanel"]') // Music player by class
      ) {
        return
      }

      // Handle both mouse and touch events properly
      let clientX: number
      let clientY: number
      
      if ('touches' in e) {
        // Touch event - use changedTouches for touchend, touches for touchstart
        const touch = e.changedTouches?.[0] || e.touches?.[0]
        if (!touch) return
        clientX = touch.clientX
        clientY = touch.clientY
      } else {
        // Mouse event
        clientX = e.clientX
        clientY = e.clientY
      }
      
      showQuote(clientX, clientY)
    }

    // Add both mouse and touch events
    window.addEventListener('click', handleClick)
    window.addEventListener('touchend', handleClick)
    
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchend', handleClick)
    }
  }, [hasSelectedCharacter, showQuote])

  if (!hasSelectedCharacter || quotes.length === 0) return null

  const character = CHARACTERS[selectedCharacter]

  return (
    <>
      {quotes.map(({ id, quote, position, isVisible }) => (
        <div
          key={id}
          className={cn(
            "fixed z-30 pointer-events-none transition-all duration-300 will-animate",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) ${isVisible ? 'scale(1)' : 'scale(0.95)'}`,
          }}
        >
          <div
            className={cn(
              "bg-white/95 backdrop-blur-xl border border-black/5 px-4 py-3 max-w-[280px] sm:max-w-[320px]",
              "animate-spring-in relative overflow-hidden rounded-2xl shadow-lg"
            )}
          >
            
            {/* Content wrapper */}
            <div className="relative z-10">
              {/* Japanese quote */}
              {quote.japanese && (
                <div className="text-sm sm:text-base font-jp font-bold mb-1 text-center leading-tight text-manga-ink">
                  「{quote.japanese}」
                </div>
              )}
              
              {/* English quote */}
              <div className="text-xs sm:text-sm font-mono text-center leading-relaxed text-manga-ink">
                {quote.text}
              </div>
              
              {/* Context */}
              {quote.context && (
                <div className="text-[10px] font-mono text-center mt-1 text-manga-ink/70 leading-tight">
                  — {quote.context}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
