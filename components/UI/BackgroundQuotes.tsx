"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"
import { CHARACTER_QUOTES, type CharacterQuote } from "@/lib/data/characterQuotes"
import { getVisibleTextColor, getVisibleBorderColor } from "@/lib/utils/colorUtils"
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
  const textColor = getVisibleTextColor(character.colors.primary, character.colors.glow, character.colors.secondary)

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
              "glass-modern domain-border rounded-lg px-3.5 py-2.5 max-w-[280px] sm:max-w-[320px]",
              "animate-spring-in shadow-2xl",
              "backdrop-blur-xl relative overflow-hidden"
            )}
            style={{
              borderColor: getVisibleBorderColor(character.colors.primary, character.colors.glow, 0.7),
              boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${character.colors.glow}50, inset 0 0 20px ${character.colors.glow}15, 0 0 0 1px ${character.colors.glow}20`,
              background: `linear-gradient(135deg, ${character.colors.primary}25 0%, ${character.colors.glow}15 50%, ${character.colors.primary}20 100%)`,
              backgroundSize: '200% 200%',
              animation: 'cursed-energy-flow 4s ease infinite',
            }}
          >
            {/* Animated background glow */}
            <div 
              className="absolute inset-0 opacity-30 animate-barrier-pulse pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${character.colors.glow}40, transparent 70%)`,
              }}
            />
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
              {/* Japanese quote */}
              {quote.japanese && (
                <div
                  className="text-sm sm:text-base font-bold mb-1 text-center leading-tight"
                  style={{
                    color: character.colors.glow,
                    textShadow: `0 0 12px ${character.colors.glow}80, 0 0 20px ${character.colors.glow}60`,
                  }}
                >
                  「{quote.japanese}」
                </div>
              )}
              
              {/* English quote */}
              <div
                className="text-xs sm:text-sm font-mono text-center leading-relaxed"
                style={{
                  color: textColor,
                  textShadow: `0 0 6px ${character.colors.glow}50`,
                }}
              >
                {quote.text}
              </div>
              
              {/* Context (if available) */}
              {quote.context && (
                <div
                  className="text-[10px] font-mono text-center mt-1 opacity-70 leading-tight"
                  style={{
                    color: character.colors.secondary || character.colors.glow,
                  }}
                >
                  — {quote.context}
                </div>
              )}
            </div>
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 rounded-tl-lg opacity-50" 
              style={{ borderColor: character.colors.glow }} 
            />
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 rounded-tr-lg opacity-50" 
              style={{ borderColor: character.colors.glow }} 
            />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 rounded-bl-lg opacity-50" 
              style={{ borderColor: character.colors.glow }} 
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 rounded-br-lg opacity-50" 
              style={{ borderColor: character.colors.glow }} 
            />
          </div>
        </div>
      ))}
    </>
  )
}
