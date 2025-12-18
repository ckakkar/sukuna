"use client"

import { useEffect, useRef } from "react"
import { useSpotifyStore } from "@/store/useSpotifyStore"
import { getTrackAnalysis } from "@/lib/spotify-actions"
import type { CurrentTrack } from "@/lib/types/spotify"

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string
        getOAuthToken: (cb: (token: string) => void) => void
        volume?: number
      }) => SpotifyPlayer
    }
  }
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (event: string, callback: (state: any) => void) => void
  removeListener: (event: string, callback: (state: any) => void) => void
  getCurrentState: () => Promise<any>
  setName: (name: string) => Promise<void>
  getVolume: () => Promise<number>
  setVolume: (volume: number) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  togglePlay: () => Promise<void>
  seek: (positionMs: number) => Promise<void>
  previousTrack: () => Promise<void>
  nextTrack: () => Promise<void>
}

interface SpotifyState {
  paused: boolean
  track_window: {
    current_track: {
      id: string
      name: string
      album: {
        name: string
        images: Array<{ url: string }>
      }
      artists: Array<{ name: string }>
      uri: string
      duration_ms: number
    }
  }
}

export function SpotifyWebPlayer() {
  const playerRef = useRef<SpotifyPlayer | null>(null)
  const {
    accessToken,
    deviceId,
    setDeviceId,
    setPlaybackState,
    setTrackData,
    setIsLoadingAnalysis,
    setIsDomainExpanding,
    setDomainState,
    notifyTrackSkipped,
  } = useSpotifyStore()
  const lastTrackIdRef = useRef<string | null>(null)
  const initializingRef = useRef(false)

  useEffect(() => {
    if (!accessToken || initializingRef.current) return

    let script: HTMLScriptElement | null = null

    const initializePlayer = () => {
      if (!window.Spotify) {
        console.error("Spotify SDK not available")
        return
      }

      if (playerRef.current) {
        return
      }

      initializingRef.current = true

      try {
        const player = new window.Spotify.Player({
          name: "Sukuna Player",
          getOAuthToken: (cb) => {
            cb(accessToken)
          },
          volume: 0.5,
        })

        playerRef.current = player

        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Spotify player ready with device ID:", device_id)
          setDeviceId(device_id)

          fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              device_ids: [device_id],
            }),
          }).catch((error) => {
            console.error("Error transferring playback:", error)
          })
        })

        player.addListener("player_state_changed", async (state: SpotifyState | null) => {
          if (!state) {
            setPlaybackState(true, null)
            return
          }

          const track = state.track_window.current_track
          const currentTrack: CurrentTrack = {
            id: track.id,
            name: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url,
            duration: track.duration_ms,
            uri: track.uri,
          }

          setPlaybackState(state.paused, currentTrack)

          if (track.id !== lastTrackIdRef.current) {
            if (lastTrackIdRef.current) {
              // Treat any subsequent track change as a "skip" event
              notifyTrackSkipped()
            }
            lastTrackIdRef.current = track.id
            
            // Trigger domain expansion animation
            setDomainState("expanding")
            setIsDomainExpanding(true)
            setTimeout(() => {
              setIsDomainExpanding(false)
              setDomainState("active")
            }, 3000)

            // Fetch track analysis
            setIsLoadingAnalysis(true)
            try {
              const analysis = await getTrackAnalysis(track.id, accessToken)
              if (analysis) {
                setTrackData(analysis)
              }
            } catch (error) {
              console.error("Error fetching track analysis:", error)
            } finally {
              setIsLoadingAnalysis(false)
            }
          }
        })

        player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
          console.error("Device has gone offline", device_id)
          setDeviceId(null)
        })

        player.addListener("authentication_error", ({ message }: { message: string }) => {
          console.error("Authentication error:", message)
        })

        player.addListener("account_error", ({ message }: { message: string }) => {
          console.error("Account error:", message)
        })

        player.addListener("playback_error", ({ message }: { message: string }) => {
          console.error("Playback error:", message)
        })

        player.connect().catch((error) => {
          console.error("Error connecting player:", error)
          initializingRef.current = false
        })
      } catch (error) {
        console.error("Error initializing player:", error)
        initializingRef.current = false
      }
    }

    if (window.Spotify) {
      initializePlayer()
    } else {
      script = document.createElement("script")
      script.src = "https://sdk.scdn.co/spotify-player.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        initializePlayer()
      }

      script.onerror = () => {
        console.error("Failed to load Spotify SDK")
        initializingRef.current = false
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.disconnect()
        } catch (error) {
          console.error("Error disconnecting player:", error)
        }
        playerRef.current = null
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      initializingRef.current = false
    }
  }, [
    accessToken,
    setDeviceId,
    setPlaybackState,
    setTrackData,
    setIsLoadingAnalysis,
    setIsDomainExpanding,
    setDomainState,
    notifyTrackSkipped,
  ])

  return null
}
