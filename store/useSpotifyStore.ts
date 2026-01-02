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
  playbackPosition: number
  playbackDuration: number
  repeatMode: "off" | "track" | "context"
  shuffleMode: boolean
  // Analysis
  trackData: TrackData | null
  isLoadingAnalysis: boolean
  // Character
  selectedCharacter: CharacterType
  currentTechnique: TechniqueType
  hasSelectedCharacter: boolean
  // Domain Expansion
  isDomainExpanding: boolean
  domainState: DomainState
  intensity: number
  // Beat detection
  beatIntensity: number
  lastBeatTime: number
  bpm: number
  // Audio analysis
  frequencySpectrum: { bass: number; mid: number; treble: number } | null
  audioMood: { mood: "happy" | "sad" | "energetic" | "calm" | "neutral"; confidence: number } | null
  tempoChanges: Array<{ time: number; tempo: number; confidence: number }>
  // Transient event counters
  impactFrameId: number
  skipEventId: number
  // Player instance
  playerInstance: any | null

  // Actions
  setToken: (token: string | null) => void
  setDeviceId: (deviceId: string | null) => void
  setPlaybackState: (isPaused: boolean, track?: CurrentTrack | null) => void
  setPlaybackPosition: (position: number, duration: number) => void
  setRepeatMode: (mode: "off" | "track" | "context") => void
  setShuffleMode: (enabled: boolean) => void
  setTrackData: (data: TrackData | null) => void
  setIsLoadingAnalysis: (loading: boolean) => void
  setSelectedCharacter: (character: CharacterType) => void
  setHasSelectedCharacter: (hasSelected: boolean) => void
  setIsDomainExpanding: (expanding: boolean) => void
  setDomainState: (state: DomainState) => void
  setIntensity: (intensity: number) => void
  setBeatIntensity: (intensity: number) => void
  setCurrentTechnique: (technique: TechniqueType) => void
  triggerImpactFrame: () => void
  notifyTrackSkipped: () => void
  setPlayerInstance: (instance: any | null) => void
  registerBeat: () => void
  setFrequencySpectrum: (spectrum: { bass: number; mid: number; treble: number } | null) => void
  setAudioMood: (mood: { mood: "happy" | "sad" | "energetic" | "calm" | "neutral"; confidence: number } | null) => void
  setTempoChanges: (changes: Array<{ time: number; tempo: number; confidence: number }>) => void
}

export const useSpotifyStore = create<SpotifyState>((set, get) => ({
  accessToken: null,
  deviceId: null,
  isPaused: true,
  currentTrack: null,
  playbackPosition: 0,
  playbackDuration: 0,
  repeatMode: "off",
  shuffleMode: false,
  trackData: null,
  isLoadingAnalysis: false,
  selectedCharacter: "sukuna",
  currentTechnique: defaultTechniqueForCharacter("sukuna"),
  hasSelectedCharacter: false,
  isDomainExpanding: false,
  domainState: "idle",
  intensity: 0,
  beatIntensity: 0,
  lastBeatTime: 0,
  bpm: 120,
  frequencySpectrum: null,
  audioMood: null,
  tempoChanges: [],
  impactFrameId: 0,
  skipEventId: 0,
  playerInstance: null,

  setToken: (token) => set({ accessToken: token }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlaybackState: (isPaused, track) => set({ isPaused, currentTrack: track ?? null }),
  setPlaybackPosition: (position, duration) => set({ playbackPosition: position, playbackDuration: duration }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setShuffleMode: (enabled) => set({ shuffleMode: enabled }),
  setTrackData: (data) =>
    set({
      trackData: data,
      intensity: data?.energy ?? 0,
      bpm: data?.bpm ?? 120,
    }),
  setIsLoadingAnalysis: (loading) => set({ isLoadingAnalysis: loading }),
  setSelectedCharacter: (character) =>
    set({
      selectedCharacter: character,
      currentTechnique: defaultTechniqueForCharacter(character),
      hasSelectedCharacter: true,
    }),
  setHasSelectedCharacter: (hasSelected) => set({ hasSelectedCharacter: hasSelected }),
  setIsDomainExpanding: (expanding) =>
    set((state) => ({
      isDomainExpanding: expanding,
      domainState: expanding ? "expanding" : state.domainState === "expanding" ? "active" : state.domainState,
    })),
  setDomainState: (domainState) => set({ domainState }),
  setIntensity: (intensity) => set({ intensity }),
  setBeatIntensity: (intensity) => set({ beatIntensity: intensity }),
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
  registerBeat: () => {
    const now = performance.now()
    set((state) => {
      // Calculate time since last beat
      const timeSinceLastBeat = now - state.lastBeatTime
      const expectedBeatInterval = (60 / state.bpm) * 1000
      
      // Only register if enough time has passed (avoid double-triggering)
      if (timeSinceLastBeat > expectedBeatInterval * 0.7) {
        return {
          lastBeatTime: now,
          beatIntensity: 1.0, // Will decay in beat detector
        }
      }
      return state
    })
  },
  setFrequencySpectrum: (spectrum) => set({ frequencySpectrum: spectrum }),
  setAudioMood: (mood) => set({ audioMood: mood }),
  setTempoChanges: (changes) => set({ tempoChanges: changes }),
}))