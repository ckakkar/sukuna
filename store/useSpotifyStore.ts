import { create } from "zustand"
import type { TrackData, CurrentTrack } from "@/lib/types/spotify"
import type { CharacterType } from "@/lib/types/character"

export type DomainState = "idle" | "expanding" | "active" | "collapsing"
export type TechniqueType = "cleave" | "blue" | "boogie_woogie" | null

const defaultTechniqueForCharacter = (character: CharacterType): TechniqueType => {
  switch (character) {
    case "sukuna":
      return "cleave"
    case "gojo":
      return "blue"
    case "todo":
      return "boogie_woogie"
    default:
      return null
  }
}

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
  currentTechnique: TechniqueType
  // Domain Expansion
  isDomainExpanding: boolean
  domainState: DomainState
  intensity: number // 0–1, derived from audio analysis
  // Transient event counters (used by hooks/postprocessing)
  impactFrameId: number
  skipEventId: number

  // Player instance (for direct control)
  playerInstance: any | null

  // Actions
  setToken: (token: string | null) => void
  setDeviceId: (deviceId: string | null) => void
  setPlaybackState: (isPaused: boolean, track?: CurrentTrack | null) => void
  setTrackData: (data: TrackData | null) => void
  setIsLoadingAnalysis: (loading: boolean) => void
  setSelectedCharacter: (character: CharacterType) => void
  setIsDomainExpanding: (expanding: boolean) => void
  setDomainState: (state: DomainState) => void
  setIntensity: (intensity: number) => void
  setCurrentTechnique: (technique: TechniqueType) => void
  triggerImpactFrame: () => void
  notifyTrackSkipped: () => void
  setPlayerInstance: (instance: any | null) => void
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  accessToken: null,
  deviceId: null,
  isPaused: true,
  currentTrack: null,
  trackData: null,
  isLoadingAnalysis: false,
  selectedCharacter: "sukuna",
  currentTechnique: defaultTechniqueForCharacter("sukuna"),
  isDomainExpanding: false,
  domainState: "idle",
  intensity: 0,
  impactFrameId: 0,
  skipEventId: 0,
  playerInstance: null,

  setToken: (token) => set({ accessToken: token }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlaybackState: (isPaused, track) => set({ isPaused, currentTrack: track ?? null }),
  setTrackData: (data) =>
    set({
      trackData: data,
      intensity: data?.energy ?? 0,
    }),
  setIsLoadingAnalysis: (loading) => set({ isLoadingAnalysis: loading }),
  setSelectedCharacter: (character) =>
    set({
      selectedCharacter: character,
      currentTechnique: defaultTechniqueForCharacter(character),
    }),
  setIsDomainExpanding: (expanding) =>
    set((state) => ({
      isDomainExpanding: expanding,
      domainState: expanding ? "expanding" : state.domainState === "expanding" ? "active" : state.domainState,
    })),
  setDomainState: (domainState) => set({ domainState }),
  setIntensity: (intensity) => set({ intensity }),
  setCurrentTechnique: (currentTechnique) => set({ currentTechnique }),
  triggerImpactFrame: () =>
    set((state) => ({
      impactFrameId: state.impactFrameId + 1,
    })),
  notifyTrackSkipped: () =>
    set((state) => ({
      skipEventId: state.skipEventId + 1,
    })),
  setPlayerInstance: (instance) => set({ playerInstance: instance }),
}))
