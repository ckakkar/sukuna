"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import type { Session } from "next-auth"

interface AuthInitializerProps {
  session: Session | null
}

export function AuthInitializer({ session }: AuthInitializerProps) {
  const setToken = useSpotifyStore((state) => state.setToken)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken)
      
      // Set up automatic session refresh every 30 minutes to prevent token expiration
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      
      refreshIntervalRef.current = setInterval(async () => {
        try {
          // Refresh session to get updated token
          const response = await fetch("/api/auth/session", { cache: "no-store" })
          if (response.ok) {
            const updatedSession = await response.json()
            if (updatedSession?.accessToken) {
              setToken(updatedSession.accessToken)
            }
          }
        } catch (error) {
          console.error("Error refreshing session:", error)
        }
      }, 30 * 60 * 1000) // Every 30 minutes
    } else {
      setToken(null)
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [session?.accessToken, setToken])

  return null
}

