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
  const { accessToken, deviceId, setDeviceId, setPlaybackState, setTrackData } = useSpotifyStore()
  const lastTrackIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!accessToken) return

    let script: HTMLScriptElement | null = null

    const initializePlayer = () => {
      if (!window.Spotify) {
        console.error("Spotify SDK not available")
        return
      }

      // Don't create a new player if one already exists
      if (playerRef.current) {
        return
      }

      const player = new window.Spotify.Player({
        name: "Sukuna Player",
        getOAuthToken: (cb) => {
          cb(accessToken)
        },
        volume: 0.5,
      })

      playerRef.current = player

      // Ready event - get device ID and transfer playback
      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Spotify player ready with device ID:", device_id)
        setDeviceId(device_id)

        // Transfer playback to this device
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

      // Player state changed - update store
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

        // Fetch track analysis if track changed
        if (track.id !== lastTrackIdRef.current) {
          lastTrackIdRef.current = track.id
          const analysis = await getTrackAnalysis(track.id, accessToken)
          if (analysis) {
            setTrackData(analysis)
          }
        }
      })

      // Error handling
      player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.error("Device has gone offline", device_id)
      })

      player.addListener("authentication_error", ({ message }: { message: string }) => {
        console.error("Authentication error:", message)
      })

      player.addListener("account_error", ({ message }: { message: string }) => {
        console.error("Account error:", message)
      })

      // Connect to Spotify
      player.connect()
    }

    // Check if SDK is already loaded
    if (window.Spotify) {
      initializePlayer()
    } else {
      // Load Spotify SDK script
      script = document.createElement("script")
      script.src = "https://sdk.scdn.co/spotify-player.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        initializePlayer()
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
        playerRef.current = null
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [accessToken, setDeviceId, setPlaybackState, setTrackData])

  return null // This component doesn't render anything
}

