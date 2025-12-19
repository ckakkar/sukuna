"use client"

import { Component, ReactNode } from "react"
import { Button } from "./Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl">
          <div className="text-center space-y-6 px-6 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white font-mono">
              Something went wrong
            </h2>
            <p className="text-gray-400 font-mono text-sm">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              variant="primary"
            >
              Reload Application
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
