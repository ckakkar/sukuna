"use client"

import { useEffect } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import type { Session } from "next-auth"

interface AuthInitializerProps {
  session: Session | null
}

export function AuthInitializer({ session }: AuthInitializerProps) {
  const setToken = useSpotifyStore((state) => state.setToken)

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken)
    } else {
      setToken(null)
    }
  }, [session?.accessToken, setToken])

  return null
}

