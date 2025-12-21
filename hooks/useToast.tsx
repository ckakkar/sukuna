"use client"

import { useState, useCallback } from "react"
import { ToastContainer, type ToastType } from "@/components/UI/shared/Toast"

interface Toast {
  id: string
  message: string
  type?: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const ToastProvider = () => (
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  )

  return {
    showToast,
    removeToast,
    ToastProvider,
  }
}

