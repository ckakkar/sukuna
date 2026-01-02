"use client"

import { HTMLAttributes, ReactNode, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { CHARACTERS } from "@/lib/types/character"

interface AnimatedButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "primary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  glowColor?: string
  haptic?: boolean
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "md",
  glowColor,
  haptic = true,
  className,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleIdRef = useRef(0)
  const { selectedCharacter } = useSpotifyStore()
  const character = CHARACTERS[selectedCharacter]
  const buttonGlowColor = glowColor || character.colors.glow

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    // Create ripple effect
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: rippleIdRef.current++, x, y }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    // Haptic feedback on mobile
    if (haptic && "vibrate" in navigator) {
      navigator.vibrate(10)
    }

    // Energy burst particles
    createEnergyBurst(e.clientX, e.clientY)

    onClick?.(e)
  }

  const createEnergyBurst = (x: number, y: number) => {
    // Create temporary particles at click point
    const particles = document.createElement("div")
    particles.style.position = "fixed"
    particles.style.left = `${x}px`
    particles.style.top = `${y}px`
    particles.style.pointerEvents = "none"
    particles.style.zIndex = "9999"
    particles.innerHTML = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const distance = 30
      return `<div style="
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${buttonGlowColor};
        border-radius: 50%;
        box-shadow: 0 0 8px ${buttonGlowColor};
        animation: energy-burst 0.6s ease-out forwards;
        --end-x: ${Math.cos(angle) * distance}px;
        --end-y: ${Math.sin(angle) * distance}px;
      "></div>`
    }).join("")

    document.body.appendChild(particles)
    setTimeout(() => particles.remove(), 600)
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const variantStyles = {
    default: {
      background: "rgba(0, 0, 0, 0.4)",
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    primary: {
      background: `linear-gradient(135deg, ${character.colors.primary}, ${character.colors.glow})`,
      borderColor: buttonGlowColor,
    },
    danger: {
      background: "rgba(220, 38, 38, 0.2)",
      borderColor: "rgba(220, 38, 38, 0.6)",
    },
    ghost: {
      background: "transparent",
      borderColor: "transparent",
    },
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 font-mono font-semibold transition-all duration-200",
          sizeClasses[size],
          className
        )}
        style={{
          ...variantStyles[variant],
          boxShadow: isHovered
            ? `0 0 20px ${buttonGlowColor}60, inset 0 0 15px ${buttonGlowColor}20`
            : "0 2px 8px rgba(0,0,0,0.3)",
        }}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          scale: 1.05,
          rotate: 1,
          transition: { type: "spring", stiffness: 400, damping: 17 },
        }}
        whileTap={{
          scale: 0.95,
          transition: { type: "spring", stiffness: 400, damping: 17 },
        }}
        {...props}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
                background: `radial-gradient(circle, ${buttonGlowColor}40, transparent)`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${buttonGlowColor}30, transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Content */}
        <span className="relative z-10">{children}</span>

        {/* Loading spinner (if needed) */}
        {props.disabled && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </motion.button>

      <style jsx>{`
        @keyframes energy-burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--end-x)),
              calc(-50% + var(--end-y))
            ) scale(1.5);
          }
        }
      `}</style>
    </>
  )
}

