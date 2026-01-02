"use client"

import React from "react"
import { motion } from "framer-motion"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })
    
    // Log to error tracking service (if available)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "exception", {
        description: error.message,
        fatal: false,
      })
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleReload = () => {
    window.location.reload()
  }

  handleDismiss = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  getErrorType = (error: Error | null): string => {
    if (!error) return "Unknown"
    if (error.message.includes("Network") || error.message.includes("fetch")) {
      return "Network Error"
    }
    if (error.message.includes("Spotify") || error.message.includes("auth")) {
      return "Authentication Error"
    }
    if (error.message.includes("WebGL") || error.message.includes("three")) {
      return "Graphics Error"
    }
    return "Application Error"
  }

  render() {
    if (this.state.hasError) {
      const errorType = this.getErrorType(this.state.error)
      const isRetryable = this.state.retryCount < 3 && 
                         errorType !== "Graphics Error" &&
                         !this.state.error?.message.includes("WebGL")

      return (
        this.props.fallback || (
          <div 
            className="absolute inset-0 bg-black flex items-center justify-center z-[9999]"
            role="alert"
            aria-live="assertive"
          >
            <motion.div
              className="text-center space-y-6 p-8 max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Error Icon */}
              <motion.div
                className="text-red-500 text-4xl font-mono font-bold mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                呪力エラー
              </motion.div>
              
              <div className="text-gray-400 font-mono text-sm">
                Cursed Energy Disrupted
              </div>
              
              <div className="text-gray-500 font-mono text-xs uppercase tracking-wider">
                {errorType}
              </div>

              {/* Error Message */}
              <div className="text-gray-300 text-sm font-mono max-w-md bg-black/40 p-4 rounded border border-red-500/20">
                {this.state.error?.message || "Unknown error occurred"}
              </div>

              {/* Error Details (Collapsible) */}
              {this.state.errorInfo && (
                <details className="text-left">
                  <summary className="text-gray-500 text-xs font-mono cursor-pointer hover:text-gray-400 mb-2">
                    Technical Details
                  </summary>
                  <pre className="text-xs text-gray-600 font-mono bg-black/60 p-3 rounded overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isRetryable && (
                  <button
                    onClick={this.handleRetry}
                    className="px-6 py-3 bg-jujutsu-energy text-white font-mono text-sm rounded hover:bg-jujutsu-domain transition-colors touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-jujutsu-energy focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Retry operation"
                  >
                    Retry ({3 - this.state.retryCount} attempts left)
                  </button>
                )}
                
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-red-600/80 text-white font-mono text-sm rounded hover:bg-red-600 transition-colors touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Reload application"
                >
                  Restart Domain
                </button>
                
                {isRetryable && (
                  <button
                    onClick={this.handleDismiss}
                    className="px-6 py-3 bg-black/40 border border-white/20 text-white font-mono text-sm rounded hover:bg-white/10 transition-colors touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Dismiss error"
                  >
                    Dismiss
                  </button>
                )}
              </div>

              {/* Help Text */}
              <div className="text-gray-600 text-xs font-mono mt-4">
                If this persists, try refreshing the page or clearing your browser cache.
              </div>
            </motion.div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
