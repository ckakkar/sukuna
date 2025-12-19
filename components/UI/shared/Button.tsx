"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  glowColor?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      glowColor,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "font-mono font-semibold tracking-wider transition-all duration-200 rounded-lg relative overflow-hidden touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-gradient-to-r from-jujutsu-energy to-jujutsu-domain text-white hover:from-jujutsu-domain hover:to-jujutsu-energy active:scale-95",
      secondary: "bg-black/40 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 active:scale-95",
      ghost: "bg-transparent text-white hover:bg-white/10 active:scale-95",
      danger: "bg-red-900/30 border-2 border-red-800/60 text-red-400 hover:border-red-500 hover:bg-red-900/50 active:scale-95",
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        style={{
          boxShadow: glowColor ? `0 0 20px ${glowColor}40` : undefined,
        }}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={cn("relative", isLoading && "opacity-0")}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"
