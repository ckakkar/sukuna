"use server"

import type { TrackData, Segment } from "@/lib/types/spotify"

interface SpotifyAudioFeatures {
  tempo: number
  energy: number
  valence: number
  danceability: number
  loudness: number
}

interface SpotifyAudioAnalysis {
  segments: Array<{
    start: number
    duration: number
    confidence: number
    loudness_start: number
    loudness_max_time: number
    loudness_max: number
    pitches: number[]
    timbre: number[]
  }>
}

export async function getTrackAnalysis(
  trackId: string,
  accessToken: string
): Promise<TrackData | null> {
  try {
    // Fetch audio features and analysis in parallel
    const [featuresResponse, analysisResponse] = await Promise.all([
      fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ])

    if (!featuresResponse.ok || !analysisResponse.ok) {
      console.error("Failed to fetch track analysis")
      return null
    }

    const features: SpotifyAudioFeatures = await featuresResponse.json()
    const analysis: SpotifyAudioAnalysis = await analysisResponse.json()

    // Transform segments to our interface
    const segments: Segment[] = analysis.segments.map((seg) => ({
      start: seg.start,
      duration: seg.duration,
      confidence: seg.confidence,
      loudness_start: seg.loudness_start,
      loudness_max_time: seg.loudness_max_time,
      loudness_max: seg.loudness_max,
      pitches: seg.pitches,
      timbre: seg.timbre,
    }))

    return {
      bpm: features.tempo,
      energy: features.energy,
      valence: features.valence,
      segments,
    }
  } catch (error) {
    console.error("Error fetching track analysis:", error)
    return null
  }
}

