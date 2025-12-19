"use client"

import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils/cn"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "solid"
  glowColor?: string
  borderColor?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      glowColor,
      borderColor,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-black/60 backdrop-blur-3xl border-2",
      glass: "glass border",
      solid: "bg-black/80 border-2",
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl shadow-2xl transition-all duration-300",
          variants[variant],
          className
        )}
        style={{
          borderColor: borderColor || "rgba(255, 255, 255, 0.1)",
          boxShadow: glowColor
            ? `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${glowColor}50, inset 0 1px 0 rgba(255,255,255,0.1)`
            : undefined,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"
