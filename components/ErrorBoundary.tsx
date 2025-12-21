"use client"

import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="text-red-500 text-2xl font-mono font-bold">
                呪力エラー
              </div>
              <div className="text-gray-400 font-mono text-sm">
                Cursed Energy Disrupted
              </div>
              <div className="text-gray-600 text-xs font-mono max-w-md">
                {this.state.error?.message || "Unknown error occurred"}
              </div>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="mt-4 px-6 py-2 bg-jujutsu-energy text-white font-mono text-sm rounded hover:bg-jujutsu-domain transition-colors touch-manipulation min-h-[44px]"
                aria-label="Reload application"
              >
                Restart Domain
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-2 px-6 py-2 bg-black/40 border border-white/20 text-white font-mono text-sm rounded hover:bg-white/10 transition-colors touch-manipulation min-h-[44px]"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
