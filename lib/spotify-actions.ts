import type { TrackData, Segment, CurrentTrack } from "@/lib/types/spotify"

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

export interface SearchTrack {
  id: string
  name: string
  artist: string
  album: string
  image?: string
  duration: number
  uri: string
}

export interface SearchResponse {
  tracks: SearchTrack[]
  total: number
}

export async function searchTracks(
  query: string,
  accessToken: string,
  limit: number = 20
): Promise<SearchResponse | null> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.error("Failed to search tracks")
      return null
    }

    const data = await response.json()
    const tracks: SearchTrack[] = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url,
      duration: track.duration_ms,
      uri: track.uri,
    }))

    return {
      tracks,
      total: data.tracks.total,
    }
  } catch (error) {
    console.error("Error searching tracks:", error)
    return null
  }
}

export async function playTrack(
  trackUri: string,
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Failed to play track:", response.status, errorData)
      return false
    }

    return true
  } catch (error) {
    console.error("Error playing track:", error)
    return false
  }
}

export async function setVolume(
  volumePercent: number,
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.max(0, Math.min(100, volumePercent))}&device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error setting volume:", error)
    return false
  }
}

