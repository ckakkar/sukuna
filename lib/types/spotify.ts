export interface Segment {
  start: number
  duration: number
  confidence: number
  loudness_start: number
  loudness_max_time: number
  loudness_max: number
  pitches: number[]
  timbre: number[]
}

export interface TrackData {
  bpm: number
  energy: number // 0-1
  valence: number // 0-1
  danceability?: number // 0-1
  loudness?: number // dB
  segments: Segment[]
}

export interface FrequencySpectrum {
  bass: number // 0-1
  mid: number // 0-1
  treble: number // 0-1
}

export interface AudioMood {
  mood: "happy" | "sad" | "energetic" | "calm" | "neutral"
  confidence: number // 0-1
}

export interface CurrentTrack {
  id: string
  name: string
  artist: string
  album: string
  image?: string
  duration: number
  uri: string
}

