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
    const baseStyles = "font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl relative overflow-hidden touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-manga-ink text-white hover:bg-manga-ink/90 active:scale-[0.98] shadow-md hover:shadow-lg",
      secondary: "bg-manga-tone/50 text-manga-ink hover:bg-manga-tone border border-black/5",
      ghost: "bg-transparent text-manga-ink hover:bg-black/5",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
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
        style={glowColor ? {} : undefined}
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
