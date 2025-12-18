import { create } from "zustand"
import type { TrackData, CurrentTrack } from "@/lib/types/spotify"
import type { CharacterType } from "@/lib/types/character"

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
  isLoadingAnalysis: boolean
  // Character
  selectedCharacter: CharacterType
  // Domain Expansion
  isDomainExpanding: boolean
  
  // Actions
  setToken: (token: string | null) => void
  setDeviceId: (deviceId: string | null) => void
  setPlaybackState: (isPaused: boolean, track?: CurrentTrack | null) => void
  setTrackData: (data: TrackData | null) => void
  setIsLoadingAnalysis: (loading: boolean) => void
  setSelectedCharacter: (character: CharacterType) => void
  setIsDomainExpanding: (expanding: boolean) => void
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  accessToken: null,
  deviceId: null,
  isPaused: true,
  currentTrack: null,
  trackData: null,
  isLoadingAnalysis: false,
  selectedCharacter: "sukuna",
  isDomainExpanding: false,

  setToken: (token) => set({ accessToken: token }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlaybackState: (isPaused, track) => set({ isPaused, currentTrack: track ?? null }),
  setTrackData: (data) => set({ trackData: data }),
  setIsLoadingAnalysis: (loading) => set({ isLoadingAnalysis: loading }),
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
  setIsDomainExpanding: (expanding) => set({ isDomainExpanding: expanding }),
}))
