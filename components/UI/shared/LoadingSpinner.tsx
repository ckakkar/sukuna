"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: string
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  color = "#9333ea",
  ...props 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
  }
  
  return (
    <div
      className={cn(
        "rounded-full animate-spin border-t-transparent",
        sizes[size],
        className
      )}
      style={{
        borderColor: `${color}30`,
        borderTopColor: color,
        boxShadow: `0 0 15px ${color}60`,
      }}
      {...props}
    />
  )
}
