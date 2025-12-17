import { create } from "zustand"
import type { TrackData, CurrentTrack } from "@/lib/types/spotify"

interface SpotifyState {
  // Auth
  accessToken: string | null
  // Device
  deviceId: string | null
  // Playback
  isPaused: boolean
  currentTrack: CurrentTrack | null
  // Analysis
  trackData: TrackData | null
  
  // Actions
  setToken: (token: string | null) => void
  setDeviceId: (deviceId: string | null) => void
  setPlaybackState: (isPaused: boolean, track?: CurrentTrack | null) => void
  setTrackData: (data: TrackData | null) => void
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  accessToken: null,
  deviceId: null,
  isPaused: true,
  currentTrack: null,
  trackData: null,

  setToken: (token) => set({ accessToken: token }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlaybackState: (isPaused, track) => set({ isPaused, currentTrack: track ?? null }),
  setTrackData: (data) => set({ trackData: data }),
}))

