import type { TrackData, Segment } from "@/lib/types/spotify"

export interface FrequencySpectrum {
  bass: number // 0-1
  mid: number // 0-1
  treble: number // 0-1
}

export interface AudioMood {
  mood: "happy" | "sad" | "energetic" | "calm" | "neutral"
  confidence: number // 0-1
}

export interface TempoChange {
  time: number
  tempo: number
  confidence: number
}

/**
 * Analyze frequency spectrum from audio segments
 */
export function analyzeFrequencySpectrum(
  segments: Segment[],
  currentTime: number
): FrequencySpectrum {
  // Find current segment
  const currentSegment = segments.find(
    (seg) => currentTime >= seg.start && currentTime < seg.start + seg.duration
  )

  if (!currentSegment) {
    return { bass: 0, mid: 0, treble: 0 }
  }

  // Analyze timbre (12-dimensional vector from Spotify)
  // Timbre dimensions represent different frequency bands
  const timbre = currentSegment.timbre

  // Map timbre to frequency bands
  // Dimensions 0-3: Bass frequencies
  // Dimensions 4-7: Mid frequencies
  // Dimensions 8-11: Treble frequencies
  const bass = Math.max(0, Math.min(1, 
    (timbre[0] + timbre[1] + timbre[2] + timbre[3]) / 4 + 0.5
  ))
  const mid = Math.max(0, Math.min(1,
    (timbre[4] + timbre[5] + timbre[6] + timbre[7]) / 4 + 0.5
  ))
  const treble = Math.max(0, Math.min(1,
    (timbre[8] + timbre[9] + timbre[10] + timbre[11]) / 4 + 0.5
  ))

  return { bass, mid, treble }
}

/**
 * Detect mood from track data
 */
export function detectMood(trackData: TrackData): AudioMood {
  const { energy, valence } = trackData

  // Mood classification based on energy and valence
  // Valence: 0 (sad) to 1 (happy)
  // Energy: 0 (calm) to 1 (energetic)

  let mood: AudioMood["mood"]
  let confidence: number

  if (valence > 0.6 && energy > 0.6) {
    mood = "happy"
    confidence = (valence + energy) / 2
  } else if (valence < 0.4 && energy > 0.6) {
    mood = "energetic"
    confidence = energy
  } else if (valence < 0.4 && energy < 0.4) {
    mood = "sad"
    confidence = 1 - (valence + energy) / 2
  } else if (valence > 0.5 && energy < 0.4) {
    mood = "calm"
    confidence = (valence + (1 - energy)) / 2
  } else {
    mood = "neutral"
    confidence = 0.5
  }

  return { mood, confidence }
}

/**
 * Detect tempo changes in track
 */
export function detectTempoChanges(
  segments: Segment[],
  baseBPM: number
): TempoChange[] {
  const tempoChanges: TempoChange[] = []
  const windowSize = 5 // Analyze 5 segments at a time

  for (let i = 0; i < segments.length - windowSize; i++) {
    const window = segments.slice(i, i + windowSize)
    
    // Calculate average loudness and confidence
    const avgLoudness = window.reduce((sum, seg) => sum + Math.abs(seg.loudness_max), 0) / window.length
    const avgConfidence = window.reduce((sum, seg) => sum + seg.confidence, 0) / window.length

    // Detect significant changes
    if (avgLoudness > 50 && avgConfidence > 0.7) {
      // Estimate tempo change based on segment timing
      const segmentDuration = window[window.length - 1].start + window[window.length - 1].duration - window[0].start
      const estimatedTempo = (60 / segmentDuration) * window.length
      
      // Only record if significantly different from base
      if (Math.abs(estimatedTempo - baseBPM) > 10) {
        tempoChanges.push({
          time: window[0].start,
          tempo: estimatedTempo,
          confidence: avgConfidence,
        })
      }
    }
  }

  return tempoChanges
}

/**
 * Calculate danceability from track data
 */
export function calculateDanceability(trackData: TrackData): number {
  // Use energy and valence to estimate danceability
  // Higher energy + moderate valence = more danceable
  const { energy, valence } = trackData
  
  // Danceability formula (simplified)
  const danceability = (energy * 0.7 + Math.abs(valence - 0.5) * 0.3)
  return Math.max(0, Math.min(1, danceability))
}

/**
 * Detect key changes in track (simplified)
 */
export function detectKeyChanges(segments: Segment[]): Array<{ time: number; key: number }> {
  const keyChanges: Array<{ time: number; key: number }> = []
  let lastKey = -1

  for (const segment of segments) {
    // Find dominant pitch (highest value in pitches array)
    const pitches = segment.pitches
    const dominantPitch = pitches.indexOf(Math.max(...pitches))
    
    if (dominantPitch !== lastKey && segment.confidence > 0.6) {
      keyChanges.push({
        time: segment.start,
        key: dominantPitch,
      })
      lastKey = dominantPitch
    }
  }

  return keyChanges
}

