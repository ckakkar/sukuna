"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: "bg-green-500/20 border-green-500/50 text-green-400",
    error: "bg-red-500/20 border-red-500/50 text-red-400",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
  }

  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-auto",
        typeStyles[type],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
          duration={3000}
        />
      ))}
    </div>
  )
}

