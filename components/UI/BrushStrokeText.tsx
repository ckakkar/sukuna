"use client"

import { HTMLAttributes, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

interface BrushStrokeTextProps extends HTMLAttributes<HTMLDivElement> {
  children: string
  color?: string
  glowColor?: string
  delay?: number
  duration?: number
}

export function BrushStrokeText({
  children,
  color = "#ffffff",
  glowColor,
  delay = 0,
  duration = 1.2,
  className,
  ...props
}: BrushStrokeTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      {...props}
    >
      <div
        className="relative overflow-hidden"
        style={{
          clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          transition: `clip-path ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <div
          className="font-bold relative z-10"
          style={{
            color,
            textShadow: glowColor
              ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}80, 0 0 30px ${glowColor}60`
              : undefined,
          }}
        >
          {children}
        </div>
        {/* Brush stroke effect - animated background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: isVisible
              ? `brush-stroke ${duration * 0.8}s ease-out forwards`
              : "none",
            mixBlendMode: "overlay",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes brush-stroke {
          0% {
            background-position: -100% 0;
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}

