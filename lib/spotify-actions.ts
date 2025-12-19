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

export interface Playlist {
  id: string
  name: string
  description?: string
  image?: string
  owner: string
  trackCount: number
  uri: string
}

export async function getUserPlaylists(
  accessToken: string,
  limit: number = 50
): Promise<Playlist[]> {
  try {
    const playlists: Playlist[] = []
    let url = `https://api.spotify.com/v1/me/playlists?limit=${limit}`
    
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch playlists")
        break
      }

      const data = await response.json()
      const items: Playlist[] = data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.images[0]?.url,
        owner: playlist.owner.display_name,
        trackCount: playlist.tracks.total,
        uri: playlist.uri,
      }))

      playlists.push(...items)
      url = data.next
    }

    return playlists
  } catch (error) {
    console.error("Error fetching playlists:", error)
    return []
  }
}

export async function getPlaylistTracks(
  playlistId: string,
  accessToken: string,
  limit: number = 50
): Promise<SearchTrack[]> {
  try {
    const tracks: SearchTrack[] = []
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`
    
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch playlist tracks")
        break
      }

      const data = await response.json()
      const items: SearchTrack[] = data.items
        .filter((item: any) => item.track && !item.track.is_local)
        .map((item: any) => {
          const track = item.track
          return {
            id: track.id,
            name: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url,
            duration: track.duration_ms,
            uri: track.uri,
          }
        })

      tracks.push(...items)
      url = data.next
    }

    return tracks
  } catch (error) {
    console.error("Error fetching playlist tracks:", error)
    return []
  }
}

export async function getSavedTracks(
  accessToken: string,
  limit: number = 50
): Promise<SearchTrack[]> {
  try {
    const tracks: SearchTrack[] = []
    let url = `https://api.spotify.com/v1/me/tracks?limit=${limit}`
    
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch saved tracks")
        break
      }

      const data = await response.json()
      const items: SearchTrack[] = data.items.map((item: any) => {
        const track = item.track
        return {
          id: track.id,
          name: track.name,
          artist: track.artists.map((a: any) => a.name).join(", "),
          album: track.album.name,
          image: track.album.images[0]?.url,
          duration: track.duration_ms,
          uri: track.uri,
        }
      })

      tracks.push(...items)
      url = data.next
    }

    return tracks
  } catch (error) {
    console.error("Error fetching saved tracks:", error)
    return []
  }
}

export async function getCurrentPlaybackState(
  accessToken: string
): Promise<{ position: number; duration: number } | null> {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return {
      position: data.progress_ms || 0,
      duration: data.item?.duration_ms || 0,
    }
  } catch (error) {
    console.error("Error fetching playback state:", error)
    return null
  }
}

export async function seekToPosition(
  positionMs: number,
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error seeking:", error)
    return false
  }
}

export async function setRepeatMode(
  state: "off" | "track" | "context",
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error setting repeat mode:", error)
    return false
  }
}

export async function setShuffleMode(
  state: boolean,
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${state}&device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error setting shuffle mode:", error)
    return false
  }
}

export async function getQueue(accessToken: string): Promise<{
  currently_playing: SearchTrack | null
  queue: SearchTrack[]
} | null> {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // Queue endpoint might not be available, return empty queue
      return { currently_playing: null, queue: [] }
    }

    const data = await response.json()
    
    const transformTrack = (track: any): SearchTrack => ({
      id: track.id,
      name: track.name,
      artist: track.artists?.map((a: any) => a.name).join(", ") || "Unknown Artist",
      album: track.album?.name || "Unknown Album",
      image: track.album?.images?.[0]?.url,
      duration: track.duration_ms || 0,
      uri: track.uri,
    })

    return {
      currently_playing: data.currently_playing ? transformTrack(data.currently_playing) : null,
      queue: (data.queue || []).map(transformTrack),
    }
  } catch (error) {
    console.error("Error fetching queue:", error)
    return { currently_playing: null, queue: [] }
  }
}

export async function addToQueue(
  trackUri: string,
  deviceId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}&device_id=${deviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error adding to queue:", error)
    return false
  }
}

export async function getRecentlyPlayed(
  accessToken: string,
  limit: number = 20
): Promise<SearchTrack[]> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.items.map((item: any) => {
      const track = item.track
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(", "),
        album: track.album.name,
        image: track.album.images[0]?.url,
        duration: track.duration_ms,
        uri: track.uri,
      }
    })
  } catch (error) {
    console.error("Error fetching recently played:", error)
    return []
  }
}

export async function playPlaylist(
  playlistUri: string,
  deviceId: string,
  accessToken: string,
  offset?: number
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
          context_uri: playlistUri,
          offset: offset ? { position: offset } : undefined,
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error("Error playing playlist:", error)
    return false
  }
}

